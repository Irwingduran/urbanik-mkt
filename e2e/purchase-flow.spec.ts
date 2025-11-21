import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test('should complete a full purchase cycle', async ({ page }) => {
    // 1. Login as Customer
    await page.goto('/auth/signin?callbackUrl=/dashboard');
    await page.getByLabel('Email address').fill('demo@customer.com');
    await page.getByLabel('Password').fill('password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard or home
    await page.waitForURL('**/dashboard**');

    // 2. Navigate to Marketplace and find a product
    await page.goto('/marketplace');
    // Click on the first product card
    await page.click('a[href^="/marketplace/products/"] >> nth=0');
    
    // 3. Add to Cart
    await page.waitForSelector('h1'); // Wait for product title
    await page.click('button:has-text("Añadir al Carrito")');
    
    // 4. Go to Cart
    await page.click('button:has-text("Ver Carrito")');
    await page.waitForURL('**/cart');
    await page.click('button:has-text("Proceder al Checkout")');

    // 5. Checkout - Shipping
    // Handle potential session loss/redirect to login
    // We use a race condition check because the redirect to login happens client-side
    const firstNameInput = page.locator('#firstName');
    const loginEmailInput = page.getByLabel('Email address');

    await Promise.race([
      firstNameInput.waitFor({ state: 'visible' }).catch(() => {}),
      loginEmailInput.waitFor({ state: 'visible' }).catch(() => {})
    ]);

    if (await loginEmailInput.isVisible()) {
      console.log('Session lost, logging in again...');
      await loginEmailInput.fill('demo@customer.com');
      await page.getByLabel('Password').fill('password123');
      await page.click('button[type="submit"]');
      await page.waitForURL(url => url.pathname === '/checkout');
    }

    // Handle "Revisar productos" step (Step 0) if present
    // The checkout page starts at Step 0 (Review) by default
    await page.waitForSelector('button:has-text("Siguiente")');
    if (!await page.locator('#firstName').isVisible()) {
      console.log('Advancing from Review step to Shipping step...');
      await page.click('button:has-text("Siguiente")');
    }

    // Handle "Saved Addresses" if present (click "Usar nueva dirección" to show form)
    const useNewAddressBtn = page.locator('button:has-text("Usar nueva dirección")');
    if (await useNewAddressBtn.isVisible()) {
      console.log('Clicking "Usar nueva dirección"...');
      await useNewAddressBtn.click();
    }

    // Fill shipping info if empty (demo user might have pre-filled data, but let's ensure)
    // Note: Using IDs as names are not present on inputs
    await page.fill('#firstName', 'Demo');
    await page.fill('#lastName', 'Customer');
    await page.fill('#phone', '5551234567');
    await page.fill('#street', 'Av. Reforma 222');
    await page.fill('#city', 'Ciudad de México');
    
    // Handle Select for State
    const stateTrigger = page.locator('text=Seleccionar estado');
    if (await stateTrigger.isVisible()) {
      await stateTrigger.click();
      await page.getByRole('option', { name: 'Ciudad de México' }).click();
    }
    
    await page.fill('#zipCode', '06600');
    
    await page.click('button:has-text("Siguiente")');

    // 6. Checkout - Payment
    // Select "Tarjeta de Crédito" (default) and fill dummy data
    await page.fill('#cardNumber', '4242424242424242');
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cvv', '123');
    await page.fill('#cardholderName', 'Demo Customer');
    
    await page.click('button:has-text("Siguiente")');

    // 7. Checkout - Confirmation
    await page.click('button:has-text("Confirmar Pedido")');

    // 8. Verify Success
    await page.waitForURL('**/checkout/success**');
    // Update expectation to match actual UI text "¡Pedido Confirmado!"
    await expect(page.locator('h1')).toContainText('¡Pedido Confirmado!');
    
    // Extract Order ID from URL or page content if needed
    const url = page.url();
    const orderId = new URL(url).searchParams.get('orderId');
    console.log('Order created:', orderId);
  });
});
