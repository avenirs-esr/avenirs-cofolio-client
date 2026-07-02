<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { ActivityResource } from '@/features/staff/activities/types/resource.types'
import { useDownloadFile } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { downloadBlob } from '@/common/utils/download/download'
import { isActivityResourceFile, isActivityResourceLink } from '@/features/staff/activities/utils/resource.types-guard'
import { useToasterStore } from '@/store'
import { AvCard, AvIcon, AvTag, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityResourceCardComponentProps {
  resource: ActivityResource
}

const { resource } = defineProps<ActivityResourceCardComponentProps>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()

const { mutate: mutateDownloadFile } = useDownloadFile({
  mutation: {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.errors.download'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: data => downloadBlob(data, resource.title),
  },
})

const icon = computed(() =>
  isActivityResourceFile(resource)
    ? MDI_ICONS.FILE
    : MDI_ICONS.LINK,
)

const typeLabel = computed(() =>
  t(`global.${resource.type}`))

function downloadFile () {
  if (!isActivityResourceFile(resource)) {
    return
  }

  mutateDownloadFile({ fileId: resource.fileId })
}
</script>

<template>
  <component
    :is="isActivityResourceLink(resource) ? 'a' : 'div'"
    class="activity-resource-card-link"
    v-bind="isActivityResourceLink(resource)
      ? {
        href: resource.url,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
      : {}"
  >
    <AvCard
      class="activity-resource-card"
      background-color="var(--card2)"
      border-color="transparent"
      data-testid="activity-resource-card"
      @click="isActivityResourceFile(resource) ? downloadFile : undefined"
    >
      <template #body>
        <div class="icon-container av-col av-align-center av-justify-center av-top-none av-left-none">
          <AvIcon
            :name="icon"
            color="var(--other-background-base)"
            :size="2"
          />
        </div>

        <div class="content av-col av-gap-md av-pt-2xl">
          <span
            class="title av-max-lines b1-regular"
            :class="{ 'title-link': isActivityResourceLink(resource) }"
            data-testid="activity-resource-card-title"
          >
            {{ resource.title }}
          </span>

          <AvTag
            :label="typeLabel"
            data-testid="activity-resource-card-type"
          />
        </div>
      </template>
    </AvCard>
  </component>
</template>

<style scoped lang="scss">
.activity-resource-card {
  position: relative;

  width: 13.75rem;
  height: 13rem;

  .icon-container {
    position: absolute;

    width: var(--dimension-2xl);
    height: var(--dimension-2xl);

    background-color: var(--dark-background-primary1);
    border-radius: 0 0 var(--radius-md) 0;
  }

  .title {
    --max-lines: 2;
  }

  .title-link {
    text-decoration: underline;
  }
}

.activity-resource-card-link {
  text-decoration: none;
  color: inherit;
}
</style>
