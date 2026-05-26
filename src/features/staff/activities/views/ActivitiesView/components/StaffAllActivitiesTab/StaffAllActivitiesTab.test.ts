import { useGetStaffActivityLibrary } from '@/api/avenir-esr'
import { ActivitiesTabStub } from '@/features/staff/activities/views/ActivitiesView/components/ActivitiesTab/ActivitiesTab.stub'
import StaffAllActivitiesTab from '@/features/staff/activities/views/ActivitiesView/components/StaffAllActivitiesTab/StaffAllActivitiesTab.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

vi.mock('@/features/staff/activities/stores/activities.store', () => ({
  useStaffActivitiesStore: () => ({
    allActivitiesCurrentPage: ref(0),
    allActivitiesPageSizeSelected: ref(PageSizes.TWELVE),
  }),
}))

BddTest().given('a StaffAllActivitiesTab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffAllActivitiesTab>>

  const stubs = {
    ActivitiesTab: ActivitiesTabStub,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = mountComponent(StaffAllActivitiesTab, { global: { stubs } })
    await flushPromises()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it renders ActivitiesTab with the correct props', () => {
      const activitiesTab = wrapper.findComponent(ActivitiesTabStub)
      const params = activitiesTab.props('usePaginatedStaffActivitesParams')

      expect(activitiesTab.exists()).toBe(true)
      expect(activitiesTab.props('title')).toBe('Toutes les activités publiées dans mon établissement (0)')
      expect(activitiesTab.props('emptyStateMessage')).toBe('Aucune activité pour le moment.')

      expect(params.currentPageRef.value).toBe(0)
      expect(params.pageSizeRef.value).toBe(PageSizes.TWELVE)
      expect(params.fetchFn).toBe(useGetStaffActivityLibrary)
    })

    BddTest().then('it updates the title when ActivitiesTab emits the count', async () => {
      const activitiesTab = wrapper.findComponent(ActivitiesTabStub)

      activitiesTab.vm.$emit('updateActivitiesCount', 6)
      await nextTick()

      expect(wrapper.findComponent(ActivitiesTabStub).props('title')).toBe('Toutes les activités publiées dans mon établissement (6)')
    })
  })
})
