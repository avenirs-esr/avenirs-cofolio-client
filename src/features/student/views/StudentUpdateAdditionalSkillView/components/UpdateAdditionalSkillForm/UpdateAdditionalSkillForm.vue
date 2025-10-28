<script lang="ts" setup>
import { useDateUtils } from '@/common/composables'
import {
  type AdditionalSkillCategory,
  type AdditionalSkillProgressDetailsDTO,
  EAdditionalSkillCategoryType
} from '@/features/student/views/StudentAdditionalSkillView/components/AdditionalSkillDetails/AdditionalSkillDetails.types'
import AdditionalSkillCommentFormField
  from '@/features/student/views/StudentUpdateAdditionalSkillView/components/AdditionalSkillCommentFormField/AdditionalSkillCommentFormField.vue'
import AdditionalSkillLevelFormField
  from '@/features/student/views/StudentUpdateAdditionalSkillView/components/AdditionalSkillLevelFormField/AdditionalSkillLevelFormField.vue'
import { useUpdateAdditionalSkillForm } from '@/features/student/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import { AvBadge, AvButton, AvCard, AvIcon, AvIconText, AvInput, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateAdditionalSkillFormProps {
  additionalSkillProgressDetails: AdditionalSkillProgressDetailsDTO
  onSkillUpdated?: () => void
  onCancel?: () => void
}

const props = defineProps<UpdateAdditionalSkillFormProps>()
const { t } = useI18n()
const { formatTranslatedDateTime } = useDateUtils()

const { form, isFormValid, isSubmitting } = useUpdateAdditionalSkillForm(
  props.additionalSkillProgressDetails,
  props.onSkillUpdated
)

function handleSubmit () {
  form.handleSubmit()
}

function handleCancel () {
  props.onCancel?.()
}

function getPathSegmentLabel (segment: AdditionalSkillCategory) {
  const before = t(`student.additionalSkillCategoryTypes.${EAdditionalSkillCategoryType[segment.type]}`)
  return t('global.colon', { before, after: segment.title })
}
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

          <div class="ref--container">
            <span class="caption-regular">{{ t('student.views.studentAdditionalSkillView.tabs.details.refTitle') }}</span>
            <AvCard>
              <div class="ref--content">
                <div class="ref--type">
                  <AvIcon
                    :name="MDI_ICONS.CIRCLE"
                    color="var(--dark-background-primary1)"
                    :size="0.5"
                  />
                  <AvBadge
                    background-color="var(--surface-background)"
                    border-color="var(--other-border-skill-card)"
                    color="var(--text1)"
                    :label="t(`student.additionalSkillTypes.${additionalSkillProgressDetails.type}`)"
                    no-icon
                  />
                </div>

                <div
                  v-for="(segment, index) in additionalSkillProgressDetails.pathSegments"
                  :key="index"
                  class="ref--item"
                  :style="{ paddingLeft: `calc(${index + 1} * var(--spacing-sm))` }"
                >
                  <AvIconText
                    v-if="index < additionalSkillProgressDetails.pathSegments.length - 1"
                    :icon="MDI_ICONS.ARROW_RIGHT_BOTTOM"
                    icon-color="var(--dark-background-primary1)"
                    :text="getPathSegmentLabel(segment)"
                    text-color="var(--text1)"
                    inline
                  />
                  <div
                    v-else
                    class="ref--last-segment"
                  >
                    <AvIcon
                      :name="MDI_ICONS.ARROW_RIGHT_BOTTOM"
                      color="var(--dark-background-primary1)"
                      :size="1.3125"
                    />
                    <AvBadge
                      background-color="var(--light-background-accent)"
                      color="var(--dark-background-accent)"
                      :label="getPathSegmentLabel(segment)"
                      no-icon
                    />
                  </div>
                </div>
              </div>
            </AvCard>
          </div>

          <div class="update-additional-skill-form__field">
            <AdditionalSkillLevelFormField :form="form" />
          </div>

          <div class="date-details">
            <AvIconText
              v-if="additionalSkillProgressDetails.createdAt"
              :icon="RI_ICONS.LOADER_LINE"
              :text="t('student.views.studentAdditionalSkillView.tabs.details.dateDetails.added',
                       { date: formatTranslatedDateTime(additionalSkillProgressDetails.createdAt) })"
            />
            <AvIconText
              v-if="additionalSkillProgressDetails.updatedAt"
              :icon="MDI_ICONS.PENCIL_OUTLINE"
              :text="t('student.views.studentAdditionalSkillView.tabs.details.dateDetails.updated',
                       { date: formatTranslatedDateTime(additionalSkillProgressDetails.updatedAt) })"
            />
          </div>
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

.ref {
  &--container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
  }

  &--content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &--type, &--last-segment {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xxs);
    align-items: center;
  }

  &--last-segment {
    align-items: start;

    :deep(.fr-badge span) {
      text-transform: initial !important;
    }
  }

  &--item {
    :deep(.icon-text--container) {
      align-items: start;
    }
  }
}

.date-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
