import { supabase } from '../lib/supabase';
import { TrackItem, PlaylistCollection } from '../components/MusicPlayer';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const CACHE_PLAYLISTS_KEY = 'focusflow_yt_playlists';
const CACHE_LIKED_KEY = 'focusflow_yt_liked';

export interface YouTubeSyncResult {
  success: boolean;
  playlists: PlaylistCollection[];
  likedSongs: TrackItem[];
  error?: string;
  errorType?: 'NEEDS_PERMISSION' | 'API_NOT_ENABLED' | 'NO_TOKEN' | 'NETWORK_ERROR';
}

export const youtubeService = {
  // Get stored Google OAuth provider token from active Supabase session
  async getGoogleAccessToken(): Promise<string | null> {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.provider_token || null;
  },

  // Initiate Google Sign-In with full YouTube readonly permissions
  async connectYouTube(): Promise<void> {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        scopes: 'https://www.googleapis.com/auth/youtube.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  },

  // Comprehensive sync: fetches both Liked Songs and Personal Playlists
  async syncAll(token: string): Promise<YouTubeSyncResult> {
    try {
      const [playlistsRes, likedRes] = await Promise.all([
        this.fetchUserPlaylists(token),
        this.fetchLikedSongs(token),
      ]);

      return {
        success: true,
        playlists: playlistsRes,
        likedSongs: likedRes,
      };
    } catch (err: any) {
      const msg = err?.message || '';
      let errorType: YouTubeSyncResult['errorType'] = 'NETWORK_ERROR';

      if (msg.includes('YouTube Data API v3 has not been used') || msg.includes('accessNotConfigured')) {
        errorType = 'API_NOT_ENABLED';
      } else if (msg.includes('insufficientPermissions') || msg.includes('403') || msg.includes('401')) {
        errorType = 'NEEDS_PERMISSION';
      }

      return {
        success: false,
        playlists: this.getCachedPlaylists(),
        likedSongs: this.getCachedLiked(),
        error: msg,
        errorType,
      };
    }
  },

  // 1. Fetch user's real Liked Songs (playlistId "LL" is YouTube Liked Music)
  async fetchLikedSongs(token: string): Promise<TrackItem[]> {
    const res = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=LL&maxResults=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson?.error?.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json();
    if (!data.items) return [];

    const tracks: TrackItem[] = data.items.map((item: any) => {
      const snippet = item.snippet;
      const videoId = item.contentDetails?.videoId || snippet.resourceId?.videoId;
      const thumbs = snippet.thumbnails;
      const cover = thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url;

      return {
        id: videoId || item.id,
        title: snippet.title || 'Untitled Track',
        artist: snippet.videoOwnerChannelTitle || snippet.channelTitle || 'YouTube Music',
        album: 'Liked Songs',
        duration: 'YouTube',
        videoId: videoId,
        coverUrl: cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        genre: 'Liked Music',
        liked: true,
      };
    });

    try {
      localStorage.setItem(CACHE_LIKED_KEY, JSON.stringify(tracks));
    } catch {}

    return tracks;
  },

  // 2. Fetch user's real personal playlists
  async fetchUserPlaylists(token: string): Promise<PlaylistCollection[]> {
    const res = await fetch(
      `${YOUTUBE_API_BASE}/playlists?part=snippet,contentDetails&mine=true&maxResults=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson?.error?.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json();
    if (!data.items) return [];

    const playlists: PlaylistCollection[] = await Promise.all(
      data.items.map(async (item: any) => {
        const snippet = item.snippet;
        const thumbs = snippet.thumbnails;
        const cover = thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url;
        const playlistId = item.id;

        // Fetch tracks inside this playlist
        const tracks = await this.fetchPlaylistTracks(token, playlistId);

        return {
          id: playlistId,
          title: snippet.title || 'Untitled Playlist',
          description: snippet.description || 'Personal YouTube Music Playlist',
          coverUrl: cover || (tracks[0]?.coverUrl) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          tracksCount: item.contentDetails?.itemCount || tracks.length || 0,
          tracks,
        };
      })
    );

    try {
      localStorage.setItem(CACHE_PLAYLISTS_KEY, JSON.stringify(playlists));
    } catch {}

    return playlists;
  },

  // 3. Fetch tracks inside a specific playlist
  async fetchPlaylistTracks(token: string, playlistId: string): Promise<TrackItem[]> {
    try {
      const res = await fetch(
        `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=30`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (!res.ok) return [];

      const data = await res.json();
      if (!data.items) return [];

      return data.items.map((item: any) => {
        const snippet = item.snippet;
        const videoId = item.contentDetails?.videoId || snippet.resourceId?.videoId;
        const thumbs = snippet.thumbnails;
        const cover = thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url;

        return {
          id: videoId || item.id,
          title: snippet.title || 'Untitled',
          artist: snippet.videoOwnerChannelTitle || snippet.channelTitle || 'YouTube Music',
          album: 'Playlist Track',
          duration: 'YouTube',
          videoId: videoId,
          playlistId: playlistId,
          coverUrl: cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
          genre: 'YouTube Music',
        };
      });
    } catch {
      return [];
    }
  },

  // 4. Cached data retrieval
  getCachedPlaylists(): PlaylistCollection[] {
    try {
      const raw = localStorage.getItem(CACHE_PLAYLISTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getCachedLiked(): TrackItem[] {
    try {
      const raw = localStorage.getItem(CACHE_LIKED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
};
