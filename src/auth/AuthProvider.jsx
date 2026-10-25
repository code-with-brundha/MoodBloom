import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Logo from '../components/Logo.jsx';
import SoftBackground from '../components/SoftBackground.jsx';
import { supabase } from '../lib/supabaseClient.js';
import { friendlyAuthError, readAuthCallback } from './authErrors.js';

export const AuthContext = createContext(null);

// Read the confirmation-link result right now, before supabase-js tidies the address bar.
const initialCallback = typeof window !== 'undefined' ? readAuthCallback() : null;

/** Where the confirmation email sends people back to. Must be listed under Redirect URLs in Supabase. */
const confirmationRedirect = () => `${window.location.origin}/signin`;

/** Shown while the saved session is being checked, so protected pages never flash before a redirect. */
export function AuthLoadingScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <SoftBackground />
      <div role="status" aria-live="polite" className="flex flex-col items-center text-center">
        <Logo />
        <p className="mt-4 text-ink-600">Opening your little world…</p>
      </div>
    </div>
  );
}

/**
 * Keeps the Supabase session in React state.
 * - Supabase itself stores the session (one `sb-…-auth-token` key in localStorage) and refreshes it.
 * - onAuthStateChange is the single source of truth: it also fires when another tab signs in or out.
 * - Nothing here reads, changes or removes any `moodbloom.*` data.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [manualSignOut, setManualSignOut] = useState(false);
  const [callbackNotice, setCallbackNotice] = useState(initialCallback?.kind === 'error' ? initialCallback : null);
  const settled = useRef(false);

  useEffect(() => {
    let active = true;

    // Do NOT call other supabase methods inside this callback (it can deadlock); just store the session.
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      settled.current = true;
      setSession(nextSession ?? null);
      setLoading(false);
    });

    // Safety net: if the first event never arrives, still finish loading from the saved session.
    supabase.auth.getSession().then(({ data: current }) => {
      if (!active || settled.current) return;
      settled.current = true;
      setSession(current.session ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: confirmationRedirect() },
    });
    if (error) return { ok: false, error: friendlyAuthError(error), code: error.code };
    if (data.session) {
      // Email confirmation is switched off in Supabase: the person is signed in straight away.
      setManualSignOut(false);
      setSession(data.session);
      return { ok: true, needsConfirmation: false };
    }
    // Confirmation required. (For an already-registered email Supabase answers the same way on purpose,
    // so we never reveal whether an account exists.)
    return { ok: true, needsConfirmation: true };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: friendlyAuthError(error), code: error.code };
    setManualSignOut(false);
    setSession(data.session);
    return { ok: true };
  }, []);

  const resendConfirmation = useCallback(async (email) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: confirmationRedirect() },
    });
    return error ? { ok: false, error: friendlyAuthError(error) } : { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    // 'local' = this browser only. It removes just the Supabase session key, never other browser storage.
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) return { ok: false, error: friendlyAuthError(error) };
    setManualSignOut(true);
    setSession(null);
    return { ok: true };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      manualSignOut,
      callbackNotice,
      dismissCallbackNotice: () => setCallbackNotice(null),
      signUp,
      signIn,
      signOut,
      resendConfirmation,
    }),
    [session, loading, manualSignOut, callbackNotice, signUp, signIn, signOut, resendConfirmation],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
