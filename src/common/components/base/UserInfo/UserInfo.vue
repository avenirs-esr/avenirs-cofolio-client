<script lang="ts" setup>
import { PROFILE_PICTURE_RATIO } from '@/common/components/interaction/files/ImageUpload/config'
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { capitalize } from 'lodash-es'
import { useI18n } from 'vue-i18n'

export interface UserInfoProps {
  firstName: string
  lastName: string
  email?: string
  profilePictureUrl?: string
}

const { firstName, lastName } = defineProps<UserInfoProps>()

const { t } = useI18n()

const fullName = computed(() => `${capitalize(firstName)} ${capitalize(lastName)}`)

const profilePictureRatio = `${PROFILE_PICTURE_RATIO}`

const AVATAR_SIZE = 2
const avatarSizeRem = `${AVATAR_SIZE}rem`
</script>

<template>
  <div
    class="av-row av-gap-sm av-align-center"
    data-testid="user-info"
  >
    <div
      v-if="profilePictureUrl"
      class="picture-container"
    >
      <img
        :src="profilePictureUrl"
        :alt="t('global.cards.ProfileCard.pictureAlt')"
        class="picture av-w-full av-h-full"
        data-testid="profile-picture"
      >
    </div>
    <AvIcon
      v-else
      :name="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
      color="var(--icon)"
      :size="AVATAR_SIZE"
      data-testid="default-account-icon"
    />

    <div class="av-col b2-regular">
      <span data-testid="name">{{ fullName }}</span>
      <span
        v-if="email"
        data-testid="email"
      >{{ email }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.picture-container {
  width: v-bind('avatarSizeRem');
  height: v-bind('avatarSizeRem');
}

.picture {
  aspect-ratio: v-bind('profilePictureRatio');
  object-fit: cover;
}
</style>
