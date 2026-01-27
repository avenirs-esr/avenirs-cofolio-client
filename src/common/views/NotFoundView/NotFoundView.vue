<script setup lang="ts">
import { ROUTES } from '@/common/constants'
import { AvButton } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface NotFoundViewProps {
  titleKey?: string
  descriptionKey?: string
}

const { titleKey = 'global.views.notFoundView.pageNotFound.title', descriptionKey = 'global.views.notFoundView.pageNotFound.description' } = defineProps<NotFoundViewProps>()

const router = useRouter()
const { t } = useI18n()

const title = computed(() => t(titleKey))
const description = computed(() => t(descriptionKey))
function backToHome () {
  router.push({ name: ROUTES.STUDENT.HOME.name })
}
</script>

<template>
  <div class="av-col av-align-center av-justify-center av-gap-lg">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>

    <AvButton
      :label="t('global.views.notFoundView.buttonLabel')"
      theme="PRIMARY"
      size="MEDIUM"
      @click="backToHome"
    />
  </div>
</template>
