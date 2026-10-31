import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Library,
  ChevronLeft,
  ChevronRight,
  Airplay,
  ListMusic,
  RefreshCw,
  Zap,
  Smile,
  Droplets,
  HeartCrack,
  Wind,
  Target
} from 'lucide-react';

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  videoId: string;
  playlistId?: string;
  coverUrl: string;
  genre: string;
  liked?: boolean;
}

export type TrackPreset = TrackItem;

export interface MoodCard {
  id: string;
  title: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
  track: TrackItem;
}

export interface EssentialCard {
  id: string;
  title: string;
  genre: string;
  artist: string;
  coverUrl: string;
  track: TrackItem;
}

export interface PlaylistCollection {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracksCount: number;
  tracks: TrackItem[];
}

// 1. Mood Cards (from reference image: Energy, Love, Feel Good, Feeling Blue, Heartbreak, Relax, Focus)
const MOOD_CARDS: MoodCard[] = [
  {
    id: 'mood-focus',
    title: 'Focus',
    description: 'Limitless music to help stay in the zone.',
    gradient: 'from-teal-400 via-cyan-500 to-emerald-500',
    icon: <Target className="w-12 h-12 text-white stroke-[1.75]" />,
    track: {
      id: 'm-focus',
      title: 'Deep Focus (Alpha Waves 40Hz for Mental Clarity)',
      artist: 'Brain Wave Collective',
      album: 'Apple Music Focus',
      duration: '4:20',
      videoId: 'WPni755-Krg',
      coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
      genre: 'Focus',
    },
  },
  {
    id: 'mood-relax',
    title: 'Relax',
    description: 'Soothing sounds to help you unwind and breathe easily.',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    icon: <Wind className="w-12 h-12 text-white stroke-[1.75]" />,
    track: {
      id: 'm-relax',
      title: 'Rainy Cafe in Kyoto — Ambient Jazz & Piano',
      artist: 'Coffee Cozy Records',
      album: 'Apple Music Chill',
      duration: '3:50',
      videoId: 'e3L1I71DwfA',
      coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
      genre: 'Acoustic Jazz',
    },
  },
  {
    id: 'mood-energy',
    title: 'Energy',
    description: 'Keep it moving with non-stop high-voltage tracks.',
    gradient: 'from-emerald-400 via-teal-500 to-green-600',
    icon: <Zap className="w-12 h-12 text-white stroke-[1.75]" />,
    track: {
      id: 'm-energy',
      title: 'Synthwave / Cyberpunk Coding Mix 2026',
      artist: 'ChillSynth Radio',
      album: 'Apple Music Electronic',
      duration: '5:12',
      videoId: '4xDzrJKXOOY',
      coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      genre: 'High Voltage',
    },
  },
  {
    id: 'mood-feelgood',
    title: 'Feel Good',
    description: 'The most uplifting tracks to brighten your day.',
    gradient: 'from-amber-400 via-orange-500 to-yellow-500',
    icon: <Smile className="w-12 h-12 text-white stroke-[1.75]" />,
    track: {
      id: 'm-feelgood',
      title: 'Lofi Hip Hop Radio — Beats to Relax/Study',
      artist: 'Lofi Girl',
      album: 'Apple Music Lofi',
      duration: '3:45',
      videoId: 'jfKfPfyJRdk',
      coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
      genre: 'Feel Good Chill',
    },
  },
  {
    id: 'mood-blue',
    title: 'Feeling Blue',
    description: 'Sad songs that understand exactly how you feel.',
    gradient: 'from-blue-600 via-indigo-700 to-slate-800',
    icon: <Droplets className="w-12 h-12 text-white stroke-[1.75]" />,
    track: {
      id: 'm-blue',
      title: 'Peaceful Piano Masterpieces for Deep Work',
      artist: 'Ludovico Ensemble',
      album: 'Apple Music Piano',
      duration: '4:05',
      videoId: 'lTRiuFIWV54',
      coverUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=600&auto=format&fit=crop&q=80',
      genre: 'Melancholy',
    },
  },
  {
    id: 'mood-love',
    title: 'Love',
    description: 'Romantic music that captures the perfect mood.',
    gradient: 'from-fuchsia-500 via-purple-600 to-pink-500',
    icon: <Heart className="w-12 h-12 text-white stroke-[1.75]" />,
    track: {
      id: 'm-love',
      title: 'Acoustic Guitar Sessions & Warm Melodies',
      artist: 'Soleil Acoustic',
      album: 'Apple Music Acoustic',
      duration: '3:32',
      videoId: 'e3L1I71DwfA',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      genre: 'Warm Acoustic',
    },
  },
  {
    id: 'mood-heartbreak',
    title: 'Heartbreak',
    description: 'Get over it, one tear-jerking anthem at a time.',
    gradient: 'from-indigo-400 via-purple-500 to-violet-600',
    icon: <HeartCrack className="w-12 h-12 text-white stroke-[1.75]" />,
    track: {
      id: 'm-heartbreak',
      title: 'Interstellar Deep Space Soundscape',
      artist: 'Cosmos Sound',
      album: 'Apple Music Space',
      duration: '6:15',
      videoId: 'tNkZsRW7h2c',
      coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      genre: 'Reflective',
    },
  },
];

