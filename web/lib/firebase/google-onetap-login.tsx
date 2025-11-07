// ✅ SUPABASE COMPATIBILITY LAYER
// Google One Tap redirected to Supabase

import { useEffect } from 'react'
import { signInWithGoogle } from '../supabase/auth'

export function GoogleOneTapSetup() {
  useEffect(() => {
    // Google One Tap can be implemented with Supabase
    // For MVP, we'll skip One Tap and use regular Google Sign-In
    console.log('Google One Tap: Use Supabase signInWithGoogle() instead')
  }, [])

  return null
}
