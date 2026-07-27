<script setup lang="ts">
import type { MindMapNodeTemplateProps } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import { EErrorCode, invalidateGetSelfKnowledgeElementDetails, invalidateGetSelfKnowledgeElements, useCreateSelfKnowledgeElement, useUpdateSelfKnowledgeElement } from '@/api/avenir-esr'
import { Rating } from '@/common/components'
import TitleDescriptionNodeTemplate from '@/common/components/VueFlow/TitleDescriptionNodeTemplate/TitleDescriptionNodeTemplate.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useNodes } from '@/common/composables/VueFlow/use-nodes/use-nodes'
import { MIND_MAP_FLOW_ID } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

const { id, data } = defineProps<MindMapNodeTemplateProps>()

const { updateNodeId } = useNodes(MIND_MAP_FLOW_ID)

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const queryClient = useQueryClient()

const { mutate: mutateCreateSelfKnowledgeElement } = useCreateSelfKnowledgeElement()

function addSelfKnowledgeCategoryElement () {
  mutateCreateSelfKnowledgeElement({
    selfKnowledgeCategoryId: data.categoryId as string,
    data: {
      title: data.title,
      description: data.description,
      rating: data.rating > 0 ? data.rating : undefined,
      valorized: data.valorized ?? false,
    },
  }, {
    onSuccess: async (newElement) => {
      await invalidateGetSelfKnowledgeElements(queryClient, data.categoryId as string)
      addSuccessMessage(t('student.buildProject.mindMap.selfKnowledge.element.success'))
      updateNodeId(id, newElement.id)
    },
    onError: error => addErrorMessage({
      title: t('student.buildProject.mindMap.selfKnowledge.element.error'),
      description: getErrorMessage(error),
    })
  })
}

const { mutate: mutateUpdateSelfKnowledgeElement } = useUpdateSelfKnowledgeElement()

function updateSelfKnowledgeElement () {
  mutateUpdateSelfKnowledgeElement({
    selfKnowledgeElementId: id,
    data: {
      title: data.title,
      description: data.description,
      rating: data.rating > 0 ? data.rating : undefined,
      valorized: data.valorized ?? false
    }
  }, {
    onSuccess: async () => {
      await invalidateGetSelfKnowledgeElementDetails(queryClient, id)
      addSuccessMessage(t('student.buildProject.mindMap.selfKnowledge.element.success'))
    },
    onError: (error) => {
      if (isEErrorCode(error.code) && error.code === EErrorCode.SELF_KNOWLEDGE_ELEMENT_NOT_FOUND) {
        addSelfKnowledgeCategoryElement()
      }
      else {
        addErrorMessage({
          title: t('student.buildProject.mindMap.selfKnowledge.element.error'),
          description: getErrorMessage(error),
        })
      }
    }
  })
}

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
      updateSelfKnowledgeElement()
    }"
  >
    <Rating
      v-if="data.rating"
      :rating="data.rating"
      :with-background="false"
    />
  </TitleDescriptionNodeTemplate>
</template>
