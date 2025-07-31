import type { VueWrapper } from '@vue/test-utils'
import { mountWithRouter } from '@/ui/tests/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoute } from 'vue-router'
import SwitchUniverse from './SwitchUniverse.vue'

const mockShowModal = ref(false)
const mockDisplayModal = vi.fn()
const mockHideModal = vi.fn()
const navigateToStudentHome = vi.fn()
const navigateToTeacherHome = vi.fn()

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
      navigateToTeacherHome
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

describe('switchUniverse', () => {
  let wrapper: VueWrapper

  describe('given we are on student route', () => {
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

    describe('when clicking the main switch button', () => {
      it('then it should display the modal', async () => {
        const button = wrapper.find('button')
        await button.trigger('click')
        expect(mockDisplayModal).toHaveBeenCalled()
      })
    })

    describe('when clicking the teacher button in modal', () => {
      beforeEach(async () => {
        mockShowModal.value = true
        await wrapper.vm.$nextTick()
      })

      it('then it should hide the modal and navigate to teacher', async () => {
        const teacherButton = wrapper.findAll('button')[1]
        await teacherButton.trigger('click')

        expect(mockHideModal).toHaveBeenCalled()
        expect(navigateToTeacherHome).toHaveBeenCalled()
        expect(navigateToStudentHome).not.toHaveBeenCalled()
      })
    })

    describe('when clicking the student button in modal', () => {
      beforeEach(async () => {
        mockShowModal.value = true
        await wrapper.vm.$nextTick()
      })

      it('then it should hide the modal and do nothing (already student)', async () => {
        const studentButton = wrapper.findAll('button')[2]
        await studentButton.trigger('click')

        expect(mockHideModal).toHaveBeenCalled()
        expect(navigateToTeacherHome).not.toHaveBeenCalled()
        expect(navigateToStudentHome).not.toHaveBeenCalled()
      })
    })
  })

  describe('given we are on teacher route', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      vi.mocked(useRoute).mockReturnValue({
        path: '/teacher/home'
      } as any)

      wrapper = await mountWithRouter(SwitchUniverse, {
        global: {
          stubs
        }
      })
    })

    describe('when clicking the student button in modal', () => {
      beforeEach(async () => {
        mockShowModal.value = true
        await wrapper.vm.$nextTick()
      })

      it('then it should hide the modal and navigate to student', async () => {
        const studentButton = wrapper.findAll('button')[2]
        await studentButton.trigger('click')

        expect(mockHideModal).toHaveBeenCalled()
        expect(navigateToStudentHome).toHaveBeenCalled()
        expect(navigateToTeacherHome).not.toHaveBeenCalled()
      })
    })
  })
})
