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
  Check,
  Disc,
  Sparkles,
  ArrowLeft,
  Share2,
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
  type?: 'essentials' | 'album' | 'mood' | 'playlist';
  typeLabel?: string;
  artist?: string;
  genre?: string;
  year?: string;
  badgeText?: string;
  bannerColor?: string;
  bannerTextColor?: string;
  totalDurationText?: string;
  gradient?: string;
}

export type AlbumCollection = PlaylistCollection;

// ==========================================
// 1. FIND YOUR MOOD (Reference Row 1)
// ==========================================
export const FIND_YOUR_MOOD_COLLECTIONS: PlaylistCollection[] = [
  {
    id: 'mood-energy',
    type: 'mood',
    typeLabel: 'Mood Station',
    title: 'Energy',
    description: 'Keep it moving with non-stop high-voltage tracks.',
    artist: 'FocusFlow Audio',
    genre: 'High Voltage Rock & Beats',
    year: '2026',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-emerald-400 via-teal-500 to-green-600',
    tracksCount: 6,
    totalDurationText: '21 min',
    tracks: [
      {
        id: 'en-1',
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
        id: 'en-2',
        title: 'Enter Sandman',
        artist: 'Metallica',
        album: 'Metallica (The Black Album)',
        duration: '5:31',
        durationSec: 331,
        videoId: 'CD-E-LDc384',
        coverUrl: 'https://i.ytimg.com/vi/CD-E-LDc384/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'en-3',
        title: 'Chop Suey!',
        artist: 'System of a Down',
        album: 'Toxicity',
        duration: '3:30',
        durationSec: 210,
        videoId: 'CSvFpBOe8eY',
        coverUrl: 'https://i.ytimg.com/vi/CSvFpBOe8eY/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'en-4',
        title: 'Bleed It Out',
        artist: 'LINKIN PARK',
        album: 'Minutes to Midnight',
        duration: '2:44',
        durationSec: 164,
        videoId: 'OnuuYcqhzCE',
        coverUrl: 'https://i.ytimg.com/vi/OnuuYcqhzCE/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'en-5',
        title: 'Lux Æterna',
        artist: 'Metallica',
        album: '72 Seasons',
        duration: '3:25',
        durationSec: 205,
        videoId: '_ElURv_1j0g',
        coverUrl: 'https://i.ytimg.com/vi/_ElURv_1j0g/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'en-6',
        title: 'Out of Control',
        artist: 'Hoobastank',
        album: 'The Reason',
        duration: '2:42',
        durationSec: 162,
        videoId: 'eIqJvO1sO8A',
        coverUrl: 'https://i.ytimg.com/vi/eIqJvO1sO8A/hqdefault.jpg',
        category: 'Energize',
      },
    ],
  },
  {
    id: 'mood-love',
    type: 'mood',
    typeLabel: 'Mood Station',
    title: 'Love',
    description: 'Romantic music that captures the perfect mood.',
    artist: 'Curated Essentials',
    genre: 'R&B / Acoustic Pop',
    year: '2026',
    coverUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    tracksCount: 5,
    totalDurationText: '18 min',
    tracks: [
      {
        id: 'lv-1',
        title: 'Die For You',
        artist: 'The Weeknd',
        album: 'Starboy',
        duration: '3:52',
        durationSec: 232,
        videoId: 'uPD0Q879FK4',
        coverUrl: 'https://i.ytimg.com/vi/uPD0Q879FK4/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'lv-2',
        title: 'Sanctuary',
        artist: 'Joji',
        album: 'Nectar',
        duration: '3:00',
        durationSec: 180,
        videoId: 'YLsnEx4j-eQ',
        coverUrl: 'https://i.ytimg.com/vi/YLsnEx4j-eQ/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'lv-3',
        title: 'Sunflower',
        artist: 'Post Malone & Swae Lee',
        album: 'Spider-Man Soundtrack',
        duration: '2:38',
        durationSec: 158,
        videoId: 'ApXoWvfEYVU',
        coverUrl: 'https://i.ytimg.com/vi/ApXoWvfEYVU/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'lv-4',
        title: 'Ojitos Lindos',
        artist: 'Bad Bunny (feat. Bomba Estéreo)',
        album: 'Un Verano Sin Ti',
        duration: '4:18',
        durationSec: 258,
        videoId: '10EX-_h4pYc',
        coverUrl: 'https://i.ytimg.com/vi/10EX-_h4pYc/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'lv-5',
        title: 'With You',
        artist: 'LINKIN PARK',
        album: 'Hybrid Theory',
        duration: '3:23',
        durationSec: 203,
        videoId: '4qJk11nI5kE',
        coverUrl: 'https://i.ytimg.com/vi/4qJk11nI5kE/hqdefault.jpg',
        category: 'Energize',
      },
    ],
  },
  {
    id: 'mood-feelgood',
    type: 'mood',
    typeLabel: 'Mood Station',
    title: 'Feel Good',
    description: 'The most uplifting tracks to brighten your day.',
    artist: 'Daily Radiance',
    genre: 'Indie Pop & Grooves',
    year: '2026',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-amber-400 via-orange-500 to-yellow-500',
    tracksCount: 5,
    totalDurationText: '17 min',
    tracks: [
      {
        id: 'fg-1',
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
        id: 'fg-2',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: '3:20',
        durationSec: 200,
        videoId: '4NRXx6U8ABQ',
        coverUrl: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'fg-3',
        title: 'Congratulations',
        artist: 'Post Malone (feat. Quavo)',
        album: 'Stoney',
        duration: '3:40',
        durationSec: 220,
        videoId: 'SC4x4qGXx2k',
        coverUrl: 'https://i.ytimg.com/vi/SC4x4qGXx2k/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'fg-4',
        title: "Can't Feel My Face",
        artist: 'The Weeknd',
        album: 'Beauty Behind the Madness',
        duration: '3:33',
        durationSec: 213,
        videoId: 'KEI4qS4P-3Y',
        coverUrl: 'https://i.ytimg.com/vi/KEI4qS4P-3Y/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'fg-5',
        title: 'Me Porto Bonito',
        artist: 'Bad Bunny & Chencho Corleone',
        album: 'Un Verano Sin Ti',
        duration: '2:58',
        durationSec: 178,
        videoId: 'p38WgAkuYDo',
        coverUrl: 'https://i.ytimg.com/vi/p38WgAkuYDo/hqdefault.jpg',
        category: 'Trending',
      },
    ],
  },
  {
    id: 'mood-feelingblue',
    type: 'mood',
    typeLabel: 'Mood Station',
    title: 'Feeling Blue',
    description: 'Sad songs that understand exactly how you feel.',
    artist: 'Melancholy Sessions',
    genre: 'Acoustic Solitude',
    year: '2026',
    coverUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    tracksCount: 6,
    totalDurationText: '24 min',
    tracks: [
      {
        id: 'fb-1',
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
        id: 'fb-2',
        title: 'Fade to Black',
        artist: 'Metallica',
        album: 'Ride the Lightning',
        duration: '6:57',
        durationSec: 417,
        videoId: 'WEQnzs8wl6E',
        coverUrl: 'https://i.ytimg.com/vi/WEQnzs8wl6E/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'fb-3',
        title: 'Numb',
        artist: 'LINKIN PARK',
        album: 'Meteora',
        duration: '3:07',
        durationSec: 187,
        videoId: 'kXYiU_JCYtU',
        coverUrl: 'https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'fb-4',
        title: 'Call Out My Name',
        artist: 'The Weeknd',
        album: 'My Dear Melancholy,',
        duration: '3:48',
        durationSec: 228,
        videoId: 'M4ZoCHID9GI',
        coverUrl: 'https://i.ytimg.com/vi/M4ZoCHID9GI/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'fb-5',
        title: 'Lonely Day',
        artist: 'System of a Down',
        album: 'Hypnotize',
        duration: '2:47',
        durationSec: 167,
        videoId: 'DnGdoEa1tPg',
        coverUrl: 'https://i.ytimg.com/vi/DnGdoEa1tPg/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'fb-6',
        title: 'The Reason',
        artist: 'Hoobastank',
        album: 'The Reason',
        duration: '3:53',
        durationSec: 233,
        videoId: 'fV4DiAyExN0',
        coverUrl: 'https://i.ytimg.com/vi/fV4DiAyExN0/hqdefault.jpg',
        category: 'Relax',
      },
    ],
  },
  {
    id: 'mood-heartbreak',
    type: 'mood',
    typeLabel: 'Mood Station',
    title: 'Heartbreak',
    description: 'Get over it, one tear-jerking anthem at a time.',
    artist: 'Anthems Collective',
    genre: 'Emotional Ballads',
    year: '2026',
    coverUrl: 'https://images.unsplash.com/photo-1520523839898-5071270cd69a?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-purple-500 via-indigo-600 to-slate-700',
    tracksCount: 6,
    totalDurationText: '23 min',
    tracks: [
      {
        id: 'hb-1',
        title: 'SLOW DANCING IN THE DARK',
        artist: 'Joji',
        album: 'BALLADS 1',
        duration: '3:29',
        durationSec: 209,
        videoId: 'K3QzzGGn--s',
        coverUrl: 'https://i.ytimg.com/vi/K3QzzGGn--s/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'hb-2',
        title: 'In the End',
        artist: 'LINKIN PARK',
        album: 'Hybrid Theory',
        duration: '3:36',
        durationSec: 216,
        videoId: 'eVTXPUF4Oz4',
        coverUrl: 'https://i.ytimg.com/vi/eVTXPUF4Oz4/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'hb-3',
        title: 'Save Your Tears',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: '3:35',
        durationSec: 215,
        videoId: 'XXYlFuWEuKI',
        coverUrl: 'https://i.ytimg.com/vi/XXYlFuWEuKI/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'hb-4',
        title: 'Nothing Else Matters',
        artist: 'Metallica',
        album: 'Metallica (The Black Album)',
        duration: '6:28',
        durationSec: 388,
        videoId: 'tAGnKpE4NCI',
        coverUrl: 'https://i.ytimg.com/vi/tAGnKpE4NCI/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'hb-5',
        title: 'Crawling',
        artist: 'LINKIN PARK',
        album: 'Hybrid Theory',
        duration: '3:29',
        durationSec: 209,
        videoId: 'Gd9OhYroKA0',
        coverUrl: 'https://i.ytimg.com/vi/Gd9OhYroKA0/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'hb-6',
        title: 'YEAH RIGHT',
        artist: 'Joji',
        album: 'BALLADS 1',
        duration: '2:54',
        durationSec: 174,
        videoId: 'u9er39sW4jQ',
        coverUrl: 'https://i.ytimg.com/vi/u9er39sW4jQ/hqdefault.jpg',
        category: 'Relax',
      },
    ],
  },
  {
    id: 'mood-relax',
    type: 'mood',
    typeLabel: 'Mood Station',
    title: 'Relax',
    description: 'Soothing sounds to help you unwind and breathe easily.',
    artist: 'Chillout Soundscapes',
    genre: 'Ambient & Lo-Fi',
    year: '2026',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-cyan-400 via-blue-500 to-teal-500',
    tracksCount: 4,
    totalDurationText: '18 min',
    tracks: [
      {
        id: 'rx-1',
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
        id: 'rx-2',
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
        id: 'rx-3',
        title: 'Interstellar Deep Space Ambient Journey',
        artist: 'Cosmos Soundscapes',
        album: 'Celestial Flow',
        duration: '6:15',
        durationSec: 375,
        videoId: 'tNkZsRW7h2c',
        coverUrl: 'https://i.ytimg.com/vi/tNkZsRW7h2c/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'rx-4',
        title: 'Peaceful Piano Masterpieces for Deep Work',
        artist: 'Ludovico Ensemble',
        album: 'Reflections in Solitude',
        duration: '4:05',
        durationSec: 245,
        videoId: 'lTRiuFIWV54',
        coverUrl: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg',
        category: 'Focus',
      },
    ],
  },
  {
    id: 'mood-focus',
    type: 'mood',
    typeLabel: 'Mood Station',
    title: 'Focus',
    description: 'Limitless music to help stay in the zone.',
    artist: 'FocusFlow Audio',
    genre: 'Binaural & Cyberpunk Beats',
    year: '2026',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    gradient: 'from-teal-400 via-cyan-500 to-emerald-500',
    tracksCount: 4,
    totalDurationText: '18 min',
    tracks: [
      {
        id: 'fc-1',
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
        id: 'fc-2',
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
        id: 'fc-3',
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
        id: 'fc-4',
        title: 'Peaceful Piano Masterpieces for Deep Work',
        artist: 'Ludovico Ensemble',
        album: 'Reflections in Solitude',
        duration: '4:05',
        durationSec: 245,
        videoId: 'lTRiuFIWV54',
        coverUrl: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg',
        category: 'Focus',
      },
    ],
  },
];

