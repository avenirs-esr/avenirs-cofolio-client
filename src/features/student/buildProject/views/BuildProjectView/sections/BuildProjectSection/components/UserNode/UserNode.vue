<script setup lang="ts">
import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { useStudentSummaryQuery } from '@/features/student/user'
import { Handle, type NodeProps, Position } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

defineProps<NodeProps>()

const { t } = useI18n()
const { data: studentData } = useStudentSummaryQuery()
// TODO: Remove localhost replacement when backend will provide the correct URL
const profilePictureUrl = computed(() => studentData.value?.profilePicture.url.replace('http://localhost:5173', 'https://qualif.avenirs-esr.fr'))

const handles = [
  { id: GLOBAL_NODE_HANDLES.TOP, position: Position.Top },
  { id: GLOBAL_NODE_HANDLES.RIGHT, position: Position.Right },
  { id: GLOBAL_NODE_HANDLES.BOTTOM, position: Position.Bottom },
  { id: GLOBAL_NODE_HANDLES.LEFT, position: Position.Left },
]
</script>

<template>
  <div class="vue-flow__node-default av-p-none av-radius-xl">
    <img
      :src="profilePictureUrl"
      :alt="t('student.buildProject.mindMap.user.profilePictureAlt')"
      class="user-picture av-w-full av-h-full"
    >

    <Handle
      v-for="handle in handles"
      :key="handle.id"
      v-bind="handle"
      connectable
      type="source"
    />
  </div>
</template>

<style lang="scss" scoped>
.vue-flow__node-default {
  width: v-bind('data.width');
  height: v-bind('data.height');
  border: none;
  overflow: hidden;

  .user-picture {
    object-fit: cover;
  }
}
</style>
