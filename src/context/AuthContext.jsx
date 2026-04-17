import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signUp = (email, password) =>
    supabase ? supabase.auth.signUp({ email, password }) : Promise.resolve({ error: { message: 'Supabase not configured' } })

  const signIn = (email, password) =>
    supabase ? supabase.auth.signInWithPassword({ email, password }) : Promise.resolve({ error: { message: 'Supabase not configured' } })

  const signOut = () =>
    supabase ? supabase.auth.signOut() : Promise.resolve()

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
      return { error: null }
    } catch {
      return { error: { message: 'Could not reach the server. Try again.' } }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, deleteAccount, supabaseEnabled: !!supabase }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
