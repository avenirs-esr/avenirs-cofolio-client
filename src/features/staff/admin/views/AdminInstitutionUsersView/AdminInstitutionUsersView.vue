<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SearchEntityInput from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.vue'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'

const { t } = useI18n()

const userInfoSearch = ref('')
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionUsersView.title')" />

  <div class="av-col">
    <SearchEntityInput
      v-model="userInfoSearch"
      :entity-name="t('staff.admin.views.AdminInstitutionUsersView.SearchEntityInput.entityName')"
      :entity-placeholder="t('staff.admin.views.AdminInstitutionUsersView.SearchEntityInput.entityPlaceholder')"
    />
  </div>
</template>
