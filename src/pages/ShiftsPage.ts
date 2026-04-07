import { type Locator, type Page } from '@playwright/test';

import { ENV } from '../config/env';

const SHIFTS_URL = `${ENV.BASE_URL}/demo/api/kic/da/index.html#/organisation/shifts`;

// Calendar header month names are displayed in German
const GERMAN_MONTHS: Record<string, number> = {
  Januar: 1, Februar: 2, März: 3, April: 4, Mai: 5, Juni: 6,
  Juli: 7, August: 8, September: 9, Oktober: 10, November: 11, Dezember: 12,
};

export interface ShiftFormData {
  title: string;
  description?: string;
  shiftType: string;
  resources: string[];
  date: string;        // MM.DD.YYYY
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
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

  // Vuetify autocomplete: click the visible .v-input__slot that wraps the hidden input.
  // Works for both add view (testid on outer div) and edit view (testid on inner input).
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

  async deleteShift(): Promise<void> {
    await this.deleteShiftButton.click();
    await this.deleteShiftButton.waitFor({ state: 'detached' });
  }

  /** The focusable slider thumb (role="slider", driven by arrow keys). */
  get sliderThumb(): Locator {
    return this.page.locator('[role="slider"]');
  }

  /** The edit side drawer — the right-side aside panel. */
  get editDrawer(): Locator {
    return this.page.locator('.v-navigation-drawer--right.v-navigation-drawer--open');
  }

  /** Waits for the edit drawer to be open and the shift type field to be ready. */
  async waitForEditDrawer(): Promise<void> {
    await this.editDrawer.waitFor({ state: 'visible' });
    await this.shiftTypeSelect.waitFor({ state: 'visible' });
  }

  /**
   * Returns the calendar event block whose content contains the given title.
   * Matches against the text inside .b-sch-event-content.
   */
  shiftEventByTitle(title: string): Locator {
    return this.page
      .locator('.b-sch-event-wrap')
      .filter({ has: this.page.locator('.b-sch-event-content', { hasText: title }) });
  }

  async clickShiftEvent(title: string): Promise<void> {
    await this.shiftEventByTitle(title).dblclick();
  }

  get openEditButton(): Locator {
    return this.page.getByTestId('open-btn');
  }

  async openShiftEditView(): Promise<void> {
    await this.openEditButton.click();
  }

  /**
   * Waits for the "Lade" loading indicator to disappear.
   * Safe to call even when the indicator never appears.
   */
  async waitForCalendarToLoad(): Promise<void> {
    const loader = this.page.getByText('Lade');
    const isVisible = await loader.isVisible();
    if (isVisible) {
      await loader.waitFor({ state: 'hidden' });
    }
  }

  /** The currently active/visible autocomplete dropdown. */
  private get dropdownList(): Locator {
    return this.page.locator('.v-menu__content.menuable__content__active .v-list[role="listbox"]');
  }

  // Use .last() on all calendar locators — Vuetify renders multiple picker instances
  // in the DOM; the last one is always the currently open/active picker.
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
    await this.dropdownList
      .locator('[role="option"]', { hasText: typeName })
      .first()
      .click();
  }


  async selectResources(resources: string[]): Promise<void> {
    await this.resourcesSelect.click();
    await this.dropdownList.waitFor({ state: 'visible' });

    for (const resource of resources) {
      await this.dropdownList
        .locator('[role="option"]', { hasText: resource })
        .first()
        .click();
    }

    await this.page.keyboard.press('Escape');
  }

  /**
   * Opens the date picker, navigates to the correct month/year, and clicks the day.
   * Accepts a pre-formatted MM.DD.YYYY string (use toShiftDateFormat to build one).
   */
  async fillDate(date: string): Promise<void> {
    const [mm, dd, yyyy] = date.split('.');
    const targetMonth = Number(mm);
    const targetDay = Number(dd);
    const targetYear = Number(yyyy);

    await this.dateInput.click();
    await this.page.locator('.v-date-picker-table--date').last().waitFor({ state: 'visible' });

    // Navigate month-by-month until the header shows the correct month/year
    while (true) {
      const headerText = (await this.calendarHeaderButton.textContent() ?? '').trim();
      const [monthName, yearStr] = headerText.split(' ');
      const currentMonth = GERMAN_MONTHS[monthName] ?? 0;
      const currentYear = Number(yearStr);

      if (currentYear === targetYear && currentMonth === targetMonth) break;

      const goForward =
        currentYear < targetYear ||
        (currentYear === targetYear && currentMonth < targetMonth);

      if (goForward) {
        await this.calendarNextMonth.click();
      } else {
        await this.calendarPrevMonth.click();
      }
    }

    // Click the exact day via .v-btn__content (avoids whitespace from nested divs)
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
    // Wait for the dialog to close — save button detaching from DOM confirms the shift was saved
    await this.saveShiftButton.waitFor({ state: 'detached' });
  }

  /**
   * Moves the slider to an exact target value using arrow keys.
   * Reads aria-valuenow / aria-valuemax from the DOM so no magic numbers needed.
   */
  async setSliderValue(targetValue: number): Promise<void> {
    const thumb = this.sliderThumb;
    await thumb.focus();

    const current = Number(await thumb.getAttribute('aria-valuenow') ?? 0);
    const steps = targetValue - current;
    const key = steps > 0 ? 'ArrowRight' : 'ArrowLeft';

    for (let i = 0; i < Math.abs(steps); i++) {
      await this.page.keyboard.press(key);
    }
  }

  /** Moves the slider all the way to its maximum (aria-valuemax). */
  async moveSliderToMax(): Promise<void> {
    const thumb = this.sliderThumb;
    await thumb.focus();
    const max = Number(await thumb.getAttribute('aria-valuemax') ?? 0);
    await this.setSliderValue(max);
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
}
