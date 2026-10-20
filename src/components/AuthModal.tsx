import React, { useState } from 'react';
import { User, LogOut, Mail, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SupabaseUser | null;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setMessage({ type: 'error', text: msg });
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !email) return;
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setMessage({
        type: 'success',
        text: 'Magic login link sent to your email! Check your inbox.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send login link.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative"
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
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              {currentUser ? 'Your Profile' : 'Sign in to FocusFlow'}
            </h2>
            <p className="text-xs text-zinc-500">
              {currentUser
                ? 'Your sessions & media are synced to the cloud'
                : 'Save focus history & sync across all devices'}
            </p>
          </div>
        </div>

        {currentUser ? (
          /* User Logged In State */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-base">
                {currentUser.email?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-zinc-900 truncate">
                  {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                </div>
                <div className="text-xs text-zinc-500 truncate">{currentUser.email}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Row Level Security active: Your timeline & notes are private to you.</span>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Sign In Form */
          <div className="space-y-4">
            {!isSupabaseConfigured && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Running in Local Mode</span>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Your focus logs and screenshots are saved safely in your browser storage. Connect Supabase to enable cloud login for you and your friends!
                  </p>
                </div>
              </div>
            )}

            {message && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={!isSupabaseConfigured || loading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-2xs transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200" />
              </div>
              <span className="relative bg-white px-2 text-[10px] font-medium text-zinc-400 uppercase">
                or email link
              </span>
            </div>

            {/* Email Magic Link form */}
            <form onSubmit={handleMagicLink} className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!isSupabaseConfigured || loading}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={!isSupabaseConfigured || loading}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {loading ? 'Sending link...' : 'Send Magic Login Link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
