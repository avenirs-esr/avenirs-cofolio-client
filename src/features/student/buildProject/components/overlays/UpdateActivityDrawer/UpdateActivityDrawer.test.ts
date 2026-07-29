import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { FormCancelConfirmButtonsStub } from '@/common/components/FormCancelConfirmButtons/FormCancelConfirmButtons.stub'
import { ActivityPeriodFormFieldStub } from '@/features/student/buildProject/components/interactions/formFields/ActivityPeriodFormField/ActivityPeriodFormField.stub'
import UpdateActivityDrawer from '@/features/student/buildProject/components/overlays/UpdateActivityDrawer/UpdateActivityDrawer.vue'
import { KitValorizationToggleFormFieldStub } from '@/features/student/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.stub'
import { AvAccordionStub, AvDrawerStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockCanLeave = vi.fn<() => Promise<boolean>>()
const mockConfirm = vi.fn()
const mockCancel = vi.fn()

vi.mock('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard')
  >()
  return {
    ...actual,
    useUnsavedChangesGuard: () => ({
      canLeave: mockCanLeave,
      confirm: mockConfirm,
      cancel: mockCancel
    })
  }
})

BddTest().given('the UpdateActivityDrawer component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateActivityDrawer>>

  const stubs = {
    AvDrawer: AvDrawerStub,
    AvIconText: AvIconTextStub,
    AvAccordion: AvAccordionStub,
    ActivityPeriodFormField: ActivityPeriodFormFieldStub,
    KitValorizationToggleFormField: KitValorizationToggleFormFieldStub,
    ConfirmationModal: ConfirmationModalStub,
    FormCancelConfirmButtons: FormCancelConfirmButtonsStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCanLeave.mockResolvedValue(true)

    wrapper = mountComponent(UpdateActivityDrawer, {
      props: {
        show: true,
        declaredActivity: mockedDeclaredActivityDetails
      },
      global: { stubs }
    })
  })

  BddTest().when('the drawer is mounted with show=true', () => {
    let avDrawer: VueWrapper<InstanceType<typeof AvDrawerStub>>

    beforeEach(() => {
      avDrawer = wrapper.findComponent({ name: 'AvDrawer' }) as VueWrapper<InstanceType<typeof AvDrawerStub>>
    })

    BddTest().then('it should render AvDrawer', () => {
      expect(avDrawer.exists()).toBe(true)
    })

    BddTest().then('it should pass show=true to AvDrawer', () => {
      expect(avDrawer.props('show')).toBe(true)
    })

    BddTest().then('it should render AvIconText with the drawer title', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' }) as VueWrapper<InstanceType<typeof AvIconTextStub>>
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toBe('Modifier l\'activité')
    })

    BddTest().then('it should render ActivityPeriodFormField', () => {
      const periodField = wrapper.findComponent({ name: 'ActivityPeriodFormField' })
      expect(periodField.exists()).toBe(true)
    })

    BddTest().then('it should render KitValorizationToggleFormField', () => {
      const valorizationField = wrapper.findComponent({ name: 'KitValorizationToggleFormField' })
      expect(valorizationField.exists()).toBe(true)
    })

    BddTest().then('it should render the valorization accordion first', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      expect(accordions[0].props('title')).toBe('Valorisation dans mon kit')
    })
  })

  BddTest().when('the drawer is mounted with show=false', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockCanLeave.mockResolvedValue(true)

      wrapper = mountComponent(UpdateActivityDrawer, {
        props: {
          show: false,
          declaredActivity: mockedDeclaredActivityDetails
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass show=false to AvDrawer', () => {
      const avDrawer = wrapper.findComponent({ name: 'AvDrawer' }) as VueWrapper<InstanceType<typeof AvDrawerStub>>
      expect(avDrawer.props('show')).toBe(false)
    })
  })

  BddTest().when('cancel button is clicked', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        const formCancelConfirmButtons = wrapper.findComponent({ name: 'FormCancelConfirmButtons' })
        await formCancelConfirmButtons.vm.$emit('cancel')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should emit close', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })

      BddTest().then('it should not show the confirmation modal', () => {
        const modal = wrapper.findComponent({ name: 'ConfirmationModal' }) as VueWrapper<InstanceType<typeof ConfirmationModalStub>>
        expect(modal.props('show')).toBe(false)
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        const formCancelConfirmButtons = wrapper.findComponent({ name: 'FormCancelConfirmButtons' })
        await formCancelConfirmButtons.vm.$emit('cancel')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should not emit close', () => {
        expect(wrapper.emitted('close')).toBeFalsy()
      })

      BddTest().and('confirming the modal', () => {
        beforeEach(async () => {
          const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
          await confirmationModal.vm.$emit('confirm')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call guard confirm', () => {
          expect(mockConfirm).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('closing the modal', () => {
        beforeEach(async () => {
          const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
          await confirmationModal.vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call guard cancel', () => {
          expect(mockCancel).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  BddTest().when('escape is pressed on drawer', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        const avDrawer = wrapper.findComponent({ name: 'AvDrawer' })
        await avDrawer.vm.$emit('escape-pressed')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should emit close', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        const avDrawer = wrapper.findComponent({ name: 'AvDrawer' })
        await avDrawer.vm.$emit('escape-pressed')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should not emit close', () => {
        expect(wrapper.emitted('close')).toBeFalsy()
      })
    })
  })

  BddTest().when('the confirmation modal cancel is triggered', () => {
    beforeEach(async () => {
      const modal = wrapper.findComponent({ name: 'ConfirmationModal' })
      await modal.vm.$emit('close')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should call guard cancel', () => {
      expect(mockCancel).toHaveBeenCalledTimes(1)
    })
  })
})
