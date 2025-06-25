import {
  createVueI18nPlugin,
  getBrowserLocale,
  i18n,
  parseLocaleModules,
  registerFeatureLocales
} from '@/plugins/vue-i18n/vue-i18n'
import { AvAvailableLocales } from '@/types/i18n.types'
import { describe, expect, it, vi } from 'vitest'

describe('parseLocaleModules', () => {
  it('uses default export if present', () => {
    const mockedModules = {
      '/locales/fr.json': { default: { hello: 'Bonjour' } },
      '/locales/en.json': { default: { hello: 'Hello' } }
    }

    const result = parseLocaleModules(mockedModules)
    expect(result.fr).toEqual({ hello: 'Bonjour' })
    expect(result.en).toEqual({ hello: 'Hello' })
  })

  it('uses module itself if no default export', () => {
    const mockedModules = {
      '/locales/fr.json': { hello: 'Salut' },
      '/locales/en.json': { hello: 'Hi' }
    }

    const result = parseLocaleModules(mockedModules)
    expect(result.fr).toEqual({ hello: 'Salut' })
    expect(result.en).toEqual({ hello: 'Hi' })
  })
})

describe('getBrowserLocale', () => {
  const originalNavigator = navigator

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', { value: originalNavigator, configurable: true })
  })

  it('should return the browser locale if it is available', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { language: 'en-US' },
      configurable: true
    })
    expect(getBrowserLocale()).toBe('en')
  })

  it('should fallback to "fr" if the browser locale is not available', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { language: 'ja-JP' },
      configurable: true
    })
    expect(getBrowserLocale()).toBe('fr')
  })
})

describe('registerFeatureLocales', () => {
  it('should register feature locales without throwing', async () => {
    await expect(registerFeatureLocales('student')).resolves.not.toThrow()
  })

  it('should warn if a feature locale is missing', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await registerFeatureLocales('non-existent-feature')

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No'))
    warnSpy.mockRestore()
  })
})

describe('vue-i18n setup', () => {
  it('should initialize i18n with expected locales', () => {
    const messages = i18n.global.messages

    for (const lang of AvAvailableLocales) {
      expect(messages.value[lang]).toBeDefined()
    }
  })

  it('should set default locale to fr', () => {
    expect(i18n.global.locale.value).toBe('fr')
  })
})

describe('createVueI18nPlugin', () => {
  it('should install i18n plugin and register student and teacher locales', () => {
    const mockRegister = vi.fn().mockResolvedValue(undefined)
    const app = { use: vi.fn() } as any

    const plugin = createVueI18nPlugin(mockRegister)
    plugin.install(app)

    expect(app.use).toHaveBeenCalledWith(i18n)
    expect(mockRegister).toHaveBeenCalledWith('student')
    expect(mockRegister).toHaveBeenCalledWith('teacher')
  })
})
