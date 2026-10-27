import type { Page } from '@playwright/test'
import { createA11yAudit } from '@avenirs-esr/test-utils/a11y'
import { AxeBuilder } from '@axe-core/playwright'
import { createHtmlReport } from 'axe-html-reporter'

export { waitMswToStart } from '@avenirs-esr/test-utils/a11y'

export const auditAccessibility = createA11yAudit({
  createAxeBuilder: (page: Page) => new AxeBuilder({ page }),
  createHtmlReport,
})
