// Supabase SQL — run once in dashboard:
//
// create table if not exists user_profiles (
//   user_id uuid references auth.users(id) on delete cascade primary key,
//   first_name text, last_name text, branch text, rank text, status text,
//   created_at timestamptz default now()
// );
// alter table user_profiles enable row level security;
// create policy "Users manage own profile" on user_profiles for all
//   using (auth.uid() = user_id) with check (auth.uid() = user_id);

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(u) {
    if (!supabase || !u) { setProfile(null); return }
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', u.id)
      .single()

    if (data) {
      setProfile(data)
      try { if (data.first_name) localStorage.setItem('vtg_first_name', data.first_name) } catch {}
      return
    }

    // No profile row yet — create one from user_metadata (set during signUp)
    const meta = u.user_metadata || {}
    if (meta.first_name || meta.branch) {
      const payload = {
        user_id: u.id,
        first_name: meta.first_name || '',
        last_name: meta.last_name || '',
        branch: meta.branch || '',
        rank: meta.rank || '',
        status: meta.status || '',
      }
      const { data: created } = await supabase
        .from('user_profiles')
        .insert(payload)
        .select()
        .single()
      if (created) {
        setProfile(created)
        try { if (created.first_name) localStorage.setItem('vtg_first_name', created.first_name) } catch {}
      }
    }
  }

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      setLoading(false)
      if (u) loadProfile(u)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) loadProfile(u)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // signUp now accepts optional profileData stored in user_metadata
  const signUp = (email, password, profileData = {}) =>
    supabase
      ? supabase.auth.signUp({ email, password, options: { data: profileData, emailRedirectTo: 'https://www.tyfms.com' } })
      : Promise.resolve({ error: { message: 'Supabase not configured' } })

  const signIn = (email, password) =>
    supabase
      ? supabase.auth.signInWithPassword({ email, password })
      : Promise.resolve({ error: { message: 'Supabase not configured' } })

  const signOut = async () => {
    if (!supabase) return
    return supabase.auth.signOut()
  }

  const saveProfile = async (data) => {
    if (!supabase || !user) return { error: 'Not signed in' }
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: user.id, ...data }, { onConflict: 'user_id' })
    if (!error) {
      setProfile(prev => ({ ...(prev || {}), ...data }))
      try { if (data.first_name) localStorage.setItem('vtg_first_name', data.first_name) } catch {}
    }
    return { error }
  }

  const deleteAccount = async () => {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return { error: { message: 'Not signed in' } }
    try {
      const r = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      const data = await r.json()
      if (!r.ok) return { error: { message: data.error || 'Could not delete account.' } }
      await supabase.auth.signOut()
      try { localStorage.removeItem('vtg_first_name') } catch {}
      return { error: null }
    } catch {
      return { error: { message: 'Could not reach the server. Try again.' } }
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, saveProfile, deleteAccount, supabaseEnabled: !!supabase }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
