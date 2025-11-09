import type { BaseApiException } from '@/common/exceptions'
import type { AdditionalSkillFormData } from '@/features/student/skills/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/types'
import { useCreateAdditionalSkillMutation } from '@/features/student/queries'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useAdditionalSkillForm (onSkillAdded?: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  const onCreateAdditionalSkillError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.errors.createAdditionalSkill'),
      description: error.message
    })
  }

  const { mutate: createAdditionalSkill, isPending } = useCreateAdditionalSkillMutation({ onError: onCreateAdditionalSkillError })

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
    onSubmit: ({ value }: { value: AdditionalSkillFormData }) => {
      const selectedSkill = value.selectedSkills[0]
      createAdditionalSkill({
        id: selectedSkill.id,
        type: selectedSkill.type,
        level: value.level
      }, {
        onSuccess: () => {
          onSkillAdded?.()
        }
      })
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending
  }
}

export type AdditionalSkillForm = ReturnType<typeof useAdditionalSkillForm>['form']
