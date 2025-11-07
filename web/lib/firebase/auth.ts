// ✅ SUPABASE COMPATIBILITY LAYER - Firebase Auth API Shim
// This file provides Firebase Auth API compatibility using Supabase
// For new code, use web/lib/supabase/auth.ts directly

import { supabase } from '../supabase/init'
import { User as SupabaseUser } from '@supabase/supabase-js'

// Firebase User type compatibility
export interface User {
  uid: string
  email: string | null
  emailVerified: boolean
  displayName: string | null
  photoURL: string | null
  isAnonymous: boolean
  metadata: {
    creationTime?: string
    lastSignInTime?: string
  }
  stsTokenManager: {
    accessToken: string
    expirationTime: number
    refreshToken: string
  }
  toJSON(): any
  getIdToken(forceRefresh?: boolean): Promise<string>
}

// Auth object compatibility
export interface Auth {
  currentUser: User | null
}

// Convert Supabase user to Firebase-like user
function toFirebaseUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null

  return {
    uid: supabaseUser.id,
    email: supabaseUser.email || null,
    emailVerified: supabaseUser.email_confirmed_at != null,
    displayName: supabaseUser.user_metadata?.name || null,
    photoURL: supabaseUser.user_metadata?.avatar_url || null,
    isAnonymous: false,
    metadata: {
      creationTime: supabaseUser.created_at,
      lastSignInTime: supabaseUser.last_sign_in_at || undefined,
    },
    stsTokenManager: {
      accessToken: '', // Will be filled by session
      expirationTime: 0,
      refreshToken: '',
    },
    toJSON() {
      return {
        uid: this.uid,
        email: this.email,
        emailVerified: this.emailVerified,
        displayName: this.displayName,
        photoURL: this.photoURL,
        isAnonymous: this.isAnonymous,
        metadata: this.metadata,
        stsTokenManager: this.stsTokenManager,
      }
    },
    async getIdToken(forceRefresh?: boolean) {
      const { data } = await supabase.auth.getSession()
      return data.session?.access_token || ''
    },
  }
}

// onIdTokenChanged compatibility
export function onIdTokenChanged(
  auth: Auth,
  callback: (user: User | null) => void,
  errorCallback?: (error: Error) => void
): () => void {
  // Subscribe to Supabase auth state changes
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      try {
        if (session?.user) {
          const firebaseUser = toFirebaseUser(session.user)
          if (firebaseUser && session.access_token) {
            // Fill in token info
            firebaseUser.stsTokenManager.accessToken = session.access_token
            firebaseUser.stsTokenManager.refreshToken =
              session.refresh_token || ''
            firebaseUser.stsTokenManager.expirationTime =
              session.expires_at || 0
          }
          callback(firebaseUser)
        } else {
          callback(null)
        }
      } catch (error) {
        if (errorCallback) {
          errorCallback(error as Error)
        } else {
          console.error('onIdTokenChanged error:', error)
        }
      }
    }
  )

  // Return unsubscribe function
  return () => {
    authListener.subscription.unsubscribe()
  }
}

// onAuthStateChanged compatibility (simpler version)
export function onAuthStateChanged(
  auth: Auth,
  callback: (user: User | null) => void,
  errorCallback?: (error: Error) => void
): () => void {
  return onIdTokenChanged(auth, callback, errorCallback)
}
