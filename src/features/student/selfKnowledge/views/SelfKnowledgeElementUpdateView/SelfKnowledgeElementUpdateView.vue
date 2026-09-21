<script lang="ts" setup>
import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { useGetSelfKnowledgeElementDetails } from '@/api/avenir-esr'
import UpdateInProgressBadge from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { useSelfKnowledgeCategory } from '@/features/student/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import SelfKnowledgeElementUpdateForm from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/SelfKnowledgeElementUpdateForm.vue'
import { toSentenceCase } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementUpdateViewProps {
  categoryId: string
  elementId: string
}

const props = defineProps<SelfKnowledgeElementUpdateViewProps>()

const { data: element } = useGetSelfKnowledgeElementDetails(toRef(props, 'elementId'))

const { t } = useI18n()
const { navigateToStudentSelfKnowledgeCategory } = useNavigation()

const categoryId = computed(() => props.categoryId as ESelfKnowledgeCategory)

const { categoryTypeLabel } = useSelfKnowledgeCategory(categoryId)

const trailingLinks = computed(() => [
  { text: toSentenceCase(categoryTypeLabel.value) },
  {
    text: element.value?.title ?? '',
    to: {
      name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
      params: { id: props.categoryId },
      query: { elementId: props.elementId }
    }
  },
  { text: t('global.buttons.update') }
])

function backToElementDetails () {
  navigateToStudentSelfKnowledgeCategory({
    categoryId: props.categoryId,
    elementId: props.elementId
  })
}
</script>

<template>
  <UpdatePageTitle
    :title="`${toSentenceCase(categoryTypeLabel)} - ${element?.title}`"
    :trailing-links="trailingLinks"
  >
    <template #actions>
      <UpdateInProgressBadge
        v-if="element"
        :show="true"
      />
    </template>
  </UpdatePageTitle>

  <div class="self-knowledge-element-update-view av-row av-gap-sm">
    <div
      v-if="element"
      class="av-col av-flex-fill av-gap-md"
      :element-title="element.title"
    >
      <SelfKnowledgeElementUpdateForm
        :element="element"
        :on-cancel="() => backToElementDetails()"
      />
    </div>
  </div>
</template>
