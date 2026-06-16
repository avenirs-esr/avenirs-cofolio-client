<script setup lang="ts">
import { EActivityStatus, EDeclaredActivityStatus, invalidateGetActivityPresentation, useUpdateReflection } from '@/api/avenir-esr'
import Card from '@/common/components/cards/Card/Card.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { AUTO_SAVE_DEBOUNCE_DELAY, ICONS } from '@/common/constants'
import { PERSPECTIVE_MAX_LENGTH } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/config'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import { useToasterStore } from '@/store'
import { AvButton, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import DOMPurify from 'dompurify'
import { debounce } from 'lodash-es'
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export interface MyPerspectiveCardProps {
  activityId: string
  perspective?: string
  activityStatus?: EDeclaredActivityStatus
}

const { activityId, perspective } = defineProps<MyPerspectiveCardProps>()

const RichTextEditor = defineAsyncComponent(() => import('@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.vue'))

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()
const { validateMax } = useFormValidators()

const readonly = ref(true)
const content = ref(perspective ?? '<p></p>')
const sanitizedContent = computed(() => DOMPurify.sanitize(content.value))
const charCount = ref(0)

const { mutate: mutateUpdateReflection, isPending: isPendingSave } = useUpdateReflection()

function updateActivityReflection (reflection: string) {
  mutateUpdateReflection({ activityId, data: { reflection } }, {
    onError: (error) => {
      addErrorMessage({
        title: t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveCard.save.error'),
        description: getErrorMessage(error)
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetActivityPresentation(queryClient, EActivityStatus.PUBLISHED, activityId))
      addSuccessMessage(t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveCard.save.success'))
      readonly.value = true
    }
  })
}

const { mutate: mutateUpdateReflectionOnAutoSave, isPending: isPendingAutoSave } = useUpdateReflection()

function updateActivityReflectionOnAutoSave (reflection: string) {
  mutateUpdateReflectionOnAutoSave({ activityId, data: { reflection } }, {
    onError: (error) => {
      addErrorMessage({
        title: t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveCard.autoSave.error'),
        description: getErrorMessage(error)
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetActivityPresentation(queryClient, EActivityStatus.PUBLISHED, activityId))
      addSuccessMessage(t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveCard.autoSave.success'))
    }
  })
}

const isModified = computed(() => sanitizedContent.value !== perspective)
const errors = computed(() => validateMax(charCount.value, PERSPECTIVE_MAX_LENGTH))

const onAutoSave = debounce(() => {
  if (!readonly.value
    && isModified.value
    && !isPendingAutoSave.value
    && !isPendingSave.value
    && !errors.value) {
    updateActivityReflectionOnAutoSave(sanitizedContent.value)
  }
}, AUTO_SAVE_DEBOUNCE_DELAY)

function onSave () {
  updateActivityReflection(sanitizedContent.value)
}

watch(content, () => {
  if (!readonly.value) {
    onAutoSave()
  }
})
</script>

<template>
  <Card
    background-color="var(--card2)"
    title-background="var(--card2)"
    border-color="var(--other-border-skill-card)"
    :collapsible="readonly"
    data-testid="my-perspective-card"
  >
    <template #title>
      <div class="av-row av-flex-fill av-align-center av-justify-between av-gap-sm">
        <AvIconText
          typography-class="n4"
          :icon="ICONS.ACTIVITY_PERSPECTIVE"
          icon-color="var(--dark-background-primary1)"
          :text="t('student.buildProject.activities.global.perspective')"
          text-color="var(--text1)"
          gap="var(--spacing-sm)"
          data-testid="my-perspective-card-title"
        />

        <div>
          <AvButton
            v-if="readonly"
            :label="t('global.buttons.update')"
            :icon="MDI_ICONS.PENCIL_OUTLINE"
            variant="OUTLINED"
            small
            :disabled="activityStatus !== EDeclaredActivityStatus.IN_PROGRESS"
            data-testid="my-perspective-card-edit-button"
            @click="readonly = false"
          />
          <UpdateInProgressBadge
            v-else
            :show="!readonly"
          />
        </div>
      </div>
    </template>

    <div class="av-col av-gap-md">
      <RichTextEditor
        v-if="!readonly"
        v-model="content"
        v-model:char-count="charCount"
        :maxlength="PERSPECTIVE_MAX_LENGTH"
        :error-message="errors"
      />
      <div
        v-else
        data-user-content
        data-testid="my-perspective-card-content"
        v-html="sanitizedContent"
      />

      <div class="av-row av-flex-fill av-align-center av-gap-sm av-justify-end">
        <div v-if="!readonly">
          <AvButton
            v-if="isModified"
            :label="t('global.buttons.save')"
            :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
            variant="FLAT"
            :disabled="!isModified || !!errors"
            :is-loading="isPendingSave || isPendingAutoSave || isLoading"
            small
            data-testid="my-perspective-card-save-button"
            @click="onSave"
          />
          <AvButton
            v-else
            :label="t('global.buttons.cancel')"
            :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
            variant="DEFAULT"
            small
            :is-loading="isPendingAutoSave || isLoading"
            data-testid="my-perspective-card-cancel-button"
            @click="readonly = true"
          />
        </div>
      </div>
    </div>
  </Card>
</template>
