

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',

    use: {
        baseURL: ' http://localhost:5031/menu',  
        browserName: 'chromium',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },

    reporter: [
        ['html'],
        ['junit', { outputFile: 'test-results/playwright-results.xml' }]
    ],

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
});


