import { test, expect, type Page } from '@playwright/test';

import { ShiftsPage, toShiftDateFormat } from '../../src/pages/ShiftsPage';

test.describe('Shifts', () => {
  let shiftsPage: ShiftsPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    shiftsPage = new ShiftsPage(page);
    await shiftsPage.navigate();
    await expect(page).toHaveURL(/organisation\/shifts/);
    await expect(shiftsPage.pageTitle).toBeVisible();
  });

  test('should add a new shift', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 10);

    await shiftsPage.addShiftButton.click();

    await shiftsPage.createShift({
      title: 'Automation Shift',
      description: 'Created by automated test',
      shiftType: 'test',
      resources: ['Artur Gjonaj'],
      date: toShiftDateFormat(tomorrow),
      startTime: '08:00',
      endTime: '16:00',
    });

    await shiftsPage.moveSliderToMax();
    await shiftsPage.waitForCalendarToLoad();

    await expect(shiftsPage.shiftEventByTitle('test')).toBeVisible();
  });

  test('should edit an existing shift', async () => {
    await shiftsPage.moveSliderToMax();
    await shiftsPage.waitForCalendarToLoad();
    await shiftsPage.clickShiftEvent('test');
    await shiftsPage.waitForEditDrawer();
    await shiftsPage.page.waitForLoadState('networkidle');
    await shiftsPage.selectShiftType('demo');
    await shiftsPage.saveShift();
  });

  test('should delete an existing shift', async () => {
    await shiftsPage.moveSliderToMax();
    await shiftsPage.waitForCalendarToLoad();
    await shiftsPage.clickShiftEvent('demo');
    await shiftsPage.waitForEditDrawer();
    await shiftsPage.page.waitForLoadState('networkidle');
    await shiftsPage.deleteShift();
  });
});
