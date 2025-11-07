# ⚠️ Arquivos Firebase Legados - Projeto Manifold Original

Esta pasta contém arquivos do **projeto Manifold Markets original** e **NÃO é usada** pelo `backend-simple` MVP para Angola.

## Status

- ❌ **NÃO USAR** em novos desenvolvimentos
- ⚠️ Mantido para referência do projeto original
- ✅ O `backend-simple/` **não depende** desta pasta

## Arquivos com Firebase

### `src/firebase-auth.ts`
- Lógica de persistência de autenticação Firebase
- Usado apenas no projeto web original (Manifold Markets)
- **Alternativa Supabase:** `backend-simple/api/src/helpers/supabase-auth.ts`

### `src/envs/constants.ts`, `dev.ts`, `prod.ts`
- Configurações Firebase (DEV e PROD)
- Configurações do projeto Manifold Markets original
- Contém: `firebaseConfig`, `FIREBASE_CONFIG`, `AUTH_COOKIE_NAME`
- **Alternativa Supabase:** Variáveis de ambiente em `backend-simple/api/.env`

## ✅ Para o MVP Angola, use:

### Backend
```typescript
// ✅ CORRETO - Autenticação Supabase
import { authenticateRequest } from '../helpers/supabase-auth'

// ❌ ERRADO - Não usar
import { FIREBASE_CONFIG } from 'common/envs/constants'
```

### Frontend
```typescript
// ✅ CORRETO - Supabase
import { supabase } from 'web/lib/supabase/init'
import { signInWithGoogle } from 'web/lib/supabase/auth'

// ❌ ERRADO - Não usar
import { FIREBASE_CONFIG } from 'common/envs/constants'
import { getFirebaseAuth } from 'web/lib/firebase/auth'
```

## 📚 Documentação

Veja `FIREBASE_LEGACY_STATUS.md` na raiz do projeto para mais detalhes sobre a migração Firebase → Supabase.