// 2. Essentials Row (from reference image: Linkin Park, The Weeknd, Post Malone, Bad Bunny, Joji, etc.)
const ESSENTIALS_LIST: EssentialCard[] = [
  {
    id: 'ess-linkin',
    title: 'LINKIN PARK Essentials',
    genre: 'Apple Music Hard Rock',
    artist: 'LINKIN PARK',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    track: {
      id: 't-lp',
      title: 'BURN IT DOWN',
      artist: 'LINKIN PARK',
      album: 'LIVING THINGS',
      duration: '3:51',
      videoId: 'dxytyRy-yo8',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
      genre: 'Hard Rock',
    },
  },
  {
    id: 'ess-weeknd',
    title: 'The Weeknd Essentials',
    genre: 'Apple Music R&B',
    artist: 'The Weeknd',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    track: {
      id: 't-weeknd',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:20',
      videoId: '4NRXx6U8ABQ',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      genre: 'R&B / Synthpop',
    },
  },
  {
    id: 'ess-lofi',
    title: 'Lofi Girl Essentials',
    genre: 'Apple Music Lo-Fi',
    artist: 'Lofi Girl',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
    track: {
      id: 't-lofi',
      title: 'Lofi Hip Hop Radio — Beats to Relax/Study',
      artist: 'Lofi Girl',
      album: 'Lofi Chill Session',
      duration: '3:45',
      videoId: 'jfKfPfyJRdk',
      coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
      genre: 'Lo-Fi',
    },
  },
  {
    id: 'ess-post',
    title: 'Post Malone Essentials',
    genre: 'Apple Music Hip-Hop',
    artist: 'Post Malone',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    track: {
      id: 't-post',
      title: 'Circles',
      artist: 'Post Malone',
      album: "Hollywood's Bleeding",
      duration: '3:35',
      videoId: 'wXhTHyIgQ_U',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      genre: 'Hip-Hop',
    },
  },
  {
    id: 'ess-piano',
    title: 'Modern Classical Piano',
    genre: 'Apple Music Classical',
    artist: 'Ludovico Ensemble',
    coverUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=500&auto=format&fit=crop&q=80',
    track: {
      id: 't-piano',
      title: 'Nuvole Bianche (Deep Flow Edition)',
      artist: 'Ludovico Ensemble',
      album: 'Reflections',
      duration: '4:05',
      videoId: 'lTRiuFIWV54',
      coverUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=500&auto=format&fit=crop&q=80',
      genre: 'Modern Classical',
    },
  },
  {
    id: 'ess-badbunny',
    title: 'Bad Bunny Essentials',
    genre: 'Apple Music Urbano Latino',
    artist: 'Bad Bunny',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    track: {
      id: 't-bb',
      title: 'Monaco',
      artist: 'Bad Bunny',
      album: 'Nadie Sabe Lo Que Va a Pasar',
      duration: '4:27',
      videoId: 'dxytyRy-yo8',
      coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
      genre: 'Urbano Latino',
    },
  },
];

