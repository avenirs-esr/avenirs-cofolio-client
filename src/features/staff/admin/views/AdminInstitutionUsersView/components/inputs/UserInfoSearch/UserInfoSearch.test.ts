import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub.js'
import UserInfoSearch from '@/features/staff/admin/views/AdminInstitutionUsersView/components/inputs/UserInfoSearch/UserInfoSearch.vue'

BddTest().given('a user information search input', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserInfoSearch>>

  const stubs = { Input: InputStub }

  const mountWith = (modelValue?: string) => wrapper = mount(UserInfoSearch, {
    props: { modelValue },
    global: { stubs }
  })

  const getInput = () => wrapper.findComponent(InputStub)

  BddTest().when('the component is rendered without modelValue', () => {
    beforeEach(() => {
      mountWith(undefined)
    })

    BddTest().then('it should render the input component', () => {
      expect(getInput().exists()).toBe(true)
      expect(getInput().props('placeholder')).toBe('Renseigner un nom, prénom ou email')
      expect(getInput().props('label')).toBe('Rechercher un utilisateur')
    })

    BddTest().then('it should render the input with an empty string as modelValue', () => {
      expect(getInput().props('modelValue')).toBe('')
    })
  })

  BddTest().when('the component is rendered with an empty string as modelValue', () => {
    beforeEach(() => {
      mountWith('')
    })

    BddTest().then('it should render the input component', () => {
      expect(getInput().exists()).toBe(true)
      expect(getInput().props('placeholder')).toBe('Renseigner un nom, prénom ou email')
      expect(getInput().props('label')).toBe('Rechercher un utilisateur')
    })

    BddTest().then('it should render the input with an empty string as modelValue', () => {
      expect(getInput().props('modelValue')).toBe('')
    })

    BddTest().and('the user inputs a value', () => {
      beforeEach(() => {
        getInput().vm.$emit('update:modelValue', 'Bob Martin')
      })

      BddTest().then('it should update the modelValue prop', () => {
        expect(getInput().props('modelValue')).toBe('Bob Martin')
      })

      BddTest().and('the user clears the input', () => {
        beforeEach(() => {
          getInput().vm.$emit('update:modelValue', null)
        })

        BddTest().then('it should update the modelValue prop to an empty string', () => {
          expect(getInput().props('modelValue')).toBe('')
        })
      })
    })
  })

  BddTest().when('the component is rendered with a modelValue', () => {
    beforeEach(() => {
      mountWith('Alice Dupont')
    })

    BddTest().then('it should render the input with the correct initial value', () => {
      expect(getInput().props('modelValue')).toBe('Alice Dupont')
    })
  })
})
