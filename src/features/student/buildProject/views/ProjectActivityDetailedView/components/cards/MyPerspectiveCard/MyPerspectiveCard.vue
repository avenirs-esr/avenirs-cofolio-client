<script setup lang="ts">
import { useUpdateActivityReflectionMutation } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { PERSPECTIVE_MAX_LENGTH } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/config'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import { ICONS } from '@/features/student/global/icons'
import { useToasterStore } from '@/store'
import { AvButton, AvCard, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import DOMPurify from 'dompurify'
import { debounce } from 'lodash-es'
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export interface MyPerspectiveCardProps {
  activityId: string
  perspective?: string
}

const { activityId, perspective } = defineProps<MyPerspectiveCardProps>()

const RichTextEditor = defineAsyncComponent(() => import('@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.vue'))

const { t } = useI18n()
const { addSuccessMessage, addErrorMessage } = useToasterStore()

const readonly = ref(true)
const content = ref(perspective ?? '<p></p>')
const sanitizedContent = computed(() => DOMPurify.sanitize(content.value))

const { mutate: updateActivityReflection, isPending: isPendingSave } = useUpdateActivityReflectionMutation({
  onError: (error) => {
    addErrorMessage({
      title: t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveCard.save.error'),
      description: error.message
    })
  },
  onSuccess: () => {
    addSuccessMessage(t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveCard.save.success'))
    readonly.value = true
  }
})
const { mutate: updateActivityReflectionOnAutoSave, isPending: isPendingAutoSave } = useUpdateActivityReflectionMutation({
  onError: (error) => {
    addErrorMessage({
      title: t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveCard.autoSave.error'),
      description: error.message
    })
  },
  onSuccess: () => {
    addSuccessMessage(t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveCard.autoSave.success'))
  }
})

const isModified = computed(() => sanitizedContent.value !== perspective)

const onAutoSave = debounce(() => {
  if (!readonly.value && isModified.value && !isPendingAutoSave.value && !isPendingSave.value) {
    updateActivityReflectionOnAutoSave({ activityId, reflection: sanitizedContent.value })
  }
}, 15000)

function onSave () {
  updateActivityReflection({ activityId, reflection: sanitizedContent.value })
}

watch(content, () => {
  if (!readonly.value) {
    onAutoSave()
  }
})
</script>

<template>
  <AvCard
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
        :maxlength="PERSPECTIVE_MAX_LENGTH"
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
            :disabled="!isModified"
            :is-loading="isPendingSave || isPendingAutoSave"
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
            :is-loading="isPendingAutoSave"
            data-testid="my-perspective-card-cancel-button"
            @click="readonly = true"
          />
        </div>
      </div>
    </div>
  </AvCard>
</template>
