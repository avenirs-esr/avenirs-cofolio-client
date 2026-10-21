import type { VueWrapper } from '@vue/test-utils'
import type { SearchEntityInputProps } from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub.js'
import SearchEntityInput from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.vue'

BddTest().given('a search entity input', () => {
  let wrapper: VueWrapper<InstanceType<typeof SearchEntityInput>>

  const stubs = { Input: InputStub }

  const mountWith = (props: SearchEntityInputProps & { modelValue?: string }) => wrapper = mount(SearchEntityInput, {
    props,
    global: { stubs }
  })

  const getInput = () => wrapper.findComponent(InputStub)

  BddTest().when('the component is rendered without modelValue nor entityPlaceholder', () => {
    beforeEach(() => {
      mountWith({ entityName: 'un utilisateur' })
    })

    BddTest().then('it should render the input component', () => {
      expect(getInput().exists()).toBe(true)
      expect(getInput().props('placeholder')).toBe('Renseigner un utilisateur')
      expect(getInput().props('label')).toBe('Rechercher un utilisateur')
    })

    BddTest().then('it should render the input with an empty string as modelValue', () => {
      expect(getInput().props('modelValue')).toBe('')
    })
  })

  BddTest().when('the component is rendered without modelValue', () => {
    beforeEach(() => {
      mountWith({ entityName: 'un utilisateur', entityPlaceholder: 'un nom, prénom ou email' })
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
      mountWith({ entityName: 'un groupe', modelValue: '' })
    })

    BddTest().then('it should render the input component', () => {
      expect(getInput().exists()).toBe(true)
      expect(getInput().props('placeholder')).toBe('Renseigner un groupe')
      expect(getInput().props('label')).toBe('Rechercher un groupe')
    })

    BddTest().then('it should render the input with an empty string as modelValue', () => {
      expect(getInput().props('modelValue')).toBe('')
    })

    BddTest().and('the user inputs a value', () => {
      beforeEach(() => {
        getInput().vm.$emit('update:modelValue', 'Groupe de TD')
      })

      BddTest().then('it should update the modelValue prop', async () => {
        await vi.waitFor(() => {
          expect(getInput().props('modelValue')).toBe('Groupe de TD')
        })
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
      mountWith({ entityName: 'un groupe', modelValue: 'Groupe de TP' })
    })

    BddTest().then('it should render the input with the correct initial value', () => {
      expect(getInput().props('modelValue')).toBe('Groupe de TP')
    })
  })
})
