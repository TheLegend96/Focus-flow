import React, { useState, useEffect } from 'react';
import { X, Paperclip } from 'lucide-react';

interface NotesPanelProps {
  currentNote: string;
  onNoteChange: (note: string) => void;
  screenshots: string[];
  onAddScreenshot: (dataUrl: string) => void;
  onRemoveScreenshot: (index: number) => void;
  filterBreak: boolean;
  setFilterBreak: (val: boolean) => void;
  filterCurrentCategory: boolean;
  setFilterCurrentCategory: (val: boolean) => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  currentNote,
  onNoteChange,
  screenshots,
  onAddScreenshot,
  onRemoveScreenshot,
  filterBreak,
  setFilterBreak,
  filterCurrentCategory,
  setFilterCurrentCategory,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Client-side image compression: converts pasted image into crisp WebP/JPEG under 200KB
  const processAndCompressImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Compress to lightweight WebP or JPEG
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.82);
          onAddScreenshot(compressedDataUrl);
        }
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  // Listen for global Cmd+V / Ctrl+V clipboard paste anywhere in notes
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processAndCompressImage(file);
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          processAndCompressImage(file);
        }
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Notes</h2>
        <span className="text-xs text-zinc-400 font-medium">
          Auto-saves in real-time
        </span>
      </div>

      {/* Main Note Box with Screenshot Support */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            Array.from(e.dataTransfer.files).forEach((file) => {
              if (file.type.startsWith('image/')) {
                processAndCompressImage(file);
              }
            });
          }
        }}
        className={`relative border rounded-2xl p-4 transition-all bg-white ${
          isDragging
            ? 'border-rose-500 bg-rose-50/30'
            : 'border-zinc-200 focus-within:border-zinc-400 shadow-sm'
        }`}
      >
        <textarea
          value={currentNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Write down your thoughts, your learning, or what you are confused about. Clarify your thoughts. Writing is thinking."
          className="w-full h-28 text-sm text-zinc-800 placeholder-zinc-400 resize-none focus:outline-none leading-relaxed bg-transparent"
        />

        {/* Attached Screenshot Thumbnails */}
        {screenshots.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 mt-2">
            {screenshots.map((src, index) => (
              <div
                key={index}
                className="relative group w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 shadow-sm"
              >
                <img
                  src={src}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveScreenshot(index)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                  title="Remove screenshot"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Attachment Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-50 mt-1">
          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 cursor-pointer transition">
            <Paperclip className="w-3.5 h-3.5" />
            <span>Attach or paste screenshot (⌘V)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </label>

          <span className="text-[11px] text-zinc-400">
            {screenshots.length > 0 ? `${screenshots.length} media attached` : 'Drop images here'}
          </span>
        </div>
      </div>

      {/* Filter and Switch Row matching screenshot */}
      <div className="flex items-center justify-between mt-4 pb-2 border-b border-zinc-100">
        <span className="text-xs font-semibold text-zinc-600">Recent Notes</span>

        <div className="flex items-center gap-4">
          {/* Break filter */}
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-zinc-500 hover:text-zinc-700">
            <input
              type="checkbox"
              checked={filterBreak}
              onChange={(e) => setFilterBreak(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-zinc-300 text-rose-500 focus:ring-rose-400"
            />
            <span>Break</span>
          </label>

          {/* Current Category Only filter */}
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-zinc-500 hover:text-zinc-700">
            <input
              type="checkbox"
              checked={filterCurrentCategory}
              onChange={(e) => setFilterCurrentCategory(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-zinc-300 text-rose-500 focus:ring-rose-400"
            />
            <span>Current category only</span>
          </label>
        </div>
      </div>
    </div>
  );
};
