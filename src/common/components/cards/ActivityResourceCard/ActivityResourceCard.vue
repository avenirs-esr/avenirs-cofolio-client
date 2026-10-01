<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { ActivityResource } from '@/features/staff/activities/types/resource.types'
import { useDownloadActivityFile, useDownloadDraftFile } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { downloadBlob } from '@/common/utils/download/download'
import { isActivityResourceFile, isActivityResourceLink, isActivityResourcePendingFile } from '@/features/staff/activities/utils/resource.types-guard'
import { useToasterStore } from '@/store'
import { AvCard, AvIcon, type AvInteractiveProps, AvTag, AvTooltip, getAvTooltipContent, isAvTooltipEnabled, MDI_ICONS, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { mergeProps } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ActivityResourceCardComponentProps extends AvInteractiveProps {
  activityId: string
  resource: ActivityResource
  isDraft?: boolean
  tooltipVisible?: boolean
}

const {
  activityId,
  resource,
  disabled = false,
  isDraft = false,
  tooltipVisible = undefined
} = defineProps<ActivityResourceCardComponentProps>()

const titleRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(titleRef)

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()

const title = computed(() => {
  if (isActivityResourceLink(resource)) {
    return resource
  }

  if (isActivityResourcePendingFile(resource)) {
    return resource.name
  }

  return resource.fileName
})

function onDownloadError (error: BaseApiException) {
  addErrorMessage({
    title: t('global.error.download'),
    description: getErrorMessage(error),
  })
}

const { mutate: mutateDownloadFile } = useDownloadActivityFile({
  mutation: {
    onError: onDownloadError,
    onSuccess: data => downloadBlob(data, title.value),
  },
})

const { mutate: mutateDownloadDraftFile } = useDownloadDraftFile({
  mutation: {
    onError: onDownloadError,
    onSuccess: data => downloadBlob(data, title.value),
  },
})

const href = computed(() =>
  isActivityResourceLink(resource)
    ? resource
    : undefined,
)

const icon = computed(() =>
  isActivityResourceFile(resource)
    ? MDI_ICONS.FILE
    : MDI_ICONS.LINK,
)

const typeLabel = computed(() =>
  isActivityResourceLink(resource)
    ? t('global.link')
    : t('global.file'))

const downloadTooltipDisabled = computed(() =>
  disabled || isActivityResourceLink(resource),
)

function downloadFile () {
  if (disabled || !isActivityResourceFile(resource)) {
    return
  }

  if (isActivityResourcePendingFile(resource)) {
    downloadBlob(resource, resource.name)
  }
  else if (isDraft) {
    mutateDownloadDraftFile({ activityDraftId: activityId, fileId: resource.id })
  }
  else {
    mutateDownloadFile({ activityId, fileId: resource.id })
  }
}

const rootTag = computed(() => {
  if (disabled) {
    return 'div'
  }
  return href.value ? 'a' : 'button'
})

const rootAttrs = computed(() => {
  if (disabled) {
    return {}
  }

  if (href.value) {
    return {
      href: href.value,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  return {
    onClick: downloadFile
  }
})

const rootClass = computed(() => [
  href.value
    ? 'activity-resource-card-link'
    : 'activity-resource-card-file av-p-none',
  { 'activity-resource-card--disabled': disabled },
])

const rootTestId = computed(() => `activity-resource-card-${href.value ? 'link' : 'file'}`)
</script>

<template>
  <AvTooltip
    :content="t('global.cards.ActivityResourceCard.downloadDocument')"
    :disabled="downloadTooltipDisabled"
    data-testid="activity-resource-card-tooltip"
  >
    <component
      :is="rootTag"
      :class="rootClass"
      v-bind="mergeProps(rootAttrs, $attrs)"
      :data-testid="rootTestId"
    >
      <AvCard
        class="activity-resource-card"
        background-color="var(--surface-background)"
        border-color="transparent"
      >
        <template #title>
          <AvIcon
            :name="icon"
            color="var(--other-background-base)"
            :size="2"
          />
        </template>

        <template #body>
          <div class="av-row">
            <AvTooltip
              :content="getAvTooltipContent({ content: title, disabled, disabledTooltip })"
              :disabled="!isAvTooltipEnabled({ disabled, disabledTooltip, enableTooltip: isTruncated || tooltipVisible })"
              force-focusable
              data-testid="activity-resource-card-title-tooltip"
            >
              <span
                ref="titleRef"
                class="title av-max-lines b1-regular"
                :class="{ 'title-link': isActivityResourceLink(resource) }"
                data-testid="activity-resource-card-title"
              >
                {{ title }}
              </span>
            </AvTooltip>
          </div>
        </template>

        <template #footer>
          <div class="av-row">
            <AvTag :label="typeLabel" />
          </div>
        </template>
      </AvCard>
    </component>
  </AvTooltip>
</template>

<style scoped lang="scss">
.activity-resource-card-link,
.activity-resource-card-file {
  cursor: pointer;

  &:hover {
    background: none;
  }
}

.activity-resource-card-link {
  text-decoration: none;
  color: inherit;
  background: none;
}

.activity-resource-card--disabled {
  cursor: not-allowed;
}

.activity-resource-card {
  position: relative;
  width: 13.5rem;
  height: 12.5rem;

  :deep(.av-card__title) {
    width: var(--dimension-2xl);
    height: var(--dimension-2xl);

    background-color: var(--dark-background-primary1) !important;
    border-radius: 0 0 var(--radius-md) 0;

    justify-content: center;
  }

  .title {
    --max-lines: 2;

    &-link {
      text-decoration: underline;
    }
  }
}
</style>
