// ⚠️ FIREBASE LEGADO - NÃO USAR EM NOVOS DESENVOLVIMENTOS
// Para MVP Angola, use: web/lib/supabase/init.ts
// Veja: FIREBASE_LEGACY_STATUS.md

import { getStorage } from 'firebase/storage'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { FIREBASE_CONFIG } from 'common/envs/constants'

// Initialize Firebase
export const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG)
export const storage = getStorage()
export const privateStorage = getStorage(
  app,
  'gs://' + FIREBASE_CONFIG.privateBucket
)
