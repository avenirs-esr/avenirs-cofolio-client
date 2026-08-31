<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { ActivityResource } from '@/features/activities/types/resource.types'
import { useDownloadActivityFile } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { downloadBlob } from '@/common/utils/download/download'
import { isActivityResourceFile, isActivityResourceLink, isActivityResourcePendingFile } from '@/features/activities/utils/resource.types-guard'
import { useToasterStore } from '@/store'
import { AvCard, AvIcon, AvTag, AvTooltip, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityResourceCardComponentProps {
  activityId: string
  resource: ActivityResource
  disabled?: boolean
  tooltipVisible?: boolean
}

const {
  activityId,
  resource,
  disabled = false,
  tooltipVisible = undefined
} = defineProps<ActivityResourceCardComponentProps>()

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

const { mutate: mutateDownloadFile } = useDownloadActivityFile({
  mutation: {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.download'),
        description: getErrorMessage(error),
      })
    },
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

function downloadFile () {
  if (disabled || !isActivityResourceFile(resource)) {
    return
  }

  if (isActivityResourcePendingFile(resource)) {
    downloadBlob(resource, resource.name)
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
  <component
    :is="rootTag"
    :class="rootClass"
    v-bind="rootAttrs"
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
            :content="title"
            :disabled="tooltipVisible === undefined ? disabled : !tooltipVisible"
          >
            <span
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
