<script lang="ts" setup>
import type { AdditionalSkillProgressDetailsDTO } from '@/api/avenir-esr'
import { AdditionalSkillDateDetails, AdditionalSkillRefCard, AdditionalSkillCommentFormField, AdditionalSkillLevelFormField } from '@/features/student/components'
import { useUpdateAdditionalSkillForm } from '@/features/student/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import { AvButton, AvCard, AvInput, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateAdditionalSkillFormProps {
  additionalSkillProgressDetails: AdditionalSkillProgressDetailsDTO
  onSkillUpdated?: () => void
  onCancel?: () => void
}

const props = defineProps<UpdateAdditionalSkillFormProps>()
const emit = defineEmits<{
  (e: 'dirtyChange', value: boolean): void
}>()
const { t } = useI18n()

const { form, isFormValid, isSubmitting } = useUpdateAdditionalSkillForm(
  props.additionalSkillProgressDetails,
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
</script>

<template>
  <AvCard class="update-additional-skill-form">
    <form @submit.prevent="handleSubmit">
      <div class="update-additional-skill-form__content">
        <div class="update-additional-skill-form__main">
          <AvInput
            :label="t('student.views.studentAdditionalSkillView.tabs.details.skillTitle')"
            label-class="caption-regular"
            :prefix-icon="RI_ICONS.LOADER_LINE"
            :model-value="additionalSkillProgressDetails.title"
            disabled
          />

          <AdditionalSkillRefCard
            :type="additionalSkillProgressDetails.type"
            :path-segments="additionalSkillProgressDetails.pathSegments"
          />

          <div class="update-additional-skill-form__field">
            <AdditionalSkillLevelFormField :form="form" />
          </div>

          <AdditionalSkillDateDetails
            :created-at="additionalSkillProgressDetails.createdAt"
            :updated-at="additionalSkillProgressDetails.updatedAt"
          />
        </div>

        <div class="update-additional-skill-form__side">
          <div class="update-additional-skill-form__field">
            <AdditionalSkillCommentFormField :form="form" />
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="update-additional-skill-form__actions">
        <AvButton
          :label="t('global.buttons.cancel')"
          :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          variant="OUTLINED"
          size="sm"
          @click="handleCancel"
        />

        <AvButton
          variant="FLAT"
          size="sm"
          :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
          :label="t('global.buttons.save')"
          :disabled="!isFormValid || isSubmitting"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </div>
    </template>
  </AvCard>
</template>

<style scoped lang="scss">
.update-additional-skill-form {
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
    gap: var(--spacing-sm);
  }
}
</style>
