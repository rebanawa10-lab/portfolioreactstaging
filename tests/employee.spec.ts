
import { test, expect } from '@playwright/test';

test('Employee page loads', async ({ page }) => {

    await page.goto('/menu');

    console.log('URL:', page.url());
    console.log('TITLE:', await page.title());

    console.log(
        'BODY:',
        await page.locator('body').innerText()
    );

    await page.screenshot({
        path: 'test-results/employee-page.png',
        fullPage: true
    });

});
