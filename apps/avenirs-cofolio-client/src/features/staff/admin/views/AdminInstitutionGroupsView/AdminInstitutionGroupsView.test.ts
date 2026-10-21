import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EGroupType } from '@/api/avenir-esr'
import { SearchEntityInputStub } from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.stub'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import { GroupsListStub } from '@/features/staff/admin/components/dataDisplay/GroupsList/GroupsList.stub'
import AdminInstitutionGroupsView from '@/features/staff/admin/views/AdminInstitutionGroupsView/AdminInstitutionGroupsView.vue'
import { GroupTypeMultiselectStub } from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/selects/GroupTypeMultiselect/GroupTypeMultiselect.stub'

BddTest().given('an admin institution groups view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminInstitutionGroupsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    GroupsList: GroupsListStub,
    GroupTypeMultiselect: GroupTypeMultiselectStub,
    SearchEntityInput: SearchEntityInputStub,
  }

  const mountView = () => {
    wrapper = mount(AdminInstitutionGroupsView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getGroupsList = () => wrapper.findComponent(GroupsListStub)
  const getSearchEntityInput = () => wrapper.findComponent(SearchEntityInputStub)
  const searchEntity = (text: string) => getSearchEntityInput().vm.$emit('update:modelValue', text)
  const getGroupTypeMultiselect = () => wrapper.findComponent(GroupTypeMultiselectStub)
  const selectGroupTypes = (types: EGroupType[]) => getGroupTypeMultiselect().vm.$emit('update:modelValue', types)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Groupes de l\'établissement')
    })

    BddTest().then('the search entity input is rendered', () => {
      expect(getSearchEntityInput().exists()).toBe(true)
    })

    BddTest().then('the groups list is rendered', () => {
      expect(getGroupsList().exists()).toBe(true)
      expect(getGroupsList().props('keyword')).toBe(undefined)
    })

    BddTest().then('the group type multiselect is rendered', () => {
      expect(getGroupTypeMultiselect().exists()).toBe(true)
    })

    BddTest().and('the user enters a search term', () => {
      const keyword = 'Test Group'

      beforeEach(() => {
        searchEntity(keyword)
      })

      BddTest().then('the search entity input has the correct value', () => {
        expect(getSearchEntityInput().props('modelValue')).toBe(keyword)
      })

      BddTest().then('the group list should receive the keyword', () => {
        expect(getGroupsList().props('keyword')).toBe(keyword)
      })
    })

    BddTest().and('the user selects some group types', () => {
      const selectedTypes: EGroupType[] = [EGroupType.PROGRAM, EGroupType.STUDENT_GROUP]

      beforeEach(() => {
        selectGroupTypes(selectedTypes)
      })

      BddTest().then('the group type multiselect should emit the selected group types', () => {
        expect(getGroupTypeMultiselect().emitted('update:modelValue')?.at(-1)).toEqual([selectedTypes])
      })
    })
  })
})
