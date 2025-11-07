// ✅ SUPABASE COMPATIBILITY LAYER
// This file redirects old Firebase calls to new Supabase implementation
// For new code, use web/lib/supabase/auth.ts directly

import {
  signInWithGoogle as supabaseSignInWithGoogle,
  signInWithApple as supabaseSignInWithApple,
  signOut as supabaseSignOut,
  getCurrentUser,
} from '../supabase/auth'

// Re-export for backward compatibility
export const firebaseLogin = supabaseSignInWithGoogle
export const loginWithApple = supabaseSignInWithApple
export const firebaseLogout = supabaseSignOut

// Auth instance (for API compatibility)
import type { Auth } from './auth'

export const auth: Auth = {
  currentUser: null as any,
}

// User type (re-export from common for compatibility)
export type { User } from 'common/user'
