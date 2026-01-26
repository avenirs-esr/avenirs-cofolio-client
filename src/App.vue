<script setup lang="ts">
import { BaseApiErrorCode } from '@/common/exceptions'
import NotFoundView from '@/common/views/NotFoundView/NotFoundView.vue'
import { useToasterStore } from '@/store'
import { AvToaster } from '@avenirs-esr/avenirs-dsav'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()

const toasterStore = useToasterStore()
const { messages, errorCode } = storeToRefs(toasterStore)
const { removeMessage, clearErrorCode } = toasterStore

watch(() => route.fullPath, () => clearErrorCode())
</script>

<template>
  <NotFoundView
    v-if="errorCode === BaseApiErrorCode.NOT_FOUND"
    title-key="global.views.notFoundView.resourceNotFound.title"
    description-key="global.views.notFoundView.resourceNotFound.description"
  />
  <router-view v-else />

  <AvToaster
    :messages="messages"
    :on-remove-message="removeMessage"
  />
</template>
