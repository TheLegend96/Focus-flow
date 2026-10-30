import { supabase } from '../lib/supabase';
import { TrackItem, PlaylistCollection } from '../components/MusicPlayer';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const CACHE_PLAYLISTS_KEY = 'focusflow_yt_playlists';
const CACHE_LIKED_KEY = 'focusflow_yt_liked';

export const youtubeService = {
  // Get stored Google OAuth provider token from active Supabase session
  async getGoogleAccessToken(): Promise<string | null> {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.provider_token || null;
  },

  // Initiate Google Sign-In with YouTube permissions
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

  // 1. Fetch user's real Liked Songs (magic playlistId "LL" is YouTube Liked Videos/Music)
  async fetchLikedSongs(token: string): Promise<TrackItem[]> {
    try {
      const res = await fetch(
        `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=LL&maxResults=30`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (!res.ok) {
        console.warn('YouTube Liked songs error:', await res.text());
        return [];
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
    } catch (err) {
      console.warn('Failed to fetch YouTube Liked songs:', err);
      return [];
    }
  },

  // 2. Fetch user's real personal playlists
  async fetchUserPlaylists(token: string): Promise<PlaylistCollection[]> {
    try {
      const res = await fetch(
        `${YOUTUBE_API_BASE}/playlists?part=snippet,contentDetails&mine=true&maxResults=25`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (!res.ok) {
        console.warn('YouTube Playlists error:', await res.text());
        return [];
      }

      const data = await res.json();
      if (!data.items) return [];

      const playlists: PlaylistCollection[] = await Promise.all(
        data.items.map(async (item: any) => {
          const snippet = item.snippet;
          const thumbs = snippet.thumbnails;
          const cover = thumbs?.high?.url || thumbs?.medium?.url || thumbs?.default?.url;
          const playlistId = item.id;

          // Fetch first few tracks of playlist
          const tracks = await this.fetchPlaylistTracks(token, playlistId);

          return {
            id: playlistId,
            title: snippet.title || 'Untitled Playlist',
            description: snippet.description || 'Personal YouTube Music Playlist',
            coverUrl: cover || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
            tracksCount: item.contentDetails?.itemCount || tracks.length || 0,
            tracks,
          };
        })
      );

      try {
        localStorage.setItem(CACHE_PLAYLISTS_KEY, JSON.stringify(playlists));
      } catch {}

      return playlists;
    } catch (err) {
      console.warn('Failed to fetch YouTube Playlists:', err);
      return [];
    }
  },

  // 3. Fetch tracks inside a specific playlist
  async fetchPlaylistTracks(token: string, playlistId: string): Promise<TrackItem[]> {
    try {
      const res = await fetch(
        `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=20`,
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
          title: snippet.title,
          artist: snippet.videoOwnerChannelTitle || snippet.channelTitle || 'YouTube Music',
          album: 'Playlist Item',
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

  // 4. Load cached data from localStorage if offline
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
