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
  ListMusic,
  Radio,
  Compass,
  Sparkles,
  Disc3,
  Minimize2,
  Maximize2,
  Flame,
  Plus,
  RefreshCw
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

export interface PlaylistCollection {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracksCount: number;
  tracks: TrackItem[];
}

const FEATURED_TRACKS: TrackItem[] = [
  {
    id: 'f1',
    title: 'Lofi Hip Hop Radio — Beats to Relax/Study',
    artist: 'Lofi Girl',
    album: 'Lofi Beats Session',
    duration: '3:45',
    videoId: 'jfKfPfyJRdk',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    genre: 'Lo-Fi Chill',
  },
  {
    id: 'f2',
    title: 'Deep Focus (Alpha Waves 40Hz for Mental Clarity)',
    artist: 'Brain Wave Collective',
    album: 'Cognitive Architecture',
    duration: '4:20',
    videoId: 'WPni755-Krg',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    genre: 'Ambient Alpha',
  },
  {
    id: 'f3',
    title: 'Synthwave / Cyberpunk Coding Mix 2026',
    artist: 'ChillSynth Radio',
    album: 'Night City Overdrive',
    duration: '5:12',
    videoId: '4xDzrJKXOOY',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    genre: 'Synthwave',
  },
  {
    id: 'f4',
    title: 'Rainy Cafe in Kyoto — Ambient Jazz & Piano',
    artist: 'Coffee Cozy Records',
    album: 'Raindrops on Concrete',
    duration: '3:50',
    videoId: 'e3L1I71DwfA',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    genre: 'Acoustic Jazz',
  },
  {
    id: 'f5',
    title: 'Peaceful Piano Masterpieces for Deep Work',
    artist: 'Ludovico Ensemble',
    album: 'Reflections & Solitude',
    duration: '4:05',
    videoId: 'lTRiuFIWV54',
    coverUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=600&auto=format&fit=crop&q=80',
    genre: 'Classical Piano',
  },
  {
    id: 'f6',
    title: 'Interstellar Deep Space Ambience',
    artist: 'Cosmos Soundscapes',
    album: 'Orbital Resonance',
    duration: '6:15',
    videoId: 'tNkZsRW7h2c',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    genre: 'Space Ambient',
  },
];

