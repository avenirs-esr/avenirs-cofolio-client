<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { AvLocale } from '@/types'
import type { RouteLocationRaw } from 'vue-router'
import { useAcceptCgu, useGetLatestCgu } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { formatDateLocalized } from '@/common/utils'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import { useToasterStore } from '@/store'
import { AvButton } from '@avenirs-esr/avenirs-dsav'
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()
const { modalOpened: refusalModalOpened, openModal: openRefusalModal, closeModal: closeRefusalModal } = useModal()

const authStore = useAuthStore()

const { data: cgu, isLoading, error } = useGetLatestCgu()

const title = computed(() => t('global.views.cguView.title'))

const trailingLinks = computed(() => [{ text: title.value }])

const version = computed(() => cgu.value ? t('global.views.cguView.version', { version: cgu.value.version }) : '')

const lastPublication = computed(() => cgu.value
  ? t('global.views.cguView.lastPublication', { date: formatDateLocalized(cgu.value.uploadedAt, locale.value as AvLocale) })
  : '')

const sanitizedContent = computed(() => DOMPurify.sanitize(cgu.value?.content ?? ''))

const acceptanceRequired = computed(() => authStore.isLoggedIn && !authStore.hasAcceptedLatestCgu)

const redirectTarget = computed<RouteLocationRaw>(() => {
  const redirect = route.query.redirect

  if (typeof redirect === 'string') {
    const resolved = router.resolve(redirect)
    if (resolved.matched.length > 0) {
      return resolved.fullPath
    }
  }

  return authStore.homeRoute
})

const { mutate: acceptCgu, isPending: isAccepting } = useAcceptCgu({
  mutation: {
    onSuccess: (accepted) => {
      authStore.setAcceptedCgu(accepted)
      router.replace(redirectTarget.value)
    },
    onError: (error: BaseApiException) => addErrorMessage(getErrorMessage(error))
  }
})

function onAccept () {
  acceptCgu()
}

function onRefuse () {
  window.location.assign(__AUTH_LOGOUT_URL__)
}
</script>

<template>
  <PageTitle
    :title="title"
    :trailing-links="trailingLinks"
  />

  <QuerySuspense
    :error="error"
    :is-loading="isLoading"
  >
    <div
      v-if="cgu"
      class="av-col av-gap-lg"
      :class="{ 'cgu-content-offset': acceptanceRequired }"
    >
      <div class="av-row av-wrap av-align-baseline av-gap-x-md av-gap-y-xs">
        <span
          class="b2-bold"
          data-testid="cgu-version"
        >
          {{ version }}
        </span>
        <span
          class="caption-regular av-text-text2"
          data-testid="cgu-last-publication"
        >
          {{ lastPublication }}
        </span>
      </div>

      <div
        class="cgu-content"
        data-testid="cgu-content"
        data-user-content
        v-html="sanitizedContent"
      />
    </div>
  </QuerySuspense>

  <div
    v-if="acceptanceRequired"
    class="cgu-acceptance-bar"
    data-testid="cgu-acceptance-bar"
  >
    <div class="av-container av-row av-wrap av-justify-center av-gap-md av-py-sm">
      <AvButton
        data-testid="cgu-refuse-button"
        :label="t('global.views.cguView.actions.refuse')"
        variant="OUTLINED"
        @click="openRefusalModal"
      />
      <AvButton
        data-testid="cgu-accept-button"
        :label="t('global.views.cguView.actions.accept')"
        variant="FLAT"
        :is-loading="isAccepting"
        @click="onAccept"
      />
    </div>
  </div>

  <ConfirmationModal
    data-testid="cgu-refusal-confirmation-modal"
    :opened="refusalModalOpened"
    :title="t('global.views.cguView.refusalModal.title')"
    :description="t('global.views.cguView.refusalModal.description')"
    :confirm-button-label="t('global.buttons.logout')"
    :close-button-label="t('global.buttons.cancel')"
    @confirm="onRefuse"
    @close="closeRefusalModal"
  />
</template>

<style lang="scss" scoped>
.cgu-content {
  :deep() {
    a {
      color: var(--dark-background-primary1);
      text-decoration: underline;
    }
  }
}

.cgu-acceptance-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background-color: var(--other-background-base);
  border-top: 1px solid var(--stroke);
  box-shadow: 0 -0.25rem 0.75rem rgb(0 0 0 / 10%);
}

.cgu-content-offset {
  padding-bottom: var(--dimension-5xl);
}
</style>
