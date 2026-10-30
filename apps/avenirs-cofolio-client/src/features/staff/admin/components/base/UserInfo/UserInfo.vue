<script lang="ts" setup>
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { PROFILE_PICTURE_RATIO } from '@/common/components/interaction/files/ImageUpload/config'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { useStorageImage } from '@/common/composables/use-storage-image/use-storage-image'
import { ROUTES } from '@/common/constants'
import { toFullName } from '@/common/utils/user/user'

export interface UserInfoProps {
  user: UserInfoType
  withNav?: boolean
}

const { user, withNav = false } = defineProps<UserInfoProps>()

const { t } = useI18n()
const route = useRoute()
const { isStaffAdminGroupsRoute } = useIdentifyRoute()

const fullName = computed(() => toFullName(user.firstName, user.lastName))
const { url: avatarUrl } = useStorageImage(() => user.profilePictureId)

const profilePictureRatio = `${PROFILE_PICTURE_RATIO}`

const AVATAR_SIZE = 2
const avatarSizeRem = `${AVATAR_SIZE}rem`

const hasImageError = ref(false)

const to = computed(() => {
  const groupId = route.params.id as string

  return isStaffAdminGroupsRoute.value
    ? {
        name: ROUTES.STAFF.ADMIN.GROUP.USER.name,
        params: { userId: user.id, groupId }
      }
    : {
        name: ROUTES.STAFF.ADMIN.USER.name,
        params: { id: user.id }
      }
})

const routerProps = computed(() => withNav ? { to: to.value } : {})
</script>

<template>
  <component
    :is="withNav ? 'RouterLink' : 'div'"
    v-bind="routerProps"
    class="user-info av-row av-gap-sm av-align-center"
    :class="{ 'user-info--hoverable': withNav }"
    data-testid="user-info"
    :data-user-id="user.id"
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
        class="name b2-bold"
        data-testid="name"
      >
        {{ fullName }}
      </span>
      <span
        v-if="user.email"
        class="b2-regular"
        data-testid="email"
      >
        {{ user.email }}
      </span>
    </div>
  </component>
</template>

<style lang="scss" scoped>
.user-info {
  &--hoverable:hover {
    .name {
      color: var(--light-foreground-primary2);
      text-decoration: underline;
    }
  }
}

.picture-container {
  width: v-bind('avatarSizeRem');
  height: v-bind('avatarSizeRem');
}

.picture {
  aspect-ratio: v-bind('profilePictureRatio');
  object-fit: cover;
}
</style>
