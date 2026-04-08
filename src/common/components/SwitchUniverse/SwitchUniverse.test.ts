import type { VueWrapper } from '@vue/test-utils'
import SwitchUniverse from '@/common/components/SwitchUniverse/SwitchUniverse.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { useRoute } from 'vue-router'

const mockShowModal = ref(false)
const mockDisplayModal = vi.fn()
const mockHideModal = vi.fn()
const navigateToStudentHome = vi.fn()
const navigateToStaffHome = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      showModal: mockShowModal,
      displayModal: mockDisplayModal,
      hideModal: mockHideModal
    }),
    useNavigation: () => ({
      navigateToStudentHome,
      navigateToStaffHome
    }),
  }
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

const stubs = {
  AvButton: {
    name: 'AvButton',
    props: ['label', 'onClick'],
    template: `<button class="av-button" @click="onClick" />`
  },
  AvModal: {
    name: 'AvModal',
    props: ['opened'],
    emits: ['close'],
    template: `
      <div v-if="opened" class="av-modal">
        <slot name="header"></slot>
        <slot></slot>
      </div>
    `
  },
  AvIconText: {
    name: 'AvIconText',
    template: '<div class="av-icon-text" />'
  }
}

BddTest().given('a universe switcher', () => {
  let wrapper: VueWrapper

  BddTest().and('we are on student route', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      vi.mocked(useRoute).mockReturnValue({
        path: '/student/home'
      } as any)

      wrapper = await mountWithRouter(SwitchUniverse, {
        global: {
          stubs
        }
      })
    })

    BddTest().when('clicking the main switch button', () => {
      BddTest().then('it should display the modal', async () => {
        const button = wrapper.find('button')
        await button.trigger('click')
        expect(mockDisplayModal).toHaveBeenCalled()
      })
    })

    BddTest().when('clicking the staff button in modal', () => {
      beforeEach(async () => {
        mockShowModal.value = true
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the modal and navigate to staff', async () => {
        const staffButton = wrapper.findAll('button')[1]
        await staffButton.trigger('click')

        expect(mockHideModal).toHaveBeenCalled()
        expect(navigateToStaffHome).toHaveBeenCalled()
        expect(navigateToStudentHome).not.toHaveBeenCalled()
      })
    })

    BddTest().when('clicking the student button in modal', () => {
      beforeEach(async () => {
        mockShowModal.value = true
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the modal and do nothing (already student)', async () => {
        const studentButton = wrapper.findAll('button')[2]
        await studentButton.trigger('click')

        expect(mockHideModal).toHaveBeenCalled()
        expect(navigateToStaffHome).not.toHaveBeenCalled()
        expect(navigateToStudentHome).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().and('we are on staff route', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      vi.mocked(useRoute).mockReturnValue({
        path: '/staff/home'
      } as any)

      wrapper = await mountWithRouter(SwitchUniverse, {
        global: {
          stubs
        }
      })
    })

    BddTest().when('clicking the student button in modal', () => {
      beforeEach(async () => {
        mockShowModal.value = true
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the modal and navigate to student', async () => {
        const studentButton = wrapper.findAll('button')[2]
        await studentButton.trigger('click')

        expect(mockHideModal).toHaveBeenCalled()
        expect(navigateToStudentHome).toHaveBeenCalled()
        expect(navigateToStaffHome).not.toHaveBeenCalled()
      })
    })
  })
})
