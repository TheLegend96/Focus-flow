import React, { useState, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  ListMusic,
  Link2,
  Disc3,
  Sparkles,
  Music2
} from 'lucide-react';

export interface TrackPreset {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  playlistId?: string;
  coverUrl: string;
  category: 'lofi' | 'ambient' | 'classical' | 'synth';
}

const PRESET_TRACKS: TrackPreset[] = [
  {
    id: 'p1',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study',
    artist: 'Lofi Girl',
    videoId: 'jfKfPfyJRdk',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=60',
    category: 'lofi',
  },
  {
    id: 'p2',
    title: 'Deep Focus: Alpha Binaural Waves for Work',
    artist: 'Brain Waves Club',
    videoId: 'WPni755-Krg',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=60',
    category: 'ambient',
  },
  {
    id: 'p3',
    title: 'Synthwave / Cyberpunk Coding Mix',
    artist: 'ChillSynth Radio',
    videoId: '4xDzrJKXOOY',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=60',
    category: 'synth',
  },
  {
    id: 'p4',
    title: 'Rainy Coffee Shop - Ambient Jazz & Piano',
    artist: 'Coffee Cozy',
    videoId: 'e3L1I71DwfA',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=60',
    category: 'classical',
  },
  {
    id: 'p5',
    title: 'Peaceful Piano Focus & Deep Flow',
    artist: 'Relaxing Piano Studio',
    videoId: 'lTRiuFIWV54',
    coverUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=300&auto=format&fit=crop&q=60',
    category: 'classical',
  },
];

