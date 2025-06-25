import { useLanguageSwitcher } from '@/common/composables/use-language-switcher/use-language-switcher'
import { i18n } from '@/plugins/vue-i18n'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('useLanguageSwitcher', () => {
  const TestComponent = defineComponent({
    setup () {
      const { languageSelector, selectLanguage } = useLanguageSwitcher()
      return { languageSelector, selectLanguage }
    },
    template: `<div></div>`,
  })

  it('should initialize with French as default language', () => {
    const wrapper = mount(TestComponent)
    expect(wrapper.vm.languageSelector.currentLanguage).toBe('fr')
  })

  it('should switch to English', () => {
    const wrapper = mount(TestComponent)
    wrapper.vm.selectLanguage({ label: 'English', codeIso: 'en' })
    expect(wrapper.vm.languageSelector.currentLanguage).toBe('en')
  })

  it('should update i18n locale when switching language', () => {
    const wrapper = mount(TestComponent)
    wrapper.vm.selectLanguage({ label: 'English', codeIso: 'en' })
    expect(i18n.global.locale.value).toBe('en')
  })
})
