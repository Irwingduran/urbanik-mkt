# 📊 Plan de Optimización de Base de Datos - Regen Marketplace

## ✅ CAMBIOS COMPLETADOS

### 1. Unificación del Sistema de Vendors

#### Cambios en Schema (Prisma)
- ✅ **Product.vendorId** → **Product.vendorUserId** (ahora apunta a VendorProfile.userId)
- ✅ **Order.vendorId** → **Order.vendorUserId** (ahora apunta a VendorProfile.userId)
- ✅ Modelo **Vendor** marcado como **DEPRECATED** (se mantendrá durante migración)
- ✅ Agregadas relaciones **products** y **orders** a **VendorProfile**
- ✅ Agregados índices en `vendorUserId` para performance

#### Script de Migración
- ✅ Creado script: `prisma/migrations/migrate-vendor-to-profile.ts`
- Migra automáticamente datos de Vendor → VendorProfile
- Preserva información histórica
- Marca vendedores existentes como VERIFIED

---

## 📋 PRÓXIMOS PASOS

### Fase 1: Completar Migración de Vendors (URGENTE)

#### Paso 1: Generar Migración de Prisma
```bash
# Esto creará la migración SQL necesaria
npx prisma migrate dev --name migrate-to-vendor-profile --create-only
```

#### Paso 2: Editar Migración SQL (IMPORTANTE)
La migración generada necesita ajustes manuales para evitar pérdida de datos:

```sql
-- En el archivo de migración generado, ANTES de DROP columnas:

-- 1. Agregar nueva columna vendorUserId a Products
ALTER TABLE "products" ADD COLUMN "vendorUserId" TEXT;

-- 2. Copiar datos de vendorId a vendorUserId (via userId de Vendor)
UPDATE "products" p
SET "vendorUserId" = v."userId"
FROM "vendors" v
WHERE p."vendorId" = v."id";

-- 3. Hacer vendorUserId NOT NULL
ALTER TABLE "products" ALTER COLUMN "vendorUserId" SET NOT NULL;

-- 4. Crear índice
CREATE INDEX "products_vendorUserId_idx" ON "products"("vendorUserId");

-- 5. Repetir para Orders
ALTER TABLE "orders" ADD COLUMN "vendorUserId" TEXT;
UPDATE "orders" o
SET "vendorUserId" = v."userId"
FROM "vendors" v
WHERE o."vendorId" = v."id";
ALTER TABLE "orders" ALTER COLUMN "vendorUserId" SET NOT NULL;
CREATE INDEX "orders_vendorUserId_idx" ON "orders"("vendorUserId");

-- 6. Eliminar columnas antiguas
ALTER TABLE "products" DROP COLUMN "vendorId";
ALTER TABLE "orders" DROP COLUMN "vendorId";
```

#### Paso 3: Ejecutar Migración
```bash
# Ejecutar migraciones pendientes
npx prisma migrate dev

# O en producción:
npx prisma migrate deploy
```

#### Paso 4: Ejecutar Script de Migración de Datos
```bash
# Instalar tsx si no está
npm install -D tsx

# Ejecutar script
npx tsx prisma/migrations/migrate-vendor-to-profile.ts
```

#### Paso 5: Verificar Migración
- Verificar que todos los VendorProfile fueron creados
- Verificar que Products tienen vendorUserId correcto
- Verificar que Orders tienen vendorUserId correcto
- Probar funcionalidad de vendor dashboard
- Probar creación de productos

#### Paso 6: Actualizar APIs y Código
**Archivos a actualizar**:
1. `/app/api/products/route.ts` - Cambiar `vendorId` → `vendorUserId`
2. `/app/api/vendor/products/route.ts` - Usar `vendorProfile` en includes
3. `/app/api/orders/create/route.ts` - Cambiar `vendorId` → `vendorUserId`
4. `/app/api/vendor/orders/route.ts` - Usar `vendorProfile`
5. `/app/api/cart/route.ts` - Actualizar includes para productos
6. Cualquier componente que use `vendor.companyName`

---

