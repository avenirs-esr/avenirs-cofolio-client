<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { BaseApiException } from '@/common/exceptions'
import { AvButton } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useAcceptCgu } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/overlay/modals/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import { useToasterStore } from '@/store'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { getErrorMessage } = useApiErrors()
const { addErrorMessage } = useToasterStore()
const { invalidateSession } = useAuthStore()
const { homeRoute, cgu: { hasAcceptedLatest, setAccepted } } = useCurrentUserSession()
const { modalOpened: refusalModalOpened, openModal: openRefusalModal, closeModal: closeRefusalModal } = useModal()

const redirectTarget = computed<RouteLocationRaw>(() => {
  const redirect = route.query.redirect

  if (typeof redirect === 'string') {
    const resolved = router.resolve(redirect)
    if (resolved.matched.length > 0) {
      return resolved.fullPath
    }
  }

  return homeRoute.value
})

const { mutate: acceptCgu, isPending: isAccepting } = useAcceptCgu({
  mutation: {
    onSuccess: (accepted) => {
      setAccepted(accepted)
      router.replace(redirectTarget.value)
    },
    onError: (error: BaseApiException) => addErrorMessage(getErrorMessage(error))
  }
})

function onAccept () {
  acceptCgu()
}

function onRefuse () {
  invalidateSession()
  window.location.assign(__AUTH_LOGOUT_URL__)
}
</script>

<template>
  <template v-if="!hasAcceptedLatest">
    <div
      class="cgu-acceptance-spacer"
      aria-hidden="true"
    />

    <div
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
  </template>

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
.cgu-acceptance-spacer {
  height: var(--dimension-5xl);
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
</style>
