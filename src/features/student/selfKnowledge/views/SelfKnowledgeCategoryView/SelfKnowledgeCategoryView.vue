<script setup lang="ts">
import type { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

interface SelfKnowledgeCategoryViewProps {
  categoryId: string
  categoryType: ESelfKnowledgeCategoryType
}

const { categoryType } = defineProps<SelfKnowledgeCategoryViewProps>()
const { t } = useI18n()

const categoryTypeLabel = computed(() => t(`student.selfKnowledgeCategoryType.${categoryType}`))

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.trajectories') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.selfKnowledgeCategoryView.title', { type: categoryTypeLabel })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.HOME"
  />
</template>

<style scoped lang="scss">

</style>
