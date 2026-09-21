<script setup lang="ts">
import type { Slot } from 'vue'
import Card from '@/common/components/cards/Card/Card.vue'
import { PROFILE_BANNER_RATIO, PROFILE_PICTURE_RATIO } from '@/common/components/ImageUpload/config'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface ProfileCardProps {
  firstName: string
  lastName: string
  profilePictureUrl: string
  coverPictureUrl: string
  bio?: string
}

const {
  firstName,
  lastName,
  profilePictureUrl,
  coverPictureUrl,
  bio
} = defineProps<ProfileCardProps>()

defineSlots<{
  default?: Slot
}>()

const { t } = useI18n()

const fullName = computed(() => `${capitalize(firstName)} ${capitalize(lastName)}`)
const profileBannerRatio = `${PROFILE_BANNER_RATIO}`
const profilePictureRatio = `${PROFILE_PICTURE_RATIO}`
</script>

<template>
  <Card
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
    data-testid="profile-card"
  >
    <template #title>
      <div class="profile-card__title">
        <img
          :src="coverPictureUrl"
          :alt="t('global.cards.ProfileCard.bannerAlt')"
          class="profile-card__banner av-w-full av-radius-md"
          data-testid="profile-banner"
        >
        <div
          class="profile-card__icon av-row av-justify-center av-align-center av-radius-md av-border-width-lg av-border-style-solid"
        >
          <img
            :src="profilePictureUrl"
            :alt="t('global.cards.ProfileCard.pictureAlt')"
            class="profile-card__picture av-w-full av-h-full"
            data-testid="profile-picture"
          >
        </div>
      </div>
    </template>
    <template #body>
      <div class="av-col av-gap-xs">
        <span
          class="n4"
          data-testid="profile-full-name"
        >{{ fullName }}</span>
        <span
          class="b2-light profile-card__bio"
          data-testid="profile-bio"
        >{{ bio }}</span>
      </div>
    </template>
    <template
      v-if="$slots.default"
      #footer
    >
      <slot />
    </template>
  </Card>
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
  border-color: var(--dark-foreground);
  right: var(--spacing-sm);
  top: var(--spacing-sm);
}

.profile-card__banner {
  width: 100%;
  height: auto;
  aspect-ratio: v-bind('profileBannerRatio');
  object-fit: cover;
}

.profile-card__picture {
  aspect-ratio: v-bind('profilePictureRatio');
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
