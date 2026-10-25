
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';



import {
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE,
  getAppearanceStorageKey,
  isWorldId,
  loadAppearance,
  normalizeAppearance,
  saveAppearance,
  themeKey,
} from './themes.js';

import { supabase } from '../lib/supabaseClient.js';
import { AuthContext } from '../auth/AuthProvider.jsx';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [appearance, setAppearanceState] = useState(() => ({
    ...DEFAULT_APPEARANCE,
  }));

  const [saveFailed, setSaveFailed] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState(null);

  const requestId = useRef(0);
  const key = themeKey(appearance);

  // Load the appearance belonging to the signed-in user.
  useEffect(() => {
    const currentRequest = ++requestId.current;
    let cancelled = false;

    async function loadCloudAppearance() {
      setLoadedUserId(null);
      setSaveFailed(false);

      if (!user?.id) {
        setAppearanceState({ ...DEFAULT_APPEARANCE });
        setLoadedUserId(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('appearance')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (cancelled || requestId.current !== currentRequest) {
          return;
        }

        let userAppearance;

        if (data?.appearance) {
          // Restore this user's saved theme.
          userAppearance = normalizeAppearance(data.appearance);
        } else {
          // A new account starts with the default theme.
          userAppearance = { ...DEFAULT_APPEARANCE };

          const { error: insertError } = await supabase
            .from('user_settings')
            .upsert(
              {
                user_id: user.id,
                appearance: userAppearance,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' },
            );

          if (insertError) throw insertError;

          if (cancelled || requestId.current !== currentRequest) {
            return;
          }
        }

        // Cache the appearance using this user's unique key.
        saveAppearance(userAppearance, user.id);
        setAppearanceState(userAppearance);
        setLoadedUserId(user.id);
      } catch (error) {
        console.error('Could not load appearance:', error);

        if (!cancelled && requestId.current === currentRequest) {
          // Use only this user's local appearance as a fallback.
          setAppearanceState(loadAppearance(user.id));
          setSaveFailed(true);
          setLoadedUserId(user.id);
        }
      }
    }

    loadCloudAppearance();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Save appearance changes to the current user's local cache and cloud record.
  useEffect(() => {
    if (!user?.id || loadedUserId !== user.id) {
      return;
    }

    let cancelled = false;

    async function saveCloudAppearance() {
      const localSaved = saveAppearance(appearance, user.id);

      if (!localSaved) {
        setSaveFailed(true);
        return;
      }

      try {
        const { error } = await supabase
          .from('user_settings')
          .upsert(
            {
              user_id: user.id,
              appearance,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          );

        if (error) throw error;

        if (!cancelled) {
          setSaveFailed(false);
        }
      } catch (error) {
        console.error('Could not save appearance:', error);

        if (!cancelled) {
          setSaveFailed(true);
        }
      }
    }

    saveCloudAppearance();

    return () => {
      cancelled = true;
    };
  }, [appearance, user?.id, loadedUserId]);

  // Sync changes from another tab for the same account.
  useEffect(() => {
    const storageKey = user?.id
      ? getAppearanceStorageKey(user.id)
      : APPEARANCE_STORAGE_KEY;

    function onStorage(event) {
      if (event.key !== storageKey) return;

      setAppearanceState(
        user?.id
          ? loadAppearance(user.id)
          : { ...DEFAULT_APPEARANCE },
      );
    }

    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, [user?.id]);

  // Set an appearance directly.
  const setAppearance = useCallback(
    (next) => {
      const clean = normalizeAppearance(next);

      setAppearanceState(clean);

      const saved = saveAppearance(clean, user?.id ?? null);
      setSaveFailed(!saved);
    },
    [user?.id],
  );

  // Change the theme.
  const selectTheme = useCallback((theme) => {
    setAppearanceState((current) => {
      if (theme === current.theme) return current;

      return normalizeAppearance({
        theme,
        variant: 'day',
      });
    });
  }, []);

  // Change the day/night variant for world themes.
  const selectVariant = useCallback((theme, variant) => {
    if (!isWorldId(theme)) return;

    setAppearanceState((current) => {
      if (
        theme === current.theme &&
        variant === current.variant
      ) {
        return current;
      }

      return normalizeAppearance({
        theme,
        variant,
      });
    });
  }, []);

  const value = useMemo(
    () => ({
      appearance,
      key,
      saveFailed,
      setAppearance,
      selectTheme,
      selectVariant,
    }),
    [
      appearance,
      key,
      saveFailed,
      setAppearance,
      selectTheme,
      selectVariant,
    ],
  );

  

return (
  <ThemeContext.Provider value={value}>
    {children}
  </ThemeContext.Provider>
);


}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }

  return context;
}
