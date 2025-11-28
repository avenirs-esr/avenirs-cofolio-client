<script setup lang="ts">
import type { MindMapNodeTemplateProps } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import { EErrorCode } from '@/api/avenir-esr'
import { Rating } from '@/common/components'
import TitleDescriptionNodeTemplate from '@/common/components/VueFlow/TitleDescriptionNodeTemplate/TitleDescriptionNodeTemplate.vue'
import { useNodes } from '@/common/composables/VueFlow/use-nodes/use-nodes'
import { MIND_MAP_FLOW_ID } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'
import { useAddSelfKnowledgeCategoryElementMutation, useUpdateSelfKnowledgeElementMutation } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

const { id, data } = defineProps<MindMapNodeTemplateProps>()

const { updateNodeId } = useNodes(MIND_MAP_FLOW_ID)

const { t } = useI18n()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { mutate: addSelfKnowledgeCategoryElement } = useAddSelfKnowledgeCategoryElementMutation({
  onSuccess: (newElement) => {
    addSuccessMessage(t('student.buildProject.mindMap.selfKnowledge.element.success'))
    updateNodeId(id, newElement.id)
  },
  onError: error => addErrorMessage({
    title: t('student.buildProject.mindMap.selfKnowledge.element.error'),
    description: error.message,
  })
})
const { mutate: updateSelfKnowledgeElement } = useUpdateSelfKnowledgeElementMutation({
  onSuccess: () => addSuccessMessage(t('student.buildProject.mindMap.selfKnowledge.element.success')),
  onError: (error) => {
    if (isEErrorCode(error.code) && error.code === EErrorCode.SELF_KNOWLEDGE_ELEMENT_NOT_FOUND) {
      addSelfKnowledgeCategoryElement({
        selfKnowledgeCategoryId: data.categoryId as string,
        element: {
          title: data.title,
          description: data.description,
          rating: data.rating > 0 ? data.rating : undefined,
        },
      })
    }
    else {
      addErrorMessage({
        title: t('student.buildProject.mindMap.selfKnowledge.element.error'),
        description: error.message,
      })
    }
  }
})

function isEErrorCode (code: unknown): code is EErrorCode {
  return Object.values(EErrorCode).includes(code as EErrorCode)
}
</script>

<template>
  <TitleDescriptionNodeTemplate
    v-bind="$props"
    with-profile-update
    :flow-id="MIND_MAP_FLOW_ID"
    @update-in-profile="() => {
      updateSelfKnowledgeElement({
        selfKnowledgeElementId: id,
        element: {
          title: data.title,
          description: data.description,
          rating: data.rating > 0 ? data.rating : undefined,
        },
      })
    }"
  >
    <Rating
      v-if="data.rating"
      :rating="data.rating"
      :with-background="false"
    />
  </TitleDescriptionNodeTemplate>
</template>
