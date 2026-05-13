import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityDraftCreationResponse } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { createActivityDraftErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { ActivityTitleInputStub } from '@/features/staff/activities/components/interactions/inputs/ActivityTitleInput/ActivityTitleInput.stub'
import ActivityDraftCreationModal from '@/features/staff/activities/views/ActivitiesView/components/ActivityDraftCreationModal/ActivityDraftCreationModal.vue'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockNavigateToEdit = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStaffActivitiesEditNationalActivity: mockNavigateToEdit,
    }),
  }
})

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addErrorMessage: mockAddErrorMessage,
    })),
  }
})

BddTest().given('ActivityDraftCreationModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDraftCreationModal>>

  const stubs = {
    AvModal: AvModalStub,
    ActivityTitleInput: ActivityTitleInputStub,
  }

  const getModal = () => wrapper.findComponent(AvModalStub) as VueWrapper<InstanceType<typeof AvModalStub>>
  const getTitleInput = () => wrapper.findComponent(ActivityTitleInputStub) as VueWrapper<InstanceType<typeof ActivityTitleInputStub>>

  const fillValidTitle = async () => {
    await getTitleInput().vm.$emit('update:modelValue', 'Mon activité nationale')
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(ActivityDraftCreationModal, {
      props: { opened: true },
      global: { stubs },
    })
  })

  BddTest().when('the modal is mounted with opened=true', () => {
    BddTest().then('it should render the AvModal component', () => {
      expect(getModal().exists()).toBe(true)
    })

    BddTest().then('it should pass opened=true to AvModal', () => {
      expect(getModal().props('opened')).toBe(true)
    })

    BddTest().then('it should pass the correct close button label', () => {
      expect(getModal().props('closeButtonLabel')).toBe('Annuler')
    })

    BddTest().then('it should pass the correct confirm button label', () => {
      expect(getModal().props('confirmButtonLabel')).toBe('Créer')
    })

    BddTest().then('it should render the modal title', () => {
      expect(wrapper.text()).toContain('Créer une activité')
    })

    BddTest().then('it should render the ActivityTitleInput', () => {
      expect(getTitleInput().exists()).toBe(true)
    })

    BddTest().then('it should have the confirm button disabled initially', () => {
      expect(getModal().props('confirmButtonDisabled')).toBe(true)
    })
  })

  BddTest().when('mounted with opened=false', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityDraftCreationModal, {
        props: { opened: false },
        global: { stubs },
      })
    })

    BddTest().then('it should pass opened=false to AvModal', () => {
      expect(getModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the title input is filled with a valid value', () => {
    beforeEach(async () => {
      await fillValidTitle()
    })

    BddTest().then('it should enable the confirm button', async () => {
      await vi.waitFor(() => expect(getModal().props('confirmButtonDisabled')).toBe(false))
    })
  })

  BddTest().when('the close button is clicked', () => {
    beforeEach(async () => {
      await getModal().vm.$emit('close')
    })

    BddTest().then('it should emit the close event', () => {
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  BddTest().when('the form is submitted with a valid title and the API succeeds', () => {
    beforeEach(async () => {
      await fillValidTitle()
      await getModal().vm.$emit('confirm')
    })

    BddTest().then('it should emit the close event', async () => {
      await vi.waitFor(() => expect(wrapper.emitted('close')).toBeTruthy())
    })

    BddTest().then('it should navigate to the edit page with the draft id', async () => {
      await vi.waitFor(() => {
        expect(mockNavigateToEdit).toHaveBeenCalledWith({
          id: mockedActivityDraftCreationResponse.draftId,
          mode: 'add',
        })
      })
    })
  })

  BddTest().when('the form is submitted with a valid title and the API returns an error', () => {
    beforeEach(async () => {
      server.use(createActivityDraftErrorHandler)
      await fillValidTitle()
      await getModal().vm.$emit('confirm')
    })

    BddTest().then('it should call addErrorMessage', async () => {
      await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalledTimes(1))
    })

    BddTest().then('it should call addErrorMessage with the correct error title', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Une erreur est survenue lors de la création de l\'activité',
          })
        )
      })
    })
  })
})
