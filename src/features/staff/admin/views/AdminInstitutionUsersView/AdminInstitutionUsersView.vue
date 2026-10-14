<script setup lang="ts">
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import UserInfoSearch from '@/features/staff/admin/views/AdminInstitutionUsersView/components/inputs/UserInfoSearch/UserInfoSearch.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const userInfoSearch = ref('')
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionUsersView.title')" />

  <div class="av-col">
    <UserInfoSearch v-model="userInfoSearch" />
  </div>
</template>
