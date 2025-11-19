# 🌱 FLUJOS Y FUNCIONALIDADES DEL MARKETPLACE

**Regen Marketplace (Urbanika)** - Plataforma de E-commerce Sostenible Multi-Vendor

---

## 📖 ÍNDICE

1. [Visión General del Marketplace](#-visión-general-del-marketplace)
2. [Características Diferenciadoras](#-características-diferenciadoras)
3. [Flujo del Comprador (Customer)](#-flujo-del-comprador-customer)
4. [Flujo del Vendedor (Vendor)](#-flujo-del-vendedor-vendor)
5. [Flujo del Administrador (Admin)](#-flujo-del-administrador-admin)
6. [Sistemas Transversales](#-sistemas-transversales)
7. [Diagrama de Arquitectura de Roles](#-diagrama-de-arquitectura-de-roles)

---

## 🎯 VISIÓN GENERAL DEL MARKETPLACE

### ¿Qué es Regen Marketplace?

**Regen Marketplace (Urbanika)** es una plataforma de comercio electrónico sostenible que conecta **vendedores de productos eco-friendly** con **compradores conscientes del medio ambiente**.

### Modelo de Negocio

```
┌─────────────────────────────────────────────────────────┐
│                   REGEN MARKETPLACE                      │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐   ┌────────────┐ │
│  │  COMPRADORES │ ←→ │  PLATAFORMA  │ ←→│ VENDEDORES │ │
│  │  (Customers) │    │    (Admin)   │   │  (Vendors) │ │
│  └──────────────┘    └──────────────┘   └────────────┘ │
│         │                   │                   │        │
│         └───────────────────┴───────────────────┘        │
│                    Transacciones                         │
│                  Stripe Payments                         │
└─────────────────────────────────────────────────────────┘
```

**Tipo:** Multi-Vendor Marketplace
**Mercado:** México (MXN, IVA 16%)
**Nicho:** Productos Sostenibles y Eco-friendly
**Modelo de Pago:** Stripe (Procesamiento de pagos)

---

## 🌟 CARACTERÍSTICAS DIFERENCIADORAS

### 1. **Sistema de Impacto Ambiental (REGEN Score)**

Cada producto tiene métricas de sostenibilidad medibles:

```typescript
Métricas por Producto:
├── regenScore: Int (0-100)       // Puntuación de sostenibilidad
├── co2Reduction: Float (kg CO₂)  // CO₂ reducido/ahorrado
├── waterSaving: Float (litros)   // Agua ahorrada
├── energyEfficiency: Float (kWh) // Energía generada/ahorrada
├── certifications: String[]      // Certificaciones eco
└── origin: String                // Origen del producto
```

**Impacto Acumulado del Usuario:**
- Dashboard muestra el impacto total de todas sus compras
- Visualización de: CO₂ ahorrado, agua ahorrada, energía generada, árboles plantados equivalentes

### 2. **Sistema de NFTs y Gamificación**

**Vendedores:**
- NFT de certificación que evoluciona con el impacto generado
- Niveles: "Semilla Verde" → "Brote" → "Árbol Maduro"
- Aumenta visibilidad según nivel de NFT

**Compradores:**
- Colección de NFTs por compras sostenibles
- Recompensas por hitos de impacto
- Sistema de puntos de lealtad (`loyaltyPoints`)

### 3. **Multi-Vendor con Gestión Independiente**

Cada vendedor:
- ✅ Dashboard propio con analytics
- ✅ Gestión independiente de inventario
- ✅ Procesamiento de órdenes por vendedor
- ✅ Una orden puede tener múltiples vendedores (split automático)

### 4. **Sistema de Verificación de Vendedores**

Proceso riguroso:
```
Solicitud → Revisión Admin → Verificación → Aprobación → Vendedor Activo
```

### 5. **Búsqueda y Filtrado Avanzado**

**Filtros Únicos:**
- Por REGEN Score (impacto ambiental)
- Por certificaciones sostenibles
- Por métricas de impacto (CO₂, agua, energía)
- Categorías especializadas en sostenibilidad

### 6. **Transparencia Total**

- Origen de productos visible
- Certificaciones verificables
- Impacto ambiental medible
- Reviews verificados de compradores

---

## 🛍️ FLUJO DEL COMPRADOR (CUSTOMER)

### Rol: `CUSTOMER` (antes `USER`)

### 1️⃣ **Registro e Inicio de Sesión**

**Archivo:** `app/auth/signin/page.tsx`, `app/api/auth/register/route.ts`

#### Opciones de Registro:
```
┌─────────────────────────┐
│   Crear Cuenta          │
├─────────────────────────┤
│ 1. Email + Password     │
│    - Validación mínimo  │
│      8 caracteres       │
│    - Hash con bcrypt    │
│                         │
│ 2. Google OAuth         │
│    - Login social       │
│    (configurado pero    │
│     no funcional aún)   │
└─────────────────────────┘
```

**Proceso:**
```typescript
POST /api/auth/register
Body: {
  name: "Ana García",
  email: "ana@example.com",
  password: "Password123"
}

Sistema automáticamente:
✅ Hash de password (bcrypt)
✅ Crea User en BD
✅ Asigna rol CUSTOMER por defecto
✅ Crea CustomerProfile vacío
✅ Inicia sesión automática
```

**Perfil Creado:**
```typescript
User {
  role: "CUSTOMER"
  userRoles: [{ role: "CUSTOMER", active: true }]
  customerProfile: {
    regenScore: 0
    loyaltyPoints: 0
    nftsCollected: []
  }
}
```

---

### 2️⃣ **Explorar el Marketplace**

**Archivo:** `app/marketplace/page.tsx`

#### Página Principal del Marketplace

**Componentes Visuales:**

```
┌────────────────────────────────────────────────────┐
│  HEADER (Navbar)                                   │
│  [Logo] [Search] [Cart] [User Menu]               │
├────────────────────────────────────────────────────┤
│                                                    │
│  CATEGORÍAS (Grid)                                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐│
│  │ ☀️  │ │ 💧  │ │ 🔋  │ │ ♻️  │ │ 💡  │ │ 🌬️ ││
│  │Solar│ │Agua │ │Movil│ │Resid│ │Ilum │ │Aire ││
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘│
│                                                    │
│  BARRA DE BÚSQUEDA Y FILTROS                      │
│  ┌──────────────────────────────────────────────┐ │
│  │ 🔍 Search sustainable products...            │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  FILTROS LATERALES        │  PRODUCTOS (Grid)     │
│  ├─ Ubicación             │  ┌────┐ ┌────┐ ┌────┐│
│  ├─ Certificaciones       │  │Prod│ │Prod│ │Prod││
│  ├─ Rango de Precio       │  │ 1  │ │ 2  │ │ 3  ││
│  ├─ REGEN Score           │  └────┘ └────┘ └────┘│
│  ├─ Solo en Stock         │                       │
│  └─ Solo Featured         │  ┌────┐ ┌────┐ ┌────┐│
│                           │  │Prod│ │Prod│ │Prod││
│                           │  │ 4  │ │ 5  │ │ 6  ││
│                           │  └────┘ └────┘ └────┘│
└────────────────────────────────────────────────────┘
```

**Características de los Productos Mostrados:**

```typescript
ProductCard muestra:
├── Imagen principal del producto
├── Nombre y descripción corta
├── Precio (con descuento si aplica)
├── Rating (⭐ promedio de reviews)
├── REGEN Score (barra de progreso)
├── Métricas de impacto:
│   ├── 🌍 CO₂ reducido: 45.2 kg
│   ├── 💧 Agua ahorrada: 12,450 L
│   └── ⚡ Energía: 89.5 kWh
├── Certificaciones (badges)
├── Vendor (nombre del vendedor)
├── Stock disponible
├── NFTs asociados (si tiene)
└── Botones:
    ├── [❤️ Agregar a Wishlist]
    └── [🛒 Agregar al Carrito]
```

**Búsqueda y Filtrado:**

```typescript
GET /api/products?
  search=panel solar      // Búsqueda de texto
  &category=Energía Solar // Filtro por categoría
  &featured=true          // Solo productos destacados
  &minPrice=500
  &maxPrice=5000
  &minRegenScore=70       // Productos con alto impacto

Respuesta:
{
  success: true,
  data: [
    {
      id: "prod_123",
      name: "Panel Solar 300W",
      price: 2999.00,
      regenScore: 85,
      co2Reduction: 150.5,
      vendor: {
        companyName: "EcoTech Solutions",
        location: "México, CDMX"
      },
      // ... más datos
    }
  ]
}
```

---

### 3️⃣ **Ver Detalle de Producto**

**Archivo:** `app/marketplace/products/[id]/page.tsx`

```
┌──────────────────────────────────────────────────────────┐
│  GALERÍA DE IMÁGENES                                     │
│  ┌──────────────────┐  ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│  │                  │  │Img│ │Img│ │Img│ │Img│         │
│  │  Imagen Grande   │  │ 1 │ │ 2 │ │ 3 │ │ 4 │         │
│  │                  │  └───┘ └───┘ └───┘ └───┘         │
│  └──────────────────┘                                    │
│                                                          │
│  INFORMACIÓN DEL PRODUCTO                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Panel Solar 300W Certificado                     │   │
│  │ ⭐⭐⭐⭐⭐ 4.8 (127 reviews)                      │   │
│  │                                                  │   │
│  │ $2,999.00 MXN    (antes $3,499.00) -14%        │   │
│  │                                                  │   │
│  │ REGEN Score: 85/100 ████████████░░░             │   │
│  │                                                  │   │
│  │ 📋 Certificaciones:                             │   │
│  │ [ISO 14001] [FSC] [Fair Trade]                 │   │
│  │                                                  │   │
│  │ 🌍 Impacto Ambiental:                           │   │
│  │ • CO₂ reducido: 150.5 kg/año                   │   │
│  │ • Agua ahorrada: 0 L                           │   │
│  │ • Energía generada: 300 kWh/mes                │   │
│  │                                                  │   │
│  │ 📦 Stock: 25 unidades disponibles              │   │
│  │ 🚚 Envío gratis en compras mayores a $500     │   │
│  │                                                  │   │
│  │ Cantidad: [▼ 1 ]                                │   │
│  │                                                  │   │
│  │ [🛒 Agregar al Carrito]  [❤️ Wishlist]        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  DESCRIPCIÓN DETALLADA                                   │
│  Material: Silicio monocristalino                       │
│  Dimensiones: 165 x 99 x 4 cm                           │
│  Peso: 18.5 kg                                          │
│  Origen: Alemania                                       │
│  ...                                                    │
│                                                          │
│  VENDEDOR                                                │
│  ┌────────────────────────────────────────────┐         │
│  │ EcoTech Solutions                          │         │
│  │ ⭐ 4.9 • CDMX, México                      │         │
│  │ 🏆 NFT Level: Árbol Maduro                │         │
│  │ [Ver más productos de este vendedor]      │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  REVIEWS Y CALIFICACIONES                                │
│  ⭐⭐⭐⭐⭐ 5.0 - Juan P. (Compra verificada)           │
│  "Excelente calidad, genera la energía prometida"      │
│  ...                                                    │
└──────────────────────────────────────────────────────────┘
```

---

### 4️⃣ **Gestionar Carrito**

**Sistema Dual:** Redux (local) + Base de Datos (persistente)

**Archivo:** `lib/store/slices/cartSlice.ts`, `app/api/cart/route.ts`

#### Agregar al Carrito

```typescript
// Frontend (Redux)
dispatch(addToCart({
  productId: "prod_123",
  quantity: 2,
  price: 2999.00,
  name: "Panel Solar 300W",
  image: "url...",
  vendor: "EcoTech Solutions"
}))

// Backend (Persistencia)
POST /api/cart
Body: {
  userId: "user_456",
  productId: "prod_123",
  quantity: 2
}

Sistema automáticamente:
✅ Valida stock disponible
✅ Crea o actualiza CartItem en BD
✅ Constraint: un producto por usuario (unique)
✅ Calcula totales
```

**Cart Sidebar:**

```
┌─────────────────────────┐
│  🛒 CARRITO (3)        │
├─────────────────────────┤
│ Panel Solar 300W       │
│ x2    $5,998.00        │
│ [−][+] [🗑️]           │
├─────────────────────────┤
│ Cargador EV            │
│ x1    $1,299.00        │
│ [−][+] [🗑️]           │
├─────────────────────────┤
│ Batería Solar          │
│ x1      $899.00        │
│ [−][+] [🗑️]           │
├─────────────────────────┤
│ Subtotal:   $8,196.00  │
│ Envío:         $99.00  │
│ IVA (16%): $1,311.36   │
├─────────────────────────┤
│ TOTAL:     $9,606.36   │
├─────────────────────────┤
│ [💳 Proceder a Pagar]  │
└─────────────────────────┘
```

---

### 5️⃣ **Proceso de Checkout (4 Pasos)**

**Archivo:** `app/checkout/page.tsx`

```
PASO 1: REVISAR CARRITO
┌────────────────────────────────────────────┐
│ 📋 Revisar Productos                       │
├────────────────────────────────────────────┤
│ • Panel Solar 300W x2    $5,998.00        │
│ • Cargador EV x1         $1,299.00        │
│ • Batería Solar x1         $899.00        │
├────────────────────────────────────────────┤
│ [Continuar a Envío →]                      │
└────────────────────────────────────────────┘

↓

PASO 2: DIRECCIÓN DE ENVÍO
┌────────────────────────────────────────────┐
│ 🚚 Información de Envío                    │
├────────────────────────────────────────────┤
│ Nombre: [Ana García              ]        │
│ Email:  [ana@example.com         ]        │
│ Teléfono: [55 1234 5678          ]        │
│ Calle:  [Av. Reforma 123         ]        │
│ Ciudad: [México                  ]        │
│ Estado: [CDMX ▼]                          │
│ CP:     [06600                   ]        │
│ País:   [México ▼]                        │
│                                            │
│ ☐ Usar como dirección de facturación     │
│                                            │
│ Método de envío:                          │
│ • Estándar (3-5 días) - $99.00           │
│ • Express (1-2 días)  - $199.00          │
│                                            │
│ [← Volver] [Continuar a Pago →]          │
└────────────────────────────────────────────┘

↓

PASO 3: MÉTODO DE PAGO (STRIPE)
┌────────────────────────────────────────────┐
│ 💳 Información de Pago                     │
├────────────────────────────────────────────┤
│ Selecciona método de pago:                │
│                                            │
│ ○ 💳 Tarjeta de Crédito/Débito           │
│   ┌──────────────────────────────────────┐│
│   │ Número de tarjeta                    ││
│   │ [1234 5678 9012 3456]                ││
│   │                                      ││
│   │ Vencimiento         CVC              ││
│   │ [12/26]            [123]             ││
│   │                                      ││
│   │ Nombre en la tarjeta                 ││
│   │ [ANA GARCIA                ]         ││
│   └──────────────────────────────────────┘│
│                                            │
│ ○ PayPal (próximamente)                   │
│ ○ OXXO (próximamente)                     │
│ ○ Transferencia (próximamente)            │
│                                            │
│ 🔒 Pago 100% seguro con Stripe           │
│                                            │
│ [← Volver] [Continuar →]                  │
└────────────────────────────────────────────┘

↓

PASO 4: CONFIRMACIÓN
┌────────────────────────────────────────────┐
│ ✅ Confirmar Pedido                        │
├────────────────────────────────────────────┤
│ 📦 Resumen del Pedido                     │
│                                            │
│ Productos (3 artículos):      $8,196.00  │
│ Envío:                           $99.00  │
│ IVA (16%):                    $1,311.36  │
│ ═══════════════════════════════════════   │
│ TOTAL:                        $9,606.36  │
│                                            │
│ 🚚 Enviar a:                              │
│ Ana García                                │
│ Av. Reforma 123, CDMX                     │
│ 06600, México                             │
│                                            │
│ 💳 Pago con:                              │
│ Visa •••• 3456                            │
│                                            │
│ 🌱 Tu impacto:                            │
│ • CO₂ ahorrado: 150.5 kg                 │
│ • Agua ahorrada: 12,450 L                │
│                                            │
│ [← Volver] [🛒 Confirmar Pedido]         │
└────────────────────────────────────────────┘
```

**Flujo de Backend:**

```typescript
// Al confirmar pedido
POST /api/orders/create
Body: {
  items: [
    { productId: "prod_123", quantity: 2 },
    { productId: "prod_456", quantity: 1 }
  ],
  shippingAddress: { ... },
  paymentMethod: { type: "card", ... }
}

Sistema realiza:
1. ✅ Valida autenticación (role: CUSTOMER)
2. ✅ Valida productos y stock
3. ✅ Agrupa items por vendedor (multi-vendor)
   - Vendedor A: Panel Solar
   - Vendedor B: Cargador + Batería
4. ✅ Calcula totales por vendedor
   - Subtotal proporcional
   - Envío proporcional (gratis si >$500)
   - IVA 16% por vendedor
5. ✅ Crea Payment Intent en Stripe
   {
     amount: 960636, // centavos
     currency: "mxn",
     metadata: {
       userId: "user_456",
       orderCount: 2 // 2 órdenes (2 vendedores)
     }
   }
6. ✅ Crea 2 órdenes en BD (una por vendedor)
   Order 1: {
     userId: "user_456",
     vendorUserId: "vendor_a",
     status: "PENDING",
     paymentStatus: "PENDING",
     stripePaymentId: "pi_xxxx",
     total: 6097.36,
     items: [{ productId: "prod_123", quantity: 2 }]
   }
   Order 2: { vendorUserId: "vendor_b", ... }
7. ✅ Reserva stock (decrementa temporalmente)
8. ✅ Crea notificaciones
   - Para usuario: "Pedido creado"
   - Para vendedores: "Nueva orden recibida"
9. ✅ Retorna clientSecret para Stripe

Respuesta:
{
  success: true,
  data: {
    orders: [order1, order2],
    paymentIntent: {
      clientSecret: "pi_xxx_secret_xxx"
    }
  }
}

Frontend:
- Usa clientSecret para confirmar pago con Stripe
- stripe.confirmCardPayment(clientSecret)
- Espera webhook de confirmación
```

**Webhook de Stripe:**

```typescript
POST /api/webhooks/stripe
Headers: { stripe-signature: "xxx" }

Sistema escucha eventos:
- payment_intent.succeeded → Marcar orden como PAID
- payment_intent.failed → Restaurar stock, cancelar
- charge.refunded → Procesar devolución

Proceso de éxito:
1. Verificar firma webhook
2. Buscar órdenes por stripePaymentId
3. Actualizar orden:
   {
     paymentStatus: "PAID",
     status: "PROCESSING"
   }
4. Enviar email de confirmación (pendiente)
5. Notificar a vendedor (pendiente)
```

---

### 6️⃣ **Dashboard del Cliente**

**Archivo:** `app/dashboard/page.tsx`

```
┌────────────────────────────────────────────────────────────┐
│  DASHBOARD - BIENVENIDO ANA GARCÍA                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🌱 TU IMPACTO AMBIENTAL                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │   💧     │ │    ⚡    │ │   🏆     │ │   🌍    │    │
│  │  12,450  │ │   89.5   │ │    3     │ │  45.2   │    │
│  │  litros  │ │   kWh    │ │ árboles  │ │ kg CO₂  │    │
│  │ ahorrados│ │generados │ │plantados │ │ahorrado │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                            │
│  📦 ÓRDENES RECIENTES                                     │
│  ┌────────────────────────────────────────────────────┐   │
│  │ #ORD-001  |  15 Mar 2024  |  $299.99  | ✅ Entregado│  │
│  │ EcoTech Solutions • 2 artículos                    │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ #ORD-002  |  10 Mar 2024  |  $149.99  | 🚚 Enviado │  │
│  │ Green Living Co. • 1 artículo                      │   │
│  └────────────────────────────────────────────────────┘   │
│  [Ver Todas las Órdenes →]                                │
│                                                            │
│  🎯 META DE SOSTENIBILIDAD                                │
│  CO₂ Target: 100 kg                                       │
│  ████████████░░░░░░░░░░ 45% (45.2 kg)                    │
│                                                            │
│  ⚡ ACCIONES RÁPIDAS                                      │
│  [🛍️ Explorar]  [📦 Órdenes]  [❤️ Wishlist]  [📊 Impacto]│
│                                                            │
│  💡 ¿QUIERES SER VENDEDOR?                                │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 🌟 Convierte tu pasión eco-friendly en negocio    │   │
│  │ [🚀 Solicitar ser Vendedor]                       │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

**Funcionalidades del Dashboard:**

1. **Vista de Impacto Ambiental**
   - Métricas acumuladas de todas las compras
   - Visualización de CO₂, agua, energía
   - Progreso hacia metas personales

2. **Historial de Órdenes**
   - Lista de órdenes pasadas
   - Estado en tiempo real
   - Tracking de envío
   - Opción de recomprar

3. **Lista de Deseos (Wishlist)**
   ```
   GET /api/wishlist
   - Productos guardados para después
   - Notificaciones de cambio de precio
   - Notificaciones de stock
   ```

4. **Perfil de Usuario**
   ```
   /dashboard/profile
   - Editar información personal
   - Direcciones guardadas
   - Métodos de pago
   - Preferencias de notificación
   ```

5. **Configuración**
   ```
   /dashboard/settings
   - Notificaciones (email, push)
   - Privacidad
   - Seguridad (cambiar password)
   ```

---

### 7️⃣ **Seguimiento de Órdenes**

**Archivo:** `app/dashboard/orders/page.tsx`

```
┌──────────────────────────────────────────────────────┐
│  MIS ÓRDENES                                         │
├──────────────────────────────────────────────────────┤
│  Filtros: [Todas ▼] [Últimos 30 días ▼]            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ORDEN #ORD-00123                                   │
│  ┌────────────────────────────────────────────────┐ │
│  │ 📅 15 de Marzo, 2024                          │ │
│  │ 💰 Total: $299.99 MXN                         │ │
│  │ 🏪 Vendedor: EcoTech Solutions                │ │
│  │                                                │ │
│  │ Estado: ✅ ENTREGADO                          │ │
│  │                                                │ │
│  │ Timeline:                                      │ │
│  │ ✅ Pedido creado      - 15 Mar 10:30         │ │
│  │ ✅ Pago confirmado    - 15 Mar 10:32         │ │
│  │ ✅ En preparación     - 15 Mar 14:00         │ │
│  │ ✅ Enviado           - 16 Mar 09:00          │ │
│  │    📦 Tracking: 1234567890                   │ │
│  │ ✅ Entregado         - 18 Mar 15:30          │ │
│  │                                                │ │
│  │ Productos:                                     │ │
│  │ • Panel Solar 300W x2                         │ │
│  │                                                │ │
│  │ [Ver Detalles] [Descargar Factura] [Reseña]  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ORDEN #ORD-00122                                   │
│  ┌────────────────────────────────────────────────┐ │
│  │ 📅 10 de Marzo, 2024                          │ │
│  │ 💰 Total: $149.99 MXN                         │ │
│  │ 🏪 Vendedor: Green Living Co.                 │ │
│  │                                                │ │
│  │ Estado: 🚚 EN CAMINO                          │ │
│  │                                                │ │
│  │ Entrega estimada: 20 de Marzo                 │ │
│  │ 📦 Tracking: DHL987654321                     │ │
│  │                                                │ │
│  │ [Rastrear Envío] [Contactar Vendedor]        │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Estados de Orden:**
```typescript
enum OrderStatus {
  PENDING       // Creada, esperando pago
  PROCESSING    // Pago confirmado, en preparación
  SHIPPED       // Enviada
  DELIVERED     // Entregada
  CANCELLED     // Cancelada
}

enum PaymentStatus {
  PENDING       // Esperando pago
  PAID          // Pagado
  FAILED        // Fallo en pago
  REFUNDED      // Reembolsado
}
```

---

## 🏪 FLUJO DEL VENDEDOR (VENDOR)

### Rol: `VENDOR`

### 1️⃣ **Solicitar ser Vendedor**

**Archivo:** `app/onboarding/page.tsx`, `app/api/vendor/onboarding/route.ts`

#### Proceso de Onboarding (4 Pasos)

```
PASO 1: BIENVENIDA
┌──────────────────────────────────────────────┐
│  ¡Bienvenido a Urbanika Marketplace! 🎉     │
├──────────────────────────────────────────────┤
│                                              │
│  Únete a nuestra comunidad de vendedores    │
│  sostenibles                                 │
│                                              │
│  ┌────────────┐ ┌────────────┐ ┌──────────┐│
│  │  🏪 Vende  │ │ 🏆 NFT     │ │ 📈 Crece ││
│  │  Productos │ │Certificado │ │ Negocio  ││
│  └────────────┘ └────────────┘ └──────────┘│
│                                              │
│  [Comenzar Registro →]                      │
└──────────────────────────────────────────────┘

↓

PASO 2: INFORMACIÓN DEL NEGOCIO
┌──────────────────────────────────────────────┐
│  📋 Información de tu Negocio                │
├──────────────────────────────────────────────┤
│                                              │
│ Nombre de la Empresa *                      │
│ [EcoTech Solutions              ]           │
│                                              │
│ Tipo de Negocio *                           │
│ [Empresa ▼]                                 │
│ • Persona Física                            │
│ • Empresa                                   │
│ • Cooperativa                               │
│                                              │
│ Descripción del Negocio *                   │
│ [Descripción detallada...       ]           │
│                                              │
│ Sitio Web (opcional)                        │
│ [https://ecotech.com            ]           │
│                                              │
│ Teléfono de Contacto *                      │
│ [55 1234 5678                   ]           │
│                                              │
│ RFC (México) *                              │
│ [XAXX010101000                  ]           │
│                                              │
│ Dirección Fiscal *                          │
│ Calle: [Av. Reforma 123         ]           │
│ Ciudad: [México CDMX            ]           │
│ CP: [06600                      ]           │
│                                              │
│ Categorías de Productos *                   │
│ ☑ Energía Solar                            │
│ ☑ Gestión de Agua                          │
│ ☐ Movilidad Eléctrica                      │
│ ☐ Gestión de Residuos                      │
│                                              │
│ [← Volver] [Continuar →]                    │
└──────────────────────────────────────────────┘

↓

PASO 3: EDUCACIÓN NFT Y RECOMPENSAS
┌──────────────────────────────────────────────┐
│  🏆 Sistema de NFTs y Recompensas            │
├──────────────────────────────────────────────┤
│                                              │
│  ¿Cómo funciona?                            │
│                                              │
│  1️⃣ Al ser aprobado recibes tu primer NFT │
│     "Semilla Verde"                         │
│                                              │
│  2️⃣ Tu NFT evoluciona según tu impacto:   │
│     • Ventas generadas                      │
│     • REGEN Score promedio                  │
│     • Reviews de clientes                   │
│     • Impacto ambiental total               │
│                                              │
│  3️⃣ Niveles de NFT:                        │
│     🌱 Semilla Verde (Inicio)               │
│     🌿 Brote (500+ kg CO₂)                  │
│     🌳 Árbol Maduro (2000+ kg CO₂)          │
│                                              │
│  4️⃣ Beneficios por nivel:                  │
│     • Mayor visibilidad en búsquedas       │
│     • Badge especial en tus productos       │
│     • Comisión reducida                     │
│     • Prioridad en soporte                  │
│                                              │
│  [← Volver] [Continuar →]                   │
└──────────────────────────────────────────────┘

↓

PASO 4: CONFIRMACIÓN Y ENVÍO
┌──────────────────────────────────────────────┐
│  ✅ ¡Listo!                                  │
├──────────────────────────────────────────────┤
│                                              │
│  Tu solicitud ha sido enviada               │
│                                              │
│  📋 Resumen:                                │
│  • Empresa: EcoTech Solutions               │
│  • RFC: XAXX010101000                       │
│  • Categorías: Energía Solar, Agua          │
│                                              │
│  ⏳ ¿Qué sigue?                             │
│                                              │
│  1. Nuestro equipo revisará tu solicitud   │
│     (24-48 horas)                           │
│                                              │
│  2. Recibirás un email con el resultado    │
│                                              │
│  3. Si eres aprobado, podrás acceder a tu │
│     dashboard de vendedor                   │
│                                              │
│  [Ir a Mi Dashboard]                        │
└──────────────────────────────────────────────┘
```

**Proceso en Backend:**

```typescript
POST /api/vendor/onboarding
Body: {
  companyName: "EcoTech Solutions",
  businessType: "COMPANY",
  description: "...",
  website: "https://ecotech.com",
  phone: "5512345678",
  taxId: "XAXX010101000",
  businessAddress: {
    street: "Av. Reforma 123",
    city: "México CDMX",
    zipCode: "06600",
    country: "México"
  },
  categories: ["Energía Solar", "Gestión de Agua"]
}

Sistema realiza:
1. ✅ Valida autenticación (usuario logueado)
2. ✅ Valida que NO tenga solicitud activa
3. ✅ Crea VendorApplication:
   {
     userId: "user_456",
     companyName: "EcoTech Solutions",
     status: "PENDING",  // Esperando revisión admin
     onboardingStatus: "SUBMITTED",
     verificationStatus: "PENDING",
     submittedAt: "2024-03-20T10:30:00Z"
   }
4. ✅ Crea notificación para admins:
   "Nueva solicitud de vendedor: EcoTech Solutions"
5. ✅ Envía email al solicitante (pendiente):
   "Tu solicitud ha sido recibida"

Respuesta:
{
  success: true,
  message: "Solicitud enviada exitosamente",
  application: { ... }
}
```

**Estados de la Aplicación:**

```typescript
VendorApplication {
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED"
  onboardingStatus: "PENDING" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED"
  verificationStatus: "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED"
  rejectionReason?: string
}
```

---

### 2️⃣ **Espera de Aprobación**

Mientras el admin revisa, el usuario ve en su dashboard:

```
┌──────────────────────────────────────────────────────┐
│  📋 SOLICITUD DE VENDEDOR EN PROCESO                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ⏳ Tu solicitud está siendo revisada               │
│                                                      │
│  Estado: PENDING                                     │
│  Enviada: 20 de Marzo, 2024                        │
│                                                      │
│  ¿Qué estamos revisando?                            │
│  ✓ Información de la empresa                        │
│  ✓ Categorías de productos                          │
│  ⌛ Verificación fiscal                             │
│  ⌛ Validación de identidad                         │
│                                                      │
│  Tiempo estimado: 24-48 horas                       │
│                                                      │
│  [Contactar Soporte]                                │
└──────────────────────────────────────────────────────┘
```

**Hook Custom:**

```typescript
// hooks/useVendorStatus.ts
export function useVendorStatus() {
  const { data: session } = useSession()

  // Consulta estado del vendedor
  const { data, isLoading } = useQuery({
    queryKey: ['vendorStatus', session?.user?.id],
    queryFn: () => fetch('/api/user/vendor-status').then(r => r.json())
  })

  return {
    status: data?.status,        // 'not_applied', 'pending', 'approved', 'rejected'
    hasVendorRole: data?.hasVendorRole,
    application: data?.application,
    vendorProfile: data?.vendorProfile,
    isLoading
  }
}
```

---

### 3️⃣ **Aprobación por Admin**

Ver sección de [Flujo del Admin](#-flujo-del-administrador-admin)

Una vez aprobado:

```typescript
Sistema realiza:
1. ✅ Actualiza VendorApplication:
   {
     status: "APPROVED",
     verificationStatus: "VERIFIED",
     approvedAt: "2024-03-21T15:00:00Z",
     approvedBy: "admin_id"
   }
2. ✅ Crea VendorProfile:
   {
     userId: "user_456",
     companyName: "EcoTech Solutions",
     regenScore: 0,
     nftLevel: "Semilla Verde",
     totalProducts: 0,
     totalSales: 0,
     monthlyRevenue: 0,
     verified: true,
     active: true
   }
3. ✅ Asigna rol VENDOR al usuario:
   UserRole {
     userId: "user_456",
     role: "VENDOR",
     active: true
   }
4. ✅ Crea notificación para el usuario:
   "¡Felicidades! Tu solicitud ha sido aprobada"
5. ✅ Envía email de bienvenida (pendiente)
6. ✅ Genera NFT inicial "Semilla Verde" (concepto)
```

---

### 4️⃣ **Dashboard del Vendedor**

**Archivo:** `app/dashboard/vendor/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  DASHBOARD VENDEDOR - ECOTECH SOLUTIONS                      │
│  🏆 NFT Level: Semilla Verde 🌱                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ⚡ ACCIONES RÁPIDAS                                        │
│  [➕ Crear Producto] [📦 Ver Órdenes] [📊 Analytics]        │
│                                                              │
│  📊 ESTADÍSTICAS                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────┐│
│  │   📦         │ │   💰         │ │   🛒         │ │  ⭐ ││
│  │   25         │ │   $45,280    │ │   12         │ │ 4.8 ││
│  │ Productos    │ │ Ventas/Mes   │ │  Órdenes     │ │Rating││
│  │   Activos    │ │  +18.4%      │ │  Pendientes  │ │127  ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────┘│
│                                                              │
│  🛒 ÓRDENES RECIENTES                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ #ORD-00145  |  20 Mar  |  $2,999  | 🟡 PENDIENTE   │   │
│  │ Cliente: Ana García • Panel Solar 300W x2           │   │
│  │ [Ver Detalles] [Marcar como Procesada]              │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ #ORD-00144  |  19 Mar  |  $1,299  | 🔵 PROCESANDO  │   │
│  │ Cliente: Juan Pérez • Cargador EV x1                │   │
│  │ [Ver Detalles] [Actualizar Tracking]                │   │
│  └──────────────────────────────────────────────────────┘   │
│  [Ver Todas las Órdenes →]                                  │
│                                                              │
│  📈 RESUMEN DE RENDIMIENTO                                  │
│  • Productos más vendidos: Panel Solar 300W               │
│  • Nuevos clientes este mes: 8                             │
│  • Nuevas reseñas: 12                                      │
│  • Tasa de conversión: 3.2%                                │
│                                                              │
│  💡 CONSEJOS PARA VENDER                                    │
│  ✓ Sube fotos de alta calidad de tus productos            │
│  ✓ Describe detalladamente los beneficios sostenibles     │
│  ✓ Responde rápido a las preguntas de los clientes        │
│  ✓ Mantén tu inventario actualizado                        │
│                                                              │
│  🔗 GESTIÓN RÁPIDA                                          │
│  [📦 Mis Productos] [👥 Clientes] [📄 Reportes] [⚙️ Config]│
└──────────────────────────────────────────────────────────────┘
```

**Métricas del Dashboard:**

```typescript
GET /api/vendor/dashboard

Respuesta:
{
  stats: {
    totalProducts: 25,
    activeProducts: 23,
    totalOrders: 156,
    pendingOrders: 12,
    monthlyRevenue: 45280.50,
    revenueGrowth: 18.4,
    averageRating: 4.8,
    totalReviews: 127
  },
  recentOrders: [
    {
      id: "ord_145",
      customer: "Ana García",
      total: 2999.00,
      status: "PENDING",
      date: "2024-03-20"
    }
  ],
  lowStockProducts: [
    {
      id: "prod_78",
      name: "Panel Solar 300W",
      stock: 3,
      minStock: 5
    }
  ],
  topProducts: [
    {
      id: "prod_123",
      name: "Panel Solar 300W",
      salesCount: 45,
      revenue: 134955.00
    }
  ]
}
```

---

### 5️⃣ **Gestión de Inventario**

**Archivo:** `app/dashboard/vendor/inventory/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  INVENTARIO                                                  │
│  [➕ Crear Producto]  [📥 Importar]  [🔍 Buscar...]         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Filtros: [Todos ▼] [Activos] [Bajo Stock] [Agotados]      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🖼️ [Imagen]                                            │ │
│  │                                                         │ │
│  │ Panel Solar 300W                          ✅ Activo    │ │
│  │ SKU: ECO-PS300W-001                                    │ │
│  │ Categoría: Energía Solar                               │ │
│  │                                                         │ │
│  │ Precio: $2,999.00  (antes $3,499.00)                  │ │
│  │ Stock: 25 unidades                                     │ │
│  │ Vendidos: 45 unidades                                  │ │
│  │ REGEN Score: 85/100                                    │ │
│  │                                                         │ │
│  │ Impacto:                                               │ │
│  │ • CO₂ reducido: 150.5 kg/año                          │ │
│  │ • Energía generada: 300 kWh/mes                       │ │
│  │                                                         │ │
│  │ [✏️ Editar] [👁️ Ver] [❌ Desactivar] [📊 Analytics]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🖼️ [Imagen]                                            │ │
│  │                                                         │ │
│  │ Cargador para Vehículo Eléctrico     ⚠️ Bajo Stock   │ │
│  │ SKU: ECO-EVCH-001                                      │ │
│  │ Categoría: Movilidad Eléctrica                         │ │
│  │                                                         │ │
│  │ Precio: $1,299.00                                      │ │
│  │ Stock: 3 unidades ⚠️                                   │ │
│  │ Stock mínimo: 5                                        │ │
│  │                                                         │ │
│  │ [🔔 Alerta de Stock Bajo]                             │ │
│  │ [✏️ Editar] [➕ Agregar Stock]                         │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Crear/Editar Producto:**

```typescript
POST /api/vendor/products
Body: {
  name: "Panel Solar 300W",
  description: "Panel solar monocristalino de alta eficiencia...",
  price: 2999.00,
  originalPrice: 3499.00,
  sku: "ECO-PS300W-001",
  category: "Energía Solar",
  subcategory: "Paneles Solares",
  images: [
    "https://storage.com/panel1.jpg",
    "https://storage.com/panel2.jpg"
  ],
  stock: 25,
  minStock: 5,
  maxOrderQuantity: 10,

  // Métricas de sostenibilidad
  regenScore: 85,
  certifications: ["ISO 14001", "FSC", "Fair Trade"],
  co2Reduction: 150.5,
  waterSaving: 0,
  energyEfficiency: 300,

  // Información adicional
  dimensions: {
    length: 165,
    width: 99,
    height: 4,
    weight: 18.5
  },
  materials: ["Silicio monocristalino", "Vidrio templado"],
  origin: "Alemania",

  featured: false,
  active: true
}

Sistema valida:
✅ Autenticación (rol VENDOR)
✅ Campos requeridos
✅ SKU único
✅ Precio > 0
✅ Stock >= 0
✅ Imágenes (mínimo 1)
✅ REGEN Score (0-100)

Crea/Actualiza Product:
{
  vendorUserId: "user_456", // ID del vendedor
  ...campos
}

Respuesta:
{
  success: true,
  data: { productId: "prod_789", ... }
}
```

---

### 6️⃣ **Gestión de Órdenes**

**Archivo:** `app/dashboard/vendor/orders/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  ÓRDENES                                                     │
│  Filtros: [Todas ▼] [Pendientes] [En Proceso] [Enviadas]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ORDEN #ORD-00145                         🟡 PENDIENTE      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 📅 20 de Marzo, 2024 - 10:30 AM                        │ │
│  │ 👤 Cliente: Ana García (ana@example.com)               │ │
│  │ 💰 Total: $5,998.00 MXN                                │ │
│  │                                                         │ │
│  │ Productos:                                              │ │
│  │ • Panel Solar 300W x2 - $2,999.00 c/u                 │ │
│  │                                                         │ │
│  │ 📍 Dirección de Envío:                                 │ │
│  │ Ana García                                             │ │
│  │ Av. Reforma 123, CDMX                                  │ │
│  │ 06600, México                                          │ │
│  │ Tel: 55 1234 5678                                      │ │
│  │                                                         │ │
│  │ 💳 Pago:                                               │ │
│  │ Status: ✅ PAID                                        │ │
│  │ Método: Visa •••• 3456                                │ │
│  │                                                         │ │
│  │ [📦 Marcar como En Proceso]                           │ │
│  │ [📋 Imprimir Etiqueta de Envío]                       │ │
│  │ [✉️ Contactar Cliente]                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ORDEN #ORD-00144                         🔵 EN PROCESO     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 📅 19 de Marzo, 2024                                   │ │
│  │ 👤 Cliente: Juan Pérez                                 │ │
│  │ 💰 Total: $1,299.00 MXN                                │ │
│  │                                                         │ │
│  │ Productos:                                              │ │
│  │ • Cargador EV x1 - $1,299.00                          │ │
│  │                                                         │ │
│  │ 📦 Tracking Number:                                    │ │
│  │ [DHL987654321              ] [Guardar]                │ │
│  │                                                         │ │
│  │ [🚚 Marcar como Enviada]                              │ │
│  │ [📧 Enviar Notificación al Cliente]                   │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Actualizar Estado de Orden:**

```typescript
PATCH /api/vendor/orders/:orderId
Body: {
  status: "PROCESSING",  // o "SHIPPED", "DELIVERED"
  trackingNumber: "DHL987654321",
  estimatedDelivery: "2024-03-25"
}

Sistema realiza:
1. ✅ Valida que la orden pertenece al vendor
2. ✅ Actualiza Order en BD
3. ✅ Crea notificación para el cliente:
   "Tu orden #ORD-144 ha sido enviada"
4. ✅ Envía email al cliente (pendiente)
5. ✅ Si status = SHIPPED:
   - Actualiza tracking info
   - Calcula estimado de entrega

Respuesta:
{
  success: true,
  data: { order: { ...updatedOrder } }
}
```

---

### 7️⃣ **Analytics del Vendedor**

**Archivo:** `app/dashboard/vendor/analytics/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  ANALYTICS                                                   │
│  Período: [Últimos 30 días ▼]  [Comparar con período anterior]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 VENTAS                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Gráfico de Líneas (Revenue por día)                    │ │
│  │ $                                                       │ │
│  │ 5k│     ╱╲     ╱╲                                      │ │
│  │ 4k│    ╱  ╲   ╱  ╲                                     │ │
│  │ 3k│   ╱    ╲ ╱    ╲                                    │ │
│  │ 2k│  ╱      ╳      ╲                                   │ │
│  │ 1k│ ╱      ╱ ╲      ╲                                  │ │
│  │ 0 └────────────────────────────────────────            │ │
│  │    1  5  10  15  20  25  30 días                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Total Ventas: $45,280.50  (+18.4% vs mes anterior)        │
│  Órdenes: 156 (+12 vs mes anterior)                        │
│  Ticket Promedio: $290.26                                   │
│                                                              │
│  🏆 TOP PRODUCTOS (Por Revenue)                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1. Panel Solar 300W          45 ventas  $134,955.00   │ │
│  │ 2. Cargador EV               38 ventas   $49,362.00   │ │
│  │ 3. Batería Solar             32 ventas   $28,768.00   │ │
│  │ 4. Kit de Iluminación LED    28 ventas   $11,172.00   │ │
│  │ 5. Filtro de Agua            22 ventas    $8,778.00   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  📈 CONVERSIÓN                                              │
│  Visitas a productos: 14,256                                │
│  Add to Cart: 1,825 (12.8%)                                │
│  Checkout iniciado: 892 (6.3%)                              │
│  Compras completadas: 156 (1.1%)                            │
│                                                              │
│  ⭐ REVIEWS Y CALIFICACIONES                                │
│  Rating promedio: 4.8/5.0                                   │
│  Total reviews: 127                                         │
│  • 5 estrellas: 85 (67%)                                   │
│  • 4 estrellas: 32 (25%)                                   │
│  • 3 estrellas: 8 (6%)                                     │
│  • 2 estrellas: 2 (2%)                                     │
│  • 1 estrella: 0 (0%)                                      │
│                                                              │
│  🌍 IMPACTO AMBIENTAL GENERADO                             │
│  CO₂ total reducido: 6,772.5 kg                            │
│  Agua ahorrada: 456,780 L                                   │
│  Energía generada: 13,500 kWh                               │
│  Árboles equivalentes: 150                                  │
└──────────────────────────────────────────────────────────────┘
```

**API de Analytics:**

```typescript
GET /api/vendor/analytics?period=30d

Respuesta:
{
  revenue: {
    total: 45280.50,
    growth: 18.4,
    byDay: [
      { date: "2024-03-01", amount: 1200.00 },
      { date: "2024-03-02", amount: 1500.00 },
      // ...
    ]
  },
  orders: {
    total: 156,
    growth: 12,
    byStatus: {
      PENDING: 12,
      PROCESSING: 8,
      SHIPPED: 15,
      DELIVERED: 121
    }
  },
  topProducts: [
    {
      id: "prod_123",
      name: "Panel Solar 300W",
      salesCount: 45,
      revenue: 134955.00,
      averageRating: 4.9
    }
  ],
  conversion: {
    productViews: 14256,
    addToCart: 1825,
    checkoutStarted: 892,
    purchaseCompleted: 156,
    conversionRate: 1.1
  },
  impact: {
    co2Reduced: 6772.5,
    waterSaved: 456780,
    energyGenerated: 13500,
    treesEquivalent: 150
  }
}
```

---

### 8️⃣ **Perfil del Vendedor**

**Archivo:** `app/dashboard/vendor/profile/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  PERFIL DEL VENDEDOR                                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🏪 INFORMACIÓN DE LA EMPRESA                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Logo de la Empresa                                      │ │
│  │ [📷 Cambiar]                                            │ │
│  │                                                         │ │
│  │ Nombre de la Empresa                                    │ │
│  │ [EcoTech Solutions              ]                      │ │
│  │                                                         │ │
│  │ Descripción                                             │ │
│  │ [Somos líderes en soluciones...  ]                    │ │
│  │                                                         │ │
│  │ Sitio Web                                               │ │
│  │ [https://ecotech.com             ]                     │ │
│  │                                                         │ │
│  │ Teléfono                                                │ │
│  │ [55 1234 5678                    ]                     │ │
│  │                                                         │ │
│  │ RFC                                                     │ │
│  │ [XAXX010101000] (No editable)                          │ │
│  │                                                         │ │
│  │ [💾 Guardar Cambios]                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  🏆 NFT Y REPUTACIÓN                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ NFT Actual: 🌱 Semilla Verde                           │ │
│  │                                                         │ │
│  │ Progreso al siguiente nivel (Brote 🌿):                │ │
│  │ ████████░░░░░░░░░░░░ 45% (225/500 kg CO₂)             │ │
│  │                                                         │ │
│  │ Métricas:                                               │ │
│  │ • REGEN Score promedio: 78/100                         │ │
│  │ • Impacto total CO₂: 225 kg                            │ │
│  │ • Ventas totales: $45,280.50                           │ │
│  │ • Rating: ⭐⭐⭐⭐⭐ 4.8/5.0                           │ │
│  │ • Reviews: 127                                         │ │
│  │                                                         │ │
│  │ [Ver mi NFT en Blockchain]                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  📊 ESTADÍSTICAS PÚBLICAS                                   │
│  (Lo que los clientes ven)                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ • Miembro desde: Marzo 2024                            │ │
│  │ • Productos activos: 25                                │ │
│  │ • Órdenes completadas: 144                             │ │
│  │ • Rating: 4.8/5.0                                      │ │
│  │ • Responde en: < 2 horas promedio                      │ │
│  │ • Ubicación: México, CDMX                              │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 👨‍💼 FLUJO DEL ADMINISTRADOR (ADMIN)

### Rol: `ADMIN`

### 1️⃣ **Dashboard de Administración**

**Archivo:** `app/dashboard/admin/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  PANEL DE ADMINISTRACIÓN                                     │
│  Vista general y métricas de la plataforma                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 ESTADÍSTICAS PRINCIPALES                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │   👥         │ │   🏪         │ │   💰         │        │
│  │  1,247       │ │    89        │ │ $45,280.50   │        │
│  │  Usuarios    │ │ Vendedores   │ │  Revenue     │        │
│  │  +12.5% ↑   │ │  +8.3% ↑    │ │ +18.4% ↑    │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                              │
│  ⚠️ ALERTAS Y ACCIONES PENDIENTES                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🟡 Vendedores Pendientes de Aprobación                 │ │
│  │                                                         │ │
│  │ Hay 5 solicitudes de vendedores esperando revisión    │ │
│  │                                                         │ │
│  │ [Revisar Solicitudes →]                   Badge: [5]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  🏪 SOLICITUDES DE VENDEDORES RECIENTES                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ EcoTech Solutions               🟡 PENDING             │ │
│  │ juan.perez@ecotech.com                                 │ │
│  │ 20 de Marzo, 2024                                      │ │
│  │ [✅ Aprobar] [❌ Rechazar] [👁️ Ver Detalles]          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Green Living Co.                🟡 PENDING             │ │
│  │ maria@greenliving.com                                  │ │
│  │ 19 de Marzo, 2024                                      │ │
│  │ [✅ Aprobar] [❌ Rechazar] [👁️ Ver Detalles]          │ │
│  └────────────────────────────────────────────────────────┘ │
│  [Ver Todas las Solicitudes →]                              │
│                                                              │
│  🔧 ESTADO DEL SISTEMA                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │ 🟢 API  │ │ 🟢 BD   │ │ 🟢 Store│ │ ✅ 99.98%│         │
│  │Operativo│ │Operativo│ │Operativo│ │ Uptime  │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                              │
│  ⚡ ACCIONES RÁPIDAS                                        │
│  [👥 Gestionar Usuarios] [🏪 Gestionar Vendedores]         │
│  [📦 Gestionar Productos] [📊 Ver Analytics Completos]      │
└──────────────────────────────────────────────────────────────┘
```

**API del Dashboard:**

```typescript
GET /api/admin/dashboard

Requiere: Rol ADMIN

Respuesta:
{
  stats: {
    totalUsers: 1247,
    usersGrowth: 12.5,
    totalVendors: 89,
    vendorsGrowth: 8.3,
    platformRevenue: 45280.50,
    revenueGrowth: 18.4,
    totalProducts: 2456,
    totalOrders: 3892
  },
  pendingApplications: [
    {
      id: "app_123",
      companyName: "EcoTech Solutions",
      businessType: "COMPANY",
      status: "PENDING",
      submittedAt: "2024-03-20T10:30:00Z",
      user: {
        name: "Juan Pérez",
        email: "juan@ecotech.com"
      }
    }
  ],
  systemHealth: {
    apiStatus: "operational",
    databaseStatus: "operational",
    storageStatus: "operational",
    uptime: 99.98
  }
}
```

---

### 2️⃣ **Gestión de Solicitudes de Vendedores**

**Archivo:** `app/dashboard/admin/vendors/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  GESTIÓN DE VENDEDORES                                       │
│  Filtros: [Todos ▼] [Pendientes] [Aprobados] [Rechazados]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SOLICITUD #APP-00123                    🟡 PENDING         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🏪 EcoTech Solutions                                    │ │
│  │ 👤 Solicitante: Juan Pérez                             │ │
│  │ 📧 Email: juan.perez@ecotech.com                       │ │
│  │ 📅 Enviada: 20 de Marzo, 2024                         │ │
│  │                                                         │ │
│  │ 📋 INFORMACIÓN DEL NEGOCIO                             │ │
│  │ • Tipo: Empresa                                        │ │
│  │ • RFC: XAXX010101000                                   │ │
│  │ • Teléfono: 55 1234 5678                              │ │
│  │ • Sitio Web: https://ecotech.com                      │ │
│  │ • Ubicación: México, CDMX                             │ │
│  │                                                         │ │
│  │ • Categorías: Energía Solar, Gestión de Agua          │ │
│  │                                                         │ │
│  │ 📄 DESCRIPCIÓN:                                        │ │
│  │ "Somos líderes en soluciones sostenibles para el     │ │
│  │  sector energético. Con 10 años de experiencia..."    │ │
│  │                                                         │ │
│  │ 📂 DOCUMENTOS:                                         │ │
│  │ • Acta Constitutiva.pdf [Ver]                         │ │
│  │ • RFC Digital.pdf [Ver]                               │ │
│  │ • Identificación Oficial.pdf [Ver]                    │ │
│  │                                                         │ │
│  │ ACCIONES:                                              │ │
│  │ ┌──────────────────┐ ┌──────────────────┐            │ │
│  │ │ ✅ APROBAR       │ │ ❌ RECHAZAR      │            │ │
│  │ └──────────────────┘ └──────────────────┘            │ │
│  │                                                         │ │
│  │ Si Rechazar:                                           │ │
│  │ Motivo: [Documentación incompleta ▼]                  │ │
│  │ Comentarios: [                          ]             │ │
│  │ [Enviar Rechazo]                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  SOLICITUD #APP-00122                    ✅ APPROVED        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🏪 Green Living Co.                                    │ │
│  │ 👤 María González                                      │ │
│  │ ✅ Aprobada el: 19 de Marzo, 2024                     │ │
│  │ 👨‍💼 Por: Admin User                                  │ │
│  │                                                         │ │
│  │ [Ver Perfil de Vendedor] [Ver Productos]              │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Aprobar Solicitud:**

```typescript
POST /api/admin/vendors
Body: {
  applicationId: "app_123",
  action: "approve"
}

Requiere: Rol ADMIN

Sistema realiza:
1. ✅ Valida rol ADMIN
2. ✅ Busca VendorApplication
3. ✅ Inicia transacción:
   a) Actualiza VendorApplication:
      {
        status: "APPROVED",
        verificationStatus: "VERIFIED",
        approvedAt: now(),
        approvedBy: adminId
      }
   b) Crea VendorProfile:
      {
        userId: application.userId,
        companyName: application.companyName,
        businessType: application.businessType,
        verified: true,
        active: true,
        regenScore: 0,
        nftLevel: "Semilla Verde"
      }
   c) Asigna rol VENDOR:
      UserRole {
        userId: application.userId,
        role: "VENDOR",
        active: true
      }
4. ✅ Crea notificación para usuario:
   "¡Felicidades! Tu solicitud ha sido aprobada"
5. ✅ Envía email de bienvenida (pendiente)
6. ✅ Log de auditoría

Respuesta:
{
  success: true,
  message: "Vendedor aprobado exitosamente",
  vendor: { ...vendorProfile }
}
```

**Rechazar Solicitud:**

```typescript
POST /api/admin/vendors
Body: {
  applicationId: "app_123",
  action: "reject",
  reason: "incomplete_documentation",
  comments: "Falta acta constitutiva actualizada"
}

Sistema realiza:
1. ✅ Actualiza VendorApplication:
   {
     status: "REJECTED",
     verificationStatus: "REJECTED",
     rejectedAt: now(),
     rejectedBy: adminId,
     rejectionReason: "incomplete_documentation",
     rejectionComments: "..."
   }
2. ✅ Notifica al usuario:
   "Tu solicitud ha sido rechazada. Puedes volver a aplicar."
3. ✅ Envía email con detalles (pendiente)
4. ✅ Log de auditoría

El usuario puede volver a aplicar con nueva información.
```

---

### 3️⃣ **Gestión de Usuarios**

**Archivo:** `app/dashboard/admin/users/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  GESTIÓN DE USUARIOS                                         │
│  [🔍 Buscar por nombre, email...]  [➕ Crear Usuario]       │
│  Filtros: [Todos ▼] [Customers] [Vendors] [Admins]         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Total: 1,247 usuarios                                       │
│  • Customers: 1,150                                         │
│  • Vendors: 89                                              │
│  • Admins: 8                                                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 👤 Ana García                       👥 CUSTOMER        │ │
│  │ 📧 ana.garcia@email.com                                │ │
│  │ 📅 Miembro desde: 15 Ene 2024                         │ │
│  │ 📊 Órdenes: 12 | Total gastado: $2,847.50            │ │
│  │ 🌱 REGEN Score: 45                                     │ │
│  │                                                         │ │
│  │ [👁️ Ver Perfil] [✏️ Editar] [🚫 Suspender]            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 👤 Juan Pérez                       🏪 VENDOR          │ │
│  │ 📧 juan@ecotech.com                                    │ │
│  │ 🏪 Empresa: EcoTech Solutions                          │ │
│  │ 📅 Miembro desde: 20 Mar 2024                         │ │
│  │ 📦 Productos: 25 | Ventas: $45,280.50                │ │
│  │ ⭐ Rating: 4.8/5.0                                     │ │
│  │ 🏆 NFT: Semilla Verde 🌱                              │ │
│  │                                                         │ │
│  │ [👁️ Ver Dashboard Vendor] [🚫 Suspender]              │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Acciones de Admin:**
- Ver perfil completo de usuario
- Editar información
- Suspender/reactivar cuenta
- Cambiar roles
- Ver historial de órdenes
- Ver actividad reciente
- Resetear contraseña

---

### 4️⃣ **Gestión de Productos**

**Archivo:** `app/dashboard/admin/products/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  GESTIÓN DE PRODUCTOS                                        │
│  [🔍 Buscar productos...]                                    │
│  Filtros: [Todos ▼] [Activos] [Inactivos] [Reportados]     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Total: 2,456 productos activos                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🖼️ Panel Solar 300W                   ✅ Activo       │ │
│  │ 🏪 Vendedor: EcoTech Solutions                         │ │
│  │ 💰 Precio: $2,999.00                                   │ │
│  │ 📦 Stock: 25 unidades                                  │ │
│  │ ⭐ Rating: 4.9/5.0 (45 reviews)                        │ │
│  │ 🌱 REGEN Score: 85/100                                 │ │
│  │ 📊 Ventas: 45 unidades                                 │ │
│  │                                                         │ │
│  │ [👁️ Ver] [✏️ Editar] [🚫 Desactivar] [⚠️ Reportar]   │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Capacidades del Admin:**
- Ver todos los productos de la plataforma
- Desactivar productos que violen políticas
- Editar información si es necesario
- Marcar productos destacados (featured)
- Ver reportes de usuarios sobre productos
- Analytics de productos (más vendidos, etc.)

---

### 5️⃣ **Analytics Global de la Plataforma**

**Archivo:** `app/dashboard/admin/analytics/page.tsx`

```
┌──────────────────────────────────────────────────────────────┐
│  ANALYTICS DE LA PLATAFORMA                                  │
│  Período: [Últimos 30 días ▼]  [Comparar]  [Exportar PDF]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 RESUMEN EJECUTIVO                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Revenue  │ │  GMV     │ │ Orders   │ │New Users │      │
│  │$45,280.50│ │$452,805  │ │  3,892   │ │   247    │      │
│  │ +18.4% ↑ │ │ +22.1% ↑ │ │ +15.2% ↑ │ │ +12.5% ↑ │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│  📈 GRÁFICO DE REVENUE (30 días)                            │
│  [Gráfico de líneas interactivo]                            │
│                                                              │
│  🏆 TOP CATEGORÍAS                                          │
│  1. Energía Solar         $189,450  (41.8%)                │
│  2. Movilidad Eléctrica   $112,870  (24.9%)                │
│  3. Gestión de Agua        $78,920  (17.4%)                │
│  4. Gestión de Residuos    $45,280  (10.0%)                │
│  5. Iluminación            $26,285   (5.9%)                │
│                                                              │
│  🏪 TOP VENDEDORES                                          │
│  1. EcoTech Solutions   $45,280.50   ⭐ 4.8                │
│  2. Green Living Co.    $38,920.00   ⭐ 4.9                │
│  3. Solar Power MX      $32,150.00   ⭐ 4.7                │
│                                                              │
│  🌍 IMPACTO AMBIENTAL TOTAL DE LA PLATAFORMA               │
│  • CO₂ total reducido: 125,450 kg                          │
│  • Agua ahorrada: 8,945,600 L                               │
│  • Energía generada: 245,780 kWh                            │
│  • Árboles equivalentes: 2,789                              │
│                                                              │
│  👥 USUARIOS                                                │
│  • Usuarios activos: 1,247                                  │
│  • Tasa de retención: 78%                                   │
│  • Lifetime Value (LTV): $2,284                             │
│  • Cost per Acquisition (CPA): $145                         │
│                                                              │
│  🔄 CONVERSIÓN                                              │
│  Visitas: 145,678 → Cart: 12,456 → Checkout: 4,892 → Purchase: 3,892│
│  Tasa de conversión: 2.67%                                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 SISTEMAS TRANSVERSALES

### 1. **Sistema de Notificaciones**

**Modelo:** `Notification` en Prisma Schema

```typescript
Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl?: string
  metadata?: Json
  createdAt: DateTime
}

enum NotificationType {
  ORDER_CREATED
  ORDER_UPDATED
  ORDER_SHIPPED
  ORDER_DELIVERED
  PAYMENT_CONFIRMED
  PAYMENT_FAILED
  VENDOR_APPLICATION_SUBMITTED
  VENDOR_APPLICATION_APPROVED
  VENDOR_APPLICATION_REJECTED
  NEW_REVIEW
  LOW_STOCK
  SYSTEM
}
```

**Tipos de Notificaciones:**

**Para Customers:**
- Orden creada exitosamente
- Pago confirmado
- Orden enviada (con tracking)
- Orden entregada
- Nuevo producto de vendedor favorito

**Para Vendors:**
- Nueva orden recibida
- Stock bajo en producto
- Nueva review en producto
- Solicitud aprobada/rechazada
- Milestone alcanzado (NFT upgrade)

**Para Admins:**
- Nueva solicitud de vendedor
- Producto reportado
- Usuario suspendido
- Milestone de plataforma

**Implementación:**

```typescript
// Crear notificación
POST /api/notifications
Body: {
  userId: "user_123",
  type: "ORDER_SHIPPED",
  title: "Tu orden ha sido enviada",
  message: "La orden #ORD-145 está en camino",
  actionUrl: "/dashboard/orders/ord_145"
}

// Obtener notificaciones
GET /api/notifications?userId=user_123&unread=true

// Marcar como leída
PATCH /api/notifications/:id
Body: { read: true }
```

---

### 2. **Sistema de Reviews**

**Modelo:** `Review` en Prisma Schema

```typescript
Review {
  id: string
  userId: string
  productId: string
  rating: Int (1-5)
  comment?: string
  verified: boolean  // Compra verificada
  images?: string[]
  helpful: Int       // Votos útiles
  reported: boolean
  createdAt: DateTime
}
```

**Flujo de Review:**

```
1. Cliente compra producto
2. Orden entregada
3. Sistema envía notificación: "Deja tu review"
4. Cliente deja review (1-5 estrellas + comentario)
5. Sistema:
   ✅ Marca como verificado (compra confirmada)
   ✅ Actualiza averageRating del producto
   ✅ Incrementa reviewCount
   ✅ Notifica al vendedor
6. Otros usuarios pueden marcar review como "útil"
```

**API:**

```typescript
// Crear review
POST /api/reviews
Body: {
  productId: "prod_123",
  rating: 5,
  comment: "Excelente producto, llegó a tiempo",
  images: ["review_img_1.jpg"]
}

// Listar reviews de producto
GET /api/products/prod_123/reviews?page=1&limit=10

Respuesta:
{
  reviews: [
    {
      id: "rev_456",
      user: {
        name: "Ana G.",
        verified: true  // Compra verificada
      },
      rating: 5,
      comment: "...",
      helpful: 12,
      createdAt: "2024-03-20"
    }
  ],
  averageRating: 4.8,
  totalReviews: 127
}
```

---

### 3. **Sistema de Wishlist (Lista de Deseos)**

**Modelo:** `WishlistItem` en Prisma Schema

```typescript
WishlistItem {
  id: string
  userId: string
  productId: string
  addedAt: DateTime
  notifyPriceChange: boolean
  notifyBackInStock: boolean
}
```

**Funcionalidades:**

```typescript
// Agregar a wishlist
POST /api/wishlist
Body: {
  productId: "prod_123",
  notifyPriceChange: true,
  notifyBackInStock: true
}

// Listar wishlist
GET /api/wishlist?userId=user_456

Respuesta:
{
  items: [
    {
      id: "wish_789",
      product: {
        id: "prod_123",
        name: "Panel Solar 300W",
        price: 2999.00,
        originalPrice: 3499.00,
        inStock: true,
        image: "..."
      },
      addedAt: "2024-03-15",
      priceChange: -500.00  // Bajó de precio
    }
  ]
}

// Sistema notifica:
✉️ "¡El Panel Solar que te interesa bajó de precio!"
✉️ "El Cargador EV volvió a estar en stock"
```

---

### 4. **Sistema de Búsqueda**

**Actualmente:** Búsqueda básica con SQL `LIKE`

```typescript
GET /api/products?search=panel solar

// Query en backend
prisma.product.findMany({
  where: {
    OR: [
      { name: { contains: "panel solar", mode: "insensitive" } },
      { description: { contains: "panel solar", mode: "insensitive" } }
    ],
    active: true
  }
})
```

**Planeado (Algolia):**
- Búsqueda instantánea
- Typo tolerance ("panl sola" → "panel solar")
- Sinónimos ("eco" → "ecológico, sostenible")
- Filtros facetados dinámicos
- Relevancia inteligente

---

### 5. **Sistema de Pagos (Stripe)**

**Flujo Completo:**

```
1. Cliente confirma orden
   ↓
2. Backend crea Payment Intent
   POST /api/orders/create
   ↓
   Sistema llama a Stripe:
   stripe.paymentIntents.create({
     amount: 960636, // centavos
     currency: "mxn",
     metadata: { userId, orderId }
   })
   ↓
   Retorna clientSecret

3. Frontend confirma pago
   stripe.confirmCardPayment(clientSecret, {
     payment_method: {
       card: cardElement,
       billing_details: { ... }
     }
   })
   ↓

4. Stripe procesa pago
   ↓

5. Webhook notifica resultado
   POST /api/webhooks/stripe
   Event: payment_intent.succeeded
   ↓
   Sistema:
   ✅ Actualiza orden: status = "PROCESSING"
   ✅ Confirma stock reservado
   ✅ Notifica a cliente y vendedor
   ✅ Envía email de confirmación (pendiente)
```

**Métodos de Pago Soportados:**
- ✅ Tarjetas (Visa, Mastercard, Amex)
- ⏳ PayPal (próximamente)
- ⏳ OXXO (próximamente)
- ⏳ Transferencia bancaria (próximamente)

---

## 📊 DIAGRAMA DE ARQUITECTURA DE ROLES

```
┌─────────────────────────────────────────────────────────────┐
│                    REGEN MARKETPLACE                         │
│                   Sistema Multi-Rol                          │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │ CUSTOMER  │   │  VENDOR   │   │   ADMIN   │
    │ (Compra)  │   │  (Vende)  │   │(Gestiona) │
    └───────────┘   └───────────┘   └───────────┘
         │               │               │
         │               │               │
    ┌────▼────┐     ┌────▼────┐    ┌────▼────┐
    │Explorar │     │Solicitar│    │Aprobar  │
    │Productos│     │Onboarding    │Vendors  │
    └────┬────┘     └────┬────┘    └────┬────┘
         │               │               │
    ┌────▼────┐     ┌────▼────┐    ┌────▼────┐
    │Agregar  │     │Crear    │    │Gestionar│
    │al Cart  │     │Productos│    │Usuarios │
    └────┬────┘     └────┬────┘    └────┬────┘
         │               │               │
    ┌────▼────┐     ┌────▼────┐    ┌────▼────┐
    │Checkout │     │Gestionar│    │Ver      │
    │4 Pasos  │     │Órdenes  │    │Analytics│
    └────┬────┘     └────┬────┘    └────┬────┘
         │               │               │
    ┌────▼────┐     ┌────▼────┐    ┌────▼────┐
    │Pago     │     │Ver      │    │Gestionar│
    │Stripe   │     │Analytics│    │Productos│
    └────┬────┘     └────┬────┘    └─────────┘
         │               │
    ┌────▼────┐     ┌────▼────┐
    │Rastrear │     │NFT      │
    │Orden    │     │Evolución│
    └────┬────┘     └─────────┘
         │
    ┌────▼────┐
    │Ver      │
    │Impacto  │
    └─────────┘

INTEGRACIONES:
├── Stripe (Pagos)
├── Algolia (Búsqueda) - Configurado
├── Email Service (Pendiente)
└── NFT Blockchain (Concepto)
```

---

## 🎯 RESUMEN DE CARACTERÍSTICAS ÚNICAS

1. **Sistema de Impacto Medible**
   - Cada producto tiene métricas de sostenibilidad
   - Dashboard de impacto para usuarios
   - Transparencia total

2. **NFTs y Gamificación**
   - Vendedores evolucionan con su impacto
   - Compradores coleccionan NFTs
   - Sistema de recompensas

3. **Multi-Vendor Inteligente**
   - Split automático de órdenes
   - Cada vendedor gestiona su inventario
   - Dashboard independiente

4. **Proceso de Verificación**
   - Vendedores verificados por admin
   - Calidad garantizada
   - Protección para compradores

5. **Transparencia y Trazabilidad**
   - Origen de productos
   - Certificaciones visibles
   - Reviews verificados

---

## 📝 CONCLUSIÓN

**Regen Marketplace** es una plataforma completa de e-commerce sostenible con:

✅ **3 Roles bien definidos:** Customer, Vendor, Admin
✅ **Flujos completos:** Desde registro hasta entrega
✅ **Sistema de pagos robusto:** Stripe con multi-vendor
✅ **Impacto medible:** Métricas ambientales en tiempo real
✅ **Gamificación:** NFTs que evolucionan
✅ **Verificación:** Vendedores validados por admins

**Estado Actual:** 75% completo - Core features implementados
**Falta:** Emails, webhooks completos, testing, optimizaciones

Este marketplace tiene el potencial de convertirse en **la plataforma líder de productos sostenibles en México**.

---

**Fecha:** Marzo 2025
**Versión:** 1.0 - MVP
