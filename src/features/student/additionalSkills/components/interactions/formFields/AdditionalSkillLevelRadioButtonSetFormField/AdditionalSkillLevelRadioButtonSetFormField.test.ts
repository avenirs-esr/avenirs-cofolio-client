import type { UpdateAdditionalSkillForm } from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import { EAdditionalSkillLevel } from '@/api/avenir-esr'
import AdditionalSkillLevelRadioButtonSetFormField from '@/features/student/additionalSkills/components/interactions/formFields/AdditionalSkillLevelRadioButtonSetFormField/AdditionalSkillLevelRadioButtonSetFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    AdditionalSkillLevelRadioButtonSetFormField
  },
  props: ['initialLevel'],
  setup (props: { initialLevel: string }) {
    const form = useForm({
      defaultValues: {
        level: props.initialLevel
      },
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              level: !value.level
                ? 'Ce champ est requis'
                : undefined
            }
          }
        }
      }
    }) as unknown as UpdateAdditionalSkillForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <AdditionalSkillLevelRadioButtonSetFormField :form="form" />
    </form>
  `
}

BddTest().given('an additional skill level form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    AdditionalSkillLevelRadioButtonSet: {
      name: 'AddAdditionalSkillLevelField',
      props: ['modelValue', 'errorMessage'],
      emits: ['blur', 'update:modelValue'],
      template: `<div>
          <select
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
            @blur="$emit('blur')"
          >
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
          </select>
          <span
            v-if="errorMessage"
            class="error"
          >
            {{ errorMessage }}
          </span>
        </div>`
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      props: { initialLevel: EAdditionalSkillLevel.INTERMEDIATE },
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the skill level field', () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      expect(levelField.exists()).toBe(true)
    })

    BddTest().then('it should have initial value', () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      expect(levelField.props('modelValue')).toBe(EAdditionalSkillLevel.INTERMEDIATE)
    })

    BddTest().then('it should not have error message initially', () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      expect(levelField.props('errorMessage')).toBeFalsy()
    })
  })

  BddTest().when('the user changes the level', () => {
    BddTest().then('it should update the form field value', async () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      const selectElement = levelField.find('select')

      await selectElement.setValue(EAdditionalSkillLevel.ADVANCED)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
        expect(updatedField.props('modelValue')).toBe(EAdditionalSkillLevel.ADVANCED)
      })
    })
  })

  BddTest().when('the user blurs the level field', () => {
    BddTest().then('it should trigger blur handler', async () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      const selectElement = levelField.find('select')

      await selectElement.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(levelField.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().when('the user selects an invalid value', () => {
    BddTest().then('it should not update the form field', async () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })

      await levelField.vm.$emit('update:modelValue', 'INVALID_VALUE')
      await wrapper.vm.$nextTick()

      const updatedField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      expect(updatedField.props('modelValue')).toBe(EAdditionalSkillLevel.INTERMEDIATE)
    })
  })

  BddTest().when('the form is submitted with valid level', () => {
    BddTest().then('it should not show validation error', async () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      const selectElement = levelField.find('select')

      await selectElement.setValue(EAdditionalSkillLevel.ADVANCED)
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
        expect(updatedField.props('errorMessage')).toBeFalsy()
      })
    })
  })
})

BddTest().given('an additional skill level form field with empty initial value', () => {
  let wrapper: VueWrapper

  const stubs = {
    AdditionalSkillLevelRadioButtonSet: {
      name: 'AddAdditionalSkillLevelField',
      props: ['modelValue', 'errorMessage'],
      emits: ['blur', 'update:modelValue'],
      template: `<div>
          <select
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
            @blur="$emit('blur')"
          >
              <option value="">Sélectionner</option>
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
          </select>
          <span
            v-if="errorMessage"
            class="error"
          >
            {{ errorMessage }}
          </span>
        </div>`
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      props: { initialLevel: '' },
      global: { stubs }
    })
  })

  BddTest().when('the form is submitted with empty level', () => {
    BddTest().then('it should show validation error', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
        expect(levelField.props('errorMessage')).toBe('Ce champ est requis')
      })
    })

    BddTest().then('it should display error message in the DOM', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const errorElement = wrapper.find('.error')
        expect(errorElement.exists()).toBe(true)
        expect(errorElement.text()).toBe('Ce champ est requis')
      })
    })
  })
})
