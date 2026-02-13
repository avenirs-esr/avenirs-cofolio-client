<script setup lang="ts">
import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import type { Slot } from 'vue'
import { AvCard } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface ProfileCardProps {
  studentSummary: ProfileOverviewDTO
}

const { studentSummary } = defineProps<ProfileCardProps>()

defineSlots<{
  footer?: Slot
}>()

const { t } = useI18n()

const fullName = computed(() => {
  const { firstname, lastname } = studentSummary
  return `${capitalize(firstname)} ${capitalize(lastname)}`
})
</script>

<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
    data-testid="profile-card"
  >
    <template #title>
      <div class="profile-card__title">
        <img
          :src="studentSummary.coverPicture.url"
          :alt="t('student.user.cards.ProfileCard.bannerAlt')"
          class="profile-card__banner av-w-full av-radius-md"
          data-testid="profile-banner"
        >
        <div
          class="profile-card__icon av-row av-justify-center av-align-center av-radius-md"
        >
          <img
            :src="studentSummary.profilePicture.url"
            :alt="t('student.user.cards.ProfileCard.pictureAlt')"
            class="profile-card__picture av-w-full av-h-full"
            data-testid="profile-picture"
          >
        </div>
      </div>
    </template>
    <template #body>
      <div class="av-col av-gap-xs">
        <span class="n4">{{ fullName }}</span>
        <span class="b2-light profile-card__bio">{{ studentSummary.bio }}</span>
      </div>
    </template>
    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.profile-card__title {
  position: relative;
  min-height: var(--dimension-4xl);
}

.profile-card__icon {
  position: absolute;
  width: var(--dimension-5xl);
  height: var(--dimension-5xl);
  border: 4px solid var(--dark-foreground);
  right: var(--spacing-sm);
  top: var(--spacing-sm);
}

.profile-card__banner {
  height: auto;
  max-height: 4.2rem;
}

.profile-card__picture {
  object-fit: cover;
}

.profile-card__bio {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 5;
  -webkit-line-clamp: 5;
}

:deep(.av-card__title) {
  display: block;
}
</style>
