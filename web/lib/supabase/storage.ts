import { supabase } from './init'

// Default storage bucket names
const PUBLIC_BUCKET = 'public'
const PRIVATE_BUCKET = 'private'

// Upload file to public bucket
export const uploadPublicFile = async (
  path: string,
  file: File | Blob,
  options?: { cacheControl?: string; upsert?: boolean }
) => {
  const { data, error } = await supabase.storage
    .from(PUBLIC_BUCKET)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false,
    })

  if (error) throw error
  return data
}

// Upload file to private bucket
export const uploadPrivateFile = async (
  path: string,
  file: File | Blob,
  options?: { cacheControl?: string; upsert?: boolean }
) => {
  const { data, error } = await supabase.storage
    .from(PRIVATE_BUCKET)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false,
    })

  if (error) throw error
  return data
}

// Get public URL for a file
export const getPublicUrl = (path: string): string => {
  const { data } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// Get signed URL for private file (expires after specified seconds)
export const getSignedUrl = async (
  path: string,
  expiresIn: number = 3600
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(PRIVATE_BUCKET)
    .createSignedUrl(path, expiresIn)

  if (error) throw error
  return data.signedUrl
}

// Delete file from public bucket
export const deletePublicFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from(PUBLIC_BUCKET)
    .remove([path])

  if (error) throw error
  return data
}

// Delete file from private bucket
export const deletePrivateFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from(PRIVATE_BUCKET)
    .remove([path])

  if (error) throw error
  return data
}

// List files in a bucket
export const listFiles = async (
  bucket: string = PUBLIC_BUCKET,
  path: string = ''
) => {
  const { data, error } = await supabase.storage.from(bucket).list(path)

  if (error) throw error
  return data
}

// Upload avatar helper
export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  await uploadPublicFile(filePath, file, { upsert: true })
  return getPublicUrl(filePath)
}

// Upload contract image helper
export const uploadContractImage = async (contractId: string, file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${contractId}-${Date.now()}.${fileExt}`
  const filePath = `contracts/${fileName}`

  await uploadPublicFile(filePath, file, { upsert: true })
  return getPublicUrl(filePath)
}

export const getSupabaseStorage = () => supabase.storage
