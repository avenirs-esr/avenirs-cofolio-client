<script setup lang="ts">
import { PageTitle } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionSkillsView.title')" />
</template>
