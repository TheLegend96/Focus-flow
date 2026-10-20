import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FocusSession } from '../types';

const LOCAL_STORAGE_KEY = 'focusflow_sessions_v1';

export const sessionService = {
  // Convert DataURL to Blob for Supabase Storage upload
  dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/webp';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },

  // Upload an image to Supabase Storage
  async uploadScreenshot(userId: string, dataUrl: string): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      // In local/demo mode, retain data URL
      return dataUrl;
    }

    try {
      const blob = this.dataUrlToBlob(dataUrl);
      const filename = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

      const { data, error } = await supabase.storage
        .from('screenshots')
        .upload(filename, blob, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (error) {
        console.warn('Storage upload error, falling back to data URL:', error);
        return dataUrl;
      }

      const { data: publicUrlData } = supabase.storage
        .from('screenshots')
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.warn('Upload failed, using dataUrl fallback:', err);
      return dataUrl;
    }
  },

  // Save a completed session
  async saveSession(
    userId: string | null,
    session: Omit<FocusSession, 'id' | 'timeAgo' | 'timestamp'>
  ): Promise<FocusSession> {
    // 1. Process screenshots (upload to storage if user is logged in)
    let processedScreenshots: string[] = [];
    if (session.screenshots && session.screenshots.length > 0) {
      if (userId && isSupabaseConfigured) {
        processedScreenshots = await Promise.all(
          session.screenshots.map((s) => this.uploadScreenshot(userId, s))
        );
      } else {
        processedScreenshots = session.screenshots;
      }
    }

    // 2. Persist to Supabase if configured and user is logged in
    if (isSupabaseConfigured && supabase && userId) {
      const { data, error } = await supabase
        .from('focus_sessions')
        .insert({
          user_id: userId,
          title: session.title,
          category_name: session.category,
          category_color: session.categoryColor,
          duration_minutes: session.durationMinutes,
          notes: session.notes,
          is_break: session.isBreak || false,
          screenshots: processedScreenshots,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          category: data.category_name,
          categoryColor: data.category_color,
          durationMinutes: data.duration_minutes,
          timeAgo: 'Just now',
          timestamp: new Date(data.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          notes: data.notes || '',
          screenshots: data.screenshots || [],
          isBreak: data.is_break,
        };
      }
    }

    // Fallback: LocalStorage persistence
    const localSession: FocusSession = {
      id: `local-${Date.now()}`,
      title: session.title,
      category: session.category,
      categoryColor: session.categoryColor,
      durationMinutes: session.durationMinutes,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      notes: session.notes,
      screenshots: processedScreenshots,
      isBreak: session.isBreak,
    };

    const existing = this.getLocalSessions();
    const updated = [localSession, ...existing];
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // quota safeguard
    }

    return localSession;
  },

  // Load sessions from Supabase or LocalStorage
  async loadSessions(userId: string | null): Promise<FocusSession[]> {
    if (isSupabaseConfigured && supabase && userId) {
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category_name,
          categoryColor: d.category_color,
          durationMinutes: d.duration_minutes,
          timeAgo: this.formatTimeAgo(new Date(d.created_at)),
          timestamp: new Date(d.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
          notes: d.notes || '',
          screenshots: d.screenshots || [],
          isBreak: d.is_break,
        }));
      }
    }

    return this.getLocalSessions();
  },

  getLocalSessions(): FocusSession[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  formatTimeAgo(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'Yesterday';
    return `${Math.floor(diff / 86400)} days ago`;
  },
};