### Fase 2: Implementar Funcionalidades Faltantes

#### A. Sistema de Categorías (Prioridad Alta)
**Estado**: ❌ No implementado

**Tareas**:
1. Crear API `/api/categories` (GET, POST para admin)
2. Seed inicial de categorías en Prisma
3. Actualizar marketplace filters para usar categorías dinámicas
4. **Opcional**: Migrar Product.category de String a relación

**Beneficio**: Categorías dinámicas, jerarquías, mejor SEO

---

#### B. Sistema de Reviews (Prioridad Alta)
**Estado**: ❌ Modelo existe, sin implementar

**Tareas**:
1. Crear API `/api/reviews`:
   - `GET /api/reviews?productId=xxx` - Listar reviews
   - `POST /api/reviews` - Crear review (solo usuarios con orden DELIVERED)
   - `PUT /api/reviews/:id/helpful` - Marcar como útil
   - `PUT /api/reviews/:id/verify` - Verificar compra (admin)

2. Crear componentes UI:
   - `components/product/ReviewsList.tsx`
   - `components/product/WriteReview.tsx`
   - `components/product/ReviewStats.tsx`

3. Agregar a Product Page
4. Actualizar Product.averageRating automáticamente

**Beneficio**: Social proof, confianza, mejor conversión

---

#### C. Wishlist Funcional (Prioridad Media)
**Estado**: ❌ Modelo existe, página usa mock data

**Tareas**:
1. Crear API `/api/wishlist`:
   - `GET /api/wishlist` - Listar items
   - `POST /api/wishlist` - Agregar producto
   - `DELETE /api/wishlist/:id` - Remover producto

2. Conectar `/app/dashboard/wishlist/page.tsx` con API real
3. Agregar botón "Add to Wishlist" en ProductCard
4. **Opcional**: Price alerts via Notifications

**Beneficio**: Retención de usuarios, remarketing, conversión diferida

---

#### D. Sistema de Direcciones (Prioridad Media)
**Estado**: ❌ Modelo existe, sin implementar

**Tareas**:
1. Crear API `/api/addresses` (CRUD completo)
2. Crear página `/dashboard/settings/addresses`
3. Actualizar checkout para usar direcciones guardadas
4. **Opcional**: Integración con API de validación de direcciones

**Beneficio**: Checkout más rápido, mejor UX

---

#### E. Notificaciones Reales (Prioridad Media)
**Estado**: ⚠️ Modelo existe, API vacía, usa mock data

**Tareas**:
1. Implementar API `/api/notifications`:
   - `GET /api/notifications` - Listar notificaciones del usuario
   - `PUT /api/notifications/:id/read` - Marcar como leída
   - `PUT /api/notifications/read-all` - Marcar todas como leídas

2. Conectar `DashboardLayout` con API real (remover mock data)

3. Crear triggers automáticos:
   - ORDER_CREATED - Al crear orden
   - ORDER_SHIPPED - Al actualizar tracking
   - ORDER_DELIVERED - Al marcar como entregado
   - PAYMENT_SUCCESS / FAILED - Webhooks de Stripe
   - STOCK_LOW - Cuando stock < minStock (para vendors)
   - PRODUCT_REVIEW - Cuando reciben review (para vendors)

4. **Opcional**: Email notifications via Resend/SendGrid
5. **Opcional**: Push notifications via Firebase

**Beneficio**: Engagement, retención, better customer service

---

#### F. Métodos de Pago Guardados (Prioridad Baja)
**Estado**: ❌ Modelo existe, sin implementar

**Tareas**:
1. Implementar Stripe Payment Methods:
   - Setup Intent para guardar tarjeta
   - Lista de métodos guardados
   - Eliminar método

2. Crear API `/api/payment-methods` (CRUD)
3. UI en `/dashboard/settings/payment-methods`
4. Selector en checkout

**Beneficio**: Checkout más rápido, recompras más fáciles

---

### Fase 3: Optimizaciones Avanzadas

#### A. Métricas de Vendor Performance
**Estado**: ⚠️ Campos existen en VendorProfile pero no se calculan

