import { test, expect } from '@playwright/test';

test.describe('Tic-Tac-Toe', () => {
  test('landing page links to the game', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Minigames' })).toBeVisible();
    await page.getByRole('link', { name: /tic-tac-toe/i }).click();
    await expect(page).toHaveURL(/\/games\/tic-tac-toe/);
  });

  test('starts a single-player game', async ({ page }) => {
    await page.goto('/games/tic-tac-toe');
    await page.getByRole('button', { name: 'Start Game' }).click();
    await expect(page.locator('.game-screen.active')).toBeVisible();
    await expect(page.getByLabel('Tic Tac Toe board')).toBeVisible();
  });

  test('back link returns to landing page', async ({ page }) => {
    await page.goto('/games/tic-tac-toe');
    await page.getByRole('link', { name: /games/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('buttons do not overlap the board on mobile', async ({ page }) => {
    await page.goto('/games/tic-tac-toe');
    await page.getByRole('button', { name: 'Start Game' }).click();

    const board = page.locator('.board-area');
    const restartBtn = page.getByRole('button', { name: 'Restart' });

    const boardBox = await board.boundingBox();
    const btnBox = await restartBtn.boundingBox();
    expect(boardBox && btnBox).toBeTruthy();
    expect(boardBox!.y + boardBox!.height).toBeLessThanOrEqual(btnBox!.y);
  });
});
