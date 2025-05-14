<script setup lang="ts">
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { AvButton, AvCard, MDI_ICONS } from '@/ui'

const mockedName = 'Jeanne Moulin'
const mockedBio = 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable,'
  + ' je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
</script>

<template>
  <AvCard
    background-color="--white"
    title-background="--white"
  >
    <template #title>
      <div class="student-overview-widget__title">
        <img
          :src="profile_banner_placeholder"
          alt="Description de l'image"
          class="student-overview-widget__banner"
        >
        <div
          class="student-overview-widget__icon"
        >
          <img
            :src="profile_picture_placeholder"
            alt="Description de l'image"
            class="student-overview-widget__picture"
          >
        </div>
      </div>
    </template>
    <template #body>
      <div class="student-overview-widget__body">
        <span class="n4">{{ mockedName }}</span>
        <span class="b2-light">{{ mockedBio }}</span>
      </div>
    </template>
    <template #footer>
      <div class="student-overview-widget__footer">
        <ul class="student-overview-widget__actions">
          <li>
            <AvButton
              label="Modifier mon profil"
              :icon="MDI_ICONS.PENCIL"
              :icon-right="true"
              :full-width="true"
              variant="tertiary"
            />
          </li>
          <li>
            <AvButton
              label="Partager mon CV"
              :icon="MDI_ICONS.FILE_ACCOUNT"
              :icon-right="true"
              :full-width="true"
              variant="tertiary"
            />
          </li>
          <li>
            <AvButton
              label="Partager mon Cofolio"
              :icon="MDI_ICONS.SHARE_VARIANT"
              :icon-right="true"
              :full-width="true"
              variant="tertiary"
            />
          </li>
          <li>
            <AvButton
              label="Mon/mes établissement(s)"
              :icon="MDI_ICONS.SWAP_HORIZONTAL"
              :icon-right="true"
              :full-width="true"
              variant="tertiary"
            />
          </li>
        </ul>
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.student-overview-widget__title {
  position: relative;
  min-height: 4rem;
}

.student-overview-widget__icon {
  position: absolute;
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
  border: 4px solid var(--dark-foreground);
  right: 1rem;
  top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.student-overview-widget__banner {
  width: 100%;
  height: auto;
}

.student-overview-widget__picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-overview-widget__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.student-overview-widget__footer {
  padding-top: 1rem;
}

.student-overview-widget__actions {
  list-style-type:none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: 1rem;
}

li {
  padding: 0;
  margin: 0;
}
</style>
