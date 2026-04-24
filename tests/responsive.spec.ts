import { test, expect } from '@playwright/test';

const BASE = '/tic-tac-toe';

const viewports = [
  { name: '320x568 (SE portrait)', w: 320, h: 568 },
  { name: '375x667 (iPhone 8)', w: 375, h: 667 },
  { name: '390x844 (iPhone 13)', w: 390, h: 844 },
  { name: '414x896 (iPhone 11)', w: 414, h: 896 },
  { name: '667x375 (iPhone 8 landscape)', w: 667, h: 375 },
  { name: '768x1024 (iPad portrait)', w: 768, h: 1024 },
  { name: '1024x768 (iPad landscape)', w: 1024, h: 768 },
  { name: '1280x720 (laptop)', w: 1280, h: 720 },
  { name: '1920x1080 (desktop)', w: 1920, h: 1080 },
];

test.describe('Responsive — landing page', () => {
  for (const vp of viewports) {
    test(`${vp.name}: no horizontal scroll, card visible`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto(`${BASE}/`);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.w + 1);

      await expect(page.getByRole('link', { name: /tic-tac-toe/i })).toBeVisible();
    });
  }
});

test.describe('Responsive — tic-tac-toe game', () => {
  for (const vp of viewports) {
    test(`${vp.name}: board and controls fit, no overlap`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto(`${BASE}/games/tic-tac-toe`);
      await page.getByRole('button', { name: 'Start Game' }).click();

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      expect(scrollWidth, 'no horizontal scroll').toBeLessThanOrEqual(vp.w + 1);
      expect(scrollHeight, 'no vertical scroll').toBeLessThanOrEqual(vp.h + 1);

      const board = page.locator('.board-area');
      const restartBtn = page.getByRole('button', { name: 'Restart' });
      const grid = page.locator('.grid');

      const boardBox = await board.boundingBox();
      const btnBox = await restartBtn.boundingBox();
      const gridBox = await grid.boundingBox();
      expect(boardBox && btnBox && gridBox).toBeTruthy();

      expect(boardBox!.y + boardBox!.height, 'board below restart button').toBeLessThanOrEqual(btnBox!.y + 1);
      expect(gridBox!.width, 'grid fits inside board-area width').toBeLessThanOrEqual(boardBox!.width + 1);
      expect(gridBox!.height, 'grid fits inside board-area height').toBeLessThanOrEqual(boardBox!.height + 1);

      await expect(page.locator('.cell').first()).toBeVisible();
    });
  }
});
