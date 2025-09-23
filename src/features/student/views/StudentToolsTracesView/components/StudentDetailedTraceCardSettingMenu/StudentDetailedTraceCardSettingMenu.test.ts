import { ETraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import StudentDetailedTraceCardSettingMenu from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCardSettingMenu/StudentDetailedTraceCardSettingMenu.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const displayModalMock = vi.fn()
const hideModalMock = vi.fn()

vi.mock('@/common/composables', () => ({
  useModal: () => ({
    showModal: true,
    displayModal: displayModalMock,
    hideModal: hideModalMock
  })
}))

BddTest().given('a setting menu', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDetailedTraceCardSettingMenu>>

  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma super trace',
    status: ETraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    willBeDeletedAt: '2025-07-16T10:42:00.000Z'
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

  BddTest().and('how prop set to true', () => {
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

    BddTest().when('the component is rendered', () => {
      BddTest().then('it should display the setting menu items', () => {
        expect(wrapper.find('.student-detailed-trace-card-setting-menu').exists()).toBe(true)
        const menuItems = wrapper.findAll('.student-detailed-trace-card-setting-menu__item')
        expect(menuItems).toHaveLength(2)
      })

      BddTest().then('it should display the modal when showModal is true', () => {
        expect(wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' }).exists()).toBe(true)
      })

      BddTest().then('it should display the delete button with correct props', () => {
        const buttons = wrapper.findAllComponents({ name: 'AvButton' })
        const deleteButton = buttons[0]
        expect(deleteButton.props('icon')).toBe(MDI_ICONS.TRASH_CAN_OUTLINE)
        expect(deleteButton.props('size')).toBe('sm')
        expect(deleteButton.props('label')).toBe('Supprimer ma trace')
      })

      BddTest().then('it should display the assign button with correct props', () => {
        const buttons = wrapper.findAllComponents({ name: 'AvButton' })
        const assignButton = buttons[1]
        expect(assignButton.props('icon')).toBe(MDI_ICONS.PLUS_CIRCLE_OUTLINE)
        expect(assignButton.props('size')).toBe('sm')
        expect(assignButton.props('label')).toBe('Assigner ma trace')
      })
    })

    BddTest().when('the delete button is clicked', () => {
      BddTest().then('it should call displayModal', async () => {
        const buttons = wrapper.findAllComponents({ name: 'AvButton' })
        const deleteButton = buttons[0]

        await deleteButton.trigger('click')
        expect(displayModalMock).toHaveBeenCalled()
      })
    })

    BddTest().when('deletion modal emits success', () => {
      BddTest().then('it should emit onTraceDelete and close', async () => {
        await wrapper.find('.success').trigger('click')
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(wrapper.emitted('onTraceDelete')?.[0]).toEqual([mockedTrace])
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })

    BddTest().when('deletion modal emits close', () => {
      BddTest().then('it should hide the modal', async () => {
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

  BddTest().and('how prop set to false', () => {
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

    BddTest().when('the component is rendered with show=false', () => {
      BddTest().then('it should not display anything', () => {
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
