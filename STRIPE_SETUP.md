# Configuración de Stripe - Regen Marketplace

## ✅ Estado Actual

Stripe ya está completamente integrado en el proyecto. Las claves de producción han sido configuradas.

## 🔑 Variables de Entorno Configuradas

Las siguientes variables ya están configuradas en `.env` y `.env.local`:

```bash
# Stripe Keys (LIVE MODE - Producción)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

> ⚠️ **IMPORTANTE**: Estás usando claves de producción (LIVE). Asegúrate de que tu cuenta de Stripe esté activada y verificada.

## 🔧 Integración Existente

### 1. **Cliente (Frontend)**
- **Archivo**: `components/checkout/payment-form.tsx`
- **Uso**: Formulario de pago con Stripe Elements
- **Funcionalidades**:
  - Captura de tarjeta de crédito/débito
  - Validación en tiempo real
  - Manejo de errores
  - UI segura con indicador de carga

### 2. **API - Crear Payment Intent**
- **Endpoint**: `/api/payments/create-intent`
- **Archivo**: `app/api/payments/create-intent/route.ts`
- **Funcionalidades**:
  - Crea un Payment Intent en Stripe
  - Verifica autenticación del usuario
  - Valida la orden en la base de datos
  - Convierte el total a centavos (MXN)
  - Guarda el Payment Intent ID en la orden

### 3. **Webhooks**
- **Endpoint**: `/api/webhooks/stripe`
- **Archivo**: `app/api/webhooks/stripe/route.ts`
- **Eventos Manejados**:
  - ✅ `payment_intent.succeeded` - Pago exitoso
  - ❌ `payment_intent.payment_failed` - Pago fallido
  - 🚫 `payment_intent.canceled` - Pago cancelado
  - ⚠️ `charge.dispute.created` - Disputa creada

#### Acciones Automáticas al Pagar:
1. Actualiza estado de orden a "PROCESSING"
2. Crea notificaciones para cliente y vendedor
3. Incrementa contador de ventas del producto
4. Limpia el carrito del usuario
5. Otorga puntos de lealtad basados en Regen Score
6. Restaura stock si el pago falla

### 4. **Librería Stripe**
- **Archivo**: `lib/stripe.ts`
- **Configuración**: Instancia de Stripe con la secret key
- **API Version**: `2025-08-27.basil`

## 📋 Próximos Pasos Requeridos

### 1. Configurar Webhook en Stripe Dashboard

Para que los webhooks funcionen correctamente:

1. **Ve a Stripe Dashboard**: https://dashboard.stripe.com/webhooks
2. **Crea un nuevo webhook endpoint**:
   - URL: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos a escuchar:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
     - `charge.dispute.created`

3. **Copia el Webhook Signing Secret** que Stripe te proporciona
4. **Actualiza tu `.env.local`**:
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### 2. Testing en Modo Test (Recomendado antes de producción)

Si quieres probar primero en modo test:

1. **Obtén las claves de test desde**: https://dashboard.stripe.com/test/apikeys
2. **Reemplaza temporalmente en `.env.local`**:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   ```

3. **Tarjetas de prueba**:
   - Éxito: `4242 4242 4242 4242`
   - Fallo: `4000 0000 0000 0002`
   - 3D Secure: `4000 0027 6000 3184`

### 3. Verificar configuración en Producción

Antes de aceptar pagos reales:

- [ ] Cuenta de Stripe activada y verificada
- [ ] Información bancaria configurada para recibir pagos
- [ ] Webhooks configurados y funcionando
- [ ] SSL/HTTPS activo en tu dominio
- [ ] Testear flujo completo de pago
- [ ] Revisar límites de transacciones

## 🧪 Testing Local

Para probar webhooks localmente:

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escuchar webhooks localmente
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Esto te dará un webhook secret temporal
# Cópialo a .env.local como STRIPE_WEBHOOK_SECRET
```

## 🔒 Seguridad

✅ **Implementado**:
- Secret keys solo en servidor (nunca en frontend)
- Publishable key expuesta de forma segura con `NEXT_PUBLIC_`
- Verificación de firma en webhooks
- Autenticación de usuario antes de crear Payment Intent
- Validación de propiedad de orden

⚠️ **Recomendaciones adicionales**:
- Nunca commitear archivos `.env` o `.env.local`
- Rotar claves periódicamente
- Monitorear dashboards de Stripe para actividad sospechosa
- Implementar rate limiting en endpoints de pago

## 📊 Flujo de Pago Completo

```
1. Usuario → Carrito → Checkout
2. Frontend → Carga Stripe.js con publishable key
3. Usuario → Ingresa datos de tarjeta en Stripe Elements
4. Frontend → POST /api/payments/create-intent
5. Backend → Crea Payment Intent en Stripe
6. Backend → Guarda stripePaymentId en Order
7. Backend → Retorna clientSecret
8. Frontend → Confirma pago con stripe.confirmCardPayment()
9. Stripe → Procesa pago
10. Stripe → Envía webhook a /api/webhooks/stripe
11. Backend → Actualiza orden, notifica usuarios, limpia carrito
12. Frontend → Redirige a página de confirmación
```

## 💰 Moneda y Precios

- **Moneda**: MXN (Pesos Mexicanos)
- **Conversión**: Los precios se multiplican por 100 (centavos)
- **Ejemplo**: $100.00 MXN → 10000 centavos

## 🆘 Troubleshooting

### Error: "STRIPE_SECRET_KEY is not set"
- Verifica que `.env.local` existe y tiene la variable
- Reinicia el servidor de desarrollo

### Webhook no funciona
- Verifica que `STRIPE_WEBHOOK_SECRET` esté configurado
- Revisa logs de Stripe Dashboard
- Asegúrate de que la URL del webhook sea accesible públicamente

### Pago no se refleja
- Revisa los logs del servidor
- Verifica que el webhook esté recibiendo eventos
- Checa el estado del Payment Intent en Stripe Dashboard

## 📚 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Next.js + Stripe Guide](https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
