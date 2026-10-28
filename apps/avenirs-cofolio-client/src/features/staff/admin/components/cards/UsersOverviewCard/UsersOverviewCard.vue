<script lang="ts" setup>
import type { GroupOverviewDTO } from '@/api/avenir-esr'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { ROUTES } from '@/common/constants'

export interface UsersOverviewCardProps {
  user: UserInfoType
  formations?: GroupOverviewDTO[]
  groups?: GroupOverviewDTO[]
}

const { user, formations = [], groups = [] } = defineProps<UsersOverviewCardProps>()

const { t } = useI18n()
const { isStaffAdminGroupsRoute } = useIdentifyRoute()
const route = useRoute()

const fullNamesRef = ref<HTMLElement | null>(null)
const formationsRef = ref<HTMLElement | null>(null)
const groupsRef = ref<HTMLElement | null>(null)
const email = computed(() => user.email)

const { isTruncated: isFullNamesTruncated } = useTextTruncation(fullNamesRef)
const { isTruncated: isFormationsTruncated } = useTextTruncation(formationsRef)
const { isTruncated: isGroupsTruncated } = useTextTruncation(groupsRef)

const fullNames = computed(() => `${user.firstName} ${user.lastName}`)
const formationsNames = computed(() => formations.map(formation => formation.name).join(', '))
const groupsNames = computed(() => groups.map(group => group.name).join(', '))

const to = computed(() => {
  const groupId = route.params.id as string

  return isStaffAdminGroupsRoute.value
    ? {
        name: ROUTES.STAFF.ADMIN.GROUP.USER.name,
        params: { userId: user.id, groupId },
      }
    : {
        name: ROUTES.STAFF.ADMIN.USER.name,
        params: { id: user.id },
      }
})
</script>

<template>
  <RouterLink :to="to">
    <Card
      background-color="var(--card)"
      title-background="var(--card)"
      class="users-overview-card"
      radius="var(--radius-lg)"
      data-testid="users-overview-card"
      :data-user-id="user.id"
    >
      <div class="av-col av-gap-sm">
        <AvTooltip
          v-if="user.firstName.length || user.lastName.length || email.length"
          :content="fullNames"
          :disabled="!isFullNamesTruncated"
        >
          <div class="user-identity">
            <span
              ref="fullNamesRef"
              class="b2-regular av-max-lines"
              data-testid="full-names"
            >
              {{ fullNames }}
            </span>
            <span
              ref="email"
              class="caption-light av-max-lines"
              data-testid="email"
            >
              {{ email }}
            </span>
          </div>
        </AvTooltip>

        <AvTooltip
          v-if="formations.length"
          :content="formationsNames"
          :disabled="!isFormationsTruncated"
        >
          <span
            ref="formationsRef"
            class="b2-regular av-max-lines"
            data-testid="formations"
          >
            {{ t('global.colon', { before: t('staff.admin.usersTable.columns.formations') }) }}
            {{ formationsNames }}
          </span>
        </AvTooltip>

        <AvTooltip
          v-if="groups.length"
          :content="groupsNames"
          :disabled="!isGroupsTruncated"
        >
          <span
            ref="groupsRef"
            class="b2-regular av-max-lines"
            data-testid="groups"
          >
            {{ t('global.colon', { before: t('staff.admin.usersTable.columns.groups') }) }}
            {{ groupsNames }}
          </span>
        </AvTooltip>
      </div>
    </Card>
  </RouterLink>
</template>

<style lang="scss" scoped>
:deep(.av-card:hover) {
  border: 1px solid var(--dark-background-primary1) !important;
  box-shadow: 0 0 0 2px var(--dark-background-primary1);
}

.users-overview-card {
  --max-lines: 2;
}

.user-identity {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
