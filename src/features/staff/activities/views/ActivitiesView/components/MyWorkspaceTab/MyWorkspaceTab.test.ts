import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { ActivityTableTitleStub } from '@/features/staff/activities/views/ActivitiesView/components/ActivityTableTitle/ActivityTableTitle.stub'
import MyWorkspaceTab from '@/features/staff/activities/views/ActivitiesView/components/MyWorkspaceTab/MyWorkspaceTab.vue'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a MyWorkspaceTab component', () => {
  let wrapper: ReturnType<typeof mount<typeof MyWorkspaceTab>>

  const stubs = {
    ActivityTableTitle: ActivityTableTitleStub,
    AvTable: AvTableStub,
    Pagination: PaginationStub,
  }

  BddTest().when('the component is mounted', () => {
    let avTable: VueWrapper<InstanceType<typeof AvTableStub>>
    let pagination: VueWrapper<InstanceType<typeof PaginationStub>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(MyWorkspaceTab, {
        global: { stubs },
      })
      avTable = wrapper.findComponent({ name: 'AvTable' })
      pagination = wrapper.findComponent(PaginationStub)
    })

    BddTest().then('it should render the component', () => {
      expect(wrapper.find('[data-testid="my-workspace-tab"]').exists()).toBe(true)
    })

    BddTest().then('it should display the title with the placeholder count', () => {
      expect(wrapper.find('[data-testid="my-workspace-tab-title"]').text()).toContain('Toutes les activités publiées dans mon établissement (3)')
    })

    BddTest().then('it should render the AvTable', () => {
      expect(avTable.exists()).toBe(true)
    })

    BddTest().then('it should pass 4 columns to the table', () => {
      expect(avTable.props('columns')).toHaveLength(4)
    })

    BddTest().then('it should pass the placeholder rows to the table', () => {
      expect(avTable.props('rows')).toHaveLength(3)
    })

    BddTest().then('it should render the Pagination', () => {
      expect(pagination.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct totalElements to Pagination', () => {
      expect(pagination.props('pageInfo')).toMatchObject({ totalElements: 3 })
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
        expect(titles).toHaveLength(3)
      })
    })
  })
})
