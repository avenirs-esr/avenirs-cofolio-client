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
    class="rating av-row av-gap-xxs av-align-baseline"
    :class="{ 'rating--with-background av-py-xxxs av-px-xxs av-radius-sm': withBackground }"
  >
    <template v-if="starsFirst">
      <span
        v-for="star in stars"
        :key="`${realId}-star-${star}`"
      >⭐</span>
    </template>

    <span
      class="b2-bold av-text-text1 av-ml-xxs"
      data-testid="rating__value"
    >{{ rating }}/{{ maxRating }}</span>

    <template v-if="!starsFirst">
      <span
        v-for="star in stars"
        :key="`${realId}-star-${star}`"
      >⭐</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.rating {
  &--with-background {
    background-color: var(--light-background-neutral);
  }
}
</style>
