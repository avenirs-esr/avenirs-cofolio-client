import type { VueWrapper } from '@vue/test-utils'
import type { Config } from 'driver.js'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import Tutorial from '@/common/components/overlay/tooltips/Tutorial/Tutorial.vue'
import { ROUTES } from '@/common/constants'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const markTutorialAsSeen = vi.fn()
const hasSeenTutorial = ref(true)
const replayRequested = ref(false)

vi.mock('@/common/components/overlay/tooltips/Tutorial/use-tutorial', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/components/overlay/tooltips/Tutorial/use-tutorial')>()

  return {
    ...actual,
    useTutorial: () => ({
      markTutorialAsSeen,
      hasSeenTutorial,
      replayRequested
    })
  }
})

const modalOpened = ref(false)
const openModal = vi.fn(() => {
  modalOpened.value = true
})
const closeModal = vi.fn(() => {
  modalOpened.value = false
})

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()

  return {
    ...actual,
    useModal: () => ({
      modalOpened,
      openModal,
      closeModal
    })
  }
})

const route = reactive<{ name: string }>({
  name: ROUTES.STAFF.HOME.name
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => route
  }
})

const drive = vi.fn()
let driverConfig: Config | undefined

vi.mock('driver.js', () => ({
  driver: vi.fn((config: Config) => {
    driverConfig = config

    return {
      drive
    }
  })
}))

const stubs = {
  ConfirmationModal: ConfirmationModalStub
}

BddTest().given('a tutorial component', () => {
  let wrapper: VueWrapper<InstanceType<typeof Tutorial>>

  const mountTutorial = () => {
    wrapper = mountComponent(Tutorial, {
      global: { stubs }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()

    hasSeenTutorial.value = true
    replayRequested.value = false
    modalOpened.value = false
    route.name = ROUTES.STAFF.HOME.name
  })

  BddTest().when('the tutorial has already been seen', () => {
    beforeEach(() => {
      mountTutorial()
    })

    BddTest().then('it should not open the confirmation modal', () => {
      expect(openModal).not.toHaveBeenCalled()
      expect(wrapper.findComponent(ConfirmationModalStub).props('opened')).toBe(false)
    })
  })

  BddTest().when('the tutorial has not been seen', () => {
    beforeEach(() => {
      hasSeenTutorial.value = false
      mountTutorial()
    })

    BddTest().then('it should open the confirmation modal', () => {
      expect(openModal).toHaveBeenCalled()
      expect(wrapper.findComponent(ConfirmationModalStub).props('opened')).toBe(true)
    })
  })

  BddTest().when('the confirmation modal is closed', () => {
    beforeEach(() => {
      mountTutorial()
    })

    BddTest().then('it should mark the tutorial as seen and close the modal', async () => {
      await wrapper.findComponent(ConfirmationModalStub).vm.$emit('close')

      expect(markTutorialAsSeen).toHaveBeenCalled()
      expect(closeModal).toHaveBeenCalled()
    })
  })

  BddTest().when('the confirmation modal is confirmed', () => {
    beforeEach(() => {
      mountTutorial()
    })

    BddTest().then('it should close the modal and start the tutorial', async () => {
      await wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')

      expect(closeModal).toHaveBeenCalled()
      expect(drive).toHaveBeenCalled()
    })
  })

  BddTest().when('the tutorial replay is requested', () => {
    beforeEach(() => {
      mountTutorial()
    })

    BddTest().then('it should open the confirmation modal and reset the replay request', async () => {
      replayRequested.value = true

      await wrapper.vm.$nextTick()

      expect(openModal).toHaveBeenCalled()
      expect(replayRequested.value).toBe(false)
    })
  })

  BddTest().when('the tutorial is started on a staff route', () => {
    beforeEach(() => {
      route.name = ROUTES.STAFF.HOME.name
      mountTutorial()
    })

    BddTest().then('it should use the staff tutorial', async () => {
      await wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')

      expect(drive).toHaveBeenCalled()
    })
  })

  BddTest().when('the tutorial is started on a student route', () => {
    beforeEach(() => {
      route.name = ROUTES.STUDENT.HOME.name
      mountTutorial()
    })

    BddTest().then('it should use the student tutorial', async () => {
      await wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')

      expect(drive).toHaveBeenCalled()
    })
  })

  BddTest().when('the tutorial is destroyed', () => {
    beforeEach(() => {
      mountTutorial()
    })

    BddTest().then('it should mark the tutorial as seen and close the modal', () => {
      const onDestroyed = driverConfig?.onDestroyed as (() => void) | undefined
      onDestroyed?.()

      expect(markTutorialAsSeen).toHaveBeenCalled()
      expect(closeModal).toHaveBeenCalled()
    })
  })
})
