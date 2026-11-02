import type { ErrorMessageProps } from '@avenirs-esr/shared'
import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ErrorMessage, ErrorMessageStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { createI18n } from 'vue-i18n'

enableAutoUnmount(afterEach)

BddTest().given('the shared ErrorMessage component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ErrorMessage>>

  const i18n = createI18n({
    legacy: false,
    locale: 'fr',
    messages: {
      fr: { global: { error: { generic: 'Erreur fournie par l’application' } } },
      en: { global: { error: { generic: 'Application error message' } } },
    },
  })

  const mountWith = (props: ErrorMessageProps = {}) => mountComponent(ErrorMessage, {
    props,
    global: { plugins: [i18n], stubs: { AvIcon: AvIconStub } },
  })

  beforeEach(() => {
    i18n.global.locale.value = 'fr'
  })

  BddTest().when('the root entry is imported', () => {
    BddTest().then('it exports the shared component', () => {
      expect(ErrorMessage).toBeDefined()
    })
  })

  BddTest().when('no props are supplied', () => {
    beforeEach(() => {
      wrapper = mountWith()
    })

    BddTest().then('it uses the generic error from the supplied i18n instance', () => {
      expect(wrapper.get('[data-testid="error-message-title"]').text()).toBe('Erreur fournie par l’application')
    })

    BddTest().then('it omits the description', () => {
      expect(wrapper.find('[data-testid="error-message-description"]').exists()).toBe(false)
    })

    BddTest().then('it retains the accessible alert and error icon', () => {
      expect(wrapper.attributes('role')).toBe('alert')
      expect(wrapper.findComponent(AvIconStub).props()).toMatchObject({
        name: MDI_ICONS.ALERT_OUTLINE,
        size: 2.5,
        color: 'var(--dark-background-error)',
      })
    })
  })

  BddTest().when('a title and description are supplied', () => {
    beforeEach(() => {
      wrapper = mountWith({ title: 'Titre explicite', description: 'Description explicite' })
    })

    BddTest().then('it renders the supplied content', () => {
      expect(wrapper.get('[data-testid="error-message-title"]').text()).toBe('Titre explicite')
      expect(wrapper.get('[data-testid="error-message-description"]').text()).toBe('Description explicite')
    })

    BddTest().and('the props are updated', () => {
      beforeEach(async () => {
        await wrapper.setProps({ title: 'Titre modifié', description: '' })
      })

      BddTest().then('it updates the title and removes the empty description', () => {
        expect(wrapper.get('[data-testid="error-message-title"]').text()).toBe('Titre modifié')
        expect(wrapper.find('[data-testid="error-message-description"]').exists()).toBe(false)
      })
    })
  })

  BddTest().when('an explicit empty title is supplied', () => {
    beforeEach(() => {
      wrapper = mountWith({ title: '' })
    })

    BddTest().then('it preserves the empty title instead of translating the fallback', () => {
      expect(wrapper.get('[data-testid="error-message-title"]').text()).toBe('')
    })
  })

  BddTest().when('the application changes locale after mounting', () => {
    beforeEach(() => {
      wrapper = mountWith()
      i18n.global.locale.value = 'en'
    })

    BddTest().then('it follows the supplied i18n instance reactively', async () => {
      await vi.waitFor(() => {
        expect(wrapper.get('[data-testid="error-message-title"]').text()).toBe('Application error message')
      })
    })
  })
})

BddTest().given('the shared ErrorMessage stub', () => {
  let wrapper: VueWrapper<InstanceType<typeof ErrorMessageStub>>

  beforeEach(() => {
    wrapper = mountComponent(ErrorMessageStub, { props: { title: 'Titre', description: 'Description' } })
  })

  BddTest().then('it exposes inspectable props and the existing content selectors', () => {
    expect(wrapper.props('title')).toBe('Titre')
    expect(wrapper.props('description')).toBe('Description')
    expect(wrapper.get('[data-testid="error-message-title"]').text()).toBe('Titre')
    expect(wrapper.get('[data-testid="error-message-description"]').text()).toBe('Description')
  })
})