// ==========================================
// 2. ESSENTIALS ALBUMS (Reference Row 2)
// ==========================================
export const ESSENTIALS_ALBUMS: PlaylistCollection[] = [
  {
    id: 'ess-linkinpark',
    type: 'essentials',
    typeLabel: 'Essentials Album',
    title: 'LINKIN PARK Essentials',
    artist: 'LINKIN PARK',
    genre: 'Hard Rock / Alternative',
    year: '2024',
    bannerColor: 'bg-white',
    bannerTextColor: 'text-zinc-900',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    description: 'The defining anthems that reshaped rock and alternative music for an entire generation.',
    tracksCount: 8,
    totalDurationText: '26 min',
    tracks: [
      {
        id: 'lp-1',
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
        id: 'lp-2',
        title: 'In the End',
        artist: 'LINKIN PARK',
        album: 'Hybrid Theory',
        duration: '3:36',
        durationSec: 216,
        videoId: 'eVTXPUF4Oz4',
        coverUrl: 'https://i.ytimg.com/vi/eVTXPUF4Oz4/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'lp-3',
        title: 'Numb',
        artist: 'LINKIN PARK',
        album: 'Meteora',
        duration: '3:07',
        durationSec: 187,
        videoId: 'kXYiU_JCYtU',
        coverUrl: 'https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'lp-4',
        title: 'Faint',
        artist: 'LINKIN PARK',
        album: 'Meteora',
        duration: '2:42',
        durationSec: 162,
        videoId: 'LYU-8IFc138',
        coverUrl: 'https://i.ytimg.com/vi/LYU-8IFc138/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'lp-5',
        title: 'Crawling',
        artist: 'LINKIN PARK',
        album: 'Hybrid Theory',
        duration: '3:29',
        durationSec: 209,
        videoId: 'Gd9OhYroKA0',
        coverUrl: 'https://i.ytimg.com/vi/Gd9OhYroKA0/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'lp-6',
        title: "What I've Done",
        artist: 'LINKIN PARK',
        album: 'Minutes to Midnight',
        duration: '3:25',
        durationSec: 205,
        videoId: '8sgycukafqQ',
        coverUrl: 'https://i.ytimg.com/vi/8sgycukafqQ/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'lp-7',
        title: 'Bleed It Out',
        artist: 'LINKIN PARK',
        album: 'Minutes to Midnight',
        duration: '2:44',
        durationSec: 164,
        videoId: 'OnuuYcqhzCE',
        coverUrl: 'https://i.ytimg.com/vi/OnuuYcqhzCE/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'lp-8',
        title: 'Papercut',
        artist: 'LINKIN PARK',
        album: 'Hybrid Theory',
        duration: '3:05',
        durationSec: 185,
        videoId: 'vjVkXlhpO88',
        coverUrl: 'https://i.ytimg.com/vi/vjVkXlhpO88/hqdefault.jpg',
        category: 'Energize',
      },
    ],
  },
  {
    id: 'ess-theweeknd',
    type: 'essentials',
    typeLabel: 'Essentials Album',
    title: 'The Weeknd Essentials',
    artist: 'The Weeknd',
    genre: 'R&B / Synthpop',
    year: '2024',
    bannerColor: 'bg-amber-500',
    bannerTextColor: 'text-zinc-950',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    description: 'Cinematic late-night noir R&B, chart-topping 80s synth hooks, and haunting vocal melodies.',
    tracksCount: 6,
    totalDurationText: '22 min',
    tracks: [
      {
        id: 'tw-1',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: '3:20',
        durationSec: 200,
        videoId: '4NRXx6U8ABQ',
        coverUrl: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'tw-2',
        title: 'Starboy',
        artist: 'The Weeknd (feat. Daft Punk)',
        album: 'Starboy',
        duration: '3:50',
        durationSec: 230,
        videoId: '34Na4j8AVgA',
        coverUrl: 'https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'tw-3',
        title: 'Save Your Tears',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: '3:35',
        durationSec: 215,
        videoId: 'XXYlFuWEuKI',
        coverUrl: 'https://i.ytimg.com/vi/XXYlFuWEuKI/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'tw-4',
        title: 'The Hills',
        artist: 'The Weeknd',
        album: 'Beauty Behind the Madness',
        duration: '4:02',
        durationSec: 242,
        videoId: 'yzTuBuRdAyA',
        coverUrl: 'https://i.ytimg.com/vi/yzTuBuRdAyA/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'tw-5',
        title: 'Die For You',
        artist: 'The Weeknd',
        album: 'Starboy',
        duration: '3:52',
        durationSec: 232,
        videoId: 'uPD0Q879FK4',
        coverUrl: 'https://i.ytimg.com/vi/uPD0Q879FK4/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'tw-6',
        title: "Can't Feel My Face",
        artist: 'The Weeknd',
        album: 'Beauty Behind the Madness',
        duration: '3:33',
        durationSec: 213,
        videoId: 'KEI4qS4P-3Y',
        coverUrl: 'https://i.ytimg.com/vi/KEI4qS4P-3Y/hqdefault.jpg',
        category: 'Trending',
      },
    ],
  },
  {
    id: 'ess-systemofadown',
    type: 'essentials',
    typeLabel: 'Essentials Album',
    title: 'System of a Down Essentials',
    artist: 'System of a Down',
    genre: 'Metal / Alternative',
    year: '2023',
    bannerColor: 'bg-white',
    bannerTextColor: 'text-zinc-950',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    description: 'Frenetic rhythms, operatic vocals, and razor-sharp political rock that defined early 2000s metal.',
    tracksCount: 5,
    totalDurationText: '18 min',
    tracks: [
      {
        id: 'soad-1',
        title: 'Chop Suey!',
        artist: 'System of a Down',
        album: 'Toxicity',
        duration: '3:30',
        durationSec: 210,
        videoId: 'CSvFpBOe8eY',
        coverUrl: 'https://i.ytimg.com/vi/CSvFpBOe8eY/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'soad-2',
        title: 'Toxicity',
        artist: 'System of a Down',
        album: 'Toxicity',
        duration: '3:39',
        durationSec: 219,
        videoId: 'iywaBOMvYLI',
        coverUrl: 'https://i.ytimg.com/vi/iywaBOMvYLI/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'soad-3',
        title: 'Aerials',
        artist: 'System of a Down',
        album: 'Toxicity',
        duration: '3:55',
        durationSec: 235,
        videoId: 'L-iepu3EtyE',
        coverUrl: 'https://i.ytimg.com/vi/L-iepu3EtyE/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'soad-4',
        title: 'B.Y.O.B.',
        artist: 'System of a Down',
        album: 'Mezmerize',
        duration: '4:15',
        durationSec: 255,
        videoId: 'zUzd9KyIDrU',
        coverUrl: 'https://i.ytimg.com/vi/zUzd9KyIDrU/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'soad-5',
        title: 'Lonely Day',
        artist: 'System of a Down',
        album: 'Hypnotize',
        duration: '2:47',
        durationSec: 167,
        videoId: 'DnGdoEa1tPg',
        coverUrl: 'https://i.ytimg.com/vi/DnGdoEa1tPg/hqdefault.jpg',
        category: 'Relax',
      },
    ],
  },
  {
    id: 'ess-postmalone',
    type: 'essentials',
    typeLabel: 'Essentials Album',
    title: 'Post Malone Essentials',
    artist: 'Post Malone',
    genre: 'Hip-Hop / Pop',
    year: '2024',
    bannerColor: 'bg-zinc-200',
    bannerTextColor: 'text-zinc-950',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    description: 'Effortless melodic hip-hop, guitar-driven anthems, and multi-platinum earworms.',
    tracksCount: 6,
    totalDurationText: '21 min',
    tracks: [
      {
        id: 'pm-1',
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
        id: 'pm-2',
        title: 'Sunflower',
        artist: 'Post Malone & Swae Lee',
        album: 'Spider-Man Soundtrack',
        duration: '2:38',
        durationSec: 158,
        videoId: 'ApXoWvfEYVU',
        coverUrl: 'https://i.ytimg.com/vi/ApXoWvfEYVU/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'pm-3',
        title: 'rockstar (feat. 21 Savage)',
        artist: 'Post Malone',
        album: 'beerbongs & bentleys',
        duration: '3:38',
        durationSec: 218,
        videoId: 'UceaB4D0jpo',
        coverUrl: 'https://i.ytimg.com/vi/UceaB4D0jpo/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'pm-4',
        title: 'Congratulations (feat. Quavo)',
        artist: 'Post Malone',
        album: 'Stoney',
        duration: '3:40',
        durationSec: 220,
        videoId: 'SC4x4qGXx2k',
        coverUrl: 'https://i.ytimg.com/vi/SC4x4qGXx2k/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'pm-5',
        title: 'Better Now',
        artist: 'Post Malone',
        album: 'beerbongs & bentleys',
        duration: '3:51',
        durationSec: 231,
        videoId: 'UYwF-j9V9R4',
        coverUrl: 'https://i.ytimg.com/vi/UYwF-j9V9R4/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'pm-6',
        title: 'White Iverson',
        artist: 'Post Malone',
        album: 'Stoney',
        duration: '3:41',
        durationSec: 221,
        videoId: 'sluzQRb52m0',
        coverUrl: 'https://i.ytimg.com/vi/sluzQRb52m0/hqdefault.jpg',
        category: 'Trending',
      },
    ],
  },
  {
    id: 'ess-badbunny',
    type: 'essentials',
    typeLabel: 'Essentials Album',
    title: 'Bad Bunny Essentials',
    artist: 'Bad Bunny',
    genre: 'Urbano Latino / Reggaeton',
    year: '2024',
    bannerColor: 'bg-rose-600',
    bannerTextColor: 'text-white',
    coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    description: 'The global trailblazer bridging contemporary trap, reggaeton, and Caribbean club textures.',
    tracksCount: 5,
    totalDurationText: '19 min',
    tracks: [
      {
        id: 'bb-1',
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
        id: 'bb-2',
        title: 'Tití Me Preguntó',
        artist: 'Bad Bunny',
        album: 'Un Verano Sin Ti',
        duration: '4:03',
        durationSec: 243,
        videoId: 'Cr8K88UcO08',
        coverUrl: 'https://i.ytimg.com/vi/Cr8K88UcO08/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'bb-3',
        title: 'Me Porto Bonito',
        artist: 'Bad Bunny & Chencho Corleone',
        album: 'Un Verano Sin Ti',
        duration: '2:58',
        durationSec: 178,
        videoId: 'p38WgAkuYDo',
        coverUrl: 'https://i.ytimg.com/vi/p38WgAkuYDo/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'bb-4',
        title: 'Ojitos Lindos',
        artist: 'Bad Bunny (feat. Bomba Estéreo)',
        album: 'Un Verano Sin Ti',
        duration: '4:18',
        durationSec: 258,
        videoId: '10EX-_h4pYc',
        coverUrl: 'https://i.ytimg.com/vi/10EX-_h4pYc/hqdefault.jpg',
        category: 'Trending',
      },
      {
        id: 'bb-5',
        title: 'Dákiti',
        artist: 'Bad Bunny & Jhayco',
        album: 'El Último Tour Del Mundo',
        duration: '3:25',
        durationSec: 205,
        videoId: 'TmKh7lAwnBI',
        coverUrl: 'https://i.ytimg.com/vi/TmKh7lAwnBI/hqdefault.jpg',
        category: 'Trending',
      },
    ],
  },
  {
    id: 'ess-joji',
    type: 'essentials',
    typeLabel: 'Essentials Album',
    title: 'Joji Essentials',
    artist: 'Joji',
    genre: 'Alternative R&B / Lo-Fi',
    year: '2023',
    bannerColor: 'bg-red-500',
    bannerTextColor: 'text-white',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    description: 'Somber electronic ballads, lush melancholy piano chords, and introspective vocal harmonies.',
    tracksCount: 5,
    totalDurationText: '16 min',
    tracks: [
      {
        id: 'jj-1',
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
        id: 'jj-2',
        title: 'SLOW DANCING IN THE DARK',
        artist: 'Joji',
        album: 'BALLADS 1',
        duration: '3:29',
        durationSec: 209,
        videoId: 'K3QzzGGn--s',
        coverUrl: 'https://i.ytimg.com/vi/K3QzzGGn--s/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'jj-3',
        title: 'Sanctuary',
        artist: 'Joji',
        album: 'Nectar',
        duration: '3:00',
        durationSec: 180,
        videoId: 'YLsnEx4j-eQ',
        coverUrl: 'https://i.ytimg.com/vi/YLsnEx4j-eQ/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'jj-4',
        title: 'YEAH RIGHT',
        artist: 'Joji',
        album: 'BALLADS 1',
        duration: '2:54',
        durationSec: 174,
        videoId: 'u9er39sW4jQ',
        coverUrl: 'https://i.ytimg.com/vi/u9er39sW4jQ/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'jj-5',
        title: 'Run',
        artist: 'Joji',
        album: 'Nectar',
        duration: '3:15',
        durationSec: 195,
        videoId: 'K09_5IsgGe8',
        coverUrl: 'https://i.ytimg.com/vi/K09_5IsgGe8/hqdefault.jpg',
        category: 'Energize',
      },
    ],
  },
  {
    id: 'ess-hoobastank',
    type: 'essentials',
    typeLabel: 'Essentials Album',
    title: 'Hoobastank Essentials',
    artist: 'Hoobastank',
    genre: 'Alternative Rock',
    year: '2023',
    bannerColor: 'bg-white',
    bannerTextColor: 'text-zinc-950',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    description: 'Post-grunge hooks and chart-dominating rock ballads from Southern California.',
    tracksCount: 4,
    totalDurationText: '13 min',
    tracks: [
      {
        id: 'hbk-1',
        title: 'The Reason',
        artist: 'Hoobastank',
        album: 'The Reason',
        duration: '3:53',
        durationSec: 233,
        videoId: 'fV4DiAyExN0',
        coverUrl: 'https://i.ytimg.com/vi/fV4DiAyExN0/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'hbk-2',
        title: 'Crawling in the Dark',
        artist: 'Hoobastank',
        album: 'Hoobastank',
        duration: '2:55',
        durationSec: 175,
        videoId: 'bHISTzargu8',
        coverUrl: 'https://i.ytimg.com/vi/bHISTzargu8/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'hbk-3',
        title: 'Out of Control',
        artist: 'Hoobastank',
        album: 'The Reason',
        duration: '2:42',
        durationSec: 162,
        videoId: 'eIqJvO1sO8A',
        coverUrl: 'https://i.ytimg.com/vi/eIqJvO1sO8A/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'hbk-4',
        title: 'Running Away',
        artist: 'Hoobastank',
        album: 'Hoobastank',
        duration: '2:58',
        durationSec: 178,
        videoId: '46mH77gV4lA',
        coverUrl: 'https://i.ytimg.com/vi/46mH77gV4lA/hqdefault.jpg',
        category: 'Energize',
      },
    ],
  },
];

