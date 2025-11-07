# Arquivos Firebase - Status de Migração

## ✅ Migração Backend Completa

O **backend-simple** foi 100% migrado para Supabase e **não usa** nenhum arquivo da pasta `common/`.

## ⚠️ Frontend Web - Arquivos Legados

O projeto `web/` é o frontend completo do Manifold Markets original. Ele ainda contém arquivos Firebase que são considerados **legado**.

### Arquivos Firebase Legados (NÃO USAR EM NOVOS DESENVOLVIMENTOS)

#### Pasta `common/` (Projeto Original)
- ❌ `common/src/firebase-auth.ts` - Persistência Firebase (legado)
- ❌ `common/src/envs/constants.ts` - FIREBASE_CONFIG (legado)
- ❌ `common/src/envs/dev.ts` - Configuração Firebase DEV (legado)
- ❌ `common/src/envs/prod.ts` - Configuração Firebase PROD (legado)

#### Pasta `web/lib/firebase/` (Projeto Original)
- ❌ `web/lib/firebase/init.ts` - Inicialização Firebase (legado)
- ❌ `web/lib/firebase/auth.ts` - Autenticação Firebase (legado)
- ❌ `web/lib/firebase/storage.ts` - Storage Firebase (legado)
- ❌ `web/lib/firebase/server-auth.ts` - Server-side auth Firebase (legado)
- ❌ `web/lib/firebase/google-onetap-login.tsx` - Google One Tap Firebase (legado)

### ✅ Novos Arquivos Supabase (USAR EM TODOS OS NOVOS DESENVOLVIMENTOS)

#### Backend
- ✅ `backend-simple/api/src/helpers/supabase-auth.ts` - Autenticação Supabase
- ✅ `backend-simple/api/src/helpers/db.ts` - Database PostgreSQL/Supabase

#### Frontend
- ✅ `web/lib/supabase/init.ts` - Inicialização Supabase
- ✅ `web/lib/supabase/auth.ts` - Autenticação completa Supabase
- ✅ `web/lib/supabase/storage.ts` - Storage Supabase

## 🎯 Diretrizes para Desenvolvedores

### Para Backend (backend-simple)
✅ **SEMPRE use** `web/lib/supabase/*`
❌ **NUNCA use** `web/lib/firebase/*` ou `common/src/firebase-*`

### Para Frontend Web (MVP Angola)
✅ **SEMPRE use** `web/lib/supabase/*` para novos componentes
⚠️ **Evite modificar** arquivos em `web/lib/firebase/*` (são do projeto original Manifold)

### Variáveis de Ambiente

**Backend (.env):**
```env
# ✅ USAR
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=seu-service-role-key
DATABASE_URL=postgresql://...

# ❌ NÃO CONFIGURAR
# FIREBASE_PROJECT_ID (não necessário)
# FIREBASE_PRIVATE_KEY (não necessário)
```

**Frontend (.env.local):**
```env
# ✅ USAR
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key

# ❌ NÃO CONFIGURAR
# NEXT_PUBLIC_FIREBASE_ENV (legado do Manifold)
```

## 📊 Impacto da Migração

| Componente | Status | Usa Firebase? | Usa Supabase? |
|-----------|--------|---------------|---------------|
| **backend-simple/** | ✅ Migrado | ❌ Não | ✅ Sim |
| **web/lib/supabase/** | ✅ Criado | ❌ Não | ✅ Sim |
| **web/lib/firebase/** | ⚠️ Legado | ⚠️ Sim (ignorar) | ❌ Não |
| **common/** | ⚠️ Legado | ⚠️ Sim (ignorar) | ❌ Não |

## 🚀 Próximos Passos (Futuro)

Para uma migração completa do frontend (opcional, não necessário para MVP):

1. **Fase 1**: Criar novos componentes usando `web/lib/supabase/*` ✅ (FEITO)
2. **Fase 2**: Migrar componentes existentes gradualmente (futuro)
3. **Fase 3**: Remover pasta `web/lib/firebase/*` completamente (futuro)
4. **Fase 4**: Remover referências Firebase da pasta `common/` (futuro)

## ✅ Conclusão

**Para o MVP Angola:**
- ✅ Backend 100% Supabase (completo)
- ✅ Bibliotecas Supabase criadas no frontend (pronto para uso)
- ⚠️ Arquivos Firebase originais mantidos (não interferem, podem ser ignorados)

**Recomendação:** Os arquivos Firebase podem permanecer no repositório sem problema. Eles não afetam o `backend-simple` que já está 100% Supabase. Para novos desenvolvimentos frontend, sempre use `web/lib/supabase/*`.
