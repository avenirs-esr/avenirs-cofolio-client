import { ETraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import StudentDetailedTraceModal from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceModal/StudentDetailedTraceModal.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentMailbox = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentMailbox,
  }),
}))

vi.mock('@avenirs-esr/avenirs-dsav', async () => {
  const actual = await vi.importActual<typeof import('@avenirs-esr/avenirs-dsav')>('@avenirs-esr/avenirs-dsav')

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

BddTest().given('a trace modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDetailedTraceModal>>

  const stubs = {
    AvVIcon: {
      name: 'AvVIcon',
      props: ['name', 'color', 'size'],
      template: `<div class="av-vicon" />`,
    },
    AvModal: {
      name: 'AvModal',
      template: `<div><slot name="header" /><slot /><slot name="footer" /></div>`,
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

  const nextMonthDate = new Date()
  nextMonthDate.setDate(nextMonthDate.getDate() + 30)
  const nextMonthDateIsoString = nextMonthDate.toISOString()

  const onClose = vi.fn()
  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma super trace',
    status: ETraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    willBeDeletedAt: nextMonthDateIsoString
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().and('showModal is true', () => {
    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceModal, {
        props: { trace: mockedTrace, showModal: true, onClose },
        global: { stubs }
      })
    })

    BddTest().when('the component is rendered', () => {
      BddTest().then('the modal title should contain trace details', () => {
        const modalTitle = wrapper.find('.n5')
        expect(modalTitle.exists()).toBe(true)
        expect(modalTitle.text()).toContain('Détail de ma trace')
        expect(modalTitle.text()).toContain(mockedTrace.title)
      })

      BddTest().then('the settings button should be present', () => {
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

    BddTest().when('the modal close event is emitted', () => {
      beforeEach(async () => {
        await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
      })

      BddTest().then('the onClose callback should be called', () => {
        expect(onClose).toHaveBeenCalled()
      })
    })
  })

  BddTest().and('with settings functionality', () => {
    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceModal, {
        props: { trace: mockedTrace, showModal: true, onClose },
        global: { stubs }
      })
    })

    BddTest().when('the settings button is clicked', () => {
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

      BddTest().then('the settings menu should be visible', () => {
        expect(wrapper.find('.settings-menu').exists()).toBe(true)
      })

      BddTest().when('a click event is dispatched on the document', () => {
        beforeEach(async () => {
          document.dispatchEvent(new Event('click'))
          await wrapper.vm.$nextTick()
        })

        BddTest().then('the settings menu should be hidden', () => {
          expect(wrapper.find('.settings-menu').exists()).toBe(false)
        })
      })

      BddTest().when('the settings menu emits close event', () => {
        beforeEach(async () => {
          const settingsMenu = wrapper.findComponent({ name: 'StudentDetailedTraceCardSettingMenu' })
          await settingsMenu.vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('the settings menu should be hidden', () => {
          expect(wrapper.find('.settings-menu').exists()).toBe(false)
        })
      })
    })
  })

  BddTest().and('with different trace data', () => {
    const differentTrace: TraceViewDTO = {
      id: 'trace2',
      title: 'Another trace',
      status: ETraceStatus.ASSOCIATED,
      createdAt: '2025-06-15T10:42:00.000Z',
      updatedAt: '2025-06-16T15:18:00.000Z',
      willBeDeletedAt: nextMonthDateIsoString
    }

    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceModal, {
        props: { trace: differentTrace, showModal: true, onClose },
        global: { stubs }
      })
    })

    BddTest().when('the component is rendered', () => {
      BddTest().then('the modal title should contain the different trace title', () => {
        const modalTitle = wrapper.find('.n5')
        expect(modalTitle.text()).toContain('Détail de ma trace')
        expect(modalTitle.text()).toContain(differentTrace.title)
      })
    })

    BddTest().when('the settings button is clicked', () => {
      beforeEach(async () => {
        const settingsButton = wrapper.findComponent({
          name: 'AvButton',
          props: {
            icon: MDI_ICONS.DOTS_VERTICAL,
          }
        })
        await settingsButton.trigger('click')
      })

      BddTest().then('the settings menu should receive the correct trace data', () => {
        const settingsMenu = wrapper.findComponent({ name: 'StudentDetailedTraceCardSettingMenu' })
        expect(settingsMenu.props('trace')).toEqual(differentTrace)
      })
    })
  })

  BddTest().and('showModal is false', () => {
    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceModal, {
        props: { trace: mockedTrace, showModal: false, onClose },
        global: { stubs }
      })
    })

    BddTest().when('the component is rendered', () => {
      BddTest().then('the modal component should exist', () => {
        const avModal = wrapper.findComponent({ name: 'AvModal' })
        expect(avModal.exists()).toBe(true)
      })
    })
  })
})
