import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sidebar } from './components/Sidebar';
import { FocusDial } from './components/FocusDial';
import { NotesPanel } from './components/NotesPanel';
import { TimelineFeed } from './components/TimelineFeed';
import { CalendarModal } from './components/CalendarModal';
import { AuthModal } from './components/AuthModal';
import { Category, FocusSession, CalendarEvent } from './types';
import { sessionService } from './services/sessionService';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Product understanding', color: '#e11d48' },
  { id: '2', name: 'Zenuidesign', color: '#ef4444' },
  { id: '3', name: 'Post Ideation', color: '#3b82f6' },
  { id: '4', name: 'Deep Coding', color: '#10b981' },
  { id: '5', name: 'General', color: '#8b5cf6' },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'analytics' | 'profile' | 'favorites' | 'settings'>('timer');
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<Category>(INITIAL_CATEGORIES[0]);
  const [sessionTitle, setSessionTitle] = useState('initial Ideation');
  
  // Active Notes & Attached Screenshots
  const [currentNote, setCurrentNote] = useState('');
  const [currentScreenshots, setCurrentScreenshots] = useState<string[]>([]);
  
  // Filters
  const [filterBreak, setFilterBreak] = useState(false);
  const [filterCurrentCategory, setFilterCurrentCategory] = useState(false);
  
  // Timeline Sessions List
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  
  // Modals State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  // Initialize Auth & Load Sessions
  useEffect(() => {
    if (supabase && isSupabaseConfigured) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setCurrentUser(user);
        sessionService.loadSessions(user?.id || null).then(setSessions);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user || null;
        setCurrentUser(user);
        sessionService.loadSessions(user?.id || null).then(setSessions);
      });

      return () => subscription.unsubscribe();
    } else {
      // In local mode, load from localStorage
      sessionService.loadSessions(null).then(setSessions);
    }
  }, []);

  // When clicking profile or settings in sidebar
  useEffect(() => {
    if (activeTab === 'profile') {
      setIsAuthOpen(true);
      setActiveTab('timer');
    }
  }, [activeTab]);

  // Trigger celebration and persist session upon timer completion
  const handleCompleteSession = async (durationMinutes: number, title: string, category: Category) => {
    // Confetti burst
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af'],
    });

    const saved = await sessionService.saveSession(currentUser?.id || null, {
      title: title || 'Completed Focus Session',
      category: category.name,
      categoryColor: category.color,
      durationMinutes,
      notes: currentNote || 'Focused work completed.',
      screenshots: [...currentScreenshots],
      isBreak: false,
    });

    setSessions((prev) => [saved, ...prev]);
    // Clear active scratchpad for next session
    setCurrentNote('');
    setCurrentScreenshots([]);
  };

  const handleAddScreenshot = (dataUrl: string) => {
    setCurrentScreenshots((prev) => [...prev, dataUrl]);
  };

  const handleRemoveScreenshot = (index: number) => {
    setCurrentScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartFromCalendar = (evt: CalendarEvent) => {
    setSessionTitle(evt.title);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setCurrentUser(null);
      const local = await sessionService.loadSessions(null);
      setSessions(local);
    }
  };

  // Filter sessions based on toggles
  const filteredSessions = sessions.filter((s) => {
    if (filterBreak && !s.isBreak) return false;
    if (filterCurrentCategory && s.category !== selectedCategory.name) return false;
    return true;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-zinc-900 font-sans">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCalendar={() => setIsCalendarOpen(true)}
      />

      {/* 2. Main Studio Dual Pane */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Focus Dial & Controls */}
        <section className="w-1/2 flex flex-col border-r border-zinc-100 h-full relative">
          <FocusDial
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sessionTitle={sessionTitle}
            onUpdateTitle={setSessionTitle}
            onCompleteSession={handleCompleteSession}
          />
        </section>

        {/* Right Panel: Notes + Scrollable Timeline */}
        <section className="w-1/2 flex flex-col h-full py-6 px-8 relative bg-white">
          {/* Notes Input Area (Top) */}
          <div className="mb-4">
            <NotesPanel
              currentNote={currentNote}
              onNoteChange={setCurrentNote}
              screenshots={currentScreenshots}
              onAddScreenshot={handleAddScreenshot}
              onRemoveScreenshot={handleRemoveScreenshot}
              filterBreak={filterBreak}
              setFilterBreak={setFilterBreak}
              filterCurrentCategory={filterCurrentCategory}
              setFilterCurrentCategory={setFilterCurrentCategory}
            />
          </div>

          {/* Scrollable Timeline (Bottom) */}
          <TimelineFeed
            sessions={filteredSessions}
            onOpenCalendarModal={() => setIsCalendarOpen(true)}
            onQuickNoteClick={() => {
              const el = document.querySelector('textarea');
              if (el) el.focus();
            }}
          />
        </section>
      </main>

      {/* Calendar & Focus Alerts Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onStartFocusFromEvent={handleStartFromCalendar}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    </div>
  );
};
