<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminRolesView.title')" />
</template>
