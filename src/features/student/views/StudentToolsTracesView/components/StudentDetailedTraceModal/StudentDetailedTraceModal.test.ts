import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import StudentDetailedTraceModal from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceModal/StudentDetailedTraceModal.vue'
import { MDI_ICONS } from '@/ui'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, vi } from 'vitest'

const navigateToStudentMailbox = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentMailbox,
  }),
}))

vi.mock('@/ui', async () => {
  const actual = await vi.importActual<typeof import('@/ui')>('@/ui')

  return {
    ...actual,
    AvModal: {
      name: 'AvModal',
      props: ['title'],
      template: `<div><slot /><slot name="footer" /></div>`,
      emits: ['close'],
    },
    AvButton: {
      name: 'AvButton',
      template: `<button @click="onClick && onClick()"><slot /></button>`,
      props: ['label', 'icon', 'size', 'onClick'],
    },
  }
})

const stubs = {
  AvVIcon: {
    name: 'AvVIcon',
    props: ['name', 'color', 'size'],
    template: `<div class="av-vicon" />`,
  },
  AvModal: {
    name: 'AvModal',
    template: `<div><slot /><slot name="footer" /></div>`,
    emits: ['close'],
  },
  AvButton: {
    name: 'AvButton',
    props: ['icon', 'iconOnly', 'size', 'onClick'],
    template: '<button class="av-button" @click="onClick"><slot /></button>',
  },
  StudentDetailedTraceCardSettingMenu: {
    name: 'StudentDetailedTraceCardSettingMenu',
    props: ['trace', 'show'],
    template: '<div v-if="show" class="settings-menu" @click="$emit(\'onTraceDelete\', trace); $emit(\'close\')">Settings Menu</div>',
    emits: ['onTraceDelete', 'close']
  }
}

describe('studentDetailedTraceModal', () => {
  const nextMonthDate = new Date()
  nextMonthDate.setDate(nextMonthDate.getDate() + 30)
  const nextMonthDateIsoString = nextMonthDate.toISOString()

  const onClose = vi.fn()
  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma super trace',
    status: TraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    deletionDate: nextMonthDateIsoString
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('given a trace modal is rendered with showModal true', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceModal, {
        props: { trace: mockedTrace, showModal: true, onClose },
        global: { stubs }
      })
    })

    describe('when the component is rendered', () => {
      it('then the modal title should contain trace details', () => {
        const modalTitle = wrapper.find('.student-detailed-trace-modal__title')
        expect(modalTitle.exists()).toBe(true)
        expect(modalTitle.text()).toContain(`Détail de ma trace - ${mockedTrace.title}`)
      })

      it('then the settings button should be present', () => {
        const settingsButton = wrapper.findComponent({
          name: 'AvButton',
          props: {
            icon: MDI_ICONS.DOTS_VERTICAL,
            iconOnly: true,
          }
        })
        expect(settingsButton.exists()).toBe(true)
      })
    })

    describe('when the modal close event is emitted', () => {
      beforeEach(async () => {
        await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
      })

      it('then the onClose callback should be called', () => {
        expect(onClose).toHaveBeenCalled()
      })
    })
  })

  describe('given a trace modal with settings functionality', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceModal, {
        props: { trace: mockedTrace, showModal: true, onClose },
        global: { stubs }
      })
    })

    describe('when the settings button is clicked', () => {
      beforeEach(async () => {
        const settingsButton = wrapper.findComponent({
          name: 'AvButton',
          props: {
            icon: MDI_ICONS.DOTS_VERTICAL,
            iconOnly: true,
          }
        })
        await settingsButton.trigger('click')
      })

      it('then the settings menu should be visible', () => {
        expect(wrapper.find('.settings-menu').exists()).toBe(true)
      })

      describe('when a click event is dispatched on the document', () => {
        beforeEach(async () => {
          document.dispatchEvent(new Event('click'))
          await wrapper.vm.$nextTick()
        })

        it('then the settings menu should be hidden', () => {
          expect(wrapper.find('.settings-menu').exists()).toBe(false)
        })
      })

      describe('when the settings menu emits close event', () => {
        beforeEach(async () => {
          const settingsMenu = wrapper.findComponent({ name: 'StudentDetailedTraceCardSettingMenu' })
          await settingsMenu.vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        it('then the settings menu should be hidden', () => {
          expect(wrapper.find('.settings-menu').exists()).toBe(false)
        })
      })
    })
  })

  describe('given a trace modal with different trace data', () => {
    const differentTrace: TraceViewDTO = {
      id: 'trace2',
      title: 'Another trace',
      status: TraceStatus.ASSOCIATED,
      createdAt: '2025-06-15T10:42:00.000Z',
      updatedAt: '2025-06-16T15:18:00.000Z',
      deletionDate: nextMonthDateIsoString
    }

    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceModal, {
        props: { trace: differentTrace, showModal: true, onClose },
        global: { stubs }
      })
    })

    describe('when the component is rendered', () => {
      it('then the modal title should contain the different trace title', () => {
        const modalTitle = wrapper.find('.student-detailed-trace-modal__title')
        expect(modalTitle.text()).toContain(`Détail de ma trace - ${differentTrace.title}`)
      })
    })

    describe('when the settings button is clicked', () => {
      beforeEach(async () => {
        const settingsButton = wrapper.findComponent({
          name: 'AvButton',
          props: {
            icon: MDI_ICONS.DOTS_VERTICAL,
            iconOnly: true,
          }
        })
        await settingsButton.trigger('click')
      })

      it('then the settings menu should receive the correct trace data', () => {
        const settingsMenu = wrapper.findComponent({ name: 'StudentDetailedTraceCardSettingMenu' })
        expect(settingsMenu.props('trace')).toEqual(differentTrace)
      })
    })
  })

  describe('given a trace modal with showModal false', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceModal, {
        props: { trace: mockedTrace, showModal: false, onClose },
        global: { stubs }
      })
    })

    describe('when the component is rendered', () => {
      it('then the modal component should exist', () => {
        const avModal = wrapper.findComponent({ name: 'AvModal' })
        expect(avModal.exists()).toBe(true)
      })
    })
  })
})
