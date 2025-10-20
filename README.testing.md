# Guía de Testing - Urbanika Marketplace

## 📋 Tabla de Contenidos
- [Configuración](#configuración)
- [Tests Unitarios y de Integración (Jest)](#tests-unitarios-y-de-integración-jest)
- [Tests E2E (Playwright)](#tests-e2e-playwright)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura de Tests](#estructura-de-tests)
- [Mejores Prácticas](#mejores-prácticas)

## Configuración

El proyecto ya está configurado con:
- **Jest** + **React Testing Library**: Tests unitarios y de integración
- **Playwright**: Tests end-to-end (E2E)

### Dependencias instaladas:
```json
{
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/user-event": "^14.6.1",
  "@playwright/test": "^1.55.1"
}
```

## Tests Unitarios y de Integración (Jest)

### Ejecutar tests:
```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Ejemplo de test de componente:
```typescript
// __tests__/components/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders and handles clicks', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })

    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Ejemplo de test de utilidad:
```typescript
// __tests__/lib/utils.test.ts
import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('px-4', 'py-2')
    expect(result).toBe('px-4 py-2')
  })
})
```

### Qué testear con Jest:
- ✅ Componentes UI (botones, forms, cards, etc.)
- ✅ Custom hooks
- ✅ Funciones de utilidad
- ✅ Validaciones con Zod
- ✅ Lógica de negocio pura
- ✅ Redux slices/reducers

## Tests E2E (Playwright)

### Ejecutar tests E2E:
```bash
# Ejecutar todos los tests E2E (headless)
npm run test:e2e

# Ejecutar con interfaz visual
npm run test:e2e:ui

# Ejecutar viendo el browser
npm run test:e2e:headed

# Ver reporte de última ejecución
npx playwright show-report
```

### Ejemplo de test E2E:
```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('should load the homepage successfully', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Urbanika/i)
})
```

### Qué testear con Playwright:
- ✅ Flujos completos de usuario (registro, login, compra)
- ✅ Navegación entre páginas
- ✅ Integración con APIs externas (Stripe, etc.)
- ✅ Funcionalidad de búsqueda
- ✅ Carrito de compras
- ✅ Responsividad en diferentes dispositivos

## Scripts Disponibles

```bash
npm test              # Jest: ejecutar tests unitarios
npm run test:watch    # Jest: modo watch
npm run test:coverage # Jest: con reporte de cobertura
npm run test:e2e      # Playwright: tests E2E
npm run test:e2e:ui   # Playwright: con UI interactiva
npm run test:all      # Ejecutar todos los tests
```

## Estructura de Tests

```
regen-marketplace/
├── __tests__/              # Tests unitarios y de integración
│   ├── components/         # Tests de componentes React
│   │   └── button.test.tsx
│   ├── lib/               # Tests de utilidades
│   │   └── utils.test.ts
│   └── app/               # Tests de lógica de app
│
├── e2e/                   # Tests end-to-end con Playwright
│   ├── homepage.spec.ts
│   ├── auth.spec.ts
│   └── checkout.spec.ts
│
├── jest.config.js         # Configuración de Jest
├── jest.setup.js          # Setup global de Jest
└── playwright.config.ts   # Configuración de Playwright
```

## Mejores Prácticas

### Tests Unitarios:
1. **Usa roles y queries semánticas**:
   ```typescript
   screen.getByRole('button', { name: /submit/i })
   screen.getByLabelText(/email/i)
   ```

2. **Testea comportamiento, no implementación**:
   ```typescript
   // ✅ Bueno
   await user.click(button)
   expect(handleClick).toHaveBeenCalled()

   // ❌ Malo
   expect(component.state.isClicked).toBe(true)
   ```

3. **Mock solo lo necesario**:
   - NextAuth ya está mockeado en `jest.setup.js`
   - Next.js router ya está mockeado

### Tests E2E:
1. **Usa selectores estables**:
   ```typescript
   // ✅ Bueno
   page.getByRole('button', { name: /login/i })
   page.getByTestId('submit-button')

   // ❌ Malo
   page.locator('.btn-primary-123')
   ```

2. **Espera correctamente**:
   ```typescript
   await page.waitForLoadState('networkidle')
   await expect(element).toBeVisible()
   ```

3. **Usa fixtures para datos de test**:
   ```typescript
   const testUser = {
     email: 'test@example.com',
     password: 'testpass123'
   }
   ```

## Ejemplos Creados

### Tests Unitarios:
- ✅ `__tests__/components/button.test.tsx` - Test del componente Button
- ✅ `__tests__/lib/utils.test.ts` - Test de la función cn()

### Tests E2E:
- ✅ `e2e/homepage.spec.ts` - Tests de la homepage
- ✅ `e2e/auth.spec.ts` - Tests de autenticación

## Próximos Pasos

Considera agregar tests para:

1. **API Routes**: Testear endpoints de Next.js
2. **Prisma**: Testear queries a la base de datos
3. **Stripe Integration**: Mock de webhooks
4. **Formularios**: Validaciones con react-hook-form + Zod
5. **Redux Store**: Acciones y reducers
6. **Búsqueda con Algolia**: Mock de resultados

## Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Next.js Testing](https://nextjs.org/docs/testing)
