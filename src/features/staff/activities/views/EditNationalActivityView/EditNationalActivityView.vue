<script setup lang="ts">
import type { Ref } from 'vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useRouteQuery } from '@vueuse/router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const mode: Ref<string> = useRouteQuery('mode', 'edit')

const title = computed(() => t(`staff.global.navigation.tabs.activities.items.${mode.value === 'add' ? 'addNationalActivity' : 'editNationalActivity'}`))

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.activities.header'), to: ROUTES.STAFF.ACTIVITIES },
  { text: title.value }
])
</script>

<template>
  <PageTitle
    :title="title"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STAFF.ACTIVITIES"
  />
</template>
