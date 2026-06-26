import type { VueWrapper } from '@vue/test-utils'
import SwitchUniverse from '@/common/components/SwitchUniverse/SwitchUniverse.vue'
import { AvButtonStub, AvIconTextStub, AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { type RouteLocationNormalizedLoadedGeneric, useRoute } from 'vue-router'

const mockShowModal = ref(false)
const mockDisplayModal = vi.fn()
const mockHideModal = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      showModal: mockShowModal,
      displayModal: mockDisplayModal,
      hideModal: mockHideModal
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
  AvButton: AvButtonStub,
  AvModal: AvModalStub,
  AvIconText: AvIconTextStub
}

BddTest().given('a universe switcher', () => {
  let wrapper: VueWrapper

  const getStaffButton = () => wrapper.find('[data-testid="staff-button"]')
  const getStudentButton = () => wrapper.find('[data-testid="student-button"]')

  BddTest().and('we are on student route', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      vi.mocked(useRoute).mockReturnValue({
        path: '/student/home'
      } as RouteLocationNormalizedLoadedGeneric)

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

      BddTest().then('it should render staff action as a link to staff home', () => {
        expect(getStaffButton().attributes('data-tag')).toBe('router-link')
        expect(getStaffButton().attributes('href')).toBeDefined()
      })

      BddTest().then('it should not trigger hideModal on click because link mode does not emit click', async () => {
        await getStaffButton().trigger('click')

        expect(mockHideModal).not.toHaveBeenCalled()
      })
    })

    BddTest().when('clicking the student button in modal', () => {
      beforeEach(async () => {
        mockShowModal.value = true
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should render student action as button (already on student universe)', () => {
        expect(getStudentButton().attributes('data-tag')).toBe('button')
      })

      BddTest().then('it should hide the modal when clicking student button', async () => {
        await getStudentButton().trigger('click')

        expect(mockHideModal).toHaveBeenCalled()
      })
    })
  })

  BddTest().and('we are on staff route', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      vi.mocked(useRoute).mockReturnValue({
        path: '/staff/home'
      } as RouteLocationNormalizedLoadedGeneric)

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

      BddTest().then('it should render student action as a link to student home', () => {
        expect(getStudentButton().attributes('data-tag')).toBe('router-link')
        expect(getStudentButton().attributes('href')).toBeDefined()
      })

      BddTest().then('it should not trigger hideModal on click because link mode does not emit click', async () => {
        await getStudentButton().trigger('click')

        expect(mockHideModal).not.toHaveBeenCalled()
      })
    })

    BddTest().when('clicking the staff button in modal', () => {
      beforeEach(async () => {
        mockShowModal.value = true
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should render staff action as button (already on staff universe)', () => {
        expect(getStaffButton().attributes('data-tag')).toBe('button')
      })
    })
  })
})