// Sample YouTube Music user playlists for simulation and demonstration
const SAMPLE_USER_PLAYLISTS = [
  {
    id: 'upl1',
    title: 'Deep Coding & Flow',
    trackCount: '84 tracks',
    playlistId: 'PLr4c6Fk_i456code',
    source: 'YouTube Music',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'upl2',
    title: 'Late Night Chill Instrumental',
    trackCount: '46 tracks',
    playlistId: 'PLr4c6Fk_i456chill',
    source: 'YouTube Music',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60',
  },
  {
    id: 'upl3',
    title: 'Study Session Beats',
    trackCount: '112 tracks',
    playlistId: 'PLr4c6Fk_i456study',
    source: 'YouTube Music',
    coverUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=60',
  },
];

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  currentTrack: TrackPreset;
  setCurrentTrack: (track: TrackPreset) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isOpen,
  onClose,
  isPlaying,
  setIsPlaying,
  currentTrack,
  setCurrentTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'playlists' | 'custom'>('presets');
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customError, setCustomError] = useState('');
  
  // Ref for the hidden YouTube iframe
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Extract YouTube Video or Playlist ID from URL
  const extractYouTubeId = (url: string) => {
    // Check for playlist
    const playlistMatch = url.match(/[?&]list=([^#&?]+)/);
    // Check for standard video watch
    const videoMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return {
      playlistId: playlistMatch ? playlistMatch[1] : null,
      videoId: videoMatch ? videoMatch[1] : null,
    };
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');
    if (!customUrl.trim()) return;

    const { videoId, playlistId } = extractYouTubeId(customUrl);

    if (videoId || playlistId) {
      setCurrentTrack({
        id: `custom-${Date.now()}`,
        title: playlistId ? 'Custom YouTube Playlist' : 'Custom YouTube Stream',
        artist: 'YouTube Music',
        videoId: videoId || '',
        playlistId: playlistId || undefined,
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60',
        category: 'lofi',
      });
      setIsPlaying(true);
      setCustomUrl('');
    } else {
      setCustomError('Please enter a valid YouTube or YouTube Music link.');
    }
  };

  const handleSelectPreset = (track: TrackPreset) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleSelectPlaylist = (pl: typeof SAMPLE_USER_PLAYLISTS[0]) => {
    setCurrentTrack({
      id: pl.id,
      title: pl.title,
      artist: 'YouTube Music Playlist',
      videoId: 'jfKfPfyJRdk', // Default audio anchor
      playlistId: pl.playlistId,
      coverUrl: pl.coverUrl,
      category: 'lofi',
    });
    setIsPlaying(true);
  };

  // Build the embed URL with autoplay parameters
  const embedUrl = currentTrack.playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${currentTrack.playlistId}&autoplay=${isPlaying ? '1' : '0'}&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    : `https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=${isPlaying ? '1' : '0'}&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;

  return (
    <>
      {/* 1. Permanent Hidden YouTube Player Iframe (Keeps playing even when modal is closed!) */}
      <div className="fixed -bottom-96 -right-96 opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
        {isPlaying && (
          <iframe
            ref={iframeRef}
            key={`${currentTrack.videoId}-${currentTrack.playlistId}-${isPlaying}`}
            width="200"
            height="200"
            src={embedUrl}
            title="FocusFlow YouTube Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>

      {/* 2. Interactive Studio Modal UI */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={onClose}
        >
          <div
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 relative flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-2xs">
                  <Music2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <span>Focus Music Studio</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                      YouTube Music
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Background music designed for deep work & sustained focus
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Now Playing Bar */}
            <div className="my-4 p-3.5 rounded-2xl bg-zinc-900 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Disc3 className="w-6 h-6 text-rose-400 animate-spin" style={{ animationDuration: '4s' }} />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-100 truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {currentTrack.artist}
                  </div>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-4 shrink-0 pl-3">
                {/* Play / Pause Toggle */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-sm transition active:scale-95"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-zinc-400 hover:text-zinc-200"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
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
                    className="w-16 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'presets'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Curated Radios</span>
              </button>

              <button
                onClick={() => setActiveTab('playlists')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'playlists'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>My YouTube Playlists</span>
              </button>

              <button
                onClick={() => setActiveTab('custom')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'custom'
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Paste Link</span>
              </button>
            </div>

            {/* Tab Contents (Scrollable) */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {/* Tab 1: Presets */}
              {activeTab === 'presets' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Handpicked Focus Radios (Ad-Free Flow)
                  </div>
                  {PRESET_TRACKS.map((t) => {
                    const isSelected = currentTrack.videoId === t.videoId;
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleSelectPreset(t)}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border transition cursor-pointer group ${
                          isSelected
                            ? 'border-rose-400 bg-rose-50/50'
                            : 'border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={t.coverUrl}
                            alt={t.title}
                            className="w-11 h-11 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className={`text-xs font-bold truncate ${isSelected ? 'text-rose-600' : 'text-zinc-800'}`}>
                              {t.title}
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-0.5">
                              {t.artist}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 pl-2">
                          {isSelected && isPlaying ? (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-100/70 px-2.5 py-1 rounded-full">
                              <Sparkles className="w-3 h-3" /> Playing
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-rose-500 group-hover:text-white text-zinc-600 flex items-center justify-center transition"
                            >
                              <Play className="w-3.5 h-3.5 ml-0.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: User YouTube Playlists */}
              {activeTab === 'playlists' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-zinc-800">
                        YouTube Music Sync
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Connected to your Google Account playlists
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Sync Ready
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Your Playlists
                  </div>

                  {SAMPLE_USER_PLAYLISTS.map((pl) => (
                    <div
                      key={pl.id}
                      onClick={() => handleSelectPlaylist(pl)}
                      className="flex items-center justify-between p-2.5 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/70 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={pl.coverUrl}
                          alt={pl.title}
                          className="w-11 h-11 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-zinc-800 group-hover:text-rose-600 transition truncate">
                            {pl.title}
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
                            <span>{pl.source}</span>
                            <span>•</span>
                            <span>{pl.trackCount}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-rose-500 group-hover:text-white text-zinc-600 flex items-center justify-center transition"
                      >
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Custom YouTube URL */}
              {activeTab === 'custom' && (
                <div className="space-y-4 pt-1">
                  <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50">
                    <h3 className="text-xs font-bold text-zinc-800 mb-1">
                      Play Any YouTube or YouTube Music Link
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      Paste any public playlist, live stream, or music video URL from YouTube or YouTube Music.
                    </p>

                    <form onSubmit={handleApplyCustomUrl} className="space-y-2">
                      <div className="relative">
                        <Link2 className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          placeholder="https://music.youtube.com/playlist?list=..."
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                        />
                      </div>

                      {customError && (
                        <p className="text-[11px] text-rose-500">{customError}</p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition"
                      >
                        Start Playing in Background
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Music continues playing in background while timer runs</span>
              <button
                onClick={onClose}
                className="text-zinc-600 hover:text-zinc-900 font-semibold"
              >
                Keep Playing & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
