import React, { useState } from 'react';
import { Calendar, Bell, Check, Clock, X, ShieldCheck } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFocusFromEvent: (event: CalendarEvent) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  onStartFocusFromEvent,
}) => {
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [icalUrl, setIcalUrl] = useState('');

  // Sample upcoming focus blocks detected from calendar
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Deep Work: System Architecture',
      startTime: '10:30 AM (In 20 mins)',
      durationMinutes: 45,
      isFocusBlock: true,
    },
    {
      id: '2',
      title: 'Sprint Ideation & Wireframing',
      startTime: '2:00 PM',
      durationMinutes: 60,
      isFocusBlock: true,
    },
    {
      id: '3',
      title: 'Weekly Team Sync (Non-focus)',
      startTime: '4:30 PM',
      durationMinutes: 30,
      isFocusBlock: false,
    },
  ];

  if (!isOpen) return null;

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification('FocusFlow Notifications Enabled', {
          body: 'We will alert you 5 minutes before your scheduled focus hours!',
          icon: '⏱️',
        });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              Calendar & Focus Alerts
            </h2>
            <p className="text-xs text-zinc-500">
              Sync scheduled focus blocks & receive timely alerts
            </p>
          </div>
        </div>

        {/* Connection Options */}
        <div className="space-y-4">
          {!calendarConnected ? (
            <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-800">
                  Connect Your Calendar
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Private & Secure
                </span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Connect Google Calendar or paste your private iCal link. Your focus blocks will automatically synchronize and trigger timer alerts.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCalendarConnected(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Connect with Google Calendar</span>
                </button>

                <div className="relative my-2 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200" />
                  </div>
                  <span className="relative bg-zinc-50 px-2 text-[10px] font-medium text-zinc-400 uppercase">
                    or instant iCal link
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste secret .ics iCal feed link..."
                    value={icalUrl}
                    onChange={(e) => setIcalUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                  <button
                    onClick={() => setCalendarConnected(true)}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Sync
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-800">
                    Google Calendar Connected
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Syncing every 15 minutes
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCalendarConnected(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 font-medium"
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Desktop Notification Alert Toggle */}
          <div className="flex items-center justify-between p-3.5 border border-zinc-200 rounded-2xl bg-white">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-zinc-600" />
              <div>
                <div className="text-xs font-semibold text-zinc-800">
                  Focus Block Browser Alerts
                </div>
                <div className="text-[11px] text-zinc-500">
                  Alert me 5 minutes before scheduled focus hours
                </div>
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                notificationsEnabled
                  ? 'bg-zinc-100 text-zinc-600'
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              {notificationsEnabled ? 'Enabled' : 'Allow Alerts'}
            </button>
          </div>

          {/* Upcoming Schedule / Detected Focus Blocks */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-zinc-700 mb-2.5">
              Detected Focus Blocks Today
            </h4>
            <div className="space-y-2">
              {sampleEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/40 transition"
                >
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-zinc-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-800">
                        {evt.title}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {evt.startTime} • {evt.durationMinutes} mins
                      </div>
                    </div>
                  </div>

                  {evt.isFocusBlock && (
                    <button
                      onClick={() => {
                        onStartFocusFromEvent(evt);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-white border border-rose-200 hover:border-rose-400 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] font-semibold transition shadow-2xs"
                    >
                      Load into Timer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
