<script lang="ts" setup>
import type { UsersOverviewCardUserType } from '@/features/staff/admin/types/users.types'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { ROUTES } from '@/common/constants'
import { toFullName } from '@/common/utils/user/user'

export interface UserNameProps {
  user: UsersOverviewCardUserType
  withNav?: boolean
}

const { user, withNav = false } = defineProps<UserNameProps>()

const { isStaffAdminGroupsRoute } = useIdentifyRoute()
const route = useRoute()

const groupId = computed(() => route.params.id as string)

const fullName = computed(() => toFullName(user.lastName, user.firstName))

const to = computed(() => isStaffAdminGroupsRoute.value
  ? {
      name: ROUTES.STAFF.ADMIN.GROUP.USER.name,
      params: { userId: user.id, groupId: groupId.value },
    }
  : {
      name: ROUTES.STAFF.ADMIN.USER.name,
      params: { id: user.id },
    })

const routerProps = computed(() => withNav ? { to: to.value } : {})
</script>

<template>
  <div
    class="user-name av-col"
    data-testid="user-name"
    :data-user-id="user.id"
  >
    <component
      :is="withNav ? 'RouterLink' : 'div'"
      v-bind="routerProps"
      class="name av-col"
      :class="{ 'name--hoverable': withNav }"
      data-testid="user-name-content"
      :data-user-id="user.id"
    >
      <span
        class="b2-bold"
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
    </component>
  </div>
</template>

<style lang="scss" scoped>
.user-name {
  .name--hoverable:hover > * {
    color: var(--light-foreground-primary2);
    text-decoration: underline;
  }
}
</style>
