import { Request } from 'express'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase client instance
let supabaseClient: SupabaseClient | null = null

export function initializeSupabase() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables')
  }

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })

  console.log('✅ Supabase client initialized')
  return supabaseClient
}

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error('Supabase not initialized. Call initializeSupabase() first.')
  }
  return supabaseClient
}

// Types
export type AuthedUser = {
  uid: string
  creds: JwtCredentials | KeyCredentials
}

type JwtCredentials = {
  kind: 'jwt'
  data: {
    user_id: string
    email?: string
    aud: string
    exp: number
  }
}

type KeyCredentials = {
  kind: 'key'
  data: string
  userId: string
}

type Credentials = JwtCredentials | KeyCredentials

// Error class
export class APIError extends Error {
  constructor(public code: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

// Parse Authorization header
export async function parseCredentials(req: Request): Promise<Credentials> {
  const authHeader = req.get('Authorization')

  if (!authHeader) {
    throw new APIError(401, 'Missing Authorization header.')
  }

  const authParts = authHeader.split(' ')

  if (authParts.length !== 2) {
    throw new APIError(401, 'Invalid Authorization header.')
  }

  const [scheme, payload] = authParts

  switch (scheme) {
    case 'Bearer': {
      if (payload === 'undefined' || !payload) {
        throw new APIError(401, 'JWT payload undefined.')
      }

      try {
        const supabase = getSupabase()

        // Verify JWT token with Supabase
        const { data, error } = await supabase.auth.getUser(payload)

        if (error || !data.user) {
          console.error('Error verifying Supabase JWT:', error)
          throw new APIError(401, 'Invalid or expired token.')
        }

        return {
          kind: 'jwt',
          data: {
            user_id: data.user.id,
            email: data.user.email,
            aud: data.user.aud || 'authenticated',
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
          },
        }
      } catch (err) {
        if (err instanceof APIError) throw err
        console.error('Error verifying JWT:', err)
        throw new APIError(401, 'Invalid or expired token.')
      }
    }

    case 'Key': {
      // API Key authentication
      // For MVP, we'll just validate format
      // In production, check against database
      if (!payload || payload.length < 10) {
        throw new APIError(401, 'Invalid API key.')
      }

      // TODO: Look up user from private_users table by api_secret
      // For now, return a placeholder
      return {
        kind: 'key',
        data: payload,
        userId: 'key-user-id', // Replace with actual DB lookup
      }
    }

    default:
      throw new APIError(401, 'Invalid auth scheme; must be "Key" or "Bearer".')
  }
}

// Get authenticated user from credentials
export async function lookupUser(creds: Credentials): Promise<AuthedUser> {
  switch (creds.kind) {
    case 'jwt': {
      if (typeof creds.data.user_id !== 'string') {
        throw new APIError(401, 'JWT must contain user ID.')
      }
      return { uid: creds.data.user_id, creds }
    }

    case 'key': {
      // For API key auth, userId is already resolved
      return { uid: creds.userId, creds }
    }

    default:
      throw new APIError(401, 'Invalid credential type.')
  }
}

// Authenticate request - combines both steps
export async function authenticateRequest(req: Request): Promise<AuthedUser> {
  const creds = await parseCredentials(req)
  return lookupUser(creds)
}
