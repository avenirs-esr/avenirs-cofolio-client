<script lang="ts" setup>
import { useGetLocalTool, useGetNationalTool } from '#shared/api/avenir-esr/index'
import ToolBanner from '#shared/ui/components/base/ToolBanner/ToolBanner.vue'
import QuerySuspense from '#shared/ui/components/containers/QuerySuspense/QuerySuspense.vue'
import { AvInput } from '@avenirs-esr/avenirs-dsav'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ToolDetailsContainerProps {
  id: string
  isNational: boolean
}

const { id, isNational } = defineProps<ToolDetailsContainerProps>()

const { t } = useI18n()

const toolId = computed(() => id)
const national = computed(() => isNational)

const {
  data: nationalTool,
  isFetching: isFetchingNationalTool,
  error: nationalToolError
} = useGetNationalTool(toolId, { query: { enabled: national } })
const {
  data: localTool,
  isFetching: isFetchingLocalTool,
  error: localToolError
} = useGetLocalTool(toolId, { query: { enabled: computed(() => !isNational) } })

const tool = computed(() => (national.value ? nationalTool.value : localTool.value))
const isFetching = computed(() => (national.value ? isFetchingNationalTool.value : isFetchingLocalTool.value))
const error = computed(() => (national.value ? nationalToolError.value : localToolError.value))

const i18nKey = 'global.components.containers.ToolDetailsContainer.labels'
</script>

<template>
  <QuerySuspense
    :error="error"
    :is-loading="isFetching"
  >
    <div class="av-col av-gap-md">
      <div class="av-row av-align-center av-justify-center">
        <div class="banner-container">
          <ToolBanner :banner-id="tool?.banner?.id" />
        </div>
      </div>

      <div class="av-row av-gap-md">
        <div class="av-col av-gap-sm av-flex-fill">
          <AvInput
            :model-value="tool?.name"
            :label="t(`${i18nKey}.name`)"
            disabled
            width="100%"
          />
          <div class="av-col">
            <label
              id="tool-link-label"
              class="av-label"
            >
              <span class="b2-light">{{ t(`${i18nKey}.url`) }}</span>
            </label>
            <a
              target="_blank"
              rel="noopener noreferrer"
              :href="tool?.url"
              class="av-link av-wrap-anywhere"
              aria-labelledby="tool-link-label"
            >
              {{ tool?.url }}
            </a>
          </div>
        </div>
        <div class="av-col av-gap-sm av-flex-fill">
          <AvInput
            :model-value="tool?.description"
            class="tool-description"
            :label="t(`${i18nKey}.description`)"
            disabled
            width="100%"
            textarea-min-height="14rem"
            is-textarea
          />
        </div>
      </div>
    </div>
  </QuerySuspense>
</template>

<style lang="scss" scoped>
.banner-container {
  width: 75%;
}

:deep(textarea) {
  resize: none !important;
}
</style>
