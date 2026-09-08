<script setup lang="ts">
import { useGetBuildLifeProjectConfig } from '@/api/avenir-esr'
import { AvModal, formatTextToHtml } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const {
  opened,
  onClose
} = defineProps<{ opened: boolean, onClose: () => void }>()

const { t } = useI18n()

const { data: config } = useGetBuildLifeProjectConfig()
</script>

<template>
  <AvModal
    :opened="opened"
    :close-button-label="t('student.global.views.studentProjectTrajectoriesView.buildProject.projectTrajectoriesHelperModal.closeButtonLabel')"
    @close="onClose"
    @click-outside="onClose"
  >
    <div
      v-if="config"
      class="av-col av-nowrap"
      v-html="formatTextToHtml(config.html)"
    />
  </AvModal>
</template>
