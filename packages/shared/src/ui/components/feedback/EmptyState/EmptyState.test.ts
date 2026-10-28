import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EmptyState } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils'
import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, expect } from 'vitest'
import { createI18n } from 'vue-i18n'

enableAutoUnmount(afterEach)

BddTest().given('an EmptyState component', () => {
  let wrapper: VueWrapper<InstanceType<typeof EmptyState>>

  const i18n = createI18n({
    legacy: false,
    locale: 'fr',
    messages: {
      fr: { global: { emptyState: { defaultTitle: 'Aucun élément à afficher' } } },
      en: { global: { emptyState: { defaultTitle: 'No elements to display' } } },
    },
  })

  beforeEach(() => {
    i18n.global.locale.value = 'fr'
  })

  const stubs = {
    AvIconText: AvIconTextStub,
  }

  BddTest().when('the component is mounted without props', () => {
    beforeEach(() => {
      wrapper = mountComponent(EmptyState, { global: { plugins: [i18n], stubs } })
    })

    BddTest().then('it should render the root element', () => {
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    })

    BddTest().then('it should render the AvIconText component', () => {
      expect(wrapper.findComponent(AvIconTextStub).exists()).toBe(true)
    })

    BddTest().then('it should use the default information icon', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe(MDI_ICONS.INFORMATION_OUTLINE)
    })

    BddTest().then('it should display the default i18n title', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('Aucun élément à afficher')
    })

    BddTest().then('it should apply the correct icon color', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('iconColor')).toBe('var(--text2)')
    })

    BddTest().then('it should apply the correct text color', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('textColor')).toBe('var(--text2)')
    })

    BddTest().then('it should apply the b1-regular typography class', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('typographyClass')).toBe('b1-regular')
    })
  })

  BddTest().when('the component is mounted with a custom title', () => {
    const customTitle = 'Aucune inscription en cours ou terminée'

    beforeEach(() => {
      wrapper = mountComponent(EmptyState, {
        props: { title: customTitle },
        global: { plugins: [i18n], stubs },
      })
    })

    BddTest().then('it should display the custom title instead of the default', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe(customTitle)
    })
  })

  BddTest().when('the component is mounted with a custom icon', () => {
    const customIcon = MDI_ICONS.ARROW_RIGHT

    beforeEach(() => {
      wrapper = mountComponent(EmptyState, {
        props: { icon: customIcon },
        global: { plugins: [i18n], stubs },
      })
    })

    BddTest().then('it should display the custom icon instead of the default', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe(customIcon)
    })
  })
  BddTest().when('the local i18n instance uses English', () => {
    beforeEach(() => {
      i18n.global.locale.value = 'en'
      wrapper = mountComponent(EmptyState, { global: { plugins: [i18n], stubs } })
    })

    BddTest().then('it uses the translation supplied by that instance', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('No elements to display')
    })
  })

  BddTest().when('empty title and icon values are supplied', () => {
    beforeEach(() => {
      wrapper = mountComponent(EmptyState, {
        props: { title: '', icon: '' },
        global: { plugins: [i18n], stubs },
      })
    })

    BddTest().then('it preserves explicit empty values instead of applying defaults', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('')
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe('')
    })
  })
})
