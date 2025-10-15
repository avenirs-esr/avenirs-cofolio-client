import type { VueWrapper } from '@vue/test-utils'
import { mockedTraceAssociations } from '@/__mocks__/fixtures/student'
import { EFileType, type TraceDetailDTO } from '@/api/avenir-esr'
import UpdateTraceModal from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/UpdateTraceModal.vue'
import { useTracesStore } from '@/store'
import { AvStepperStub, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest, mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

BddTest().given('an update trace modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateTraceModal>>

  const mockedTrace: TraceDetailDTO = {
    id: 'mock-trace',
    title: 'An awesome trace',
    isAssociated: true,
    createdAt: '2025-06-01T10:42:00.000Z',
    updatedAt: '2025-06-02T11:42:00.000Z',
    programName: 'An awesome program',
    aiUseJustification: 'An awesome justification',
    isGroup: false,
    personalNote: 'An awesome personal note',
    attachment: {
      id: 'mock-attachment',
      fileName: 'An awesome attachment',
      fileType: EFileType.TXT,
      fileSize: 1,
      version: 1,
      uploadedAt: '2025-06-02T11:42:00.000Z',
    },
    associationsTrace: mockedTraceAssociations
  }

  const stubs = {
    AvModal: {
      name: 'AvModal',
      props: ['opened', 'closeButtonLabel', 'confirmButtonLabel', 'confirmButtonIcon'],
      emits: ['close', 'confirm'],
      template: `
        <div class="av-modal">
          <slot name="header"></slot>
          <slot />
          <slot name="footer"></slot>
        </div>
      `
    },
    AvStepper: AvStepperStub,
    TermsStep: {
      name: 'TermsStep',
      props: ['trace'],
      template: '<div class="terms-step" />'
    },
    UpdateStep: {
      name: 'UpdateStep',
      props: ['trace'],
      template: '<div class="update-step" />'
    }
  }

  BddTest().and('the modal is initially closed', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(UpdateTraceModal, {
        props: {
          trace: mockedTrace
        },
        global: { stubs }
      })

      const tracesStore = useTracesStore()
      tracesStore.showUpdateTraceModal = false
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should not display the modal', () => {
        const avModal = wrapper.findComponent({ name: 'AvModal' })
        expect(avModal.exists()).toBe(true)
        expect(avModal.props('opened')).toBe(false)
      })
    })
  })

  BddTest().and('the modal is initially opened', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(UpdateTraceModal, {
        props: {
          trace: mockedTrace
        },
        global: { stubs }
      })

      const tracesStore = useTracesStore()
      tracesStore.showUpdateTraceModal = true
      await nextTick()
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should display the modal', () => {
        const avModal = wrapper.findComponent({ name: 'AvModal' })
        expect(avModal.exists()).toBe(true)
        expect(avModal.props('opened')).toBe(true)
      })

      BddTest().then('it should show the stepper', () => {
        expect(wrapper.findComponent({ name: 'AvStepper' }).exists()).toBe(true)
      })

      BddTest().then('it should display two steps in the stepper', () => {
        expect(wrapper.findAll('.step')).toHaveLength(2)
      })

      BddTest().then('it should only display the first step in the stepper as active', () => {
        const steps = wrapper.findAll('.step')
        expect(steps[0].classes()).toContain('active')
        expect(steps[1].classes()).not.toContain('active')
      })

      BddTest().then('it should show the terms step', () => {
        expect(wrapper.findComponent({ name: 'TermsStep' }).exists()).toBe(true)
      })

      BddTest().then('it should hide the update step', () => {
        expect(wrapper.findComponent({ name: 'UpdateStep' }).exists()).toBe(false)
      })

      BddTest().then('it should show validate confirm button', () => {
        const modal = wrapper.findComponent({ name: 'AvModal' })
        expect(modal.props('confirmButtonLabel')).toBe('Valider la sélection')
        expect(modal.props('confirmButtonIcon')).toBe(MDI_ICONS.CHECK_CIRCLE_OUTLINE)
      })

      BddTest().then('it should display the trace details', () => {
        expect(wrapper.find('.n5').text()).toContain(mockedTrace.title)
      })

      BddTest().then('it should pass trace prop to TermsStep', () => {
        const terms = wrapper.findComponent({ name: 'TermsStep' })
        expect(terms.exists()).toBe(true)
        expect(terms.props('trace')).toEqual(mockedTrace)
      })

      BddTest().and('the close button is clicked', () => {
        BddTest().then('it should hide the modal', async () => {
          const tracesStore = useTracesStore()

          expect(tracesStore.showUpdateTraceModal).toBe(true)

          await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
          await nextTick()

          expect(tracesStore.showUpdateTraceModal).toBe(false)
        })
      })

      BddTest().and('the confirm button is clicked', () => {
        beforeEach(async () => {
          await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')
          await nextTick()
        })

        BddTest().then('it should move to the second step', () => {
          const steps = wrapper.findAll('.step')
          expect(steps[0].classes()).not.toContain('active')
          expect(steps[1].classes()).toContain('active')
        })

        BddTest().then('it should show the update step', () => {
          expect(wrapper.findComponent({ name: 'UpdateStep' }).exists()).toBe(true)
        })

        BddTest().then('it should hide the terms step', () => {
          expect(wrapper.findComponent({ name: 'TermsStep' }).exists()).toBe(false)
        })

        BddTest().then('it should show save confirm button', () => {
          const modal = wrapper.findComponent({ name: 'AvModal' })
          expect(modal.props('confirmButtonLabel')).toBe('Enregistrer les modifications')
          expect(modal.props('confirmButtonIcon')).toBe(MDI_ICONS.CONTENT_SAVE_OUTLINE)
        })

        BddTest().then('it should pass trace prop to UpdateStep', () => {
          const updateStep = wrapper.findComponent({ name: 'UpdateStep' })
          expect(updateStep.props('trace')).toEqual(mockedTrace)
        })

        BddTest().and('the confirm button is clicked a second time', () => {
          beforeEach(async () => {
            const tracesStore = useTracesStore()
            vi.spyOn(tracesStore, 'submitUpdateTraceForm')
            await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')
            await nextTick()
          })

          BddTest().then('it should call submitUpdateTraceForm', () => {
            const tracesStore = useTracesStore()
            expect(tracesStore.submitUpdateTraceForm).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
