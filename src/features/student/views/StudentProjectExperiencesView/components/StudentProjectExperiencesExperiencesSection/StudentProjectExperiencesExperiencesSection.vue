<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="b1-bold">
    {{ t('student.views.studentProjectExperiencesView.experiences.title') }}
  </div>
</template>
