import React, { useState, useEffect, useRef } from 'react';
import { youtubeService } from '../services/youtubeService';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  Search,
  Home,
  Flame,
  ChevronLeft,
  ChevronRight,
  ListMusic,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Check
} from 'lucide-react';

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  durationSec?: number;
  videoId: string;
  playlistId?: string;
  coverUrl: string;
  category?: 'Focus' | 'Relax' | 'Energize' | 'Workout' | 'Trending' | string;
  genre?: string;
  liked?: boolean;
}

export type TrackPreset = TrackItem;

export interface PlaylistCollection {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracksCount: number;
  tracks: TrackItem[];
}

// Real YouTube Music Curated Tracks with Real YouTube CDN Thumbnails
const YOUTUBE_TRACKS: TrackItem[] = [
  // 1. Focus & Coding
  {
    id: 'yt-focus-1',
    title: 'Lofi Hip Hop Radio — Beats to Relax/Study',
    artist: 'Lofi Girl',
    album: 'Lofi Study Session',
    duration: '3:45',
    durationSec: 225,
    videoId: 'jfKfPfyJRdk',
    coverUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    category: 'Focus',
  },
  {
    id: 'yt-focus-2',
    title: 'Deep Focus: Alpha Waves 40Hz for Mental Clarity',
    artist: 'Brain Wave Club',
    album: 'Cognitive Architecture',
    duration: '4:20',
    durationSec: 260,
    videoId: 'WPni755-Krg',
    coverUrl: 'https://i.ytimg.com/vi/WPni755-Krg/hqdefault.jpg',
    category: 'Focus',
  },
  {
    id: 'yt-focus-3',
    title: 'Synthwave / Cyberpunk Coding Beats',
    artist: 'ChillSynth Radio',
    album: 'Night Drive Program',
    duration: '5:12',
    durationSec: 312,
    videoId: '4xDzrJKXOOY',
    coverUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    category: 'Focus',
  },
  {
    id: 'yt-focus-4',
    title: 'Peaceful Piano Masterpieces for Deep Work',
    artist: 'Ludovico Ensemble',
    album: 'Reflections in Solitude',
    duration: '4:05',
    durationSec: 245,
    videoId: 'lTRiuFIWV54',
    coverUrl: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg',
    category: 'Focus',
  },

  // 2. Relax & Ambient
  {
    id: 'yt-relax-1',
    title: 'Rainy Cafe in Kyoto — Ambient Jazz & Piano',
    artist: 'Coffee Cozy Records',
    album: 'Raindrops on Concrete',
    duration: '3:50',
    durationSec: 230,
    videoId: 'e3L1I71DwfA',
    coverUrl: 'https://i.ytimg.com/vi/e3L1I71DwfA/hqdefault.jpg',
    category: 'Relax',
  },
  {
    id: 'yt-relax-2',
    title: 'Interstellar Deep Space Ambient Journey',
    artist: 'Cosmos Soundscapes',
    album: 'Celestial Flow',
    duration: '6:15',
    durationSec: 375,
    videoId: 'tNkZsRW7h2c',
    coverUrl: 'https://i.ytimg.com/vi/tNkZsRW7h2c/hqdefault.jpg',
    category: 'Relax',
  },

  // 3. Energize & High Voltage
  {
    id: 'yt-energy-1',
    title: 'BURN IT DOWN',
    artist: 'LINKIN PARK',
    album: 'LIVING THINGS',
    duration: '3:51',
    durationSec: 231,
    videoId: 'dxytyRy-yo8',
    coverUrl: 'https://i.ytimg.com/vi/dxytyRy-yo8/hqdefault.jpg',
    category: 'Energize',
  },
  {
    id: 'yt-energy-2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    durationSec: 200,
    videoId: '4NRXx6U8ABQ',
    coverUrl: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
    category: 'Energize',
  },

  // 4. Trending & Quick Picks
  {
    id: 'yt-trend-1',
    title: 'Circles',
    artist: 'Post Malone',
    album: "Hollywood's Bleeding",
    duration: '3:35',
    durationSec: 215,
    videoId: 'wXhTHyIgQ_U',
    coverUrl: 'https://i.ytimg.com/vi/wXhTHyIgQ_U/hqdefault.jpg',
    category: 'Trending',
  },
  {
    id: 'yt-trend-2',
    title: 'MONACO',
    artist: 'Bad Bunny',
    album: 'nadie sabe lo que va a pasar mañana',
    duration: '4:27',
    durationSec: 267,
    videoId: 'h8qU6qE2_iI',
    coverUrl: 'https://i.ytimg.com/vi/h8qU6qE2_iI/hqdefault.jpg',
    category: 'Trending',
  },
  {
    id: 'yt-trend-3',
    title: 'Glimpse of Us',
    artist: 'Joji',
    album: 'SMITHEREENS',
    duration: '3:53',
    durationSec: 233,
    videoId: 'NrsA_j6_c6M',
    coverUrl: 'https://i.ytimg.com/vi/NrsA_j6_c6M/hqdefault.jpg',
    category: 'Relax',
  },
  {
    id: 'yt-trend-4',
    title: 'Chop Suey!',
    artist: 'System of a Down',
    album: 'Toxicity',
    duration: '3:30',
    durationSec: 210,
    videoId: 'CSvFpBOe8eY',
    coverUrl: 'https://i.ytimg.com/vi/CSvFpBOe8eY/hqdefault.jpg',
    category: 'Workout',
  },
];

