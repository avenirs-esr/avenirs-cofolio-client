<script setup lang="ts">
import KitMultimediaContentTab
  from '@/features/student/kit/views/StudentToolsKitView/components/KitMultimediaContentTab/KitMultimediaContentTab.vue'
import KitTextContentTab from '@/features/student/kit/views/StudentToolsKitView/components/KitTextContentTab/KitTextContentTab.vue'
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeTab = ref(0)
</script>

<template>
  <AvTabs v-model="activeTab">
    <AvTab :title="t('student.kit.views.StudentToolsKitView.KitContentTabs.KitTextContentTab.title')">
      <KitTextContentTab />
    </AvTab>
    <AvTab :title="t('student.kit.views.StudentToolsKitView.KitContentTabs.KitMultimediaContentTab.title')">
      <KitMultimediaContentTab />
    </AvTab>
  </AvTabs>
</template>
