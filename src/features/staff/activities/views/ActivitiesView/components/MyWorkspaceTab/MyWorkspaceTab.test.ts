import type { mount, VueWrapper } from '@vue/test-utils'
import { ActivityStatusBadgeStub } from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.stub'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ActivityDraftCreationModalStub } from '@/features/staff/activities/views/ActivitiesView/components/ActivityDraftCreationModal/ActivityDraftCreationModal.stub'
import { ActivityTableTitleStub } from '@/features/staff/activities/views/ActivitiesView/components/ActivityTableTitle/ActivityTableTitle.stub'
import MyWorkspaceTab from '@/features/staff/activities/views/ActivitiesView/components/MyWorkspaceTab/MyWorkspaceTab.vue'
import { AvButtonStub, AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a MyWorkspaceTab component', () => {
  let wrapper: ReturnType<typeof mount<typeof MyWorkspaceTab>>

  const stubs = {
    ActivityDraftCreationModal: ActivityDraftCreationModalStub,
    ActivityTableTitle: ActivityTableTitleStub,
    ActivityStatusBadge: ActivityStatusBadgeStub,
    AvButton: AvButtonStub,
    AvTable: AvTableStub,
    Pagination: PaginationStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const getModal = () => wrapper.findComponent(ActivityDraftCreationModalStub) as VueWrapper<InstanceType<typeof ActivityDraftCreationModalStub>>

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = mountComponent(MyWorkspaceTab, { global: { stubs } })
    await flushPromises()
  })

  BddTest().when('the component is mounted', () => {
    let avTable: VueWrapper<InstanceType<typeof AvTableStub>>
    let pagination: VueWrapper<InstanceType<typeof PaginationStub>>

    beforeEach(() => {
      avTable = wrapper.findComponent({ name: 'AvTable' }) as VueWrapper<InstanceType<typeof AvTableStub>>
      pagination = wrapper.findComponent(PaginationStub) as VueWrapper<InstanceType<typeof PaginationStub>>
    })

    BddTest().then('it should render the component', () => {
      expect(wrapper.find('[data-testid="my-workspace-tab"]').exists()).toBe(true)
    })

    BddTest().then('it should display the title with the correct count', () => {
      expect(wrapper.find('[data-testid="my-workspace-tab-title"]').text()).toContain('(6)')
    })

    BddTest().then('it should render the AvTable', () => {
      expect(avTable.exists()).toBe(true)
    })

    BddTest().then('it should pass 4 columns to the table', () => {
      expect(avTable.props('columns')).toHaveLength(4)
    })

    BddTest().then('it should pass the rows to the table', () => {
      expect(avTable.props('rows')).toHaveLength(6)
    })

    BddTest().then('it should render the Pagination', () => {
      expect(pagination.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct totalElements to Pagination', () => {
      expect(pagination.props('pageInfo')).toMatchObject({ totalElements: 6 })
    })

    BddTest().then('it should render the modal closed', () => {
      expect(getModal().props('opened')).toBe(false)
    })

    BddTest().and('the column labels are correct', () => {
      let columns: { key: string, label: string }[]

      beforeEach(() => {
        columns = avTable.props('columns') as { key: string, label: string }[]
      })

      BddTest().then('it should have the activity name column label', () => {
        expect(columns.find(c => c.key === 'title')?.label).toBe('Nom de l\'activité')
      })

      BddTest().then('it should have the last modification column label', () => {
        expect(columns.find(c => c.key === 'updatedAt')?.label).toBe('Dernière modification')
      })

      BddTest().then('it should have the owner column label', () => {
        expect(columns.find(c => c.key === 'owner')?.label).toBe('Propriétaire')
      })

      BddTest().then('it should have the status column label', () => {
        expect(columns.find(c => c.key === 'status')?.label).toBe('Statut')
      })
    })

    BddTest().and('the title column slot is rendered', () => {
      BddTest().then('it should render one ActivityTableTitle per row', () => {
        const titles = wrapper.findAllComponents({ name: 'ActivityTableTitle' })
        expect(titles).toHaveLength(6)
      })
    })

    BddTest().and('the status column slot is rendered', () => {
      BddTest().then('it should render one ActivityStatusBadge per row', () => {
        const titles = wrapper.findAllComponents(ActivityStatusBadgeStub)
        expect(titles).toHaveLength(6)
      })
    })
  })

  BddTest().when('the create activity button is clicked', () => {
    beforeEach(async () => {
      await wrapper.find('[data-testid="create-activity-button"]').trigger('click')
    })

    BddTest().then('it should open the modal', () => {
      expect(getModal().props('opened')).toBe(true)
    })

    BddTest().and('the modal emits close', () => {
      beforeEach(() => {
        getModal().vm.$emit('close')
      })

      BddTest().then('it should close the modal', () => {
        expect(getModal().props('opened')).toBe(false)
      })
    })
  })
})
