
import { supabase } from '../lib/supabaseClient.js';

const ALLOWED_FIELDS = ['privacy_preferences', 'reminder_preferences'];

export async function loadCloudSetting(userId, column) {
  if (!userId) return { ok: false, skipped: true };

  if (!ALLOWED_FIELDS.includes(column)) {
    return { ok: false, error: new Error('Unsupported settings field.') };
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('profile')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return { ok: false, error };

  return {
    ok: true,
    value: data?.profile?.[column] ?? null,
  };
}

export async function saveCloudSetting(userId, column, value) {
  if (!userId) return { ok: false, skipped: true };

  if (!ALLOWED_FIELDS.includes(column)) {
    return { ok: false, error: new Error('Unsupported settings field.') };
  }

  const { data: existing, error: readError } = await supabase
    .from('user_settings')
    .select('profile')
    .eq('user_id', userId)
    .maybeSingle();

  if (readError) return { ok: false, error: readError };

  if (existing) {
    const profile =
      existing.profile && typeof existing.profile === 'object'
        ? existing.profile
        : {};

    const { error } = await supabase
      .from('user_settings')
      .update({
        profile: { ...profile, [column]: value },
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    return error ? { ok: false, error } : { ok: true };
  }

  const { error } = await supabase.from('user_settings').insert({
    user_id: userId,
    profile: { [column]: value },
    appearance: {},
    updated_at: new Date().toISOString(),
  });

  return error ? { ok: false, error } : { ok: true };
}
