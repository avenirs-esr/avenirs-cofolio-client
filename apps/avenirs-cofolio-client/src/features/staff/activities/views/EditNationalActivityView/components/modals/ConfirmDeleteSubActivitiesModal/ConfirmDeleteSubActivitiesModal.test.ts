import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type { ConfirmDeleteSubActivitiesModalProps } from '@/features/staff/activities/views/EditNationalActivityView/components/modals/ConfirmDeleteSubActivitiesModal/ConfirmDeleteSubActivitiesModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { mockAddErrorMessage, mockAddSuccessMessage } from 'tests/mocks'
import { afterAll, beforeAll, beforeEach, expect, vi } from 'vitest'
import { mockedSubActivitiesOverviewDTO } from '@/__mocks__/fixtures/shared/activities.fixtures'
import { mockedActivityContentWithEnrolledStudent1, mockedActivityContentWithSubActivities } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { server } from '@/__mocks__/msw/server'
import ConfirmDeleteSubActivitiesModal from '@/features/staff/activities/views/EditNationalActivityView/components/modals/ConfirmDeleteSubActivitiesModal/ConfirmDeleteSubActivitiesModal.vue'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const SUB_ACTIVITY_ID_PATTERN = /\/sub-activities\/([^/]+)$/

BddTest().given('a ConfirmDeleteSubActivitiesModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ConfirmDeleteSubActivitiesModal>>

  const deletionEvents: string[] = []

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
  }

  function getDeletedSubActivityId (request: Request) {
    return request.method === 'DELETE' ? new URL(request.url).pathname.match(SUB_ACTIVITY_ID_PATTERN)?.[1] : undefined
  }

  function recordDeletionStart ({ request }: { request: Request }) {
    const subActivityId = getDeletedSubActivityId(request)
    if (subActivityId) {
      deletionEvents.push(`start:${subActivityId}`)
    }
  }

  function recordDeletionEnd ({ request }: { request: Request }) {
    const subActivityId = getDeletedSubActivityId(request)
    if (subActivityId) {
      deletionEvents.push(`end:${subActivityId}`)
    }
  }

  function mountWith (props: Partial<ConfirmDeleteSubActivitiesModalProps> = {}) {
    wrapper = mountComponent(ConfirmDeleteSubActivitiesModal, {
      props: {
        opened: true,
        activityDraftId: mockedActivityContentWithSubActivities.id,
        subActivities: mockedSubActivitiesOverviewDTO,
        ...props,
      },
      global: { stubs },
    })
  }

  const getModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getTitle = () => wrapper.find('[data-testid="confirm-delete-sub-activities-modal-title"]')
  const getItems = () => wrapper.findAll('[data-testid="confirm-delete-sub-activities-modal-item"]')

  async function confirmDeletion () {
    getModal().vm.$emit('confirm')
    await flushPromises()
  }

  beforeAll(() => {
    server.events.on('request:start', recordDeletionStart)
    server.events.on('response:mocked', recordDeletionEnd)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    deletionEvents.length = 0
  })

  afterAll(() => {
    server.events.removeListener('request:start', recordDeletionStart)
    server.events.removeListener('response:mocked', recordDeletionEnd)
  })

  BddTest().when('it is opened with several sub-activities', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should open the confirmation modal, not loading', () => {
      expect(getModal().props('opened')).toBe(true)
      expect(getModal().props('isLoading')).toBe(false)
    })

    BddTest().then('it should display the plural title', () => {
      expect(getTitle().text()).toBe('Êtes-vous certain(e) de vouloir supprimer les sous-activités sélectionnées ?')
    })

    BddTest().then('it should list the titles of the sub-activities', () => {
      expect(getItems().map(item => item.text())).toEqual(mockedSubActivitiesOverviewDTO.map(({ title }) => title))
    })

    BddTest().and('the user closes the modal', () => {
      beforeEach(async () => {
        getModal().vm.$emit('close')
        await flushPromises()
      })

      BddTest().then('it should emit cancel without deleting anything', () => {
        expect(wrapper.emitted('cancel')).toHaveLength(1)
        expect(deletionEvents).toEqual([])
      })
    })

    BddTest().and('the user confirms', () => {
      beforeEach(async () => {
        await confirmDeletion()
      })

      BddTest().then('it should delete the sub-activities one after the other', async () => {
        await vi.waitFor(() => {
          expect(deletionEvents).toEqual(mockedSubActivitiesOverviewDTO.flatMap(({ id }) => [`start:${id}`, `end:${id}`]))
        })
      })

      BddTest().then('it should show a success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('3 sous-activités supprimées avec succès')
        })
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })

      BddTest().then('it should emit deleted', async () => {
        await vi.waitFor(() => {
          expect(wrapper.emitted('deleted')).toHaveLength(1)
        })
      })
    })
  })

  BddTest().when('it is opened with a single sub-activity', () => {
    beforeEach(() => {
      mountWith({ subActivities: [mockedSubActivitiesOverviewDTO[0]] })
    })

    BddTest().then('it should display the singular title', () => {
      expect(getTitle().text()).toBe('Êtes-vous certain(e) de vouloir supprimer la sous-activité sélectionnée ?')
    })

    BddTest().and('the user confirms', () => {
      beforeEach(async () => {
        await confirmDeletion()
      })

      BddTest().then('it should show the singular success message', async () => {
        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith('1 sous-activité supprimée avec succès')
        })
      })
    })
  })

  BddTest().when('the deletion of a sub-activity fails in the middle of the selection', () => {
    const failingSubActivity: SubActivityOverviewDTO = { id: 'INTERNAL_ERROR_ID', title: 'Sous-activité en erreur', publishable: true }
    const subActivities = [mockedSubActivitiesOverviewDTO[0], failingSubActivity, mockedSubActivitiesOverviewDTO[1]]

    beforeEach(async () => {
      mountWith({ subActivities })
      await confirmDeletion()
    })

    BddTest().then('it should stop at the failing sub-activity', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
      expect(deletionEvents).toEqual([
        `start:${subActivities[0].id}`,
        `end:${subActivities[0].id}`,
        `start:${failingSubActivity.id}`,
        `end:${failingSubActivity.id}`,
      ])
    })

    BddTest().then('it should show an error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Une erreur est survenue lors de la suppression des sous-activités',
        }))
      })
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should not emit deleted', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
      expect(wrapper.emitted('deleted')).toBeUndefined()
    })
  })

  BddTest().when('learners are enrolled in the activity', () => {
    beforeEach(async () => {
      mountWith({
        activityDraftId: mockedActivityContentWithEnrolledStudent1.id,
        subActivities: [mockedSubActivitiesOverviewDTO[0]],
      })
      await confirmDeletion()
    })

    BddTest().then('it should show the reason of the refusal', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue lors de la suppression de la sous-activité',
          description: 'Une sous-activité ne peut pas être supprimée d\'une activité à laquelle des apprenant(e)s sont inscrit(e)s',
        })
      })
    })
  })
})
