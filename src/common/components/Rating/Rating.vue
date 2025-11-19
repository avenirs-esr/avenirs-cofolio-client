<script lang="ts" setup>
export interface RatingProps {
  id?: string
  rating: number
  maxRating?: number
  withBackground?: boolean
}

const {
  id,
  rating,
  maxRating = 5,
  withBackground = true,
} = defineProps<RatingProps>()

const realId = computed(() => id ?? `rating-${crypto.randomUUID()}`)

const stars = computed(() => {
  return Array.from({ length: rating })
})
</script>

<template>
  <div
    class="rating"
    :class="{ 'rating--with-background': withBackground }"
  >
    <span
      v-for="star in stars"
      :key="`${realId}-star-${star}`"
    >⭐</span>
    <span class="rating__value b2-bold">{{ rating }}/{{ maxRating }}</span>
  </div>
</template>

<style lang="scss" scoped>
.rating {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xxs);

  &--with-background {
    background-color: var(--light-background-neutral);
    padding: var(--spacing-xxxs) var(--spacing-xxs);
    border-radius: var(--radius-sm);
  }

  &__value {
    margin-left: var(--spacing-xxs);
    color: var(--text1);
  }
}
</style>
