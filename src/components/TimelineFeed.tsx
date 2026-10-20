import React, { useState } from 'react';
import { ArrowRight, FileText, Calendar, Edit3, X } from 'lucide-react';
import { FocusSession } from '../types';

interface TimelineFeedProps {
  sessions: FocusSession[];
  onOpenCalendarModal: () => void;
  onQuickNoteClick: () => void;
}

export const TimelineFeed: React.FC<TimelineFeedProps> = ({
  sessions,
  onOpenCalendarModal,
  onQuickNoteClick,
}) => {
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  return (
    <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 pt-2">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs">
            No completed sessions recorded yet. Start the focus timer to log your first session!
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50/80 transition group"
            >
              {/* Arrow Indicator */}
              <div className="pt-1 text-zinc-300 group-hover:text-zinc-500 transition">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>

              {/* Vertical Color Stripe */}
              <div
                className="w-1 self-stretch rounded-full shrink-0"
                style={{ backgroundColor: session.categoryColor || '#ef4444' }}
              />

              {/* Session Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                      {session.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {session.timeAgo}
                    </p>
                  </div>

                  {/* Category Pill & Duration */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-200 bg-white text-[10px] font-semibold text-zinc-700 shadow-2xs">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: session.categoryColor || '#ef4444' }}
                      />
                      {session.category}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-500 mt-1">
                      {session.durationMinutes >= 60
                        ? `${Math.floor(session.durationMinutes / 60)}h ${
                            session.durationMinutes % 60 > 0
                              ? `${session.durationMinutes % 60}min`
                              : ''
                          }`
                        : `${session.durationMinutes}min`}
                    </span>
                  </div>
                </div>

                {/* Notes Text */}
                {session.notes && (
                  <p className="text-xs text-zinc-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {session.notes}
                  </p>
                )}

                {/* Attached Screenshot Previews */}
                {session.screenshots && session.screenshots.length > 0 && (
                  <div className="flex items-center gap-2 mt-2.5">
                    {session.screenshots.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedPreviewImage(imgUrl)}
                        className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 hover:opacity-90 transition shadow-2xs group/img"
                      >
                        <img
                          src={imgUrl}
                          alt="Proof"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition" />
                      </button>
                    ))}
                    <span className="text-[10px] text-zinc-400 ml-1">
                      {session.screenshots.length} media proof
                    </span>
                  </div>
                )}

                {/* Bottom session meta icon */}
                <div className="flex items-center justify-end mt-1 text-zinc-300">
                  <FileText className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Bottom Pill [ ✏️  📅 ] from reference screenshot */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 text-white rounded-full shadow-lg hover:shadow-xl transition">
          <button
            onClick={onQuickNoteClick}
            className="p-1 hover:text-rose-400 transition"
            title="Quick Note"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <div className="w-px h-3.5 bg-zinc-700" />
          <button
            onClick={onOpenCalendarModal}
            className="p-1 hover:text-rose-400 transition flex items-center gap-1.5 text-xs font-medium"
            title="Calendar & Focus Schedule"
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal for Full Screenshot Preview */}
      {selectedPreviewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-1.5 rounded-full transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPreviewImage}
              alt="Screenshot Preview"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