**Campos a implementar**:
- `responseTime` - Promedio de tiempo de respuesta
- `fulfillmentRate` - % de órdenes completadas
- `onTimeDeliveryRate` - % entregas a tiempo

**Tareas**:
1. Crear jobs/cron para calcular métricas
2. Dashboard de vendor con gráficas
3. Badges/ratings en perfil de vendor

**Beneficio**: Quality control, mejor experiencia de compra

---

#### B. Sistema de Loyalty/Rewards
**Estado**: ❌ CustomerProfile existe pero no se usa

**Tareas**:
1. Crear sistema de puntos:
   - Por cada $1 gastado = X puntos
   - Bonos por primera compra, referrals, reviews

2. Implementar tiers (BRONZE → PLATINUM)
3. Beneficios por tier (envío gratis, descuentos, early access)
4. UI en dashboard para ver puntos y tier
5. Redención en checkout

**Beneficio**: Retención, LTV, engagement

---

#### C. Comisiones y Pagos a Vendors
**Estado**: ❌ Campos existen pero no se usan

**Tareas**:
1. Implementar Stripe Connect:
   - Onboarding de vendors a Stripe
   - KYC/verificación
   - Guardar `stripeAccountId`

2. Calcular comisiones:
   - Aplicar `commissionRate` en cada orden
   - Split payment automático

3. Dashboard de earnings para vendors:
   - Ventas totales
   - Comisiones deducidas
   - Balance disponible
   - Historial de payouts

4. Automatic payouts o manual withdrawal

**Beneficio**: Escalabilidad, transparencia, confianza

---

## 🎯 ORDEN RECOMENDADO DE EJECUCIÓN

### Sprint 1 (Semana 1-2): Migración Critical
1. ✅ Completar migración Vendor → VendorProfile
2. ✅ Actualizar todas las APIs
3. ✅ Testing completo

### Sprint 2 (Semana 3-4): Core Features
1. Categorías + Reviews
2. Wishlist + Direcciones
3. Notificaciones reales

### Sprint 3 (Semana 5-6): Polish
1. Métodos de pago guardados
2. Métricas de vendor
3. Sistema de loyalty (básico)

### Sprint 4+ (Mes 2): Advanced
1. Stripe Connect + Comisiones
2. Analytics avanzados
3. Email/Push notifications

---

## 📊 RESUMEN DE IMPACTO

### Migración Vendor → VendorProfile
- **Impacto**: 🔴 CRÍTICO - Evita inconsistencias futuras
- **Esfuerzo**: 🟡 MEDIO - Requiere migración de datos
- **Riesgo**: 🟡 MEDIO - Requiere testing exhaustivo

### Features Core (Categories, Reviews, Wishlist)
- **Impacto**: 🟢 ALTO - Completa MVP funcional
- **Esfuerzo**: 🟡 MEDIO - APIs + UIs standard
- **Riesgo**: 🟢 BAJO - Patrones conocidos

### Features Advanced (Loyalty, Comisiones)
- **Impacto**: 🟡 MEDIO - Diferenciación competitiva
- **Esfuerzo**: 🔴 ALTO - Integraciones complejas
- **Riesgo**: 🟡 MEDIO - Depende de terceros (Stripe)

---

## 🚨 IMPORTANTE

**ANTES de hacer cambios en producción**:
1. Backup completo de la base de datos
2. Probar migración en staging primero
3. Plan de rollback preparado
4. Downtime window comunicado

**Orden correcto**:
1. Primero actualizar schema
2. Luego correr migración de datos
3. Después actualizar código/APIs
4. Finalmente desplegar a producción

---

## 📞 Próximos Pasos Inmediatos

¿Quieres que proceda con alguna de estas tareas?

**Opciones**:
1. **Actualizar APIs para usar VendorProfile** (recomendado ahora)
2. **Implementar sistema de Categorías**
3. **Implementar Reviews**
4. **Otro feature específico**

Déjame saber y continúo con la implementación! 🚀
