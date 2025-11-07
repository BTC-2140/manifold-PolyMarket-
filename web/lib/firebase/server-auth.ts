// ✅ SUPABASE COMPATIBILITY LAYER
// This file provides server-side auth compatibility
// Redirects to Supabase-based authentication

import { GetServerSideProps, GetServerSidePropsContext } from 'next'

// Placeholder redirects - for MVP, implement proper Supabase server auth
export const redirectIfLoggedOut = <P extends { [k: string]: any }>(
  dest: string,
  fn?: any
) => {
  return async (ctx: GetServerSidePropsContext) => {
    // TODO: Implement Supabase server-side auth check
    // For now, allow all requests (development mode)
    if (fn) {
      return fn(ctx, null)
    }
    return { props: {} }
  }
}

export const redirectIfLoggedIn = <P extends { [k: string]: any }>(
  dest: string,
  fn?: GetServerSideProps<P>
) => {
  return async (ctx: GetServerSidePropsContext) => {
    // TODO: Implement Supabase server-side auth check
    // For now, allow all requests (development mode)
    if (fn) {
      return fn(ctx)
    }
    return { props: {} }
  }
}

export const authenticateOnServer = async (cookieValue: string | null) => {
  // TODO: Implement Supabase server-side auth
  return null
}