// ==========================================
// 3. WORLD OF METALLICA (Reference Row 3)
// ==========================================
export const WORLD_OF_METALLICA_ALBUMS: PlaylistCollection[] = [
  {
    id: 'met-mop',
    type: 'album',
    typeLabel: 'Studio Album',
    title: 'Master of Puppets (Remastered)',
    artist: 'Metallica',
    genre: 'Thrash Metal',
    year: '1986',
    coverUrl: 'https://i.ytimg.com/vi/xnKhsTXoKmg/hqdefault.jpg',
    description: 'Universally hailed as one of the pinnacle landmarks of heavy music, featuring razor-sharp riffing and epic compositions.',
    tracksCount: 6,
    totalDurationText: '43 min',
    tracks: [
      {
        id: 'mop-1',
        title: 'Battery',
        artist: 'Metallica',
        album: 'Master of Puppets',
        duration: '5:12',
        durationSec: 312,
        videoId: 'm8vd7wR_u8A',
        coverUrl: 'https://i.ytimg.com/vi/xnKhsTXoKmg/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'mop-2',
        title: 'Master of Puppets',
        artist: 'Metallica',
        album: 'Master of Puppets',
        duration: '8:36',
        durationSec: 516,
        videoId: 'xnKhsTXoKmg',
        coverUrl: 'https://i.ytimg.com/vi/xnKhsTXoKmg/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'mop-3',
        title: 'The Thing That Should Not Be',
        artist: 'Metallica',
        album: 'Master of Puppets',
        duration: '6:36',
        durationSec: 396,
        videoId: 'F8xO8x0rJ44',
        coverUrl: 'https://i.ytimg.com/vi/xnKhsTXoKmg/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'mop-4',
        title: 'Welcome Home (Sanitarium)',
        artist: 'Metallica',
        album: 'Master of Puppets',
        duration: '6:27',
        durationSec: 387,
        videoId: 'V6Dfo4zD6-U',
        coverUrl: 'https://i.ytimg.com/vi/xnKhsTXoKmg/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'mop-5',
        title: 'Disposable Heroes',
        artist: 'Metallica',
        album: 'Master of Puppets',
        duration: '8:16',
        durationSec: 496,
        videoId: 'qLmsD3W2tG0',
        coverUrl: 'https://i.ytimg.com/vi/xnKhsTXoKmg/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'mop-6',
        title: 'Orion (Instrumental)',
        artist: 'Metallica',
        album: 'Master of Puppets',
        duration: '8:27',
        durationSec: 507,
        videoId: 'K-p8u8w6n_8',
        coverUrl: 'https://i.ytimg.com/vi/xnKhsTXoKmg/hqdefault.jpg',
        category: 'Focus',
      },
    ],
  },
  {
    id: 'met-black',
    type: 'album',
    typeLabel: 'Studio Album',
    title: 'Metallica (The Black Album)',
    artist: 'Metallica',
    genre: 'Heavy Metal / Hard Rock',
    year: '1991',
    coverUrl: 'https://i.ytimg.com/vi/CD-E-LDc384/hqdefault.jpg',
    description: 'The Diamond-certified commercial behemoth that took metal into stadiums worldwide.',
    tracksCount: 5,
    totalDurationText: '30 min',
    tracks: [
      {
        id: 'blk-1',
        title: 'Enter Sandman',
        artist: 'Metallica',
        album: 'Metallica (The Black Album)',
        duration: '5:31',
        durationSec: 331,
        videoId: 'CD-E-LDc384',
        coverUrl: 'https://i.ytimg.com/vi/CD-E-LDc384/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'blk-2',
        title: 'Sad But True',
        artist: 'Metallica',
        album: 'Metallica (The Black Album)',
        duration: '5:24',
        durationSec: 324,
        videoId: 'A8MO7fkZc5o',
        coverUrl: 'https://i.ytimg.com/vi/CD-E-LDc384/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'blk-3',
        title: 'The Unforgiven',
        artist: 'Metallica',
        album: 'Metallica (The Black Album)',
        duration: '6:27',
        durationSec: 387,
        videoId: 'Ckom3gf57Yw',
        coverUrl: 'https://i.ytimg.com/vi/CD-E-LDc384/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'blk-4',
        title: 'Wherever I May Roam',
        artist: 'Metallica',
        album: 'Metallica (The Black Album)',
        duration: '6:44',
        durationSec: 404,
        videoId: 'cwPg8gJ34Pw',
        coverUrl: 'https://i.ytimg.com/vi/CD-E-LDc384/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'blk-5',
        title: 'Nothing Else Matters',
        artist: 'Metallica',
        album: 'Metallica (The Black Album)',
        duration: '6:28',
        durationSec: 388,
        videoId: 'tAGnKpE4NCI',
        coverUrl: 'https://i.ytimg.com/vi/CD-E-LDc384/hqdefault.jpg',
        category: 'Relax',
      },
    ],
  },
  {
    id: 'met-lightning',
    type: 'album',
    typeLabel: 'Studio Album',
    title: 'Ride the Lightning',
    artist: 'Metallica',
    genre: 'Thrash Metal',
    year: '1984',
    coverUrl: 'https://i.ytimg.com/vi/WEQnzs8wl6E/hqdefault.jpg',
    description: 'A revolutionary explosion of speed and melodic sophistication that shaped American thrash metal.',
    tracksCount: 5,
    totalDurationText: '30 min',
    tracks: [
      {
        id: 'rtl-1',
        title: 'Fight Fire with Fire',
        artist: 'Metallica',
        album: 'Ride the Lightning',
        duration: '4:45',
        durationSec: 285,
        videoId: '17qM644917I',
        coverUrl: 'https://i.ytimg.com/vi/WEQnzs8wl6E/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'rtl-2',
        title: 'Ride the Lightning',
        artist: 'Metallica',
        album: 'Ride the Lightning',
        duration: '6:37',
        durationSec: 397,
        videoId: 'YT_63UntRJE',
        coverUrl: 'https://i.ytimg.com/vi/WEQnzs8wl6E/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'rtl-3',
        title: 'For Whom the Bell Tolls',
        artist: 'Metallica',
        album: 'Ride the Lightning',
        duration: '5:10',
        durationSec: 310,
        videoId: 'B_HSa1dEL4s',
        coverUrl: 'https://i.ytimg.com/vi/WEQnzs8wl6E/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'rtl-4',
        title: 'Fade to Black',
        artist: 'Metallica',
        album: 'Ride the Lightning',
        duration: '6:57',
        durationSec: 417,
        videoId: 'WEQnzs8wl6E',
        coverUrl: 'https://i.ytimg.com/vi/WEQnzs8wl6E/hqdefault.jpg',
        category: 'Relax',
      },
      {
        id: 'rtl-5',
        title: 'Creeping Death',
        artist: 'Metallica',
        album: 'Ride the Lightning',
        duration: '6:36',
        durationSec: 396,
        videoId: 'lXWq3f01e2U',
        coverUrl: 'https://i.ytimg.com/vi/WEQnzs8wl6E/hqdefault.jpg',
        category: 'Energize',
      },
    ],
  },
  {
    id: 'met-72seasons',
    type: 'album',
    typeLabel: 'Studio Album',
    title: '72 Seasons',
    artist: 'Metallica',
    genre: 'Heavy Metal',
    year: '2023',
    coverUrl: 'https://i.ytimg.com/vi/_ElURv_1j0g/hqdefault.jpg',
    description: 'A relentless reflection on life, endurance, and the primal thrill of high-octane rock.',
    tracksCount: 4,
    totalDurationText: '22 min',
    tracks: [
      {
        id: 's72-1',
        title: '72 Seasons',
        artist: 'Metallica',
        album: '72 Seasons',
        duration: '7:39',
        durationSec: 459,
        videoId: '_ElURv_1j0g',
        coverUrl: 'https://i.ytimg.com/vi/_ElURv_1j0g/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 's72-2',
        title: 'Shadows Follow',
        artist: 'Metallica',
        album: '72 Seasons',
        duration: '6:04',
        durationSec: 364,
        videoId: 'j957vA494h4',
        coverUrl: 'https://i.ytimg.com/vi/_ElURv_1j0g/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 's72-3',
        title: 'Screaming Suicide',
        artist: 'Metallica',
        album: '72 Seasons',
        duration: '5:30',
        durationSec: 330,
        videoId: 'ZDyDpeCPb8E',
        coverUrl: 'https://i.ytimg.com/vi/_ElURv_1j0g/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 's72-4',
        title: 'Lux Æterna',
        artist: 'Metallica',
        album: '72 Seasons',
        duration: '3:25',
        durationSec: 205,
        videoId: '_ElURv_1j0g',
        coverUrl: 'https://i.ytimg.com/vi/_ElURv_1j0g/hqdefault.jpg',
        category: 'Energize',
      },
    ],
  },
];

