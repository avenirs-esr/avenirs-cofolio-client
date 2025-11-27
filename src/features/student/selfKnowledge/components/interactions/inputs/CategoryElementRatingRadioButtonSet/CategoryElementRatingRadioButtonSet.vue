<script setup lang="ts">
import { Rating } from '@/common/components'
import { AvRadioButton, AvRadioButtonSet } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface CategoryElementRatingInputProps {
  legend?: string
  errorMessage?: string
  name?: string
}

const {
  name = 'elementRating',
  legend,
  errorMessage
} = defineProps<CategoryElementRatingInputProps>()

const modelValue = defineModel<number | undefined>()

const { t } = useI18n()

const ratingLevels = [
  { value: 5, description: 'student.selfKnowledge.categoryElementRatingInput.levels.essential' },
  { value: 4, description: 'student.selfKnowledge.categoryElementRatingInput.levels.veryImportant' },
  { value: 3, description: 'student.selfKnowledge.categoryElementRatingInput.levels.important' },
  { value: 2, description: 'student.selfKnowledge.categoryElementRatingInput.levels.lessImportant' },
  { value: 1, description: 'student.selfKnowledge.categoryElementRatingInput.levels.notImportant' },
  { value: 0, description: 'student.selfKnowledge.categoryElementRatingInput.levels.notEvaluated' }
]

function handleUpdateModelValue (value: string | number | boolean) {
  if (typeof value === 'number') {
    modelValue.value = value
  }
}
</script>

<template>
  <div class="av-flex-col-sm self-knowledge-category-element-rating-input">
    <AvRadioButtonSet
      :model-value="modelValue"
      :legend="legend ?? t('student.selfKnowledge.categoryElementRatingInput.legend')"
      :error-message="errorMessage"
      :name="name"
      @update:model-value="handleUpdateModelValue"
    >
      <template
        v-for="level in ratingLevels"
        :key="level.value"
      >
        <AvRadioButton :value="level.value">
          <div class="av-flex-col-xs">
            <div
              v-if="level.value > 0"
              class="av-row--left"
            >
              <Rating
                :rating="level.value"
                :max-rating="5"
              />
            </div>
            <span class="b2-regular rating-option__description">
              {{ t(level.description) }}
            </span>
          </div>
        </AvRadioButton>
      </template>
    </AvRadioButtonSet>
  </div>
</template>

<style scoped lang="scss">
.self-knowledge-category-element-rating-input {
  :deep(.av-radio-group) {
    align-items: flex-start;
  }

  .rating-option {
    &__description {
      color: var(--text2);
    }
  }
}
</style>
