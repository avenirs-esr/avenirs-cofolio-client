import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import StudentDetailedTraceCardSettingMenu from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCardSettingMenu/StudentDetailedTraceCardSettingMenu.vue'
import { MDI_ICONS } from '@/ui'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, vi } from 'vitest'

describe('studentDetailedTraceCardSettingMenu', () => {
  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['icon', 'variant', 'size', 'theme', 'label', 'iconScale'],
      template: `<button class="av-button" @click="$emit('click', $event)">
        <slot>{{ label }}</slot>
      </button>`,
      emits: ['click']
    }
  }

  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma super trace',
    status: TraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    deletionDate: '2025-07-16T10:42:00.000Z'
  }

  const differentTrace: TraceViewDTO = {
    id: 'trace2',
    title: 'Another trace',
    status: TraceStatus.ASSOCIATED,
    createdAt: '2025-06-15T10:42:00.000Z',
    updatedAt: '2025-06-16T15:18:00.000Z',
    deletionDate: '2025-07-15T10:42:00.000Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('given a settings menu with show prop set to true', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceCardSettingMenu, {
        props: {
          trace: mockedTrace,
          show: true
        },
        global: {
          stubs,
        },
      })
    })

    describe('when the component is rendered', () => {
      it('then the menu should be visible', () => {
        expect(wrapper.find('.student-detailed-trace-card-setting-menu').exists()).toBe(true)
      })

      it('then the delete button should be present', () => {
        expect(wrapper.findComponent({ name: 'AvButton' }).exists()).toBe(true)
      })

      it('then the correct delete text should be displayed', () => {
        expect(wrapper.text()).toContain('Supprimer ma trace')
      })

      it('then the correct CSS classes should be applied', () => {
        expect(wrapper.find('.student-detailed-trace-card-setting-menu').exists()).toBe(true)
        expect(wrapper.find('.student-detailed-trace-card-setting-menu__item').exists()).toBe(true)
      })

      it('then the delete button should have correct props', () => {
        const deleteButton = wrapper.findComponent({ name: 'AvButton' })

        expect(deleteButton.props()).toMatchObject({
          size: 'sm',
          theme: 'SECONDARY',
          label: 'Supprimer ma trace',
          iconScale: 1.3
        })
        expect(deleteButton.props('icon')).toEqual(MDI_ICONS.TRASH_CAN_OUTLINE)
      })
    })

    describe('when the delete button is clicked', () => {
      beforeEach(async () => {
        const deleteButton = wrapper.findComponent({ name: 'AvButton' })
        await deleteButton.trigger('click')
      })

      it('then the onTraceDelete event should be emitted', () => {
        expect(wrapper.emitted('onTraceDelete')).toBeTruthy()
      })

      it('then the onTraceDelete event should contain the correct trace data', () => {
        expect(wrapper.emitted('onTraceDelete')?.[0]).toEqual([mockedTrace])
      })

      it('then the close event should be emitted', () => {
        expect(wrapper.emitted('close')).toBeTruthy()
      })
    })
  })

  describe('given a settings menu with show prop set to false', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceCardSettingMenu, {
        props: {
          trace: mockedTrace,
          show: false
        },
        global: {
          stubs,
        },
      })
    })

    describe('when the component is rendered', () => {
      it('then the menu should not be visible', () => {
        expect(wrapper.find('.student-detailed-trace-card-setting-menu').exists()).toBe(false)
      })
    })
  })

  describe('given a settings menu with a different trace object', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentDetailedTraceCardSettingMenu, {
        props: {
          trace: differentTrace,
          show: true
        },
        global: {
          stubs,
        },
      })
    })

    describe('when the delete button is clicked', () => {
      beforeEach(async () => {
        const deleteButton = wrapper.findComponent({ name: 'AvButton' })
        await deleteButton.trigger('click')
      })

      it('then the onTraceDelete event should contain the different trace object', () => {
        expect(wrapper.emitted('onTraceDelete')?.[0]).toEqual([differentTrace])
      })
    })
  })
})
