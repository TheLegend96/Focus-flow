import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  Radio,
  ListMusic,
  Link2,
  Disc3,
  Sparkles,
  Music2,
  Minimize2,
  Maximize2
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
  const [customUrl, setCustomUrl] = useState('');
  const [customError, setCustomError] = useState('');
  const [isMiniPlayerExpanded, setIsMiniPlayerExpanded] = useState(false);

  const extractYouTubeId = (url: string) => {
    const playlistMatch = url.match(/[?&]list=([^#&?]+)/);
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
      videoId: 'jfKfPfyJRdk',
      playlistId: pl.playlistId,
      coverUrl: pl.coverUrl,
      category: 'lofi',
    });
    setIsPlaying(true);
  };

  // Embed URL for YouTube Iframe
  const embedSrc = currentTrack.playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${currentTrack.playlistId}&autoplay=1`
    : `https://www.youtube.com/embed/${currentTrack.videoId}?autoplay=1`;

  return (
    <>
      {/* 1. Docked Floating Mini Player (Always visible in bottom left when playing, fully audible & never blocked by Chrome) */}
      {isPlaying && (
        <aside
          aria-label="Active music playback"
          className="fixed bottom-4 left-20 z-40 bg-zinc-900 text-white rounded-2xl shadow-xl border border-zinc-800 p-2.5 transition-all flex flex-col gap-2 max-w-xs"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-zinc-700">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Disc3 className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-100 truncate max-w-[130px]">
                  {currentTrack.title}
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[130px]">
                  {currentTrack.artist}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsMiniPlayerExpanded(!isMiniPlayerExpanded)}
                className="p-1 text-zinc-400 hover:text-white rounded transition"
                title={isMiniPlayerExpanded ? 'Hide video' : 'Show video'}
              >
                {isMiniPlayerExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition active:scale-95"
                title="Pause playback"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* YouTube Video / Audio Frame */}
          <div className={`${isMiniPlayerExpanded ? 'block w-64 h-36 mt-1 rounded-xl overflow-hidden border border-zinc-800' : 'w-48 h-10 opacity-90 rounded-lg overflow-hidden'}`}>
            <iframe
              key={`${currentTrack.videoId}-${currentTrack.playlistId}`}
              width="100%"
              height="100%"
              src={embedSrc}
              title="FocusFlow Music Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full border-0"
            />
          </div>
        </aside>
      )}

      {/* 2. Full Studio Modal */}
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
                type="button"
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Now Playing Bar in Modal */}
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

              {/* Controls */}
              <div className="flex items-center gap-3 shrink-0 pl-3">
                <button
                  type="button"
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
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
              <button
                type="button"
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
                type="button"
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
                type="button"
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

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {activeTab === 'presets' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Handpicked Focus Radios
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

            {/* Footer */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Docked mini-player stays active while your focus timer runs</span>
              <button
                type="button"
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
