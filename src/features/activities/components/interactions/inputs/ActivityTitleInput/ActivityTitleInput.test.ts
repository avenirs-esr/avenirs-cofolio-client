import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import ActivityTitleInput from '@/features/activities/components/interactions/inputs/ActivityTitleInput/ActivityTitleInput.vue'
import { ACTIVITY_TITLE_MAX_LENGTH } from '@/features/activities/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('ActivityTitleInput component', () => {
  let wrapper: VueWrapper

  const stubs = {
    Input: InputStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('mounted with default props', () => {
    let inputStub: VueWrapper<InstanceType<typeof InputStub>>

    beforeEach(() => {
      wrapper = mount(ActivityTitleInput, {
        global: { stubs },
      })
      inputStub = wrapper.findComponent(InputStub) as VueWrapper<InstanceType<typeof InputStub>>
    })

    BddTest().then('it should render the Input component', () => {
      expect(inputStub.exists()).toBe(true)
    })

    BddTest().then('it should always pass ACTIVITY_TITLE_MAX_LENGTH as maxlength', () => {
      expect(inputStub.props('maxlength')).toBe(ACTIVITY_TITLE_MAX_LENGTH)
    })

    BddTest().then('it should use the default i18n label', () => {
      expect(inputStub.props('label')).toBe('Titre de l\'activité')
    })

    BddTest().then('it should set labelVisible to false', () => {
      expect(inputStub.props('labelVisible')).toBe(false)
    })

    BddTest().then('it should set required to true', () => {
      expect(inputStub.props('required')).toBe(true)
    })

    BddTest().then('it should set isTextarea to false', () => {
      expect(inputStub.props('isTextarea')).toBe(false)
    })

    BddTest().then('it should generate an id prefixed with activity-title-input', () => {
      expect(inputStub.attributes('id')).toMatch(/^activity-title-input-/)
    })

    BddTest().then('it should not apply the n4 class', () => {
      expect(inputStub.classes()).not.toContain('n4')
    })
  })

  BddTest().when('mounted with a custom label', () => {
    const customLabel = 'Mon titre personnalisé'

    beforeEach(() => {
      wrapper = mount(ActivityTitleInput, {
        props: { label: customLabel },
        global: { stubs },
      })
    })

    BddTest().then('it should pass the custom label to Input', () => {
      expect(wrapper.findComponent(InputStub).props('label')).toBe(customLabel)
    })
  })

  BddTest().when('mounted with a custom id', () => {
    const customId = 'custom-activity-id'

    beforeEach(() => {
      wrapper = mount(ActivityTitleInput, {
        props: { id: customId },
        global: { stubs },
      })
    })

    BddTest().then('it should pass the custom id to Input', () => {
      expect(wrapper.findComponent(InputStub).attributes('id')).toBe(customId)
    })
  })

  BddTest().when('mounted with isTextarea set to true', () => {
    beforeEach(() => {
      wrapper = mount(ActivityTitleInput, {
        props: { isTextarea: true },
        global: { stubs },
      })
    })

    BddTest().then('it should pass isTextarea true to Input', () => {
      expect(wrapper.findComponent(InputStub).props('isTextarea')).toBe(true)
    })

    BddTest().then('it should apply the n4 class', () => {
      expect(wrapper.findComponent(InputStub).classes()).toContain('n4')
    })
  })

  BddTest().when('mounted with an errorMessage', () => {
    const errorMessage = 'Le titre est requis'

    beforeEach(() => {
      wrapper = mount(ActivityTitleInput, {
        props: { errorMessage },
        global: { stubs },
      })
    })

    BddTest().then('it should pass the errorMessage to Input', () => {
      expect(wrapper.findComponent(InputStub).props('errorMessage')).toBe(errorMessage)
    })
  })

  BddTest().when('mounted with labelVisible set to true', () => {
    beforeEach(() => {
      wrapper = mount(ActivityTitleInput, {
        props: { labelVisible: true },
        global: { stubs },
      })
    })

    BddTest().then('it should pass labelVisible true to Input', () => {
      expect(wrapper.findComponent(InputStub).props('labelVisible')).toBe(true)
    })
  })

  BddTest().when('a model value is provided', () => {
    beforeEach(() => {
      wrapper = mount(ActivityTitleInput, {
        props: { modelValue: 'Mon activité' },
        global: { stubs },
      })
    })

    BddTest().then('it should pass the model value to Input', () => {
      expect(wrapper.findComponent(InputStub).props('modelValue')).toBe('Mon activité')
    })
  })

  BddTest().when('the Input emits an update:modelValue event', () => {
    beforeEach(() => {
      wrapper = mount(ActivityTitleInput, {
        props: { modelValue: '' },
        global: { stubs },
      })
    })

    BddTest().then('it should emit the updated value upward', () => {
      wrapper.findComponent(InputStub).vm.$emit('update:modelValue', 'nouvelle valeur')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['nouvelle valeur'])
    })
  })
})
