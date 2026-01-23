import FormCancelConfirmButtons from '@/common/components/FormCancelConfirmButtons/FormCancelConfirmButtons.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvCancelConfirmButtonsStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a FormCancelConfirmButtons component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FormCancelConfirmButtons>>

  const stubs = {
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub
  }

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(FormCancelConfirmButtons, {
      props: {
        isSubmitting: false,
        isFormValid: true
      },
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted with default props', () => {
    BddTest().then('it should render AvCancelConfirmButtons', () => {
      expect(getCancelConfirmButtons().exists()).toBe(true)
    })

    BddTest().then('it should set default cancel label', () => {
      expect(getCancelConfirmButtons().props('cancelLabel')).toBe('Annuler')
    })

    BddTest().then('it should set default confirm label', () => {
      expect(getCancelConfirmButtons().props('confirmLabel')).toBe('Enregistrer')
    })

    BddTest().then('it should set default cancel icon', () => {
      expect(getCancelConfirmButtons().props('cancelIcon')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
    })

    BddTest().then('it should set default confirm icon', () => {
      expect(getCancelConfirmButtons().props('confirmIcon')).toBe(MDI_ICONS.CONTENT_SAVE_OUTLINE)
    })

    BddTest().then('it should not disable cancel button', () => {
      expect(getCancelConfirmButtons().props('cancelDisabled')).toBe(false)
    })

    BddTest().then('it should not disable confirm button', () => {
      expect(getCancelConfirmButtons().props('confirmDisabled')).toBe(false)
    })

    BddTest().then('it should not show confirm loading', () => {
      expect(getCancelConfirmButtons().props('confirmIsLoading')).toBe(false)
    })
  })

  BddTest().when('custom labels are provided', () => {
    beforeEach(() => {
      wrapper = mount(FormCancelConfirmButtons, {
        props: {
          isSubmitting: false,
          isFormValid: true,
          cancelLabel: 'Retour',
          confirmLabel: 'Valider'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use custom cancel label', () => {
      expect(getCancelConfirmButtons().props('cancelLabel')).toBe('Retour')
    })

    BddTest().then('it should use custom confirm label', () => {
      expect(getCancelConfirmButtons().props('confirmLabel')).toBe('Valider')
    })
  })

  BddTest().when('custom icons are provided', () => {
    beforeEach(() => {
      wrapper = mount(FormCancelConfirmButtons, {
        props: {
          isSubmitting: false,
          isFormValid: true,
          cancelIcon: MDI_ICONS.ARROW_LEFT_THIN,
          confirmIcon: MDI_ICONS.CHECK
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use custom cancel icon', () => {
      expect(getCancelConfirmButtons().props('cancelIcon')).toBe(MDI_ICONS.ARROW_LEFT_THIN)
    })

    BddTest().then('it should use custom confirm icon', () => {
      expect(getCancelConfirmButtons().props('confirmIcon')).toBe(MDI_ICONS.CHECK)
    })
  })

  BddTest().when('the form is invalid and submitting', () => {
    beforeEach(() => {
      wrapper = mount(FormCancelConfirmButtons, {
        props: {
          isSubmitting: true,
          isFormValid: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should disable confirm button', () => {
      expect(getCancelConfirmButtons().props('confirmDisabled')).toBe(true)
    })

    BddTest().then('it should disable cancel button', () => {
      expect(getCancelConfirmButtons().props('cancelDisabled')).toBe(true)
    })

    BddTest().then('it should show confirm loading', () => {
      expect(getCancelConfirmButtons().props('confirmIsLoading')).toBe(true)
    })
  })

  BddTest().when('the form is submitting', () => {
    beforeEach(() => {
      wrapper = mount(FormCancelConfirmButtons, {
        props: {
          isSubmitting: true,
          isFormValid: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should disable cancel button', () => {
      expect(getCancelConfirmButtons().props('cancelDisabled')).toBe(true)
    })

    BddTest().then('it should show confirm loading', () => {
      expect(getCancelConfirmButtons().props('confirmIsLoading')).toBe(true)
    })
  })

  BddTest().when('the form is invalid', () => {
    beforeEach(() => {
      wrapper = mount(FormCancelConfirmButtons, {
        props: {
          isSubmitting: false,
          isFormValid: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not disable cancel button', () => {
      expect(getCancelConfirmButtons().props('cancelDisabled')).toBe(false)
    })

    BddTest().then('it should disable confirm button', () => {
      expect(getCancelConfirmButtons().props('confirmDisabled')).toBe(true)
    })

    BddTest().then('it should not show confirm loading', () => {
      expect(getCancelConfirmButtons().props('confirmIsLoading')).toBe(false)
    })
  })

  BddTest().when('the cancel button is clicked', () => {
    BddTest().then('it should emit cancel', async () => {
      await getCancelConfirmButtons().vm.$emit('cancel')
      expect(wrapper.emitted('cancel')).toBeTruthy()
      expect(wrapper.emitted('cancel')?.length).toBe(1)
    })
  })

  BddTest().when('the confirm button is clicked', () => {
    BddTest().then('it should emit submit', async () => {
      await getCancelConfirmButtons().vm.$emit('confirm')
      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')?.length).toBe(1)
    })
  })
})
