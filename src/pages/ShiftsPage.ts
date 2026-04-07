import { type Locator, type Page } from '@playwright/test';

import { ENV } from '../config/env';

const SHIFTS_URL = `${ENV.BASE_URL}/demo/api/kic/da/index.html#/organisation/shifts`;

const GERMAN_MONTHS: Record<string, number> = {
  Januar: 1,
  Februar: 2,
  März: 3,
  April: 4,
  Mai: 5,
  Juni: 6,
  Juli: 7,
  August: 8,
  September: 9,
  Oktober: 10,
  November: 11,
  Dezember: 12,
};

export interface ShiftFormData {
  title: string;
  description?: string;
  shiftType: string;
  resources: string[];
  date: string;
  startTime: string;
  endTime: string;
}

export function toShiftDateFormat(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}.${dd}.${yyyy}`;
}

export class ShiftsPage {
  constructor(readonly page: Page) {}

  get pageTitle(): Locator {
    return this.page.locator('.v-toolbar__title', { hasText: 'api - Schichten' });
  }

  get addShiftButton(): Locator {
    return this.page.locator('button.v-btn--fab.primary:has(.mdi-plus)');
  }

  get titleInput(): Locator {
    return this.page.locator('input[data-testid="shift-title-input"]');
  }

  get descriptionInput(): Locator {
    return this.page.locator('input[data-testid="shift-description-input"]');
  }

  get shiftTypeSelect(): Locator {
    return this.page
      .locator('.v-input__slot')
      .filter({ has: this.page.locator('[data-testid="shift-type-select"]') });
  }

  get resourcesSelect(): Locator {
    return this.page
      .locator('.v-input__slot')
      .filter({ has: this.page.locator('[data-testid="shift-resources-select"]') });
  }

  get dateInput(): Locator {
    return this.page.locator('input[data-testid="Datum-datepicker-trigger"]');
  }

  get startTimeInput(): Locator {
    return this.page.locator('input[data-testid="Startzeit-timepicker"]');
  }

  get endTimeInput(): Locator {
    return this.page.locator('input[data-testid="Endzeit-timepicker"]');
  }

  get saveShiftButton(): Locator {
    return this.page.getByTestId('save-shift-btn');
  }

  get deleteShiftButton(): Locator {
    return this.page.getByTestId('delete-shift-btn');
  }

  get cancelShiftButton(): Locator {
    return this.page.getByTestId('cancel-shift-btn');
  }

  get editDrawer(): Locator {
    return this.page.locator('.v-navigation-drawer--right.v-navigation-drawer--open');
  }

  get openEditButton(): Locator {
    return this.page.getByTestId('open-btn');
  }

  get sliderThumb(): Locator {
    return this.page.locator('[role="slider"]');
  }

  get employeeFilterInput(): Locator {
    return this.page.locator('input[data-testid="filter-employee"]');
  }

  get positionFilterInput(): Locator {
    return this.page.locator('input[data-testid="filter-position"]');
  }

  get telephoneFilterInput(): Locator {
    return this.page.locator('input[data-testid="filter-telephone"]');
  }

  get noteFilterInput(): Locator {
    return this.page.locator('input[data-testid="filter-note"]');
  }

  get clearFiltersButton(): Locator {
    return this.page.getByTestId('clear-filters-btn');
  }

  private get dropdownList(): Locator {
    return this.page.locator('.v-menu__content.menuable__content__active .v-list[role="listbox"]');
  }

  private get calendarTable(): Locator {
    return this.page.locator('.v-date-picker-table--date').last();
  }

  private get calendarHeaderButton(): Locator {
    return this.page.locator('.v-date-picker-header__value button').last();
  }

  private get calendarNextMonth(): Locator {
    return this.page.locator('[aria-label="Monat vor"]').last();
  }

  private get calendarPrevMonth(): Locator {
    return this.page.locator('[aria-label="Monat zurück"]').last();
  }

  shiftEventByTitle(title: string): Locator {
    return this.page
      .locator('.b-sch-event-wrap')
      .filter({ has: this.page.locator('.b-sch-event-content', { hasText: title }) })
      .first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(SHIFTS_URL);
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async selectShiftType(typeName: string): Promise<void> {
    await this.shiftTypeSelect.click();
    await this.dropdownList.waitFor({ state: 'visible' });
    await this.dropdownList.locator('[role="option"]', { hasText: typeName }).first().click();
  }

  async selectResources(resources: string[]): Promise<void> {
    await this.resourcesSelect.click();
    await this.dropdownList.waitFor({ state: 'visible' });

    for (const resource of resources) {
      await this.dropdownList.locator('[role="option"]', { hasText: resource }).first().click();
    }

    await this.page.keyboard.press('Escape');
  }

  async fillDate(date: string): Promise<void> {
    const [mm, dd, yyyy] = date.split('.');
    const targetMonth = Number(mm);
    const targetDay = Number(dd);
    const targetYear = Number(yyyy);

    await this.dateInput.click();
    await this.calendarTable.waitFor({ state: 'visible' });

    while (true) {
      const headerText = ((await this.calendarHeaderButton.textContent()) ?? '').trim();
      const [monthName, yearStr] = headerText.split(' ');
      const currentMonth = GERMAN_MONTHS[monthName] ?? 0;
      const currentYear = Number(yearStr);

      if (currentYear === targetYear && currentMonth === targetMonth) break;

      const goForward =
        currentYear < targetYear || (currentYear === targetYear && currentMonth < targetMonth);

      await (goForward ? this.calendarNextMonth : this.calendarPrevMonth).click();
    }

    await this.calendarTable
      .locator('button:not([disabled]) .v-btn__content', { hasText: new RegExp(`^${targetDay}$`) })
      .click();
  }

  async fillStartTime(time: string): Promise<void> {
    await this.startTimeInput.fill(time);
    await this.page.keyboard.press('Enter');
  }

  async fillEndTime(time: string): Promise<void> {
    await this.endTimeInput.fill(time);
    await this.page.keyboard.press('Enter');
  }

  async saveShift(): Promise<void> {
    await this.saveShiftButton.click();
    await this.saveShiftButton.waitFor({ state: 'detached' });
  }

  async deleteShift(): Promise<void> {
    await this.deleteShiftButton.click();
    await this.deleteShiftButton.waitFor({ state: 'detached' });
  }

  async cancelShift(): Promise<void> {
    const cancelBtn = this.cancelShiftButton;
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.editDrawer.waitFor({ state: 'hidden' }).catch(() => {});
  }

  async createShift(data: ShiftFormData): Promise<void> {
    await this.fillTitle(data.title);
    if (data.description) {
      await this.fillDescription(data.description);
    }
    await this.selectShiftType(data.shiftType);
    await this.selectResources(data.resources);
    await this.fillDate(data.date);
    await this.fillStartTime(data.startTime);
    await this.fillEndTime(data.endTime);
    await this.saveShift();
  }

  async waitForEditDrawer(): Promise<void> {
    await this.editDrawer.waitFor({ state: 'visible' });
    await this.shiftTypeSelect.waitFor({ state: 'visible' });
  }

  async openShiftEditView(): Promise<void> {
    await this.openEditButton.click();
  }

  async clickShiftEvent(title: string): Promise<void> {
    await this.shiftEventByTitle(title).dblclick();
  }

  async waitForCalendarToLoad(): Promise<void> {
    const loader = this.page.getByText('Lade');
    if (await loader.isVisible()) {
      await loader.waitFor({ state: 'hidden' });
    }
  }

  async setSliderValue(targetValue: number): Promise<void> {
    const thumb = this.sliderThumb;
    await thumb.focus();

    const current = Number((await thumb.getAttribute('aria-valuenow')) ?? 0);
    const steps = targetValue - current;
    const key = steps > 0 ? 'ArrowRight' : 'ArrowLeft';

    for (let i = 0; i < Math.abs(steps); i++) {
      await this.page.keyboard.press(key);
    }
  }

  async moveSliderToMax(): Promise<void> {
    const thumb = this.sliderThumb;
    await thumb.focus();
    const max = Number((await thumb.getAttribute('aria-valuemax')) ?? 0);
    await this.setSliderValue(max);
  }

  async moveSliderToMin(): Promise<void> {
    const thumb = this.sliderThumb;
    await thumb.focus();
    const min = Number((await thumb.getAttribute('aria-valuemin')) ?? 0);
    await this.setSliderValue(min);
  }

  async filterByEmployee(value: string): Promise<void> {
    await this.employeeFilterInput.fill(value);
  }

  async filterByPosition(value: string): Promise<void> {
    await this.positionFilterInput.fill(value);
  }

  async filterByTelephone(value: string): Promise<void> {
    await this.telephoneFilterInput.fill(value);
  }

  async filterByNote(value: string): Promise<void> {
    await this.noteFilterInput.fill(value);
  }

  async clearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
  }
}
