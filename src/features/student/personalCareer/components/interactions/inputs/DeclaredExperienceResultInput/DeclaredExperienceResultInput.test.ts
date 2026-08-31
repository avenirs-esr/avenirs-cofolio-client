import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import DeclaredExperienceResultInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceResultInput/DeclaredExperienceResultInput.vue'
import { DECLARED_EXPERIENCE_RESULT_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experience result input component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceResultInput>>

  const stubs = {
    Input: InputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperienceResultInput, {
        props: {
          modelValue: ''
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the Input component', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have labelVisible set to true', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('labelVisible')).toBe(true)
    })

    BddTest().then('it should have maxlength prop set to config value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('maxlength')).toBe(DECLARED_EXPERIENCE_RESULT_MAX_LENGTH)
    })

    BddTest().then('it should display the correct French label', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('label')).toBe('Résultat obtenu')
    })

    BddTest().then('it should display the correct prefix icon', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('prefixIcon')).toBe(RI_ICONS.LAYOUT_6_LINE)
    })

    BddTest().then('it should display the correct placeholder', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('placeholder')).toBe(
        'Réussite, validation, certification, mention, classement ou autres...'
      )
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent(InputStub)
      expect(input.props('modelValue')).toBe('')
    })
  })
})
