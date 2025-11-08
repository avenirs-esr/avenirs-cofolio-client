import type { UpdateAdditionalSkillForm } from '@/features/student/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import type { VueWrapper } from '@vue/test-utils'
import { EAdditionalSkillLevel } from '@/api/avenir-esr'
import AdditionalSkillLevelRadioButtonSetFormField from '@/features/student/components/additionalSkills/interactions/formFields/AdditionalSkillLevelRadioButtonSetFormField/AdditionalSkillLevelRadioButtonSetFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an additional skill level form field component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdditionalSkillLevelRadioButtonSetFormField>>
  let form: UpdateAdditionalSkillForm

  const stubs = {
    AdditionalSkillLevelRadioButtonSet: {
      name: 'AddAdditionalSkillLevelField',
      props: ['form', 'errorMessage'],
      emits: ['blur'],
      template: `<div>
          <select @change="$emit(\'blur\')">
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
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

    form = useForm({
      defaultValues: {
        level: 'INTERMEDIATE'
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

    wrapper = mountComponent(AdditionalSkillLevelRadioButtonSetFormField, {
      props: { form },
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the skill level field', () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      expect(levelField.exists()).toBe(true)
    })

    BddTest().then('it should not have error message initially', () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      expect(levelField.props('errorMessage')).toBeFalsy()
    })
  })

  BddTest().when('the user changes the level', () => {
    BddTest().then('it should trigger blur handler', async () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      const selectElement = levelField.find('select')

      await selectElement.trigger('change')
      await wrapper.vm.$nextTick()

      expect(levelField.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().when('the form is submitted with empty level', () => {
    BddTest().then('it should show validation error', async () => {
      form.setFieldValue('level', '' as EAdditionalSkillLevel)
      await wrapper.vm.$nextTick()

      await form.handleSubmit()
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
        expect(levelField.props('errorMessage')).toBe('Ce champ est requis')
      })
    })
  })

  BddTest().when('the form is submitted with valid level', () => {
    BddTest().then('it should not show validation error', async () => {
      form.setFieldValue('level', EAdditionalSkillLevel.ADVANCED)
      await form.handleSubmit()
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
        expect(levelField.props('errorMessage')).toBeFalsy()
      })
    })
  })
})
