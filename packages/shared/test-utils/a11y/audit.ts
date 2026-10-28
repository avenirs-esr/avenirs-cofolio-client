import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

interface A11yAuditDependencies<TResult extends { violations: unknown[] }> {
  createAxeBuilder: (page: Page) => {
    exclude: (selector: string) => {
      analyze: () => Promise<TResult>
    }
  }
  createHtmlReport: (input: {
    results: NoInfer<TResult>
    options: { projectKey: string, doNotCreateReportFile: true }
  }) => string
  writeReport: (reportPath: string, html: string) => void
}

interface A11yAuditOptions {
  page: Page
  projectKey: string
  reportPath: string
}

export function createA11yAudit<TResult extends { violations: unknown[] }> ({ createAxeBuilder, createHtmlReport, writeReport }: A11yAuditDependencies<TResult>) {
  return async ({ page, projectKey, reportPath }: A11yAuditOptions) => {
    const rawAxeResults = await createAxeBuilder(page).exclude('[data-user-content]').analyze()

    if (rawAxeResults.violations.length > 0) {
      const reportHTML = createHtmlReport({
        results: rawAxeResults,
        options: { projectKey, doNotCreateReportFile: true },
      })

      writeReport(reportPath, reportHTML)
    }

    expect(rawAxeResults.violations.length, 'No accessibility violations').toBe(0)
  }
}
