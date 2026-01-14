<script lang="ts" setup>
import type { DeclaredSkillProgressDetailsDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import DeclaredSkillRefCard from '@/features/student/declaredSkills/components/cards/DeclaredSkillRefCard/DeclaredSkillRefCard.vue'
import DeclaredSkillCommentFormField from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillCommentFormField/DeclaredSkillCommentFormField.vue'
import DeclaredSkillLevelRadioButtonSetFormField from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillLevelRadioButtonSetFormField/DeclaredSkillLevelRadioButtonSetFormField.vue'
import { useUpdateDeclaredSkillForm } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import { AvCancelConfirmButtons, AvCard, AvInput, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

interface UpdateDeclaredSkillFormProps {
  declaredSkillProgressDetails: DeclaredSkillProgressDetailsDTO
  onSkillUpdated?: () => void
  onCancel?: () => void
}

const props = defineProps<UpdateDeclaredSkillFormProps>()
const emit = defineEmits<{
  (e: 'dirtyChange', value: boolean): void
}>()
const { t } = useI18n()

const { form, isFormValid, isSubmitting } = useUpdateDeclaredSkillForm(
  props.declaredSkillProgressDetails,
  props.onSkillUpdated
)

function handleSubmit () {
  form.handleSubmit()
}

function handleCancel () {
  emit('dirtyChange', false)
  props.onCancel?.()
}

watch(
  () => form.state.isDirty,
  dirty => emit('dirtyChange', dirty),
  { immediate: true }
)

const createdAtPrefix = computed(() => capitalize(t('student.skills.skill')))
</script>

<template>
  <AvCard class="update-declared-skill-form">
    <form @submit.prevent="handleSubmit">
      <div class="update-declared-skill-form__content">
        <div class="update-declared-skill-form__main">
          <AvInput
            :label="t('student.declaredSkills.views.StudentDeclaredSkillView.declaredSkillDetails.skillTitle')"
            label-class="caption-regular"
            :prefix-icon="RI_ICONS.LOADER_LINE"
            :model-value="declaredSkillProgressDetails.title"
            disabled
          />

          <DeclaredSkillRefCard
            :type="declaredSkillProgressDetails.type"
            :path-segments="declaredSkillProgressDetails.pathSegments"
          />

          <div class="update-declared-skill-form__field">
            <DeclaredSkillLevelRadioButtonSetFormField :form="form" />
          </div>

          <CreationUpdateDateDetails
            :created-at="declaredSkillProgressDetails.createdAt"
            :updated-at="declaredSkillProgressDetails.updatedAt"
            :created-at-prefix="createdAtPrefix"
          />
        </div>

        <div class="update-declared-skill-form__side">
          <div class="update-declared-skill-form__field">
            <DeclaredSkillCommentFormField :form="form" />
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="update-declared-skill-form__actions">
        <AvCancelConfirmButtons
          :cancel-label="t('global.buttons.cancel')"
          :confirm-label="t('global.buttons.save')"
          :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          :confirm-icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
          :cancel-disabled="isSubmitting"
          :confirm-disabled="!isFormValid || isSubmitting"
          :confirm-is-loading="isSubmitting"
          @cancel="handleCancel"
          @confirm="handleSubmit"
        />
      </div>
    </template>
  </AvCard>
</template>

<style scoped lang="scss">
.update-declared-skill-form {
  &__content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }

  &__main {
    display: flex;
    flex-direction: column;
    flex: 1 1 300px;
    min-width: 300px;
    gap: var(--spacing-md);
  }

  &__side {
    display: flex;
    flex-direction: column;
    flex: 1 1 300px;
    min-width: 300px;
    gap: var(--spacing-xl);

    :deep(textarea) {
      height: 75vh !important;
      resize: none;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
