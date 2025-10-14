import { mockedTraceAssociations } from '@/__mocks__/fixtures/student'
import { EFileType, type TraceDetailDTO } from '@/api/avenir-esr'
import UpdateTraceModal from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/UpdateTraceModal.vue'
import { AvStepperStub, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

BddTest().given('an update trace modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateTraceModal>>
  let onClose: ReturnType<typeof vi.fn>

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
    }
  }

  const stubs = {
    AvModal: {
      name: 'AvModal',
      props: ['opened', 'closeButtonLabel', 'confirmButtonLabel', 'confirmButtonIcon'],
      emits: ['close'],
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
      props: ['skillLevelAssociations', 'additionalSkillAssociations'],
      template: '<div class="terms-step" />'
    },
    UpdateStep: {
      name: 'UpdateStep',
      template: '<div class="update-step" />'
    }
  }

  BddTest().and('the modal is initially closed', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      onClose = vi.fn()
      wrapper = mount(UpdateTraceModal, {
        props: { trace: mockedTrace, skillLevelAssociations: mockedTraceAssociations.skillLevelAssociations, additionalSkillAssociations: mockedTraceAssociations.additionalSkillAssociations, show: false, onClose },
        global: { stubs }
      })
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
      onClose = vi.fn()
      wrapper = mount(UpdateTraceModal, {
        props: { trace: mockedTrace, skillLevelAssociations: mockedTraceAssociations.skillLevelAssociations, additionalSkillAssociations: mockedTraceAssociations.additionalSkillAssociations, show: true, onClose },
        global: { stubs }
      })
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

      BddTest().then('it passes associations props to TermsStep', () => {
        const terms = wrapper.findComponent({ name: 'TermsStep' })
        expect(terms.exists()).toBe(true)
      })

      BddTest().and('the close button is clicked', () => {
        beforeEach(async () => {
          await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
          await nextTick()
        })

        BddTest().then('it should close the modal', async () => {
          expect(onClose).toHaveBeenCalled()
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

        BddTest().and('the confirm button is clicked a second time', () => {
          beforeEach(async () => {
            await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('confirm')
            await nextTick()
          })

          BddTest().then('it should call onClose', () => {
            expect(onClose).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
