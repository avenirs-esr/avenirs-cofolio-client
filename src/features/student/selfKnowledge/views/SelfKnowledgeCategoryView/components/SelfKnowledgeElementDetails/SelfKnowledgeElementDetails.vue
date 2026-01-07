<script setup lang="ts">
import type { SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import Rating from '@/common/components/Rating/Rating.vue'
import CategoryElementDescriptionTextarea from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementDescriptionTextarea/CategoryElementDescriptionTextarea.vue'
import CategoryElementTitleInput from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementTitleInput/CategoryElementTitleInput.vue'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementDetailsProps {
  element: SelfKnowledgeElementDetailsDTO
}

const { element } = defineProps<SelfKnowledgeElementDetailsProps>()
const { t } = useI18n()

const createdAtPrefix = computed(() => capitalize(t('student.selfKnowledge.element')))
</script>

<template>
  <div class="self-knowledge-element-details av-col av-row--md av-gap-lg">
    <div class="self-knowledge-element-details__left-column av-col av-gap-md">
      <CategoryElementTitleInput
        :model-value="element.title"
        disabled
        :required="false"
      />
      <div class="av-col av-gap-sm">
        <span class="b2-light">{{ t('student.selfKnowledge.views.SelfKnowledgeCategoryView.selfKnowledgeElementDetails.ratingLabel') }}</span>
        <Rating
          :rating="element.rating ?? 0"
          :stars-first="false"
        />
      </div>
    </div>
    <div class="self-knowledge-element-details__right-column av-col av-gap-md">
      <CategoryElementDescriptionTextarea
        :model-value="element.description"
        disabled
      />
      <div class="self-knowledge-element-details__dates av-col av-gap-xs">
        <CreationUpdateDateDetails
          :updated-at="element.updatedAt"
          :created-at="element.createdAt"
          :created-at-prefix="createdAtPrefix"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.self-knowledge-element-details {
  &__left-column,
  &__right-column {
    flex: 1;

    :deep(.av-input__wrapper textarea){
      min-height: 14rem;
    }
  }
}
</style>
