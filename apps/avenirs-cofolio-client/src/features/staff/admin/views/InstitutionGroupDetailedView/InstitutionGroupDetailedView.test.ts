import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockGroup } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { DetailedPageTitleStub } from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.stub'
import { GroupsListStub } from '@/features/staff/admin/components/dataDisplay/GroupsList/GroupsList.stub'
import { UsersListStub } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.stub'
import { GroupMainInfoStub } from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/dataDisplay/GroupMainInfo/GroupMainInfo.stub'
import InstitutionGroupDetailedView from '@/features/staff/admin/views/InstitutionGroupDetailedView/InstitutionGroupDetailedView.vue'

BddTest().given('an institution group detailed view', () => {
  let wrapper: VueWrapper<InstanceType<typeof InstitutionGroupDetailedView>>

  const stubs = {
    DetailedPageTitle: DetailedPageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    GroupMainInfo: GroupMainInfoStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    GroupsList: GroupsListStub,
    UsersList: UsersListStub,
  }

  const mountWith = async (groupId: string) => {
    wrapper = mountComponent(InstitutionGroupDetailedView, {
      props: { groupId },
      global: { stubs },
    })

    await flushPromises()
  }

  const getPageTitle = () => wrapper.findComponent(DetailedPageTitleStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getGroupMainInfo = () => wrapper.findComponent(GroupMainInfoStub)
  const getSections = () => wrapper.findAllComponents(IconTitleCardContainerStub)
  const getSubGroupsSection = () => getSections()[0]
  const getUsersSection = () => getSections()[1]
  const getGroupsList = () => wrapper.findComponent(GroupsListStub)
  const getUsersList = () => wrapper.findComponent(UsersListStub)

  BddTest().when('the group exists', () => {
    beforeEach(async () => {
      await mountWith(mockGroup.id)
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

    BddTest().then('it should display the subgroups section', () => {
      expect(getSubGroupsSection().exists()).toBe(true)
    })

    BddTest().then('it should use the subgroups icon', () => {
      expect(getSubGroupsSection().props('titleIcon')).toBe(MDI_ICONS.PEOPLE_GROUP_OUTLINE)
    })

    BddTest().then('it should use the expected section background color', () => {
      expect(getSubGroupsSection().props('backgroundColor')).toBe('var(--other-background-base)')
      expect(getUsersSection().props('backgroundColor')).toBe('var(--other-background-base)')
    })

    BddTest().then('it should display the number of subgroups in the section title', () => {
      expect(getSubGroupsSection().props('title')).toContain('3')
    })

    BddTest().then('it should render the groups list with the current group id', () => {
      expect(getGroupsList().exists()).toBe(true)
      expect(getGroupsList().props('groupId')).toBe(mockGroup.id)
    })

    BddTest().then('it should display the users section', () => {
      expect(getUsersSection().exists()).toBe(true)
    })

    BddTest().then('it should display the group users count in the section title', () => {
      expect(getUsersSection().props('title')).toContain(String(mockGroup.usersCount))
    })

    BddTest().then('it should render the users list with the current group id and group users mode', () => {
      expect(getUsersList().exists()).toBe(true)
      expect(getUsersList().props('groupIds')).toEqual([mockGroup.id])
      expect(getUsersList().props('groupUsersMode')).toBe(true)
    })
  })

  BddTest().when('the group does not exist', () => {
    beforeEach(async () => {
      await mountWith('INVALID_ID')
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

    BddTest().then('it should not display the subgroups section', () => {
      expect(getSections()).toHaveLength(0)
    })

    BddTest().then('it should not display the groups list', () => {
      expect(getGroupsList().exists()).toBe(false)
    })

    BddTest().then('it should not display the users list', () => {
      expect(getUsersList().exists()).toBe(false)
    })
  })
})
