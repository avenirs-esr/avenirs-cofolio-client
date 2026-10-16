import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, AvIconTextStub, AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { getAvButtonByTestId, mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { EUserCategory } from '@/api/avenir-esr'
import SwitchUniverse from '@/common/components/navigation/SwitchUniverse/SwitchUniverse.vue'
import { ROUTES } from '@/common/constants'

const mockModalOpened = ref(false)
const mockOpenModal = vi.fn()
const mockCloseModal = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      modalOpened: mockModalOpened,
      openModal: mockOpenModal,
      closeModal: mockCloseModal
    }),
  }
})

const mockCategories = ref<EUserCategory[]>([])
const mockActiveProfileCategory = ref<EUserCategory>()
const mockCanSwitchProfile = ref(false)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    categories: mockCategories,
    activeProfileCategory: mockActiveProfileCategory,
    canSwitchProfile: mockCanSwitchProfile
  })
}))

BddTest().given('a universe switcher', () => {
  let wrapper: VueWrapper<InstanceType<typeof SwitchUniverse>>

  const stubs = {
    AvButton: AvButtonStub,
    AvModal: AvModalStub,
    AvIconText: AvIconTextStub
  }

  const mountWith = async (
    categories: EUserCategory[],
    activeCategory: EUserCategory,
    canSwitch: boolean
  ) => {
    vi.clearAllMocks()
    mockModalOpened.value = false

    mockCategories.value = categories
    mockActiveProfileCategory.value = activeCategory
    mockCanSwitchProfile.value = canSwitch

    wrapper = await mountWithRouter<typeof SwitchUniverse>(SwitchUniverse, {
      global: {
        stubs
      }
    })
  }

  const getMainButton = () => wrapper.findComponent(AvButtonStub)
  const getCategoryButton = (category: EUserCategory) => getAvButtonByTestId(wrapper, `${category}-button`)

  beforeEach(() => {
    vi.clearAllMocks()
    mockModalOpened.value = false
  })

  BddTest().and('a user with both profiles, currently on the student one', () => {
    beforeEach(async () => {
      await mountWith([EUserCategory.STAFF, EUserCategory.STUDENT], EUserCategory.STUDENT, true)
    })

    BddTest().when('the switcher is displayed', () => {
      BddTest().then('it should enable the main switch button', () => {
        expect(getMainButton().props('disabled')).toBe(false)
      })
    })

    BddTest().when('clicking the main switch button', () => {
      BddTest().then('it should display the modal', async () => {
        await wrapper.find('button').trigger('click')
        expect(mockOpenModal).toHaveBeenCalled()
      })
    })

    BddTest().when('the modal is opened', () => {
      beforeEach(async () => {
        mockModalOpened.value = true
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should offer a button per profile, each linking to its home', () => {
        expect(getCategoryButton(EUserCategory.STAFF).props('to')).toEqual(ROUTES.STAFF.HOME)
        expect(getCategoryButton(EUserCategory.STUDENT).props('to')).toEqual(ROUTES.STUDENT.HOME)
      })

      BddTest().then('it should only disable the button of the current profile', () => {
        expect(getCategoryButton(EUserCategory.STUDENT).props('disabled')).toBe(true)
        expect(getCategoryButton(EUserCategory.STAFF).props('disabled')).toBe(false)
      })
    })

    BddTest().when('choosing the staff profile in the modal', () => {
      beforeEach(async () => {
        mockModalOpened.value = true
        await wrapper.vm.$nextTick()
        getCategoryButton(EUserCategory.STAFF).vm.$emit('click')
      })

      BddTest().then('it should close the modal', () => {
        expect(mockCloseModal).toHaveBeenCalled()
      })
    })
  })

  BddTest().and('a user with both profiles, currently on the staff one', () => {
    beforeEach(async () => {
      await mountWith([EUserCategory.STAFF, EUserCategory.STUDENT], EUserCategory.STAFF, true)
    })

    BddTest().when('the modal is opened', () => {
      beforeEach(async () => {
        mockModalOpened.value = true
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should only disable the button of the current profile', () => {
        expect(getCategoryButton(EUserCategory.STAFF).props('disabled')).toBe(true)
        expect(getCategoryButton(EUserCategory.STUDENT).props('disabled')).toBe(false)
      })
    })

    BddTest().when('choosing the student profile in the modal', () => {
      beforeEach(async () => {
        mockModalOpened.value = true
        await wrapper.vm.$nextTick()
        getCategoryButton(EUserCategory.STUDENT).vm.$emit('click')
      })

      BddTest().then('it should close the modal', () => {
        expect(mockCloseModal).toHaveBeenCalled()
      })
    })
  })

  BddTest().and('a user with a single profile', () => {
    beforeEach(async () => {
      await mountWith([EUserCategory.STUDENT], EUserCategory.STUDENT, false)
    })

    BddTest().when('the switcher is displayed', () => {
      BddTest().then('it should disable the main switch button', () => {
        expect(getMainButton().props('disabled')).toBe(true)
      })
    })
  })
})
