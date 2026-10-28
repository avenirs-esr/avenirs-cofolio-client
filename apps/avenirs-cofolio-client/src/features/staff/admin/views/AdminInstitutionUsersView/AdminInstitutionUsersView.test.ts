import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { SearchEntityInputStub } from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.stub'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import { UsersListStub } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.stub'
import AdminInstitutionUsersView from '@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'
import { InstitutionGroupsMultiselectStub } from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/InstitutionGroupsMultiselect/InstitutionGroupsMultiselect.stub'

BddTest().given('an admin institution users view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminInstitutionUsersView>>

  const stubs = {
    PageTitle: PageTitleStub,
    UsersList: UsersListStub,
    InstitutionGroupsMultiselect: InstitutionGroupsMultiselectStub,
    SearchEntityInput: SearchEntityInputStub,
  }

  const mountView = () => {
    wrapper = mount(AdminInstitutionUsersView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getUsersList = () => wrapper.findComponent(UsersListStub)
  const getSearchEntityInput = () => wrapper.findComponent(SearchEntityInputStub)
  const searchEntity = (text: string) => getSearchEntityInput().vm.$emit('update:modelValue', text)
  const getInstitutionGroupsMultiselect = () => wrapper.findComponent(InstitutionGroupsMultiselectStub)
  const selectGroups = (groups: string[]) => getInstitutionGroupsMultiselect().vm.$emit('update:modelValue', groups)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Utilisateurs de l\'établissement')
    })

    BddTest().then('the search entity input is rendered', () => {
      expect(getSearchEntityInput().exists()).toBe(true)
    })

    BddTest().then('the users list is rendered', () => {
      expect(getUsersList().exists()).toBe(true)
      expect(getUsersList().props('keyword')).toBe(undefined)
      expect(getUsersList().props('groupIds')).toEqual([])
    })

    BddTest().then('the institution groups multiselect is rendered', () => {
      expect(getInstitutionGroupsMultiselect().exists()).toBe(true)
    })

    BddTest().and('the user enters a search term', () => {
      const keyword = 'Alice'

      beforeEach(() => {
        searchEntity(keyword)
      })

      BddTest().then('the search entity input has the correct value', () => {
        expect(getSearchEntityInput().props('modelValue')).toBe(keyword)
      })

      BddTest().then('the users list should receive the keyword', () => {
        expect(getUsersList().props('keyword')).toBe(keyword)
      })
    })

    BddTest().and('the user selects institution groups', () => {
      const selectedGroups = ['group1', 'group2']

      beforeEach(() => {
        selectGroups(selectedGroups)
      })

      BddTest().then('the institution groups multiselect should emit the selected groups', () => {
        expect(getInstitutionGroupsMultiselect().emitted('update:modelValue')?.at(-1)).toEqual([selectedGroups])
      })

      BddTest().then('the users list should receive the selected groups', () => {
        expect(getUsersList().props('groupIds')).toEqual(selectedGroups)
      })
    })
  })
})
