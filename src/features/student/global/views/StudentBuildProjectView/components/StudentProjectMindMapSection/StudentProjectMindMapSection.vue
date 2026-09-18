<script setup lang="ts">
import { useModal } from '@/common/composables'
import { ICONS } from '@/common/constants'
import MindMap from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/MindMap.vue'
import StudentProjectMindMapHelperModal
  from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectMindMapHelperModal/StudentProjectMindMapHelperModal.vue'
import { AvButton, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { modalOpened, openModal, closeModal } = useModal()
</script>

<template>
  <div class="av-row av-wrap av-gap-sm av-justify-between av-align-center av-mb-sm">
    <AvIconText
      :icon="ICONS.MIND_MAP"
      icon-color="var(--icon)"
      :text="t('student.buildProject.mindMap.title')"
      text-color="var(--title)"
      typography-class="n4"
      gap="var(--spacing-sm)"
    />
    <AvButton
      variant="OUTLINED"
      :label="t('student.global.views.StudentBuildProjectView.StudentProjectMindMapSection.consultHelpButtonLabel')"
      :icon="MDI_ICONS.FLAG_VARIANT"
      small
      @click="openModal"
    />
  </div>

  <MindMap />

  <StudentProjectMindMapHelperModal
    :opened="modalOpened"
    :on-close="closeModal"
  />
</template>
