import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { PageTitleStub } from '@avenirs-esr/shared'
import { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { UsersListStub } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.stub'
import AdminInstitutionUsersView from '@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'
import { InstitutionGroupsMultiselectStub } from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/InstitutionGroupsMultiselect/InstitutionGroupsMultiselect.stub'
import { UserCategoriesMultiselectStub } from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/UserCategoriesMultiselect/UserCategoriesMultiselect.stub'

BddTest().given('an admin institution users view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminInstitutionUsersView>>

  const stubs = {
    PageTitle: PageTitleStub,
    UsersList: UsersListStub,
    InstitutionGroupsMultiselect: InstitutionGroupsMultiselectStub,
    UserCategoriesMultiselect: UserCategoriesMultiselectStub,
  }

  const mountView = () => {
    wrapper = mount(AdminInstitutionUsersView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getUsersList = () => wrapper.findComponent(UsersListStub)
  const getInstitutionGroupsMultiselect = () => wrapper.findComponent(InstitutionGroupsMultiselectStub)
  const selectGroups = (groups: string[]) => getInstitutionGroupsMultiselect().vm.$emit('update:modelValue', groups)
  const getUserCategoriesMultiselect = () => wrapper.findComponent(UserCategoriesMultiselectStub)
  const selectCategories = (categories: EUserCategory[]) =>
    getUserCategoriesMultiselect().vm.$emit('update:modelValue', categories)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Utilisateurs de l\'établissement')
    })

    BddTest().then('the users list is rendered', () => {
      expect(getUsersList().exists()).toBe(true)
      expect(getUsersList().props('groupIds')).toEqual([])
      expect(getUsersList().props('categories')).toEqual([])
    })

    BddTest().then('the institution groups multiselect is rendered', () => {
      expect(getInstitutionGroupsMultiselect().exists()).toBe(true)
    })

    BddTest().then('the user categories multiselect is rendered', () => {
      expect(getUserCategoriesMultiselect().exists()).toBe(true)
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

    BddTest().and('the user selects categories', () => {
      const selectedCategories = [EUserCategory.STAFF, EUserCategory.STUDENT]

      beforeEach(() => {
        selectCategories(selectedCategories)
      })

      BddTest().then('the user categories multiselect should emit the selected categories', () => {
        expect(getUserCategoriesMultiselect().emitted('update:modelValue')?.at(-1)).toEqual([selectedCategories])
      })

      BddTest().then('the users list should receive the selected categories', () => {
        expect(getUsersList().props('categories')).toEqual(selectedCategories)
      })
    })

    BddTest().and('the user selects both groups and categories', () => {
      const selectedGroups = ['group1', 'group2']
      const selectedCategories = [EUserCategory.STAFF]

      beforeEach(() => {
        selectGroups(selectedGroups)
        selectCategories(selectedCategories)
      })

      BddTest().then('the users list should receive both filters', () => {
        expect(getUsersList().props('groupIds')).toEqual(selectedGroups)
        expect(getUsersList().props('categories')).toEqual(selectedCategories)
      })
    })
  })
})
