import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { SearchEntityInputStub } from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.stub'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AdminInstitutionUsersView from '@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'

BddTest().given('an admin institution users view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminInstitutionUsersView>>

  const stubs = { PageTitle: PageTitleStub, SearchEntityInput: SearchEntityInputStub }

  const mountView = () => {
    wrapper = mount(AdminInstitutionUsersView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getSearchEntityInput = () => wrapper.findComponent(SearchEntityInputStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Utilisateurs de l\'établissement')
    })

    BddTest().then('the user info search input is rendered', () => {
      expect(getSearchEntityInput().exists()).toBe(true)
      expect(getSearchEntityInput().props('modelValue')).toBe('')
    })

    BddTest().and('the user types into the search input', () => {
      beforeEach(() => {
        getSearchEntityInput().vm.$emit('update:modelValue', 'John Doe')
      })

      BddTest().then('the model value is updated', () => {
        expect(getSearchEntityInput().props('modelValue')).toBe('John Doe')
      })
    })
  })
})
