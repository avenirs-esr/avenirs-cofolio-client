<script setup lang="ts">
import type { SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import Rating from '@/common/components/Rating/Rating.vue'
import CategoryElementDescriptionTextarea from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementDescriptionTextarea/CategoryElementDescriptionTextarea.vue'
import CategoryElementTitleInput from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementTitleInput/CategoryElementTitleInput.vue'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementDetailsProps {
  element: SelfKnowledgeElementDetailsDTO
}

const { element } = defineProps<SelfKnowledgeElementDetailsProps>()
const { t } = useI18n()
</script>

<template>
  <div class="self-knowledge-element-details av-col av-gap-md">
    <ValorizedBadge :valorized="element.valorized ?? false" />
    <div class="av-col av-row--md av-gap-lg">
      <div
        class="self-knowledge-element-details__left-column av-col av-flex-fill av-gap-md"
      >
        <CategoryElementTitleInput
          :model-value="element.title"
          disabled
          :required="false"
        />
        <div class="av-col av-gap-sm">
          <span class="b2-light">{{ t('student.selfKnowledge.views.SelfKnowledgeCategoryView.selfKnowledgeElementDetails.ratingLabel') }}</span>
          <Rating
            v-if="element.rating && element.rating > 0"
            :rating="element.rating"
            :stars-first="false"
          />
          <span
            v-else
            class="b2-light"
          >
            {{ t('student.selfKnowledge.views.SelfKnowledgeCategoryView.selfKnowledgeElementDetails.notRated') }}
          </span>
        </div>
      </div>
      <div class="self-knowledge-element-details__right-column av-col av-flex-fill av-gap-md">
        <CategoryElementDescriptionTextarea
          :model-value="element.description"
          disabled
        />
        <div class="self-knowledge-element-details__dates av-row av-justify-end">
          <CreationUpdateDateDetails
            :updated-at="element.updatedAt"
            :created-at="element.createdAt"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.self-knowledge-element-details {
  &__left-column,
  &__right-column {
    :deep(.av-input__wrapper textarea){
      min-height: 14rem;
    }
  }
}
</style>
