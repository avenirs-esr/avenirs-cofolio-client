import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { expect } from 'vitest'
import { mockGroup } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { DetailedPageTitleStub } from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.stub'
import { GroupMainInfoStub } from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/dataDisplay/GroupMainInfo/GroupMainInfo.stub'
import InstitutionGroupDetailedView from '@/features/staff/admin/views/InstitutionGroupDetailedView/InstitutionGroupDetailedView.vue'

BddTest().given('an institution group detailed view', () => {
  let wrapper: VueWrapper<InstanceType<typeof InstitutionGroupDetailedView>>

  const stubs = {
    DetailedPageTitle: DetailedPageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    GroupMainInfo: GroupMainInfoStub,
  }

  const mountWith = (groupId: string) => {
    wrapper = mountComponent(InstitutionGroupDetailedView, {
      props: { groupId },
      global: { stubs },
    })
  }

  const getPageTitle = () => wrapper.findComponent(DetailedPageTitleStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getGroupMainInfo = () => wrapper.findComponent(GroupMainInfoStub)

  BddTest().when('the group exists', () => {
    beforeEach(async () => {
      mountWith(mockGroup.id)
      await flushPromises()
    })

    BddTest().then('it should display the group name as the page title', () => {
      expect(getPageTitle().props('title')).toBe(mockGroup.name)
    })

    BddTest().then('it should display the group name in the trailing links', () => {
      expect(getPageTitle().props('trailingLinks')).toEqual([
        { text: mockGroup.name },
      ])
    })

    BddTest().then('it should pass the group to the main info component', () => {
      expect(getGroupMainInfo().props('group')).toEqual(mockGroup)
    })

    BddTest().then('it should indicate that the query is not empty', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })
  })

  BddTest().when('the group does not exist', () => {
    beforeEach(async () => {
      mountWith('INVALID_ID')
      await flushPromises()
    })

    BddTest().then('it should display an empty page title', () => {
      expect(getPageTitle().props('title')).toBe('')
    })

    BddTest().then('it should display an empty trailing link', () => {
      expect(getPageTitle().props('trailingLinks')).toEqual([
        { text: '' },
      ])
    })

    BddTest().then('it should indicate that the query is empty', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
    })

    BddTest().then('it should not display the main info component', () => {
      expect(getGroupMainInfo().exists()).toBe(false)
    })
  })
})
