import type { AdditionalSkillFormData } from 'src/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/types'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useAdditionalSkillForm (onSkillAdded?: () => void) {
  const { t } = useI18n()

  const form = useForm({
    defaultValues: {
      selectedSkills: [],
      level: undefined
    } as unknown as AdditionalSkillFormData,
    validators: {
      onSubmit ({ value }: { value: AdditionalSkillFormData }) {
        return {
          fields: {
            selectedSkills: (!value.selectedSkills || value.selectedSkills.length === 0)
              ? t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.validation.skillRequired')
              : undefined,
            level: !value.level
              ? t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.validation.levelRequired')
              : undefined
          }
        }
      }
    },
    onSubmit: ({ value: _value }: { value: AdditionalSkillFormData }) => {
      // TODO: Implement save logic (API call, store update, etc.)
      onSkillAdded?.()
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid
  }
}

export type AdditionalSkillForm = ReturnType<typeof useAdditionalSkillForm>['form']
