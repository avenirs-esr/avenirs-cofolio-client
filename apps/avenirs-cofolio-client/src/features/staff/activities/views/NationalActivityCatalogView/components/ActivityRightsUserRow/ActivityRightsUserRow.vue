<script lang="ts" setup>
import type { AvSelectModelValue, AvSelectOption } from '@avenirs-esr/avenirs-dsav'
import type { EActivityRight } from '@/api/avenir-esr'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvCard, AvIcon, AvSelect, AvTooltip, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EAuthorization } from '@/api/avenir-esr'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'
import { useAuthorizationTypeConfig } from '@/features/staff/admin/views/InstitutionUserDetailedView/composables/use-authorization-type-config/use-authorization-type-config'
import DeleteOverlay from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.vue'

export interface ActivityRightsUserRowProps {
  user: UserInfoType
}

defineProps<ActivityRightsUserRowProps>()

const emit = defineEmits<{
  delete: []
}>()

const rights = defineModel<EActivityRight[]>({ default: () => [] })

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const { getAuthorizationTypeConfig } = useAuthorizationTypeConfig()

const authorizationOptions = computed<AvSelectOption[]>(() =>
  Object.values(EAuthorization).map((authorization) => {
    const { label, icon } = getAuthorizationTypeConfig(authorization)

    return { value: authorization, label: label.value, icon: icon.value }
  }),
)

const selectedOptions = computed(() =>
  authorizationOptions.value.filter(({ value }) => rights.value.includes(value as EActivityRight)),
)

function updateRights (selected: AvSelectModelValue) {
  rights.value = Array.isArray(selected) ? selected.map(({ value }) => value as EActivityRight) : []
}
</script>

<template>
  <DeleteOverlay @delete="emit('delete')">
    <AvCard class="activity-rights-user-row">
      <div
        class="av-gap-md av-py-sm av-pl-md av-pr-4xl"
        :class="isMobile ? 'av-col' : 'activity-rights-user-row--desktop av-row av-align-center'"
      >
        <UserInfo
          :user="user"
          class="av-flex-fill"
        />

        <div class="av-flex-fill">
          <AvSelect
            :model-value="selectedOptions"
            :options="authorizationOptions"
            :label="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.authorizations.label')"
            :placeholder="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.authorizations.placeholder')"
            :selected-text="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.authorizations.selected', { count: rights.length })"
            dense
            multiple
            teleport
            width="100%"
            height="2.5rem"
            collapse-max-height="16rem"
            @update:model-value="updateRights"
          />
        </div>

        <ul class="av-flex-fill av-row av-align-center av-gap-sm av-list-reset">
          <li
            v-for="option in selectedOptions"
            :key="option.value"
          >
            <AvTooltip
              :content="option.label"
              force-focusable
            >
              <AvIcon
                :name="option.icon!"
                :size="1.5"
                color="var(--dark-background-primary1)"
              />
            </AvTooltip>
          </li>
        </ul>
      </div>
    </AvCard>
  </DeleteOverlay>
</template>
