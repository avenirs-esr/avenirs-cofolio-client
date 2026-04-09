import type { BaseApiException } from '@/common/exceptions'
import type { DeclaredSkillFormData } from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/types'
import { EDeclaredSkillLevel, EErrorCode } from '@/api/avenir-esr'
import { useCreateDeclaredSkillMutation } from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useDeclaredSkillForm (onSkillAdded?: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  const onCreateDeclaredSkillError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.errors.createDeclaredSkill'),
      description: error.code === EErrorCode.STUDENT_DECLARED_ALREADY_EXIST ? t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.errors.declaredSkillAlreadyExist') : error.message
    })
  }

  const { mutate: createDeclaredSkill, isPending } = useCreateDeclaredSkillMutation({ onError: onCreateDeclaredSkillError })

  const form = useForm({
    defaultValues: {
      selectedSkills: [],
      level: EDeclaredSkillLevel.BEGINNER
    } as unknown as DeclaredSkillFormData,
    validators: {
      onSubmit ({ value }: { value: DeclaredSkillFormData }) {
        return {
          fields: {
            selectedSkills: (!value.selectedSkills || value.selectedSkills.length === 0)
              ? t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.validation.skillRequired')
              : undefined,
            level: !value.level
              ? t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.validation.levelRequired')
              : undefined,
            reflection: !value.reflection
          }
        }
      }
    },
    onSubmit: ({ value }: { value: DeclaredSkillFormData }) => {
      const selectedSkill = value.selectedSkills[0]
      createDeclaredSkill({
        id: selectedSkill.id,
        type: selectedSkill.type,
        level: value.level,
        reflection: value.reflection
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

export type DeclaredSkillForm = ReturnType<typeof useDeclaredSkillForm>['form']
