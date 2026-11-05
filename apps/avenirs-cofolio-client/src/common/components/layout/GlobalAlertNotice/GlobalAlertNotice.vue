<script setup lang="ts">
import type { FetchOptions } from '@avenirs-esr/shared'
import { AvNotice } from '@avenirs-esr/avenirs-dsav'
import { useGetAlertMessage } from '@/api/avenir-esr'

const requestOptions: FetchOptions = { skipUnauthorizedHandling: true }

const route = useRoute()

const { data, refetch } = useGetAlertMessage({ request: requestOptions })

const message = computed(() => data.value?.message?.trim())

watch(() => route.path, () => {
  refetch()
})
</script>

<template>
  <div
    v-if="message"
    class="global-alert-notice"
    data-testid="global-alert-notice"
  >
    <AvNotice
      :text="message"
      type="alert"
      global
    />
  </div>
</template>