// ==========================================
// 4. CURATED FLOW PLAYLISTS
// ==========================================
export const INITIAL_PLAYLISTS: PlaylistCollection[] = [
  {
    id: 'pl-coding',
    type: 'playlist',
    typeLabel: 'Curated Playlist',
    title: 'Deep Coding & Flow',
    description: 'High-focus electronics, glitch-free instrumentals, and minimal grooves for programmers.',
    artist: 'FocusFlow Studio',
    genre: 'Synth & Binaural',
    year: '2026',
    coverUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    tracksCount: 4,
    totalDurationText: '18 min',
    tracks: [
      {
        id: 'code-1',
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
        id: 'code-2',
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
        id: 'code-3',
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
        id: 'code-4',
        title: 'Peaceful Piano Masterpieces for Deep Work',
        artist: 'Ludovico Ensemble',
        album: 'Reflections in Solitude',
        duration: '4:05',
        durationSec: 245,
        videoId: 'lTRiuFIWV54',
        coverUrl: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg',
        category: 'Focus',
      },
    ],
  },
  {
    id: 'pl-lofi',
    type: 'playlist',
    typeLabel: 'Curated Playlist',
    title: 'Lofi Chillout Beats',
    description: 'Warm vinyl crackle, gentle chords, and soft dusty boom-bap percussion.',
    artist: 'Lofi Girl Records',
    genre: 'Lo-Fi Chill',
    year: '2026',
    coverUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    tracksCount: 3,
    totalDurationText: '11 min',
    tracks: [
      {
        id: 'lofi-1',
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
        id: 'lofi-2',
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
        id: 'lofi-3',
        title: 'Glimpse of Us',
        artist: 'Joji',
        album: 'SMITHEREENS',
        duration: '3:53',
        durationSec: 233,
        videoId: 'NrsA_j6_c6M',
        coverUrl: 'https://i.ytimg.com/vi/NrsA_j6_c6M/hqdefault.jpg',
        category: 'Relax',
      },
    ],
  },
  {
    id: 'pl-rock',
    type: 'playlist',
    typeLabel: 'Curated Playlist',
    title: 'High Voltage Surge',
    description: 'Driving riffs and powerhouse drums to supercharge energy bursts.',
    artist: 'Surge Audio',
    genre: 'Rock / Alternative',
    year: '2026',
    coverUrl: 'https://i.ytimg.com/vi/dxytyRy-yo8/hqdefault.jpg',
    tracksCount: 4,
    totalDurationText: '15 min',
    tracks: [
      {
        id: 'surge-1',
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
        id: 'surge-2',
        title: 'Enter Sandman',
        artist: 'Metallica',
        album: 'Metallica (The Black Album)',
        duration: '5:31',
        durationSec: 331,
        videoId: 'CD-E-LDc384',
        coverUrl: 'https://i.ytimg.com/vi/CD-E-LDc384/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'surge-3',
        title: 'Chop Suey!',
        artist: 'System of a Down',
        album: 'Toxicity',
        duration: '3:30',
        durationSec: 210,
        videoId: 'CSvFpBOe8eY',
        coverUrl: 'https://i.ytimg.com/vi/CSvFpBOe8eY/hqdefault.jpg',
        category: 'Energize',
      },
      {
        id: 'surge-4',
        title: 'Bleed It Out',
        artist: 'LINKIN PARK',
        album: 'Minutes to Midnight',
        duration: '2:44',
        durationSec: 164,
        videoId: 'OnuuYcqhzCE',
        coverUrl: 'https://i.ytimg.com/vi/OnuuYcqhzCE/hqdefault.jpg',
        category: 'Energize',
      },
    ],
  },
];

