import { supabase } from './init'
import { User, Session, AuthError } from '@supabase/supabase-js'

export type { User, Session }

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Get current session
export const getCurrentSession = async (): Promise<Session | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Sign in with Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

// Sign in with Apple
export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

// Sign in with email/password
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

// Sign up with email/password
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get JWT token for API calls
export const getToken = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token || null
}

// Listen to auth state changes
export const onAuthStateChange = (
  callback: (user: User | null, session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null, session)
  })
}

// Password reset
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
  return data
}

// Update password
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw error
  return data
}

// Update user metadata
export const updateUserMetadata = async (metadata: Record<string, any>) => {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  })
  if (error) throw error
  return data
}

export const getSupabaseAuth = () => supabase.auth
