import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import StudentDetailedTraceCardSettingMenu from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCardSettingMenu/StudentDetailedTraceCardSettingMenu.vue'
import { MDI_ICONS } from '@/ui/tokens/icons'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const displayModalMock = vi.fn()
const hideModalMock = vi.fn()

vi.mock('@/common/composables', () => ({
  useModal: () => ({
    showModal: true,
    displayModal: displayModalMock,
    hideModal: hideModalMock
  })
}))

describe('studentDetailedTraceCardSettingMenu', () => {
  let wrapper: VueWrapper

  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma super trace',
    status: TraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    deletedAt: '2025-07-16T10:42:00.000Z'
  }

  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['icon', 'variant', 'size', 'theme', 'label', 'iconScale', 'disabled', 'noRadius', 'onClick'],
      emits: ['click'],
      template: `<button class="av-button" @click="$emit('click')"><slot>{{ label }}</slot></button>`
    },
    TraceDeletionConfirmationModal: {
      name: 'TraceDeletionConfirmationModal',
      props: ['trace', 'show', 'onConfirmDelete', 'onClose'],
      template: `<div class="trace-deletion-modal" v-if="show">
        <button class="success" @click="onConfirmDelete()">confirm</button>
        <button class="close" @click="onClose()">close</button>
      </div>`
    }
  }

  describe('given a settings menu with show prop set to true', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mount(StudentDetailedTraceCardSettingMenu, {
        props: {
          trace: mockedTrace,
          show: true
        },
        global: {
          stubs
        }
      })
    })

    describe('when the component is rendered', () => {
      it('then it should display the setting menu and the delete button', () => {
        expect(wrapper.find('.student-detailed-trace-card-setting-menu').exists()).toBe(true)
        expect(wrapper.find('.student-detailed-trace-card-setting-menu__item').exists()).toBe(true)
      })

      it('then it should display the modal when showModal is true', () => {
        expect(wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' }).exists()).toBe(true)
      })

      it('then it should pass the correct props to AvButton', () => {
        const button = wrapper.findComponent({ name: 'AvButton' })
        expect(button.props('icon')).toBe(MDI_ICONS.TRASH_CAN_OUTLINE)
        expect(button.props('size')).toBe('sm')
      })
    })

    describe('when deletion modal emits success', () => {
      it('then it should emit onTraceDelete and close', async () => {
        await wrapper.find('.success').trigger('click')
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(wrapper.emitted('onTraceDelete')?.[0]).toEqual([mockedTrace])
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    describe('when deletion modal emits close', () => {
      it('then it should hide the modal', async () => {
        const localWrapper = mount(StudentDetailedTraceCardSettingMenu, {
          props: {
            trace: mockedTrace,
            show: true
          },
          global: { stubs }
        })

        await localWrapper.find('.close').trigger('click')
        expect(hideModalMock).toHaveBeenCalled()
      })
    })
  })

  describe('given a settings menu with show prop set to false', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mount(StudentDetailedTraceCardSettingMenu, {
        props: {
          trace: mockedTrace,
          show: false
        },
        global: {
          stubs
        }
      })
    })

    describe('when the component is rendered with show=false', () => {
      it('then it should not display anything', () => {
        wrapper = mount(StudentDetailedTraceCardSettingMenu, {
          props: {
            trace: mockedTrace,
            show: false
          },
          global: { stubs }
        })

        expect(wrapper.find('.student-detailed-trace-card-setting-menu').exists()).toBe(false)
      })
    })
  })
})