// YouTube Music Category Pills
const MOOD_TAGS = ['All', 'Focus', 'Relax', 'Energize', 'Workout', 'Trending'] as const;
type MoodTag = typeof MOOD_TAGS[number];

const INITIAL_PLAYLISTS: PlaylistCollection[] = [
  {
    id: 'pl-coding',
    title: 'Deep Coding & Flow',
    description: 'High-focus electronics, glitch-free instrumentals, and minimal grooves.',
    coverUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    tracksCount: 14,
    tracks: YOUTUBE_TRACKS.filter((t) => t.category === 'Focus'),
  },
  {
    id: 'pl-lofi',
    title: 'Lofi Chillout Beats',
    description: 'Warm vinyl crackle, gentle chords, and soft dusty boom-bap percussion.',
    coverUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    tracksCount: 22,
    tracks: YOUTUBE_TRACKS.filter((t) => t.category === 'Focus' || t.category === 'Relax'),
  },
  {
    id: 'pl-energy',
    title: 'Rock & Electronic Surge',
    description: 'High-voltage driving tracks for intense work bursts.',
    coverUrl: 'https://i.ytimg.com/vi/dxytyRy-yo8/hqdefault.jpg',
    tracksCount: 18,
    tracks: YOUTUBE_TRACKS.filter((t) => t.category === 'Energize' || t.category === 'Workout'),
  },
];

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  currentTrack: TrackItem;
  setCurrentTrack: (track: TrackItem) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isOpen,
  onClose,
  isPlaying,
  setIsPlaying,
  currentTrack,
  setCurrentTrack,
}) => {
  const [activeMood, setActiveMood] = useState<MoodTag>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progressSec, setProgressSec] = useState(24);
  const [totalDurationSec, setTotalDurationSec] = useState(231);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({
    'yt-energy-1': true,
    'yt-focus-1': true,
  });
  const [customLinkInput, setCustomLinkInput] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistCollection | null>(null);

  // Real YouTube Data API sync state
  const [userPlaylists, setUserPlaylists] = useState<PlaylistCollection[]>(INITIAL_PLAYLISTS);
  const [likedTracks, setLikedTracks] = useState<TrackItem[]>(YOUTUBE_TRACKS.slice(0, 4));
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);

  // Ref to postMessage into YouTube iframe
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Send command to the YouTube Player IFrame API
  const postToPlayer = (func: string, args: any[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch (err) {
      console.warn('Player postMessage error:', err);
    }
  };

  // Real YouTube volume control
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(false);
    postToPlayer('unMute');
    postToPlayer('setVolume', [newVol]);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      postToPlayer('unMute');
      postToPlayer('setVolume', [volume || 80]);
    } else {
      setIsMuted(true);
      postToPlayer('mute');
    }
  };

  // Interactive timeline seeking
  const handleSeekTimeline = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = Math.floor(ratio * (totalDurationSec || 231));
    setProgressSec(targetSec);
    postToPlayer('seekTo', [targetSec, true]);
  };

  // Skip forward / back 10 seconds
  const handleSeekDelta = (deltaSec: number) => {
    const targetSec = Math.max(0, Math.min(totalDurationSec || 231, progressSec + deltaSec));
    setProgressSec(targetSec);
    postToPlayer('seekTo', [targetSec, true]);
  };

  // Play / Pause toggle with YouTube API command
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      postToPlayer('pauseVideo');
    } else {
      setIsPlaying(true);
      postToPlayer('playVideo');
    }
  };

  // Listen to messages from YouTube Player API (real-time progress, duration, state)
  useEffect(() => {
    const handleWindowMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            setProgressSec(Math.floor(data.info.currentTime));
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setTotalDurationSec(Math.floor(data.info.duration));
          }
          if (typeof data.info.playerState === 'number') {
            if (data.info.playerState === 1) setIsPlaying(true);
            if (data.info.playerState === 2) setIsPlaying(false);
            if (data.info.playerState === 0) handleSkipNext(); // Auto play next on finish!
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [currentTrack]);

  // Fallback timer increment when iframe is running without postMessage
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => {
          if (prev >= totalDurationSec) return 0;
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDurationSec]);

  // Sync real YouTube Playlists & Liked Songs
  const syncYouTubeData = async () => {
    setIsLoadingYouTube(true);
    const token = await youtubeService.getGoogleAccessToken();
    if (token) {
      setIsYouTubeConnected(true);
      const res = await youtubeService.syncAll(token);
      if (res.success) {
        if (res.playlists.length > 0) setUserPlaylists(res.playlists);
        if (res.likedSongs.length > 0) setLikedTracks(res.likedSongs);
      }
    } else {
      const cachedP = youtubeService.getCachedPlaylists();
      const cachedL = youtubeService.getCachedLiked();
      if (cachedP.length > 0) setUserPlaylists(cachedP);
      if (cachedL.length > 0) setLikedTracks(cachedL);
    }
    setIsLoadingYouTube(false);
  };

  useEffect(() => {
    if (isOpen) {
      syncYouTubeData();
    }
  }, [isOpen]);

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePlayTrack = (track: TrackItem) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgressSec(0);
    setTotalDurationSec(track.durationSec || 231);
    postToPlayer('loadVideoById', [track.videoId]);
    postToPlayer('playVideo');
  };

  const handleSkipNext = () => {
    const list = selectedPlaylist ? selectedPlaylist.tracks : YOUTUBE_TRACKS;
    const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % list.length;
    handlePlayTrack(list[nextIndex]);
  };

  const handleSkipPrev = () => {
    const list = selectedPlaylist ? selectedPlaylist.tracks : YOUTUBE_TRACKS;
    const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex <= 0 ? list.length - 1 : currentIndex - 1;
    handlePlayTrack(list[prevIndex]);
  };

  const handleCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkInput.trim()) return;

    const listMatch = customLinkInput.match(/[?&]list=([^#&?]+)/);
    const videoMatch = customLinkInput.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);

    const newTrack: TrackItem = {
      id: `custom-${Date.now()}`,
      title: listMatch ? 'Custom YouTube Playlist' : 'Custom YouTube Stream',
      artist: 'YouTube Music',
      album: 'Imported Playlist',
      duration: 'Live',
      durationSec: 300,
      videoId: videoMatch ? videoMatch[1] : 'jfKfPfyJRdk',
      playlistId: listMatch ? listMatch[1] : undefined,
      coverUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
      category: 'Focus',
    };

    handlePlayTrack(newTrack);
    setCustomLinkInput('');
  };

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Origin for YouTube iframe security
  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const embedSrc = currentTrack.playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${currentTrack.playlistId}&enablejsapi=1&autoplay=1&origin=${originUrl}`
    : `https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1&autoplay=1&origin=${originUrl}`;

  // Filtered tracks based on Mood Pill and Search Query
  const displayedTracks = YOUTUBE_TRACKS.filter((t) => {
    if (activeMood !== 'All' && t.category !== activeMood) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      t.artist.toLowerCase().includes(query) ||
      t.album?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* 1. Permanent Active YouTube Audio Player (Mounted with enablejsapi=1) */}
      <div className="fixed -bottom-96 -right-96 w-48 h-28 opacity-0 pointer-events-none overflow-hidden">
        <iframe
          ref={iframeRef}
          id="yt-player-iframe"
          key={`${currentTrack.videoId}-${currentTrack.playlistId || ''}`}
          width="100%"
          height="100%"
          src={embedSrc}
          title="FocusFlow Audio Engine"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full border-0"
          onLoad={() => {
            setTimeout(() => {
              try {
                if (iframeRef.current?.contentWindow) {
                  iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
                  iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [volume] }), '*');
                  if (isMuted) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
                  }
                }
              } catch {}
            }, 500);
          }}
        />
      </div>

      {/* 2. Docked Light-Mode Apple Music Pill (Floats at bottom when modal is closed & music playing) */}
      {isPlaying && !isOpen && (
        <aside
          aria-label="Apple Music Bottom Controller"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 text-zinc-900 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-zinc-200/90 px-6 py-2.5 flex items-center gap-6 transition-all animate-in fade-in slide-in-from-bottom-4 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] select-none backdrop-blur-md"
        >
          {/* Track Info */}
          <div onClick={onClose} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-zinc-200 shadow-2xs">
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-zinc-900 group-hover:text-rose-600 transition truncate max-w-[140px]">
                {currentTrack.title}
              </div>
              <div className="text-[11px] text-zinc-500 truncate max-w-[140px]">
                {currentTrack.artist}
              </div>
            </div>
          </div>

          {/* Interactive Scrub Bar */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono text-zinc-400 w-7 text-right">
              {formatSec(progressSec)}
            </span>
            <div
              onClick={handleSeekTimeline}
              className="w-44 bg-zinc-200 h-1.5 rounded-full overflow-hidden relative cursor-pointer group"
              title="Click to seek"
            >
              <div
                className="bg-zinc-800 h-full rounded-full group-hover:bg-rose-600 transition-all duration-150"
                style={{ width: `${Math.min(100, (progressSec / (totalDurationSec || 231)) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 w-7">
              {formatSec(totalDurationSec)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSeekDelta(-10)}
              className="p-1 text-zinc-500 hover:text-zinc-900 transition"
              title="Seek back 10 seconds"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition shadow-2xs active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={() => handleSeekDelta(10)}
              className="p-1 text-zinc-500 hover:text-zinc-900 transition"
              title="Seek forward 10 seconds"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={handleToggleMute} className="text-zinc-400 hover:text-zinc-700">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-16 h-1 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-900"
            />
          </div>
        </aside>
      )}

      {/* 3. Full Apple Music Light Studio Window (100% Unslop Light Mode) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-150"
          onClick={onClose}
        >
          <div
            className="w-full max-w-6xl h-[92vh] bg-white text-zinc-900 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] border border-zinc-200/90 flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Navigation Bar */}
            <header className="h-16 px-6 border-b border-zinc-100 flex items-center justify-between shrink-0 select-none bg-white">
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center transition"
                  title="Close Studio"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50/80">
                  <button
                    type="button"
                    onClick={handleSkipPrev}
                    className="p-1 hover:bg-white rounded text-zinc-400 hover:text-zinc-800 transition"
                    title="Previous Song"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="w-px h-3 bg-zinc-200 mx-0.5" />
                  <button
                    type="button"
                    onClick={handleSkipNext}
                    className="p-1 hover:bg-white rounded text-zinc-400 hover:text-zinc-800 transition"
                    title="Next Song"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Center Segmented Pill: Home, Moods, Library */}
              <nav className="flex items-center border border-zinc-200 rounded-full p-1 bg-zinc-50/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlaylist(null);
                    setSearchQuery('');
                    setActiveMood('All');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    !selectedPlaylist && !searchQuery
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlaylist(null);
                    setActiveMood('Focus');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    activeMood === 'Focus'
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Moods</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlaylist(userPlaylists[0] || null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    selectedPlaylist && selectedPlaylist.id !== 'pl-liked'
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span>Playlists ({userPlaylists.length})</span>
                </button>

                {likedTracks.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlaylist({
                        id: 'pl-liked',
                        title: 'Your Liked Music',
                        description: 'Favorite tracks synced from your YouTube account',
                        coverUrl: likedTracks[0]?.coverUrl || 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
                        tracksCount: likedTracks.length,
                        tracks: likedTracks,
                      });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      selectedPlaylist?.id === 'pl-liked'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'text-zinc-500 hover:text-rose-600 hover:bg-rose-50/50'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Liked ({likedTracks.length})</span>
                  </button>
                )}
              </nav>

              {/* Right: Search Box & YouTube Sync Status */}
              <div className="flex items-center gap-3">
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search songs or artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                {isLoadingYouTube ? (
                  <span className="flex items-center gap-1 text-xs text-zinc-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  </span>
                ) : isYouTubeConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Gmail Synced</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => youtubeService.connectYouTube()}
                    className="px-3 py-1 rounded-full text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition"
                  >
                    Sync Gmail
                  </button>
                )}
              </div>
            </header>

            {/* YouTube Music Mood Pills Bar (All, Focus, Relax, Energize, Workout, Trending) */}
            <div className="px-8 pt-4 pb-2 border-b border-zinc-100 flex items-center gap-2 overflow-x-auto select-none">
              {MOOD_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setActiveMood(tag);
                    setSelectedPlaylist(null);
                  }}
                  className={`px-3.5 py-1 rounded-full text-xs font-medium transition shrink-0 ${
                    activeMood === tag && !selectedPlaylist
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto px-8 py-6 space-y-10 pb-36">
              {/* PLAYLIST DETAIL VIEW */}
              {selectedPlaylist ? (
                <div className="space-y-6">
                  <div className="flex items-end gap-6 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="w-40 h-40 rounded-xl overflow-hidden shadow-md border border-zinc-200 shrink-0">
                      <img
                        src={selectedPlaylist.coverUrl}
                        alt={selectedPlaylist.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
                        Playlist • YouTube Music
                      </span>
                      <h1 className="text-2xl font-bold text-zinc-900">
                        {selectedPlaylist.title}
                      </h1>
                      <p className="text-xs text-zinc-500 max-w-lg leading-relaxed">
                        {selectedPlaylist.description}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handlePlayTrack(selectedPlaylist.tracks[0])}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition active:scale-95 shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play All ({selectedPlaylist.tracksCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPlaylist(null)}
                          className="px-4 py-2 rounded-full border border-zinc-200 hover:bg-white text-xs font-medium text-zinc-700 transition"
                        >
                          Back to Home
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Track Table */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-12 text-[11px] font-bold text-zinc-400 uppercase px-4 py-2 border-b border-zinc-100">
                      <span className="col-span-1">#</span>
                      <span className="col-span-6">Title</span>
                      <span className="col-span-3">Artist</span>
                      <span className="col-span-2 text-right">Time</span>
                    </div>

                    {selectedPlaylist.tracks.map((track, i) => {
                      const isCurrent = currentTrack.id === track.id;
                      return (
                        <div
                          key={track.id}
                          onClick={() => handlePlayTrack(track)}
                          className={`grid grid-cols-12 items-center px-4 py-2.5 rounded-xl cursor-pointer transition group ${
                            isCurrent
                              ? 'bg-rose-50 text-rose-600 font-medium'
                              : 'hover:bg-zinc-50 text-zinc-700'
                          }`}
                        >
                          <span className="col-span-1 text-xs text-zinc-400">{i + 1}</span>
                          <div className="col-span-6 flex items-center gap-3 min-w-0">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-zinc-200"
                            />
                            <span className="text-xs font-semibold truncate">{track.title}</span>
                          </div>
                          <span className="col-span-3 text-xs text-zinc-500 truncate">{track.artist}</span>
                          <span className="col-span-2 text-right text-xs text-zinc-400 font-mono">
                            {track.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* MAIN FEED (Curated YouTube Music layout) */
                <>
                  {/* SECTION 1: YouTube Music Quick Picks & Mood Row */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                          {activeMood === 'All' ? 'Quick Picks for Focus' : `${activeMood} Stations`}
                        </h2>
                        <p className="text-xs text-zinc-500">
                          Curated high-resolution YouTube Music audio streams
                        </p>
                      </div>
                      <span className="text-xs text-zinc-400 font-medium">
                        {displayedTracks.length} streams
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {displayedTracks.map((track) => {
                        const isCurrent = currentTrack.id === track.id;
                        return (
                          <div
                            key={track.id}
                            onClick={() => handlePlayTrack(track)}
                            className="group cursor-pointer flex flex-col space-y-2 select-none"
                          >
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 shadow-2xs group-hover:shadow-md transition bg-zinc-100">
                              <img
                                src={track.coverUrl}
                                alt={track.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />

                              {/* Hover Play Button */}
                              <div className={`absolute inset-0 bg-black/25 flex items-center justify-center transition ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <div className="w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-md">
                                  {isCurrent && isPlaying ? (
                                    <Pause className="w-4 h-4 fill-current" />
                                  ) : (
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className={`text-xs font-bold truncate leading-tight ${isCurrent ? 'text-rose-600' : 'text-zinc-900'}`}>
                                {track.title}
                              </h3>
                              <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                                {track.artist} • {track.category}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* SECTION 2: YouTube Music Playlists & Libraries */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                          Connected Playlists
                        </h2>
                        <p className="text-xs text-zinc-500">
                          {isYouTubeConnected
                            ? 'Synced from your Google account'
                            : 'Import or sync your YouTube playlists'}
                        </p>
                      </div>

                      {/* Custom URL Import */}
                      <form onSubmit={handleCustomLink} className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="Paste YouTube playlist URL..."
                          value={customLinkInput}
                          onChange={(e) => setCustomLinkInput(e.target.value)}
                          className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-zinc-50 w-56 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Import
                        </button>
                      </form>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {userPlaylists.map((pl) => (
                        <div
                          key={pl.id}
                          onClick={() => setSelectedPlaylist(pl)}
                          className="p-3 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 transition cursor-pointer flex flex-col group select-none bg-white"
                        >
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 mb-2.5 bg-zinc-100">
                            <img
                              src={pl.coverUrl}
                              alt={pl.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <div className="w-9 h-9 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-md">
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>
                          <h3 className="text-xs font-bold text-zinc-900 truncate">
                            {pl.title}
                          </h3>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {pl.tracksCount} tracks • YouTube Music
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </main>

            {/* REAL INTERACTIVE FLOATING APPLE CONTROLLER BAR */}
            <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[94%] bg-white/95 text-zinc-900 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.14)] border border-zinc-200/95 px-6 py-3 flex items-center justify-between select-none backdrop-blur-md z-30">
              {/* Left Track Info */}
              <div className="flex items-center gap-3 w-64 min-w-0">
                <div className="w-11 h-11 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-100">
                  <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold tracking-tight text-zinc-900 truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {currentTrack.artist}
                  </div>
                </div>
              </div>

              {/* Center Playback Cluster + Real Seeking Scrubber */}
              <div className="flex-1 max-w-xl flex flex-col items-center justify-center px-4">
                {/* Control Buttons */}
                <div className="flex items-center gap-4 mb-1.5">
                  <button
                    type="button"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`transition ${isShuffle ? 'text-rose-600' : 'text-zinc-400 hover:text-zinc-700'}`}
                    title="Shuffle"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>

                  {/* Seek -10s */}
                  <button
                    type="button"
                    onClick={() => handleSeekDelta(-10)}
                    className="p-1 text-zinc-600 hover:text-zinc-900 transition active:scale-95"
                    title="Jump back 10 seconds"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipPrev}
                    className="text-zinc-700 hover:text-zinc-900 transition active:scale-95"
                    title="Previous Track"
                  >
                    <SkipBack className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition shadow-2xs active:scale-95"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipNext}
                    className="text-zinc-700 hover:text-zinc-900 transition active:scale-95"
                    title="Next Track"
                  >
                    <SkipForward className="w-4 h-4 fill-current" />
                  </button>

                  {/* Seek +10s */}
                  <button
                    type="button"
                    onClick={() => handleSeekDelta(10)}
                    className="p-1 text-zinc-600 hover:text-zinc-900 transition active:scale-95"
                    title="Jump forward 10 seconds"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`transition ${isRepeat ? 'text-rose-600' : 'text-zinc-400 hover:text-zinc-700'}`}
                    title="Repeat"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Real Clickable Interactive Timeline Scrubber */}
                <div className="w-full flex items-center gap-2.5">
                  <span className="text-[10px] font-mono text-zinc-400 w-8 text-right">
                    {formatSec(progressSec)}
                  </span>
                  <div
                    onClick={handleSeekTimeline}
                    className="flex-1 bg-zinc-200 h-2 rounded-full overflow-hidden relative cursor-pointer group"
                    title="Click anywhere to jump"
                  >
                    <div
                      className="bg-zinc-900 h-full rounded-full group-hover:bg-rose-600 transition-all duration-100"
                      style={{ width: `${Math.min(100, (progressSec / (totalDurationSec || 231)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 w-8">
                    {formatSec(totalDurationSec)}
                  </span>
                </div>
              </div>

              {/* Right Side: Like, Real Volume Slider & Playlist Selector */}
              <div className="flex items-center gap-3.5 w-64 justify-end">
                <button
                  type="button"
                  onClick={() => toggleLike(currentTrack.id)}
                  className={`p-1.5 transition ${likedMap[currentTrack.id] ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-700'}`}
                  title="Favorite"
                >
                  <Heart className={`w-4 h-4 ${likedMap[currentTrack.id] ? 'fill-current' : ''}`} />
                </button>

                {/* Real YouTube Volume Control */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="text-zinc-500 hover:text-zinc-900 transition"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-500" />
                    ) : volume < 50 ? (
                      <Volume1 className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-20 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-900"
                    title={`Volume: ${isMuted ? '0' : volume}%`}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlaylist(userPlaylists[0] || null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 transition"
                  title="View Playlists"
                >
                  <ListMusic className="w-4 h-4" />
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};
