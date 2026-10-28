import type { Page } from '@playwright/test'
import fs from 'node:fs'
import { dirname } from 'node:path'
import { createA11yAudit } from '@avenirs-esr/shared/test-utils'
import { AxeBuilder } from '@axe-core/playwright'
import { createHtmlReport } from 'axe-html-reporter'

export const auditAccessibility = createA11yAudit({
  createAxeBuilder: (page: Page) => new AxeBuilder({ page }),
  createHtmlReport,
  writeReport: (reportPath, html) => {
    fs.mkdirSync(dirname(reportPath), { recursive: true })
    fs.writeFileSync(reportPath, html)
  },
})