const INITIAL_PLAYLISTS: PlaylistCollection[] = [
  {
    id: 'pl-coding',
    title: 'Deep Coding & Flow',
    description: 'High-focus electronics, glitch-free instrumentals, and minimal grooves.',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    tracksCount: 42,
    tracks: [
      MOOD_CARDS[0].track,
      MOOD_CARDS[1].track,
      MOOD_CARDS[2].track,
    ],
  },
  {
    id: 'pl-lofi',
    title: 'Late Night Study Lounge',
    description: 'Warm vinyl crackle, gentle chords, and soft dusty boom-bap percussion.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    tracksCount: 58,
    tracks: [
      MOOD_CARDS[3].track,
      MOOD_CARDS[1].track,
      MOOD_CARDS[4].track,
    ],
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
  const [activeTab, setActiveTab] = useState<'home' | 'moods' | 'essentials' | 'library' | 'search'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progressSec, setProgressSec] = useState(24);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({
    't-lp': true,
    'm-focus': true,
  });
  const [customLinkInput, setCustomLinkInput] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistCollection | null>(null);

  // Real YouTube Data API sync state
  const [userPlaylists, setUserPlaylists] = useState<PlaylistCollection[]>(INITIAL_PLAYLISTS);
  const [likedTracks, setLikedTracks] = useState<TrackItem[]>([
    ESSENTIALS_LIST[0].track,
    MOOD_CARDS[0].track,
  ]);
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);
  const [syncError, setSyncError] = useState<{ message: string; type?: string } | null>(null);

  const syncYouTubeData = async () => {
    setIsLoadingYouTube(true);
    setSyncError(null);
    const token = await youtubeService.getGoogleAccessToken();
    if (token) {
      setIsYouTubeConnected(true);
      const res = await youtubeService.syncAll(token);
      if (res.success) {
        if (res.playlists.length > 0) setUserPlaylists(res.playlists);
        if (res.likedSongs.length > 0) setLikedTracks(res.likedSongs);
      } else {
        if (res.errorType === 'API_NOT_ENABLED') {
          setSyncError({
            type: 'API_NOT_ENABLED',
            message: 'YouTube Data API v3 needs to be enabled in your Google Cloud Console.',
          });
        } else {
          setSyncError({
            type: 'NEEDS_PERMISSION',
            message: 'Grant YouTube access to retrieve your personal playlists.',
          });
        }
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

  // Scrubber simulator
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => (prev >= 231 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePlayTrack = (track: TrackItem) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgressSec(0);
  };

  const handleSkipNext = () => {
    const list = [...MOOD_CARDS.map((m) => m.track), ...ESSENTIALS_LIST.map((e) => e.track)];
    const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % list.length;
    handlePlayTrack(list[nextIndex]);
  };

  const handleSkipPrev = () => {
    const list = [...MOOD_CARDS.map((m) => m.track), ...ESSENTIALS_LIST.map((e) => e.track)];
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
      artist: 'YouTube Music Stream',
      album: 'Imported Web Stream',
      duration: 'Live',
      videoId: videoMatch ? videoMatch[1] : 'jfKfPfyJRdk',
      playlistId: listMatch ? listMatch[1] : undefined,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      genre: 'Custom Web Link',
    };

    handlePlayTrack(newTrack);
    setCustomLinkInput('');
  };

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Embed src for YouTube
  const embedSrc = currentTrack.playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${currentTrack.playlistId}&autoplay=1`
    : `https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1`;

  // Search filter
  const allTracks = [...MOOD_CARDS.map((m) => m.track), ...ESSENTIALS_LIST.map((e) => e.track), ...likedTracks];
  const searchResults = allTracks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      t.artist.toLowerCase().includes(query) ||
      t.genre.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* 1. Permanent Hidden Active YouTube Audio Engine */}
      {isPlaying && (
        <div className="fixed -bottom-96 -right-96 w-48 h-28 opacity-0 pointer-events-none overflow-hidden">
          <iframe
            key={`${currentTrack.videoId}-${currentTrack.playlistId}`}
            width="100%"
            height="100%"
            src={embedSrc}
            title="FocusFlow Audio Core"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full border-0"
          />
        </div>
      )}

      {/* 2. Docked Apple Floating Player Pill (Visible when modal is closed & music is playing) */}
      {isPlaying && !isOpen && (
        <aside
          aria-label="Apple Music Bottom Controller"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 backdrop-blur-2xl bg-white/90 text-zinc-900 rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-zinc-200/80 px-5 py-2.5 flex items-center gap-6 transition-all animate-in fade-in slide-in-from-bottom-4 hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)] select-none"
        >
          {/* Track Info */}
          <div
            onClick={onClose}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-zinc-200 shadow-2xs">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-zinc-900 group-hover:text-rose-600 transition truncate max-w-[150px]">
                {currentTrack.title}
              </div>
              <div className="text-[11px] text-zinc-500 truncate max-w-[150px]">
                {currentTrack.artist}
              </div>
            </div>
          </div>

          {/* Scrubber Bar */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono text-zinc-400">
              {formatSec(progressSec)}
            </span>
            <div className="w-40 bg-zinc-200 h-1 rounded-full overflow-hidden relative">
              <div
                className="bg-zinc-800 h-full rounded-full"
                style={{ width: `${Math.min(100, (progressSec / 231) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              {currentTrack.duration}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSkipPrev}
              className="text-zinc-600 hover:text-zinc-900 transition"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition shadow-2xs active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={handleSkipNext}
              className="text-zinc-600 hover:text-zinc-900 transition"
              title="Next"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Like */}
          <button
            type="button"
            onClick={() => toggleLike(currentTrack.id)}
            className={`transition ${likedMap[currentTrack.id] ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            <Heart className={`w-4 h-4 ${likedMap[currentTrack.id] ? 'fill-current' : ''}`} />
          </button>
        </aside>
      )}

      {/* 3. Full Apple Music Light-Mode Studio Window (Matching Reference Image) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-150"
          onClick={onClose}
        >
          <div
            className="w-full max-w-6xl h-[92vh] bg-white text-zinc-900 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] border border-zinc-200/90 flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Navigation Bar matching Apple Music Reference */}
            <header className="h-16 px-6 border-b border-zinc-100 flex items-center justify-between shrink-0 select-none bg-white">
              {/* Left Controls: Sidebar toggle & History nav pill */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center transition"
                  title="Close Studio"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Back / Forward Pill */}
                <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50/80">
                  <button
                    type="button"
                    onClick={handleSkipPrev}
                    className="p-1 hover:bg-white rounded text-zinc-400 hover:text-zinc-800 transition"
                    title="Back"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="w-px h-3 bg-zinc-200 mx-0.5" />
                  <button
                    type="button"
                    onClick={handleSkipNext}
                    className="p-1 hover:bg-white rounded text-zinc-400 hover:text-zinc-800 transition"
                    title="Forward"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Center Segmented Navigation Pill (Home, Flame, Sparkles, Library, Search) */}
              <nav className="flex items-center border border-zinc-200 rounded-full p-1 bg-zinc-50/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('home');
                    setSelectedPlaylist(null);
                  }}
                  className={`p-2 rounded-full transition ${
                    activeTab === 'home' && !selectedPlaylist
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  title="Listen Now / Home"
                >
                  <Home className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('moods');
                    setSelectedPlaylist(null);
                  }}
                  className={`p-2 rounded-full transition ${
                    activeTab === 'moods' && !selectedPlaylist
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  title="Find Your Mood"
                >
                  <Flame className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('essentials');
                    setSelectedPlaylist(null);
                  }}
                  className={`p-2 rounded-full transition ${
                    activeTab === 'essentials' && !selectedPlaylist
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  title="Essentials"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('library');
                    setSelectedPlaylist(null);
                  }}
                  className={`p-2 rounded-full transition ${
                    activeTab === 'library' && !selectedPlaylist
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  title="My Library & YouTube Playlists"
                >
                  <Library className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('search');
                    setSelectedPlaylist(null);
                  }}
                  className={`p-2 rounded-full transition ${
                    activeTab === 'search' && !selectedPlaylist
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </nav>

              {/* Right: YouTube Status Badge & Add URL */}
              <div className="flex items-center gap-2.5">
                {isLoadingYouTube ? (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing...</span>
                  </span>
                ) : syncError ? (
                  <button
                    type="button"
                    onClick={() => youtubeService.connectYouTube()}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
                    title={syncError.message}
                  >
                    Authorize YouTube
                  </button>
                ) : isYouTubeConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>YouTube Synced</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => youtubeService.connectYouTube()}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition"
                  >
                    Sync Gmail
                  </button>
                )}
              </div>
            </header>

            {/* Main Scrollable Stage */}
            <main className="flex-1 overflow-y-auto px-8 py-6 space-y-10 pb-32">
              {/* PLAYLIST DETAIL VIEW (If a user clicks on an imported playlist) */}
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
                        Playlist • Apple Music & YouTube
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
                          <span className="col-span-1 text-xs text-zinc-400">
                            {i + 1}
                          </span>
                          <div className="col-span-6 flex items-center gap-3 min-w-0">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-zinc-200"
                            />
                            <span className="text-xs font-semibold truncate">
                              {track.title}
                            </span>
                          </div>
                          <span className="col-span-3 text-xs text-zinc-500 truncate">
                            {track.artist}
                          </span>
                          <span className="col-span-2 text-right text-xs text-zinc-400 font-mono">
                            {track.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : activeTab === 'search' ? (
                /* SEARCH VIEW */
                <div className="space-y-6">
                  <div className="max-w-xl">
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search songs, artists, genres, or focus mood..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    {searchResults.map((t, i) => (
                      <div
                        key={t.id}
                        onClick={() => handlePlayTrack(t)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs text-zinc-400 w-4 text-center">{i + 1}</span>
                          <img src={t.coverUrl} alt={t.title} className="w-10 h-10 rounded-lg object-cover border border-zinc-200" />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-zinc-900 truncate">{t.title}</div>
                            <div className="text-[11px] text-zinc-500 truncate">{t.artist} • {t.genre}</div>
                          </div>
                        </div>
                        <span className="text-xs text-zinc-400 font-mono">{t.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* HOME VIEW / MOODS / ESSENTIALS (Strictly matches reference image) */
                <>
                  {/* SECTION 1: "Find Your Mood" matching the top row of reference */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                        Find Your Mood
                      </h2>
                      <span className="text-xs font-medium text-zinc-400">
                        Curated for focus & flow
                      </span>
                    </div>

                    {/* Cards Row: Energy, Love, Feel Good, Feeling Blue, Heartbreak, Relax, Focus */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      {MOOD_CARDS.map((mood) => (
                        <div
                          key={mood.id}
                          onClick={() => handlePlayTrack(mood.track)}
                          className="group cursor-pointer flex flex-col space-y-2 select-none"
                        >
                          {/* Square Graphic Card */}
                          <div
                            className={`relative aspect-square rounded-2xl bg-gradient-to-br ${mood.gradient} p-4 flex flex-col justify-between overflow-hidden shadow-xs border border-zinc-200/60 group-hover:shadow-md transition`}
                          >
                            {/* Apple Music Brand in top-right */}
                            <div className="flex justify-end">
                              <span className="text-[9px] font-bold text-white/90 tracking-tight">
                                Music
                              </span>
                            </div>

                            {/* Centered Graphic Symbol */}
                            <div className="my-auto flex items-center justify-center">
                              {mood.icon}
                            </div>

                            {/* Hover Play Button */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-md">
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Meta Text below card */}
                          <div>
                            <h3 className="text-xs font-bold text-zinc-900 leading-tight">
                              {mood.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2 mt-0.5">
                              {mood.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* SECTION 2: "Essentials" matching the second row of reference */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                        Essentials
                      </h2>
                      <span className="text-xs font-medium text-zinc-400">
                        Top artists & studio collections
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {ESSENTIALS_LIST.map((ess) => (
                        <div
                          key={ess.id}
                          onClick={() => handlePlayTrack(ess.track)}
                          className="group cursor-pointer flex flex-col space-y-2 select-none"
                        >
                          {/* Album Art with "Essentials" Apple Banner */}
                          <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 shadow-xs group-hover:shadow-md transition">
                            <img
                              src={ess.coverUrl}
                              alt={ess.title}
                              className="w-full h-full object-cover"
                            />

                            {/* Apple Music "Essentials" Header Overlay */}
                            <div className="absolute top-0 inset-x-0 bg-white/95 px-3 py-1.5 flex items-center justify-between border-b border-zinc-200/50">
                              <span className="text-xs font-bold text-zinc-900 tracking-tight">
                                Essentials
                              </span>
                              <span className="text-[9px] font-bold text-zinc-500">
                                Music
                              </span>
                            </div>

                            {/* Hover Play Button */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-md">
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Title & Category */}
                          <div>
                            <h3 className="text-xs font-bold text-zinc-900 leading-tight truncate">
                              {ess.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                              {ess.genre}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* SECTION 3: "My YouTube Playlists" / Liked Songs */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                          My YouTube Library
                        </h2>
                        {isYouTubeConnected && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Synced with Gmail
                          </span>
                        )}
                      </div>

                      {/* Add Custom Playlist Link */}
                      <form onSubmit={handleCustomLink} className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="Paste YouTube playlist URL..."
                          value={customLinkInput}
                          onChange={(e) => setCustomLinkInput(e.target.value)}
                          className="px-3 py-1 text-xs border border-zinc-200 rounded-lg bg-zinc-50 w-52 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Import
                        </button>
                      </form>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {userPlaylists.map((pl) => (
                        <div
                          key={pl.id}
                          onClick={() => setSelectedPlaylist(pl)}
                          className="p-3 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 transition cursor-pointer flex flex-col group select-none"
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 mb-2.5">
                            <img
                              src={pl.coverUrl}
                              alt={pl.title}
                              className="w-full h-full object-cover"
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

            {/* FLOATING BOTTOM CONTROLLER BAR (Matching Reference Image Exactly!) */}
            <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] backdrop-blur-2xl bg-white/95 text-zinc-900 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-zinc-200/90 px-6 py-3 flex items-center justify-between select-none">
              {/* Left Track Info */}
              <div className="flex items-center gap-3 w-64 min-w-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 shrink-0">
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-tight text-zinc-900 truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {currentTrack.artist}
                  </div>
                </div>
              </div>

              {/* Center Scrubber & Main Playback Controls */}
              <div className="flex-1 max-w-lg flex flex-col items-center justify-center px-4">
                {/* Control Icons: Shuffle, Prev, Play, Next, Repeat */}
                <div className="flex items-center gap-4 mb-1.5">
                  <button
                    type="button"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`transition ${isShuffle ? 'text-rose-600' : 'text-zinc-400 hover:text-zinc-700'}`}
                    title="Shuffle"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipPrev}
                    className="text-zinc-700 hover:text-zinc-900 transition active:scale-95"
                    title="Previous"
                  >
                    <SkipBack className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition shadow-2xs active:scale-95"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipNext}
                    className="text-zinc-700 hover:text-zinc-900 transition active:scale-95"
                    title="Next"
                  >
                    <SkipForward className="w-4 h-4 fill-current" />
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

                {/* Progress Timeline Scrubber */}
                <div className="w-full flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 w-7 text-right">
                    {formatSec(progressSec)}
                  </span>
                  <div className="flex-1 bg-zinc-200 h-1 rounded-full overflow-hidden relative cursor-pointer">
                    <div
                      className="bg-zinc-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (progressSec / 231) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 w-7">
                    {currentTrack.duration}
                  </span>
                </div>
              </div>

              {/* Right Side Controls: Star, AirPlay, Volume, Queue */}
              <div className="flex items-center gap-3 w-64 justify-end">
                {/* Like / Star */}
                <button
                  type="button"
                  onClick={() => toggleLike(currentTrack.id)}
                  className={`p-1.5 transition ${likedMap[currentTrack.id] ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-700'}`}
                  title="Favorite"
                >
                  <Heart className={`w-4 h-4 ${likedMap[currentTrack.id] ? 'fill-current' : ''}`} />
                </button>

                {/* Airplay */}
                <button
                  type="button"
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 transition"
                  title="AirPlay"
                >
                  <Airplay className="w-4 h-4" />
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-zinc-400 hover:text-zinc-700 transition"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
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
                    onChange={(e) => {
                      setVolume(Number(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-900"
                  />
                </div>

                {/* Queue / Lyrics Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('library')}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 transition"
                  title="View Playlists & Queue"
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
