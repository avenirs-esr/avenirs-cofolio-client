import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, AvIconTextStub, AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { getAvButtonByTestId, mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { EUniverse } from '@/api/avenir-esr'
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

const mockUniverses = ref<EUniverse[]>([])
const mockActiveUniverse = ref<EUniverse>()
const mockCanSwitchUniverse = ref(false)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    universes: {
      available: mockUniverses,
      active: mockActiveUniverse,
      canSwitch: mockCanSwitchUniverse
    }
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
    universes: EUniverse[],
    activeUniverse: EUniverse,
    canSwitch: boolean
  ) => {
    vi.clearAllMocks()
    mockModalOpened.value = false

    mockUniverses.value = universes
    mockActiveUniverse.value = activeUniverse
    mockCanSwitchUniverse.value = canSwitch

    wrapper = await mountWithRouter<typeof SwitchUniverse>(SwitchUniverse, {
      global: {
        stubs
      }
    })
  }

  const getMainButton = () => wrapper.findComponent(AvButtonStub)
  const getUniverseButton = (universe: EUniverse) => getAvButtonByTestId(wrapper, `${universe}-button`)

  beforeEach(() => {
    vi.clearAllMocks()
    mockModalOpened.value = false
  })

  BddTest().and('a user with both universes, currently on the student one', () => {
    beforeEach(async () => {
      await mountWith([EUniverse.STAFF, EUniverse.STUDENT], EUniverse.STUDENT, true)
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

      BddTest().then('it should offer a button per universe, each linking to its home', () => {
        expect(getUniverseButton(EUniverse.STAFF).props('to')).toEqual(ROUTES.STAFF.HOME)
        expect(getUniverseButton(EUniverse.STUDENT).props('to')).toEqual(ROUTES.STUDENT.HOME)
      })

      BddTest().then('it should only disable the button of the current universe', () => {
        expect(getUniverseButton(EUniverse.STUDENT).props('disabled')).toBe(true)
        expect(getUniverseButton(EUniverse.STAFF).props('disabled')).toBe(false)
      })
    })

    BddTest().when('choosing the staff universe in the modal', () => {
      beforeEach(async () => {
        mockModalOpened.value = true
        await wrapper.vm.$nextTick()
        getUniverseButton(EUniverse.STAFF).vm.$emit('click')
      })

      BddTest().then('it should close the modal', () => {
        expect(mockCloseModal).toHaveBeenCalled()
      })
    })
  })

  BddTest().and('a user with both universes, currently on the staff one', () => {
    beforeEach(async () => {
      await mountWith([EUniverse.STAFF, EUniverse.STUDENT], EUniverse.STAFF, true)
    })

    BddTest().when('the modal is opened', () => {
      beforeEach(async () => {
        mockModalOpened.value = true
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should only disable the button of the current universe', () => {
        expect(getUniverseButton(EUniverse.STAFF).props('disabled')).toBe(true)
        expect(getUniverseButton(EUniverse.STUDENT).props('disabled')).toBe(false)
      })
    })

    BddTest().when('choosing the student universe in the modal', () => {
      beforeEach(async () => {
        mockModalOpened.value = true
        await wrapper.vm.$nextTick()
        getUniverseButton(EUniverse.STUDENT).vm.$emit('click')
      })

      BddTest().then('it should close the modal', () => {
        expect(mockCloseModal).toHaveBeenCalled()
      })
    })
  })

  BddTest().and('a user with a single universe', () => {
    beforeEach(async () => {
      await mountWith([EUniverse.STUDENT], EUniverse.STUDENT, false)
    })

    BddTest().when('the switcher is displayed', () => {
      BddTest().then('it should disable the main switch button', () => {
        expect(getMainButton().props('disabled')).toBe(true)
      })
    })
  })
})
