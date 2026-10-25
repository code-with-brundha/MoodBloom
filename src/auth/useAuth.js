import { useContext } from 'react';
import { AuthContext } from './AuthProvider.jsx';

/**
 * Current sign-in state and actions:
 *   { user, session, loading, manualSignOut, callbackNotice, dismissCallbackNotice,
 *     signUp, signIn, signOut, resendConfirmation }
 * `loading` is true only until the saved session (if any) has been checked.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
