<script setup lang="ts">
import { AvCard, palette, RI_ICONS } from '@/ui'
import { VIcon } from '@gouvminint/vue-dsfr'
</script>

<template>
  <div class="fr-container fr-mt-3w fr-mt-md-5w fr-mb-5w">
    <AvCard>
      <div class="student-events-card__title">
        <VIcon
          :name="RI_ICONS.FILE_USER"
          :color="palette.foreground.icon"
          :scale="1.5"
        />
        <h5 :style="{ color: palette.foreground.text1 }">
          Mes CV
        </h5>
      </div>

      <p>CV</p>
    </AvCard>
  </div>
</template>

<style lang="scss" scoped>
.student-events-card {
  &__title {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: flex-start;
  }
}
</style>
