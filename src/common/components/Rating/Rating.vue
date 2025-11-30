<script lang="ts" setup>
export interface RatingProps {
  id?: string
  maxRating?: number
  rating: number
  starsFirst?: boolean
  withBackground?: boolean
}

const {
  id,
  maxRating = 5,
  rating,
  starsFirst = true,
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
    <template v-if="starsFirst">
      <span
        v-for="star in stars"
        :key="`${realId}-star-${star}`"
      >⭐</span>
    </template>

    <span class="rating__value b2-bold">{{ rating }}/{{ maxRating }}</span>

    <template v-if="!starsFirst">
      <span class="rating__value b2-bold">{{ rating }}/{{ maxRating }}</span>
      <span
        v-for="star in stars"
        :key="`${realId}-star-${star}`"
      >⭐</span>
    </template>
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
