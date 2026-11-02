import type { Page } from '@playwright/test'
import type { MockInstance } from 'vitest'
import fs from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createA11yAudit } from '@avenirs-esr/shared/test-utils/a11y'
import { afterEach, beforeEach, expect, vi } from 'vitest'

function createDependencies () {
  const results = { violations: [] as { id: string }[], url: 'https://example.test/page' }
  const analyze = vi.fn(async () => results)
  const exclude = vi.fn((_selector: string) => ({ analyze }))
  const createAxeBuilder = vi.fn((_page: Page) => ({ exclude }))
  const createHtmlReport = vi.fn((_input: {
    results: typeof results
    options: { projectKey: string, doNotCreateReportFile: true }
  }) => '<html>Accessibility report</html>')

  const writeReport = vi.fn((reportPath: string, html: string) => {
    fs.mkdirSync(dirname(reportPath), { recursive: true })
    fs.writeFileSync(reportPath, html)
  })

  return { results, analyze, exclude, createAxeBuilder, createHtmlReport, writeReport }
}

BddTest().given('the shared accessibility audit factory', () => {
  let directory: string
  let reportPath: string
  let dependencies: ReturnType<typeof createDependencies>
  const page = {} as Page

  beforeEach(() => {
    directory = fs.mkdtempSync(join(tmpdir(), 'a11y-audit-'))
    reportPath = join(directory, 'reports/nested/page.html')
    dependencies = createDependencies()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  BddTest().when('a page has no accessibility violations', () => {
    beforeEach(async () => {
      await createA11yAudit(dependencies)({ page, projectKey: 'Project -  page', reportPath })
    })

    BddTest().then('it audits only after excluding user content without writing a report', () => {
      expect(dependencies.createAxeBuilder).toHaveBeenCalledExactlyOnceWith(page)
      expect(dependencies.exclude).toHaveBeenCalledExactlyOnceWith('[data-user-content]')
      expect(dependencies.analyze).toHaveBeenCalledOnce()
      expect(dependencies.createHtmlReport).not.toHaveBeenCalled()
      expect(fs.existsSync(join(directory, 'reports'))).toBe(false)
    })
  })
  BddTest().when('a page has accessibility violations', () => {
    let error: unknown

    beforeEach(async () => {
      dependencies.results.violations.push({ id: 'color-contrast' }, { id: 'label' })
      error = await createA11yAudit(dependencies)({ page, projectKey: 'Project -  page', reportPath }).catch(cause => cause)
    })

    BddTest().then('it writes the supplied report before failing the unchanged assertion', () => {
      expect(dependencies.writeReport).toHaveBeenCalledExactlyOnceWith(reportPath, '<html>Accessibility report</html>')
      expect(dependencies.createHtmlReport).toHaveBeenCalledExactlyOnceWith({
        results: dependencies.results,
        options: { projectKey: 'Project -  page', doNotCreateReportFile: true },
      })
      expect(dependencies.createHtmlReport.mock.calls[0][0].results).toBe(dependencies.results)
      expect(fs.readFileSync(reportPath, 'utf8')).toBe('<html>Accessibility report</html>')
      expect(error).toBeInstanceOf(Error)
      expect(error).toMatchObject({
        message: expect.stringContaining('No accessibility violations'),
        matcherResult: { actual: 2, expected: 0, name: 'toBe' },
      })
    })
  })

  for (const stage of ['builder', 'exclude', 'analyze', 'report', 'mkdir', 'write'] as const) {
    BddTest().when(`the ${stage} stage fails`, () => {
      const failure = new Error(`${stage} failed`)
      let error: unknown

      beforeEach(async () => {
        dependencies.results.violations.push({ id: 'label' })
        if (stage === 'builder') {
          dependencies.createAxeBuilder.mockImplementation(() => {
            throw failure
          })
        }
        else if (stage === 'exclude') {
          dependencies.exclude.mockImplementation(() => {
            throw failure
          })
        }
        else if (stage === 'analyze') {
          dependencies.analyze.mockRejectedValue(failure)
        }
        else if (stage === 'report') {
          dependencies.createHtmlReport.mockImplementation(() => {
            throw failure
          })
        }
        else if (stage === 'mkdir') {
          vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {
            throw failure
          })
        }
        else {
          vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {
            throw failure
          })
        }
        error = await createA11yAudit(dependencies)({ page, projectKey: 'Project -  page', reportPath }).catch(cause => cause)
      })

      BddTest().then('it propagates the original failure without replacing it with an accessibility assertion', () => {
        expect(error).toBe(failure)
        expect(fs.existsSync(reportPath)).toBe(false)
        if (stage === 'builder' || stage === 'exclude' || stage === 'analyze') {
          expect(dependencies.createHtmlReport).not.toHaveBeenCalled()
        }
        if (stage === 'report') {
          expect(fs.existsSync(join(directory, 'reports'))).toBe(false)
        }
      })
    })
  }

  BddTest().when('the same audit is reused with different project keys and paths', () => {
    let firstError: unknown
    let secondError: unknown
    let secondReportPath: string

    beforeEach(async () => {
      dependencies.results.violations.push({ id: 'label' })
      const auditAccessibility = createA11yAudit(dependencies)
      firstError = await auditAccessibility({ page, projectKey: 'First -  project', reportPath }).catch(cause => cause)
      secondReportPath = join(directory, 'other/report.html')
      dependencies.createHtmlReport.mockReturnValue('<html>Second report</html>')
      secondError = await auditAccessibility({ page, projectKey: 'Second project', reportPath: secondReportPath }).catch(cause => cause)
    })

    BddTest().then('it creates a fresh builder and preserves each invocation configuration', () => {
      expect(dependencies.createAxeBuilder).toHaveBeenCalledTimes(2)
      expect(dependencies.createHtmlReport.mock.calls.map(([input]) => input.options.projectKey)).toEqual(['First -  project', 'Second project'])
      expect(fs.readFileSync(reportPath, 'utf8')).toBe('<html>Accessibility report</html>')
      expect(fs.readFileSync(secondReportPath, 'utf8')).toBe('<html>Second report</html>')
      expect(firstError).toBeInstanceOf(Error)
      expect(secondError).toBeInstanceOf(Error)
    })
  })

  BddTest().when('the factory is initialized without auditing a page', () => {
    const dependencies = createDependencies()
    let auditAccessibility: ReturnType<typeof createA11yAudit>
    let mkdir: MockInstance<typeof fs.mkdirSync>
    let writeFile: MockInstance<typeof fs.writeFileSync>

    beforeEach(() => {
      mkdir = vi.spyOn(fs, 'mkdirSync')
      writeFile = vi.spyOn(fs, 'writeFileSync')
      auditAccessibility = createA11yAudit(dependencies)
    })

    BddTest().then('it creates no builder, report or filesystem output eagerly', () => {
      expect(auditAccessibility).toBeTypeOf('function')
      expect(dependencies.createAxeBuilder).not.toHaveBeenCalled()
      expect(dependencies.analyze).not.toHaveBeenCalled()
      expect(dependencies.createHtmlReport).not.toHaveBeenCalled()
      expect(mkdir).not.toHaveBeenCalled()
      expect(writeFile).not.toHaveBeenCalled()
    })
  })
})
