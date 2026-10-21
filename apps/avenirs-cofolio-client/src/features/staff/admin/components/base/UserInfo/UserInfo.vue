<script lang="ts" setup>
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGetResourceByFileId } from '@/api/avenir-esr'
import { PROFILE_PICTURE_RATIO } from '@/common/components/interaction/files/ImageUpload/config'
import { toFullName } from '@/common/utils/user/user'

export interface UserInfoProps {
  user: UserInfoType
}

const { user } = defineProps<UserInfoProps>()

const { t } = useI18n()

const fullName = computed(() => toFullName(user.firstName, user.lastName))
const { data: profilePictureResource } = useGetResourceByFileId(user.profilePictureId ?? '', {
  query: { enabled: !!user.profilePictureId }
})
const avatarUrl = ref<string | null>(null)

const profilePictureRatio = `${PROFILE_PICTURE_RATIO}`

const AVATAR_SIZE = 2
const avatarSizeRem = `${AVATAR_SIZE}rem`

const hasImageError = ref(false)

watch(profilePictureResource, (newValue) => {
  if (avatarUrl.value) {
    URL.revokeObjectURL(avatarUrl.value)
  }

  if (newValue) {
    avatarUrl.value = URL.createObjectURL(newValue)
  }
  else {
    avatarUrl.value = null
  }
})

onBeforeUnmount(() => {
  if (avatarUrl.value) {
    URL.revokeObjectURL(avatarUrl.value)
  }
})
</script>

<template>
  <div
    class="av-row av-gap-sm av-align-center"
    data-testid="user-info"
  >
    <div
      v-if="avatarUrl && !hasImageError"
      class="picture-container"
    >
      <img
        :src="avatarUrl"
        :alt="t('staff.admin.components.base.UserInfo.imgAlt')"
        class="picture av-w-full av-h-full"
        data-testid="profile-picture"
        @error="hasImageError = true"
      >
    </div>
    <AvIcon
      v-else
      :name="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
      color="var(--icon)"
      :size="AVATAR_SIZE"
      data-testid="default-account-icon"
    />

    <div class="av-col">
      <span
        class="b2-bold"
        data-testid="name"
      >
        {{ fullName }}
      </span>
      <span
        class="b2-regular"
        data-testid="email"
      >
        {{ user.email }}
      </span>
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
