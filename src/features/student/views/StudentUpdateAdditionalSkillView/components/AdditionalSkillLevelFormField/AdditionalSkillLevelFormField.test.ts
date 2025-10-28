import type { UpdateAdditionalSkillForm } from '@/features/student/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import AdditionalSkillLevelFormField
  from '@/features/student/views/StudentUpdateAdditionalSkillView/components/AdditionalSkillLevelFormField/AdditionalSkillLevelFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    AdditionalSkillLevelFormField
  },
  setup () {
    const form = useForm({
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

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <AdditionalSkillLevelFormField :form="form" />
    </form>
  `
}

BddTest().given('an additional skill level form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    AddAdditionalSkillLevelField: {
      name: 'AddAdditionalSkillLevelField',
      props: ['form', 'errorMessage'],
      emits: ['blur'],
      template: '<div><select @change="$emit(\'blur\')"><option value="BEGINNER">Débutant</option><option value="INTERMEDIATE">Intermédiaire</option></select><span v-if="errorMessage" class="error">{{ errorMessage }}</span></div>'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the skill level field', () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      expect(levelField.exists()).toBe(true)
    })

    BddTest().then('it should pass the form to the level field', () => {
      const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
      expect(levelField.props('form')).toBe(wrapper.vm.form)
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
      const form = wrapper.vm.form
      form.setFieldValue('level', '')
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
        expect(levelField.props('errorMessage')).toBe('Ce champ est requis')
      })
    })
  })

  BddTest().when('the form is submitted with valid level', () => {
    BddTest().then('it should not show validation error', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const levelField = wrapper.findComponent({ name: 'AddAdditionalSkillLevelField' })
        expect(levelField.props('errorMessage')).toBeFalsy()
      })
    })
  })
})