// All tracks pooled for quick global lookup
export const ALL_CURATED_TRACKS: TrackItem[] = [
  ...ESSENTIALS_ALBUMS.flatMap((a) => a.tracks),
  ...WORLD_OF_METALLICA_ALBUMS.flatMap((a) => a.tracks),
  ...FIND_YOUR_MOOD_COLLECTIONS.flatMap((a) => a.tracks),
].filter((track, index, self) => index === self.findIndex((t) => t.id === track.id));

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
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'moods' | 'essentials' | 'albums' | 'playlists'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Album / Collection for Deep Dive View
  const [selectedCollection, setSelectedCollection] = useState<PlaylistCollection | null>(null);

  // History stack for < and > browser-like navigation
  const [historyStack, setHistoryStack] = useState<(PlaylistCollection | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active Playback Queue
  const [activeQueue, setActiveQueue] = useState<TrackItem[]>(ESSENTIALS_ALBUMS[0].tracks);
  const [queueTitle, setQueueTitle] = useState('LINKIN PARK Essentials');
  const [queueIndex, setQueueIndex] = useState(0);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Transport State
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progressSec, setProgressSec] = useState(24);
  const [totalDurationSec, setTotalDurationSec] = useState(231);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Favorites
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({
    'lp-1': true,
    'mop-2': true,
    'code-1': true,
  });

  // User Connected Playlists from Google OAuth
  const [userPlaylists, setUserPlaylists] = useState<PlaylistCollection[]>(INITIAL_PLAYLISTS);
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);
  const [customLinkInput, setCustomLinkInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // YouTube Audio IFrame Ref
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Stable references for message listener closure to avoid stale state
  const activeQueueRef = useRef<TrackItem[]>(activeQueue);
  activeQueueRef.current = activeQueue;

  const queueIndexRef = useRef<number>(queueIndex);
  queueIndexRef.current = queueIndex;

  const isShuffleRef = useRef<boolean>(isShuffle);
  isShuffleRef.current = isShuffle;

  const isRepeatRef = useRef<boolean>(isRepeat);
  isRepeatRef.current = isRepeat;

  // Navigate to an album/collection with history tracking
  const navigateToCollection = (col: PlaylistCollection | null) => {
    setSelectedCollection(col);
    setHistoryStack((prev) => {
      const nextStack = prev.slice(0, historyIndex + 1);
      nextStack.push(col);
      return nextStack;
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setSelectedCollection(historyStack[newIdx]);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setSelectedCollection(historyStack[newIdx]);
    }
  };

  const handleResetHome = () => {
    setSelectedCollection(null);
    setActiveTab('home');
    setSearchQuery('');
    setHistoryStack([null]);
    setHistoryIndex(0);
  };

  // Safe PostMessage to YouTube IFrame API
  const postToPlayer = (func: string, args: any[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch {}
  };

  // Play a specific track and set active queue
  const playTrackInQueue = (track: TrackItem, queue: TrackItem[], title: string, index: number) => {
    setActiveQueue(queue);
    setQueueTitle(title);
    setQueueIndex(index);
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgressSec(0);
    setTotalDurationSec(track.durationSec || 231);

    postToPlayer('loadVideoById', [track.videoId, 0]);
    postToPlayer('playVideo');
  };

  // Play an entire collection starting from first track
  const playCollection = (collection: PlaylistCollection, startShuffle = false) => {
    if (!collection.tracks || collection.tracks.length === 0) return;

    let queue = [...collection.tracks];
    let startIdx = 0;

    if (startShuffle) {
      // Fisher-Yates shuffle
      for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
      }
    }

    playTrackInQueue(queue[startIdx], queue, collection.title, startIdx);
  };

  // Skip Next Track
  const skipNextTrack = () => {
    const queue = activeQueueRef.current;
    if (!queue || queue.length === 0) return;

    let nextIdx = 0;
    if (isShuffleRef.current) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = (queueIndexRef.current + 1) % queue.length;
    }

    setQueueIndex(nextIdx);
    const track = queue[nextIdx];
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgressSec(0);
      setTotalDurationSec(track.durationSec || 231);
      postToPlayer('loadVideoById', [track.videoId, 0]);
      postToPlayer('playVideo');
    }
  };

  // Skip Previous Track
  const skipPrevTrack = () => {
    const queue = activeQueueRef.current;
    if (!queue || queue.length === 0) return;

    const prevIdx = queueIndexRef.current <= 0 ? queue.length - 1 : queueIndexRef.current - 1;
    setQueueIndex(prevIdx);
    const track = queue[prevIdx];
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgressSec(0);
      setTotalDurationSec(track.durationSec || 231);
      postToPlayer('loadVideoById', [track.videoId, 0]);
      postToPlayer('playVideo');
    }
  };

  // Timeline Scrubber Seeking
  const handleSeekTimeline = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = Math.floor(ratio * (totalDurationSec || 231));
    setProgressSec(targetSec);
    postToPlayer('seekTo', [targetSec, true]);
  };

  // Jump delta seconds (-10s / +10s)
  const handleSeekDelta = (deltaSec: number) => {
    const targetSec = Math.max(0, Math.min(totalDurationSec || 231, progressSec + deltaSec));
    setProgressSec(targetSec);
    postToPlayer('seekTo', [targetSec, true]);
  };

  // Volume Slider
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
      postToPlayer('unMute');
    }
    postToPlayer('setVolume', [newVol]);
  };

  // Toggle Mute
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

  // Play / Pause Toggle
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      postToPlayer('pauseVideo');
    } else {
      setIsPlaying(true);
      postToPlayer('playVideo');
    }
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Listen for real YouTube events (progress, duration, track end auto-skip)
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
            if (data.info.playerState === 0) {
              // Song ended! Auto-advance to next song in the active album/playlist
              if (isRepeatRef.current) {
                postToPlayer('seekTo', [0, true]);
                postToPlayer('playVideo');
              } else {
                skipNextTrack();
              }
            }
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  // Fallback timer when iframe progress is throttled
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

  // Sync Google / YouTube API Playlists
  const syncYouTubeData = async () => {
    setIsLoadingYouTube(true);
    const token = await youtubeService.getGoogleAccessToken();
    if (token) {
      setIsYouTubeConnected(true);
      const res = await youtubeService.syncAll(token);
      if (res.success && res.playlists.length > 0) {
        setUserPlaylists(res.playlists);
      }
    } else {
      const cachedP = youtubeService.getCachedPlaylists();
      if (cachedP.length > 0) setUserPlaylists(cachedP);
    }
    setIsLoadingYouTube(false);
  };

  useEffect(() => {
    if (isOpen) {
      syncYouTubeData();
    }
  }, [isOpen]);

  // Handle custom URL import
  const handleCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkInput.trim()) return;

    const videoMatch = customLinkInput.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const vidId = videoMatch ? videoMatch[1] : 'jfKfPfyJRdk';

    const customTrack: TrackItem = {
      id: `imported-${Date.now()}`,
      title: 'Imported YouTube Stream',
      artist: 'Custom Web Audio',
      album: 'Imported Library',
      duration: 'Live',
      durationSec: 240,
      videoId: vidId,
      coverUrl: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
      category: 'Focus',
    };

    const customCollection: PlaylistCollection = {
      id: `custom-col-${Date.now()}`,
      type: 'playlist',
      typeLabel: 'Imported Stream',
      title: 'Custom YouTube Import',
      description: 'Imported stream from custom YouTube URL',
      artist: 'Custom Audio',
      genre: 'User Stream',
      year: '2026',
      coverUrl: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
      tracksCount: 1,
      totalDurationText: '4 min',
      tracks: [customTrack],
    };

    setUserPlaylists((prev) => [customCollection, ...prev]);
    navigateToCollection(customCollection);
    playTrackInQueue(customTrack, [customTrack], customCollection.title, 0);
    setCustomLinkInput('');
  };

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const embedSrc = `https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1&autoplay=1&origin=${originUrl}`;

  // Filtered collections or tracks when searching
  const filteredEssentials = ESSENTIALS_ALBUMS.filter((col) =>
    col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    col.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMetallica = WORLD_OF_METALLICA_ALBUMS.filter((col) =>
    col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    col.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMoods = FIND_YOUR_MOOD_COLLECTIONS.filter((col) =>
    col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    col.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* 1. PERSISTENT AUDIO ENGINE IFRAME (Zero unmounting, zero race conditions) */}
      <div className="fixed -bottom-96 -right-96 w-36 h-20 opacity-0 pointer-events-none overflow-hidden">
        <iframe
          ref={iframeRef}
          id="yt-player-iframe"
          key="persistent-audio-engine"
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
                  iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'setVolume', args: [volume] }),
                    '*'
                  );
                  if (isMuted) {
                    iframeRef.current.contentWindow.postMessage(
                      JSON.stringify({ event: 'command', func: 'mute', args: [] }),
                      '*'
                    );
                  }
                }
              } catch {}
            }, 400);
          }}
        />
      </div>

      {/* 2. DOCKED MINI CONTROLLER (Floats at bottom when modal is minimized & music playing) */}
      {isPlaying && !isOpen && (
        <aside
          aria-label="Bottom Floating Music Dock"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 text-zinc-900 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-zinc-200/90 px-6 py-2.5 flex items-center gap-6 transition-all animate-in fade-in slide-in-from-bottom-4 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] select-none backdrop-blur-md"
        >
          {/* Track Info */}
          <div onClick={onClose} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-zinc-200 shadow-2xs">
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>
            <div className="max-w-[150px] truncate">
              <div className="text-xs font-semibold text-zinc-900 truncate group-hover:text-rose-600 transition">
                {currentTrack.title}
              </div>
              <div className="text-[10px] text-zinc-500 truncate">{currentTrack.artist}</div>
            </div>
          </div>

          {/* Scrubber */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-400 w-7 text-right">
              {formatSec(progressSec)}
            </span>
            <div
              onClick={handleSeekTimeline}
              className="w-40 bg-zinc-200 h-1.5 rounded-full overflow-hidden relative cursor-pointer group"
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
          <div className="flex items-center gap-1.5">
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
              onClick={skipPrevTrack}
              className="p-1 text-zinc-500 hover:text-zinc-900 transition"
              title="Previous Track"
            >
              <SkipBack className="w-3.5 h-3.5 fill-current" />
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
              onClick={skipNextTrack}
              className="p-1 text-zinc-500 hover:text-zinc-900 transition"
              title="Next Track"
            >
              <SkipForward className="w-3.5 h-3.5 fill-current" />
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
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
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

      {/* 3. FULL MUSIC STUDIO MODAL (Unslop Apple Music Light Standard) */}
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
              {/* Left Controls & History */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-zinc-400">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    disabled={historyIndex <= 0}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    title="Back"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleGoForward}
                    disabled={historyIndex >= historyStack.length - 1}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
                    title="Forward"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Centered Navigation Capsule */}
              <nav className="flex items-center bg-zinc-100/80 p-1 rounded-full border border-zinc-200/60 shadow-2xs">
                <button
                  type="button"
                  onClick={handleResetHome}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    !selectedCollection && activeTab === 'home' && !searchQuery
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Browse</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCollection(null);
                    setActiveTab('moods');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    !selectedCollection && activeTab === 'moods'
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Moods</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCollection(null);
                    setActiveTab('essentials');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    !selectedCollection && activeTab === 'essentials'
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Essentials</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCollection(null);
                    setActiveTab('albums');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    !selectedCollection && activeTab === 'albums'
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  <Disc className="w-3.5 h-3.5" />
                  <span>Albums</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCollection(null);
                    setActiveTab('playlists');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    !selectedCollection && activeTab === 'playlists'
                      ? 'bg-white text-zinc-900 shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  <ListMusic className="w-3.5 h-3.5" />
                  <span>Playlists</span>
                </button>
              </nav>

              {/* Right: Search Box & Close Button */}
              <div className="flex items-center gap-3">
                <div className="relative w-44 sm:w-52">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search music, artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-400 placeholder:text-zinc-400 transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition"
                  title="Close Studio"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto px-8 py-6 space-y-10 pb-36">
              {/* ======================================================== */}
              {/* VIEW A: ALBUM / DEEP-DIVE VIEW ("Go deeper into music") */}
              {/* ======================================================== */}
              {selectedCollection ? (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Top Breadcrumb & Back */}
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <button
                      type="button"
                      onClick={() => setSelectedCollection(null)}
                      className="flex items-center gap-1.5 text-zinc-700 hover:text-zinc-950 font-semibold transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Browse</span>
                    </button>
                    <span>/</span>
                    <span className="text-zinc-400">{selectedCollection.typeLabel || 'Album'}</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-medium truncate max-w-md">
                      {selectedCollection.title}
                    </span>
                  </div>

                  {/* Hero Showcase Card */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-zinc-50 border border-zinc-200/80 shadow-xs relative overflow-hidden">
                    {/* Background subtle tint */}
                    <div
                      className={`absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none ${
                        selectedCollection.gradient || 'bg-zinc-400'
                      }`}
                    />

                    {/* Album Art Cover */}
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-xl border border-zinc-200/90 shrink-0 bg-zinc-100 group">
                      <img
                        src={selectedCollection.coverUrl}
                        alt={selectedCollection.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Essentials Banner Overlay if Essentials */}
                      {selectedCollection.type === 'essentials' && (
                        <div
                          className={`absolute top-0 inset-x-0 h-8 px-3 flex items-center justify-between font-bold text-xs tracking-tight shadow-xs ${
                            selectedCollection.bannerColor || 'bg-white'
                          } ${selectedCollection.bannerTextColor || 'text-zinc-900'}`}
                        >
                          <span>Essentials</span>
                          <Sparkles className="w-3 h-3 opacity-80" />
                        </div>
                      )}
                    </div>

                    {/* Album Details & Metadata */}
                    <div className="space-y-3 flex-1 min-w-0 z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                          {selectedCollection.typeLabel || 'Album'}
                        </span>
                        {selectedCollection.year && (
                          <span className="text-xs text-zinc-400 font-medium">
                            {selectedCollection.year}
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                        {selectedCollection.title}
                      </h1>

                      <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                        <span>{selectedCollection.artist || 'Curated'}</span>
                        <span>•</span>
                        <span>{selectedCollection.genre || 'Rock & Alternative'}</span>
                        <span>•</span>
                        <span>{selectedCollection.tracks.length} Songs, {selectedCollection.totalDurationText || '25 min'}</span>
                      </div>

                      <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
                        {selectedCollection.description}
                      </p>

                      {/* Primary Actions */}
                      <div className="flex items-center gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => playCollection(selectedCollection, false)}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs transition active:scale-95 shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play All</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => playCollection(selectedCollection, true)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 font-semibold text-xs transition active:scale-95"
                          title="Shuffle Album"
                        >
                          <Shuffle className="w-3.5 h-3.5" />
                          <span>Shuffle</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopiedLink(true);
                            setTimeout(() => setCopiedLink(false), 2000);
                          }}
                          className="p-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200 transition"
                          title="Share Link"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Complete Interactive Track Table */}
                  <div className="space-y-1">
                    <div className="grid grid-cols-12 text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-4 py-2 border-b border-zinc-100">
                      <span className="col-span-1">#</span>
                      <span className="col-span-6">Title & Artist</span>
                      <span className="col-span-3">Album</span>
                      <span className="col-span-2 text-right">Time</span>
                    </div>

                    {selectedCollection.tracks.map((track, i) => {
                      const isCurrent = currentTrack.id === track.id;
                      return (
                        <div
                          key={track.id}
                          onClick={() =>
                            playTrackInQueue(
                              track,
                              selectedCollection.tracks,
                              selectedCollection.title,
                              i
                            )
                          }
                          className={`grid grid-cols-12 items-center px-4 py-2.5 rounded-2xl cursor-pointer transition group ${
                            isCurrent
                              ? 'bg-rose-50 text-rose-600 font-medium border border-rose-100'
                              : 'hover:bg-zinc-50 text-zinc-800'
                          }`}
                        >
                          {/* Number / Animated Equalizer / Play Hover */}
                          <div className="col-span-1 flex items-center">
                            {isCurrent && isPlaying ? (
                              <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                                <span className="w-0.5 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
                                <span className="w-0.5 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.15s] h-2/3" />
                                <span className="w-0.5 bg-rose-600 rounded-full animate-bounce h-4/5" />
                              </div>
                            ) : (
                              <>
                                <span className="text-xs text-zinc-400 group-hover:hidden font-mono">
                                  {i + 1}
                                </span>
                                <Play className="w-3.5 h-3.5 text-zinc-900 fill-current hidden group-hover:block" />
                              </>
                            )}
                          </div>

                          {/* Title & Artist */}
                          <div className="col-span-6 flex items-center gap-3 min-w-0 pr-4">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-zinc-200"
                            />
                            <div className="min-w-0">
                              <div className={`text-xs font-semibold truncate ${isCurrent ? 'text-rose-600' : 'text-zinc-900'}`}>
                                {track.title}
                              </div>
                              <div className="text-[11px] text-zinc-400 truncate">
                                {track.artist}
                              </div>
                            </div>
                          </div>

                          {/* Album */}
                          <div className="col-span-3 text-xs text-zinc-400 truncate">
                            {track.album || selectedCollection.title}
                          </div>

                          {/* Time & Like */}
                          <div className="col-span-2 flex items-center justify-end gap-3 text-xs font-mono text-zinc-400">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(track.id);
                              }}
                              className={`p-1 transition opacity-0 group-hover:opacity-100 ${
                                likedMap[track.id] ? 'opacity-100 text-rose-500' : 'text-zinc-400 hover:text-zinc-700'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${likedMap[track.id] ? 'fill-current' : ''}`} />
                            </button>
                            <span>{track.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ======================================================== */
                /* VIEW B: MAIN BROWSE VIEW (Exact Reference Structure)     */
                /* ======================================================== */
                <>
                  {/* ROW 1: FIND YOUR MOOD */}
                  {(activeTab === 'home' || activeTab === 'moods') && (
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">
                            Find Your Mood
                          </h2>
                          <p className="text-xs text-zinc-500">
                            Explore full listening stations engineered for distinct mindsets
                          </p>
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">
                          {filteredMoods.length} Stations
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
                        {filteredMoods.map((mood) => (
                          <div
                            key={mood.id}
                            onClick={() => navigateToCollection(mood)}
                            className="p-3 rounded-2xl border border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/70 transition cursor-pointer flex flex-col group select-none bg-white shadow-2xs"
                          >
                            {/* Graphic Card with Gradient */}
                            <div
                              className={`relative aspect-square rounded-xl overflow-hidden mb-2.5 bg-gradient-to-br ${mood.gradient} flex items-center justify-center shadow-xs p-3`}
                            >
                              {mood.id === 'mood-energy' && <Zap className="w-10 h-10 text-white" />}
                              {mood.id === 'mood-love' && <Heart className="w-10 h-10 text-white fill-white/80" />}
                              {mood.id === 'mood-feelgood' && <Smile className="w-10 h-10 text-white" />}
                              {mood.id === 'mood-feelingblue' && <Droplets className="w-10 h-10 text-white" />}
                              {mood.id === 'mood-heartbreak' && <HeartCrack className="w-10 h-10 text-white" />}
                              {mood.id === 'mood-relax' && <Wind className="w-10 h-10 text-white" />}
                              {mood.id === 'mood-focus' && <Target className="w-10 h-10 text-white" />}

                              {/* Play Hover Pill */}
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <div className="w-9 h-9 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md">
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                </div>
                              </div>
                            </div>

                            <h3 className="text-xs font-bold text-zinc-950 truncate">
                              {mood.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5 leading-snug">
                              {mood.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ROW 2: ESSENTIALS (With Apple Music Style Top Banner) */}
                  {(activeTab === 'home' || activeTab === 'essentials') && (
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">
                            Essentials
                          </h2>
                          <p className="text-xs text-zinc-500">
                            Curated career-spanning collections from the world's greatest artists
                          </p>
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">
                          {filteredEssentials.length} Collections
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
                        {filteredEssentials.map((ess) => (
                          <div
                            key={ess.id}
                            onClick={() => navigateToCollection(ess)}
                            className="p-2.5 rounded-2xl border border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/70 transition cursor-pointer flex flex-col group select-none bg-white shadow-2xs"
                          >
                            {/* Card with Essentials Top Banner */}
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 border border-zinc-200 bg-zinc-100 flex flex-col shadow-xs">
                              {/* Top Banner */}
                              <div
                                className={`h-7 px-2.5 flex items-center justify-between font-bold text-[11px] tracking-tight shrink-0 ${
                                  ess.bannerColor || 'bg-white'
                                } ${ess.bannerTextColor || 'text-zinc-950'}`}
                              >
                                <span>Essentials</span>
                                <Sparkles className="w-2.5 h-2.5 opacity-70" />
                              </div>

                              {/* Photo Artwork */}
                              <div className="flex-1 relative overflow-hidden bg-zinc-900">
                                <img
                                  src={ess.coverUrl}
                                  alt={ess.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <div className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md">
                                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <h3 className="text-xs font-bold text-zinc-950 truncate">
                              {ess.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                              {ess.genre || 'Rock & Alternative'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ROW 3: WORLD OF METALLICA (Studio Albums Carousel) */}
                  {(activeTab === 'home' || activeTab === 'albums') && (
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">
                            World of Metallica
                          </h2>
                          <p className="text-xs text-zinc-500">
                            Explore the heavy metal legends' iconic studio catalog with high-fidelity audio
                          </p>
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">
                          {filteredMetallica.length} Studio Albums
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredMetallica.map((alb) => (
                          <div
                            key={alb.id}
                            onClick={() => navigateToCollection(alb)}
                            className="p-3 rounded-2xl border border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/70 transition cursor-pointer flex flex-col group select-none bg-white shadow-2xs"
                          >
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 border border-zinc-200 bg-zinc-900 shadow-xs">
                              <img
                                src={alb.coverUrl}
                                alt={alb.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <div className="w-9 h-9 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md">
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                </div>
                              </div>
                            </div>

                            <h3 className="text-xs font-bold text-zinc-950 truncate">
                              {alb.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 mt-0.5">
                              {alb.artist} • {alb.year}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ROW 4: CONNECTED PLAYLISTS & IMPORT */}
                  {(activeTab === 'home' || activeTab === 'playlists') && (
                    <section className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-zinc-950 tracking-tight">
                            Connected Playlists & Cloud Sync
                          </h2>
                          <p className="text-xs text-zinc-500">
                            {isYouTubeConnected
                              ? 'Synced live from your connected Google account'
                              : 'Connect Google or paste any YouTube music URL to import playlists'}
                          </p>
                        </div>

                        {/* URL Importer & Sync Button */}
                        <div className="flex items-center gap-2">
                          <form onSubmit={handleCustomLink} className="flex items-center gap-1.5">
                            <input
                              type="url"
                              placeholder="Paste YouTube music link..."
                              value={customLinkInput}
                              onChange={(e) => setCustomLinkInput(e.target.value)}
                              className="px-3 py-1.5 text-xs border border-zinc-200 rounded-full bg-zinc-50 w-48 sm:w-56 focus:outline-none focus:ring-1 focus:ring-zinc-400 placeholder:text-zinc-400"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-xs font-semibold transition shadow-2xs"
                            >
                              Import
                            </button>
                          </form>

                          {!isYouTubeConnected && (
                            <button
                              type="button"
                              onClick={() => youtubeService.connectYouTube()}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingYouTube ? 'animate-spin' : ''}`} />
                              <span>Connect Google</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {userPlaylists.map((pl) => (
                          <div
                            key={pl.id}
                            onClick={() => navigateToCollection(pl)}
                            className="p-3 rounded-2xl border border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/70 transition cursor-pointer flex flex-col group select-none bg-white shadow-2xs"
                          >
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 mb-2.5 bg-zinc-100">
                              <img
                                src={pl.coverUrl}
                                alt={pl.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <div className="w-9 h-9 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md">
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <h3 className="text-xs font-bold text-zinc-950 truncate">
                              {pl.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 mt-0.5">
                              {pl.tracksCount || pl.tracks.length} tracks • {pl.artist || 'Curated'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </main>

            {/* ======================================================== */}
            {/* 4. UP NEXT QUEUE DRAWER (Slide-over panel)               */}
            {/* ======================================================== */}
            {isQueueOpen && (
              <aside
                className="absolute top-16 right-0 bottom-24 w-80 bg-white/95 border-l border-zinc-200 shadow-xl backdrop-blur-md p-5 flex flex-col z-20 animate-in slide-in-from-right duration-200"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                      Up Next
                    </h3>
                    <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                      {queueTitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQueueOpen(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 py-3">
                  {activeQueue.map((t, idx) => {
                    const isNowPlaying = currentTrack.id === t.id;
                    return (
                      <div
                        key={`${t.id}-${idx}`}
                        onClick={() => playTrackInQueue(t, activeQueue, queueTitle, idx)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition ${
                          isNowPlaying
                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : 'hover:bg-zinc-50 text-zinc-800'
                        }`}
                      >
                        <span className="text-[10px] font-mono text-zinc-400 w-4 text-center">
                          {idx + 1}
                        </span>
                        <img
                          src={t.coverUrl}
                          alt={t.title}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-zinc-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold truncate">{t.title}</div>
                          <div className="text-[10px] text-zinc-400 truncate">{t.artist}</div>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">{t.duration}</span>
                      </div>
                    );
                  })}
                </div>
              </aside>
            )}

            {/* ======================================================== */}
            {/* 5. INTERACTIVE FLOATING APPLE MUSIC CONTROLLER BAR        */}
            {/* ======================================================== */}
            <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] bg-white/95 text-zinc-950 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.14)] border border-zinc-200/95 px-6 py-3 flex items-center justify-between select-none backdrop-blur-md z-30">
              {/* Left Track Info */}
              <div className="flex items-center gap-3 w-64 min-w-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-zinc-200 shrink-0 bg-zinc-100 shadow-2xs">
                  <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold tracking-tight text-zinc-950 truncate">
                    {currentTrack.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {currentTrack.artist}
                  </div>
                </div>
              </div>

              {/* Center Transport & Scrubber */}
              <div className="flex flex-col items-center gap-1.5 flex-1 max-w-lg px-4">
                <div className="flex items-center gap-4 text-zinc-700">
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
                    onClick={() => handleSeekDelta(-10)}
                    className="p-1 text-zinc-600 hover:text-zinc-950 transition active:scale-95"
                    title="Jump back 10 seconds"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={skipPrevTrack}
                    className="text-zinc-700 hover:text-zinc-950 transition active:scale-95"
                    title="Previous Track"
                  >
                    <SkipBack className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="w-8 h-8 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white flex items-center justify-center transition shadow-2xs active:scale-95"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={skipNextTrack}
                    className="text-zinc-700 hover:text-zinc-950 transition active:scale-95"
                    title="Next Track"
                  >
                    <SkipForward className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSeekDelta(10)}
                    className="p-1 text-zinc-600 hover:text-zinc-950 transition active:scale-95"
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

                {/* Timeline Progress Bar */}
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
                      className="bg-zinc-950 h-full rounded-full group-hover:bg-rose-600 transition-all duration-100"
                      style={{ width: `${Math.min(100, (progressSec / (totalDurationSec || 231)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 w-8">
                    {formatSec(totalDurationSec)}
                  </span>
                </div>
              </div>

              {/* Right Side Controls: Like, Volume, Queue Flyout */}
              <div className="flex items-center gap-3.5 w-64 justify-end">
                <button
                  type="button"
                  onClick={() => toggleLike(currentTrack.id)}
                  className={`p-1.5 transition ${likedMap[currentTrack.id] ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-700'}`}
                  title="Favorite"
                >
                  <Heart className={`w-4 h-4 ${likedMap[currentTrack.id] ? 'fill-current' : ''}`} />
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="text-zinc-500 hover:text-zinc-950 transition"
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
                    className="w-20 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-950"
                    title={`Volume: ${isMuted ? '0' : volume}%`}
                  />
                </div>

                {/* Queue Flyout Toggle */}
                <button
                  type="button"
                  onClick={() => setIsQueueOpen(!isQueueOpen)}
                  className={`p-1.5 transition ${isQueueOpen ? 'text-rose-600 bg-rose-50 rounded-lg' : 'text-zinc-400 hover:text-zinc-700'}`}
                  title="View Upcoming Queue"
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