const CURATED_PLAYLISTS: PlaylistCollection[] = [
  {
    id: 'pl-coding',
    title: 'Deep Coding & Flow',
    description: 'High-focus electronics, glitch-free instrumentals, and minimal grooves.',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    tracksCount: 42,
    tracks: [
      FEATURED_TRACKS[2],
      FEATURED_TRACKS[1],
      FEATURED_TRACKS[0],
      FEATURED_TRACKS[5],
    ],
  },
  {
    id: 'pl-lofi',
    title: 'Late Night Study Lounge',
    description: 'Warm vinyl crackle, gentle chords, and soft dusty boom-bap percussion.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    tracksCount: 58,
    tracks: [
      FEATURED_TRACKS[0],
      FEATURED_TRACKS[3],
      FEATURED_TRACKS[4],
    ],
  },
  {
    id: 'pl-ambient',
    title: 'Pure Focus & Neural Clarity',
    description: 'Binaural frequencies, atmospheric soundscapes, and uninterrupted flow states.',
    coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    tracksCount: 36,
    tracks: [
      FEATURED_TRACKS[1],
      FEATURED_TRACKS[4],
      FEATURED_TRACKS[5],
      FEATURED_TRACKS[2],
    ],
  },
  {
    id: 'pl-classical',
    title: 'Minimalist Modern Piano',
    description: 'Intimate felt piano and subtle orchestral textures for deep writing.',
    coverUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=600&auto=format&fit=crop&q=80',
    tracksCount: 29,
    tracks: [
      FEATURED_TRACKS[4],
      FEATURED_TRACKS[3],
      FEATURED_TRACKS[1],
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
  const [activeNav, setActiveNav] = useState<'listen-now' | 'browse' | 'radio' | 'library' | 'liked' | 'custom'>('listen-now');
  const [searchQuery, setSearchQuery] = useState('');
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progressSec, setProgressSec] = useState(38);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({
    f1: true,
    f2: true,
  });
  const [customLinkInput, setCustomLinkInput] = useState('');
  const [isGlassExpanded, setIsGlassExpanded] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistCollection | null>(null);

  // Real YouTube Data API state
  const [userPlaylists, setUserPlaylists] = useState<PlaylistCollection[]>(CURATED_PLAYLISTS);
  const [likedTracks, setLikedTracks] = useState<TrackItem[]>(FEATURED_TRACKS.slice(0, 4));
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);

  // Fetch real YouTube Liked Songs & Playlists when Google token is present
  const syncYouTubeData = async () => {
    setIsLoadingYouTube(true);
    const token = await youtubeService.getGoogleAccessToken();
    if (token) {
      setIsYouTubeConnected(true);
      const [playlists, liked] = await Promise.all([
        youtubeService.fetchUserPlaylists(token),
        youtubeService.fetchLikedSongs(token),
      ]);
      if (playlists.length > 0) setUserPlaylists(playlists);
      if (liked.length > 0) setLikedTracks(liked);
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

  // Playback timer simulator for smooth scrubber movement
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => (prev >= 240 ? 0 : prev + 1));
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
    const currentIndex = FEATURED_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % FEATURED_TRACKS.length;
    handlePlayTrack(FEATURED_TRACKS[nextIndex]);
  };

  const handleSkipPrev = () => {
    const currentIndex = FEATURED_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex <= 0 ? FEATURED_TRACKS.length - 1 : currentIndex - 1;
    handlePlayTrack(FEATURED_TRACKS[prevIndex]);
  };

  const handleCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkInput.trim()) return;

    // Parse URL
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
  const displayedTracks = FEATURED_TRACKS.filter((t) => {
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
      {/* 1. Permanent Docked Glass Mini Player (Floats in corner while user works) */}
      {isPlaying && !isOpen && (
        <aside
          aria-label="Apple Music Glass Mini Player"
          className="fixed bottom-5 left-20 z-40 backdrop-blur-2xl bg-zinc-950/75 text-white rounded-2xl shadow-2xl border border-white/10 p-2.5 flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-3 hover:bg-zinc-950/85"
        >
          {/* Subtle Ambient Backlight Glow from Album Cover */}
          <div
            className="absolute -inset-1 rounded-2xl opacity-25 blur-lg -z-10"
            style={{
              backgroundImage: `radial-gradient(circle, #f43f5e 0%, transparent 70%)`,
            }}
          />

          <div
            onClick={onClose}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-sm">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Disc3 className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '3.5s' }} />
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold text-zinc-100 truncate max-w-[125px] group-hover:text-rose-400 transition">
                {currentTrack.title}
              </div>
              <div className="text-[10px] text-zinc-400 truncate max-w-[125px]">
                {currentTrack.artist}
              </div>
            </div>
          </div>

          {/* Quick Mini Controls */}
          <div className="flex items-center gap-1 shrink-0 border-l border-white/10 pl-2">
            <button
              type="button"
              onClick={handleSkipPrev}
              className="p-1 text-zinc-400 hover:text-white transition"
              title="Previous"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-sm active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={handleSkipNext}
              className="p-1 text-zinc-400 hover:text-white transition"
              title="Next"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. Embedded Active YouTube Audio Frame (Always active, 100% audible) */}
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

      {/* 3. Full Apple Music Liquid Glass Overlay Window */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={onClose}
        >
          {/* Main Apple Glass Container */}
          <div
            className={`w-full ${
              isGlassExpanded ? 'max-w-7xl h-[95vh]' : 'max-w-5xl h-[85vh]'
            } backdrop-blur-3xl bg-zinc-950/80 text-zinc-100 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 flex flex-col overflow-hidden relative transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Reactive Colorful Backdrop Glow from Album Cover */}
            <div
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none -z-10"
              style={{
                background: `radial-gradient(circle, #f43f5e 0%, #8b5cf6 50%, transparent 80%)`,
              }}
            />
            <div
              className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none -z-10"
              style={{
                background: `radial-gradient(circle, #06b6d4 0%, transparent 70%)`,
              }}
            />

            {/* Apple Music Header / Playback Bar */}
            <header className="h-18 px-5 border-b border-white/10 flex items-center justify-between shrink-0 select-none bg-zinc-950/40">
              {/* Left Window Traffic Lights & Search */}
              <div className="flex items-center gap-4 w-72">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onClose}
                    className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition"
                    title="Close"
                  />
                  <button
                    onClick={() => setIsGlassExpanded(!isGlassExpanded)}
                    className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition"
                    title="Minimize"
                  />
                  <button
                    onClick={() => setIsGlassExpanded(!isGlassExpanded)}
                    className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition"
                    title="Maximize"
                  />
                </div>

                {/* Apple Search Input */}
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search music, artists, albums"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500/60 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              {/* Center Apple Music Interactive LCD Scrubber */}
              <div className="flex-1 max-w-lg flex flex-col items-center justify-center px-4">
                {/* Playback Button Cluster */}
                <div className="flex items-center gap-4 mb-1">
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`transition ${isShuffle ? 'text-rose-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Shuffle"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleSkipPrev}
                    className="text-zinc-300 hover:text-white transition active:scale-95"
                    title="Previous"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-md"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={handleSkipNext}
                    className="text-zinc-300 hover:text-white transition active:scale-95"
                    title="Next"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`transition ${isRepeat ? 'text-rose-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Repeat"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Apple LCD Screen & Progress Bar */}
                <div className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1 flex items-center gap-3">
                  <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/10">
                    <img src={currentTrack.coverUrl} alt="Art" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center justify-between text-[11px] font-medium leading-tight">
                      <span className="text-zinc-100 font-semibold truncate max-w-[180px]">
                        {currentTrack.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {formatSec(progressSec)} / {currentTrack.duration}
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-white/10 h-1 rounded-full mt-1 overflow-hidden relative cursor-pointer">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (progressSec / 240) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLike(currentTrack.id)}
                    className={`p-1 transition ${likedMap[currentTrack.id] ? 'text-rose-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedMap[currentTrack.id] ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Right Controls: Volume & Expand */}
              <div className="flex items-center gap-3 w-72 justify-end">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-zinc-400 hover:text-white transition"
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
                    className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="w-px h-5 bg-white/10 mx-1" />

                <button
                  onClick={() => setIsGlassExpanded(!isGlassExpanded)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                  title={isGlassExpanded ? 'Exit full window' : 'Full window'}
                >
                  {isGlassExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                  title="Close Studio"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Apple Music Main Layout: Sidebar + Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Apple Left Navigation Sidebar */}
              <nav className="w-56 p-4 border-r border-white/10 flex flex-col justify-between shrink-0 bg-zinc-950/20 select-none">
                <div className="space-y-6">
                  {/* Category Header */}
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 mb-2">
                      Apple Music
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveNav('listen-now');
                          setSelectedPlaylist(null);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                          activeNav === 'listen-now' && !selectedPlaylist
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                        }`}
                      >
                        <Compass className="w-4 h-4" />
                        <span>Listen Now</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveNav('browse');
                          setSelectedPlaylist(null);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                          activeNav === 'browse' && !selectedPlaylist
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                        }`}
                      >
                        <Flame className="w-4 h-4" />
                        <span>Browse & Hits</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveNav('radio');
                          setSelectedPlaylist(null);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                          activeNav === 'radio' && !selectedPlaylist
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                        }`}
                      >
                        <Radio className="w-4 h-4" />
                        <span>Focus Radios</span>
                      </button>
                    </div>
                  </div>

                  {/* YouTube Music Connected Library */}
                  <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        YouTube Music
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isLoadingYouTube && (
                          <RefreshCw className="w-3 h-3 text-zinc-400 animate-spin" />
                        )}
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border ${
                          isYouTubeConnected
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        }`}>
                          {isYouTubeConnected ? 'Connected' : 'Offline'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {/* Liked Songs Button */}
                      <button
                        onClick={() => {
                          setActiveNav('liked');
                          setSelectedPlaylist(null);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition text-left truncate ${
                          activeNav === 'liked'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-current shrink-0" />
                          <span className="truncate">Liked Songs</span>
                        </div>
                        <span className="text-[10px] opacity-75 shrink-0">
                          {likedTracks.length}
                        </span>
                      </button>

                      {userPlaylists.map((pl) => (
                        <button
                          key={pl.id}
                          onClick={() => {
                            setSelectedPlaylist(pl);
                            setActiveNav('library');
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition text-left truncate ${
                            selectedPlaylist?.id === pl.id
                              ? 'bg-white/10 text-rose-400 border border-white/10'
                              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <ListMusic className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{pl.title}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 shrink-0">
                            {pl.tracksCount}
                          </span>
                        </button>
                      ))}

                      {!isYouTubeConnected && (
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 mt-2 text-left">
                          <p className="text-[11px] text-zinc-300 leading-snug mb-2">
                            Connect your Google Account to sync your YouTube Liked Songs & playlists.
                          </p>
                          <button
                            type="button"
                            onClick={() => youtubeService.connectYouTube()}
                            className="w-full py-1.5 px-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <span>Connect YouTube</span>
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setActiveNav('custom');
                          setSelectedPlaylist(null);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition mt-2 ${
                          activeNav === 'custom'
                            ? 'bg-rose-500 text-white'
                            : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add YouTube Link</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Profile Badge */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/30">
                    YM
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-zinc-200 truncate">
                      YouTube Studio
                    </div>
                    <div className="text-[10px] text-zinc-400">High-Res Audio</div>
                  </div>
                </div>
              </nav>

              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. PLAYLIST VIEW (When user clicks any playlist from sidebar) */}
                {selectedPlaylist ? (
                  <div className="space-y-6">
                    {/* Playlist Hero */}
                    <div className="flex items-end gap-6 p-6 rounded-3xl bg-gradient-to-t from-white/5 to-transparent border border-white/10">
                      <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                        <img
                          src={selectedPlaylist.coverUrl}
                          alt={selectedPlaylist.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                          Playlist • YouTube Music
                        </span>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                          {selectedPlaylist.title}
                        </h1>
                        <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                          {selectedPlaylist.description}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => handlePlayTrack(selectedPlaylist.tracks[0])}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition shadow-lg active:scale-95"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>Play All</span>
                          </button>
                          <span className="text-xs text-zinc-400">
                            {selectedPlaylist.tracksCount} songs • Updated today
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Track List */}
                    <div className="space-y-1">
                      <div className="grid grid-cols-12 text-[11px] font-bold text-zinc-500 uppercase px-4 py-2 border-b border-white/10">
                        <span className="col-span-1">#</span>
                        <span className="col-span-6">Title</span>
                        <span className="col-span-3">Album</span>
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
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : 'hover:bg-white/5 text-zinc-300'
                            }`}
                          >
                            <span className="col-span-1 text-xs text-zinc-500 group-hover:text-white">
                              {isCurrent && isPlaying ? (
                                <Disc3 className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                              ) : (
                                i + 1
                              )}
                            </span>
                            <div className="col-span-6 flex items-center gap-3 min-w-0">
                              <img
                                src={track.coverUrl}
                                alt={track.title}
                                className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/10"
                              />
                              <div className="min-w-0">
                                <div className={`text-xs font-semibold truncate ${isCurrent ? 'text-rose-400' : 'text-zinc-100 group-hover:text-white'}`}>
                                  {track.title}
                                </div>
                                <div className="text-[11px] text-zinc-400 truncate">
                                  {track.artist}
                                </div>
                              </div>
                            </div>
                            <span className="col-span-3 text-xs text-zinc-400 truncate">
                              {track.album || track.genre}
                            </span>
                            <span className="col-span-2 text-right text-xs text-zinc-400 font-mono">
                              {track.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : activeNav === 'liked' ? (
                  /* 2. LIKED SONGS VIEW (Apple Music Favorite Tracks) */
                  <div className="space-y-6">
                    {/* Hero Header */}
                    <div className="flex items-end gap-6 p-6 rounded-3xl bg-gradient-to-t from-rose-950/40 via-purple-950/20 to-transparent border border-white/10">
                      <div className="w-44 h-44 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl border border-white/20 shrink-0">
                        <Heart className="w-20 h-20 text-white fill-current" />
                      </div>

                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                          Auto Playlist • YouTube Music
                        </span>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                          Liked Songs
                        </h1>
                        <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                          Your synchronized liked music and saved tracks from YouTube & YouTube Music.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => handlePlayTrack(likedTracks[0])}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition shadow-lg active:scale-95"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>Play All ({likedTracks.length})</span>
                          </button>
                          <button
                            type="button"
                            onClick={syncYouTubeData}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-medium transition"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingYouTube ? 'animate-spin' : ''}`} />
                            <span>Refresh from YouTube</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Track Table */}
                    <div className="space-y-1">
                      <div className="grid grid-cols-12 text-[11px] font-bold text-zinc-500 uppercase px-4 py-2 border-b border-white/10">
                        <span className="col-span-1">#</span>
                        <span className="col-span-6">Title</span>
                        <span className="col-span-3">Channel / Album</span>
                        <span className="col-span-2 text-right">Time</span>
                      </div>

                      {likedTracks.map((track, i) => {
                        const isCurrent = currentTrack.id === track.id;
                        return (
                          <div
                            key={track.id}
                            onClick={() => handlePlayTrack(track)}
                            className={`grid grid-cols-12 items-center px-4 py-2.5 rounded-xl cursor-pointer transition group ${
                              isCurrent
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : 'hover:bg-white/5 text-zinc-300'
                            }`}
                          >
                            <span className="col-span-1 text-xs text-zinc-500 group-hover:text-white">
                              {isCurrent && isPlaying ? (
                                <Disc3 className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                              ) : (
                                i + 1
                              )}
                            </span>
                            <div className="col-span-6 flex items-center gap-3 min-w-0">
                              <img
                                src={track.coverUrl}
                                alt={track.title}
                                className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/10"
                              />
                              <div className="min-w-0">
                                <div className={`text-xs font-semibold truncate ${isCurrent ? 'text-rose-400' : 'text-zinc-100 group-hover:text-white'}`}>
                                  {track.title}
                                </div>
                                <div className="text-[11px] text-zinc-400 truncate">
                                  {track.artist}
                                </div>
                              </div>
                            </div>
                            <span className="col-span-3 text-xs text-zinc-400 truncate">
                              {track.album || track.genre}
                            </span>
                            <span className="col-span-2 text-right text-xs text-zinc-400 font-mono">
                              {track.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : activeNav === 'custom' ? (
                  /* 2. CUSTOM YOUTUBE PASTE LINK */
                  <div className="max-w-xl mx-auto py-8 space-y-4">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                          <Plus className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-white">
                            Play Any YouTube or YouTube Music Link
                          </h2>
                          <p className="text-xs text-zinc-400">
                            Paste any video, public playlist, or live radio stream URL
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleCustomLink} className="space-y-3 pt-2">
                        <input
                          type="url"
                          placeholder="https://music.youtube.com/watch?v=... or playlist?list=..."
                          value={customLinkInput}
                          onChange={(e) => setCustomLinkInput(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/60"
                        />
                        <button
                          type="submit"
                          className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition shadow-md"
                        >
                          Stream into Apple Glass Player
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  /* 3. DEFAULT LISTEN NOW / BROWSE / RADIO VIEW */
                  <>
                    {/* Big Hero Banner (Apple Music Style) */}
                    <div className="relative rounded-3xl overflow-hidden p-8 border border-white/10 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-zinc-950/40 shadow-xl flex items-center justify-between">
                      <div className="max-w-lg space-y-3 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" /> Featured Flow
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                          Curated Deep Work Radios & YouTube Music Hits
                        </h2>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          Pure high-fidelity streams formatted for long deep work sessions. No speech, no video ads, pure uninterrupted state.
                        </p>
                        <button
                          onClick={() => handlePlayTrack(FEATURED_TRACKS[0])}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs shadow-lg transition active:scale-95"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Start Lofi Radio</span>
                        </button>
                      </div>

                      {/* Right 3D Visualizer Art */}
                      <div className="relative w-48 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shrink-0 hidden md:block">
                        <img
                          src={currentTrack.coverUrl}
                          alt="Cover Art"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    </div>

                    {/* Apple Curated Playlists Carousel Grid */}
                    <section className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-zinc-100">
                          Focus Playlists on YouTube Music
                        </h3>
                        <span className="text-xs text-zinc-400">Updated Daily</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CURATED_PLAYLISTS.map((pl) => (
                          <div
                            key={pl.id}
                            onClick={() => {
                              setSelectedPlaylist(pl);
                              setActiveNav('library');
                            }}
                            className="group p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/40 hover:bg-white/10 transition cursor-pointer flex flex-col"
                          >
                            <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 mb-2.5 shadow-md">
                              <img
                                src={pl.coverUrl}
                                alt={pl.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
                                  <Play className="w-4 h-4 fill-current ml-0.5" />
                                </div>
                              </div>
                            </div>

                            <div className="text-xs font-bold text-zinc-100 truncate group-hover:text-rose-400 transition">
                              {pl.title}
                            </div>
                            <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                              {pl.tracksCount} tracks
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Top Focus Tracks Table */}
                    <section className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-zinc-100">
                          Top Stations & Radios
                        </h3>
                        <span className="text-xs text-zinc-400">
                          {displayedTracks.length} streams available
                        </span>
                      </div>

                      <div className="space-y-1">
                        {displayedTracks.map((track, i) => {
                          const isCurrent = currentTrack.id === track.id;
                          return (
                            <div
                              key={track.id}
                              onClick={() => handlePlayTrack(track)}
                              className={`flex items-center justify-between p-2.5 rounded-2xl border transition cursor-pointer group ${
                                isCurrent
                                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                                  : 'border-white/5 hover:border-white/10 hover:bg-white/5 text-zinc-300'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xs text-zinc-500 w-4 text-center">
                                  {isCurrent && isPlaying ? (
                                    <Disc3 className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                                  ) : (
                                    i + 1
                                  )}
                                </span>
                                <img
                                  src={track.coverUrl}
                                  alt={track.title}
                                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10"
                                />
                                <div className="min-w-0">
                                  <div className={`text-xs font-semibold truncate ${isCurrent ? 'text-rose-400' : 'text-zinc-100 group-hover:text-white'}`}>
                                    {track.title}
                                  </div>
                                  <div className="text-[11px] text-zinc-400 truncate">
                                    {track.artist} • <span className="text-zinc-500">{track.genre}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0 pl-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike(track.id);
                                  }}
                                  className={`p-1 transition ${likedMap[track.id] ? 'text-rose-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${likedMap[track.id] ? 'fill-current' : ''}`} />
                                </button>
                                <span className="text-xs text-zinc-400 font-mono">
                                  {track.duration}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </>
                )}
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
