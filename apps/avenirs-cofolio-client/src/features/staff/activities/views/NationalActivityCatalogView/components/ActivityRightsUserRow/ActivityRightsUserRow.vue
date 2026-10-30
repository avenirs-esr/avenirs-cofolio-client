<script lang="ts" setup>
import type { AvSelectModelValue, AvSelectOption } from '@avenirs-esr/avenirs-dsav'
import type { EActivityRight } from '@/api/avenir-esr'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvIcon, AvSelect, AvTooltip, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useEventListener } from '@vueuse/core'
import { nextTick } from 'vue'
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

const authorizations = ref<HTMLElement | null>(null)

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

function positionCollapse () {
  nextTick(() => {
    const select = authorizations.value?.querySelector<HTMLElement>('.av-select')
    const collapse = authorizations.value?.querySelector<HTMLElement>('.av-select__collapse')

    if (!select || !collapse) {
      return
    }

    const { bottom, left, width } = select.getBoundingClientRect()

    collapse.style.top = `${bottom}px`
    collapse.style.left = `${left}px`
    collapse.style.width = `${width}px`
  })
}

useEventListener(window, 'click', positionCollapse)
useEventListener(window, 'scroll', positionCollapse, { capture: true, passive: true })
</script>

<template>
  <DeleteOverlay @delete="emit('delete')">
    <div
      class="av-gap-md av-py-sm av-pl-md av-pr-4xl av-border-width-sm av-border-style-solid av-border-stroke av-radius-md av-background-base"
      :class="isMobile ? 'av-col' : 'activity-rights-user-row--desktop av-row av-align-center'"
    >
      <UserInfo
        :user="user"
        class="activity-rights-user-row__user"
      />

      <div
        ref="authorizations"
        class="activity-rights-user-row__authorizations"
      >
        <AvSelect
          :model-value="selectedOptions"
          :options="authorizationOptions"
          :label="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.authorizations.label')"
          :placeholder="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.authorizations.placeholder')"
          :selected-text="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.authorizations.selected', { count: rights.length })"
          dense
          multiple
          width="100%"
          height="2.5rem"
          collapse-max-height="16rem"
          @update:model-value="updateRights"
        />
      </div>

      <ul class="activity-rights-user-row__icons av-row av-align-center av-gap-sm av-list-reset av-p-0">
        <li
          v-for="option in selectedOptions"
          :key="option.value"
        >
          <AvTooltip
            :content="option.label"
            force-focusable
          >
            <AvIcon
              :name="option.icon ?? ''"
              :size="1.5"
              color="var(--dark-background-primary1)"
            />
          </AvTooltip>
        </li>
      </ul>
    </div>
  </DeleteOverlay>
</template>

<style lang="scss" scoped>
.activity-rights-user-row--desktop {
  height: 4rem;

  .activity-rights-user-row__user {
    flex: 0 1 20rem;
    min-width: 0;
  }

  .activity-rights-user-row__authorizations {
    flex: 0 0 22rem;
  }

  .activity-rights-user-row__icons {
    flex: 1 1 11rem;
    min-width: 11rem;
  }
}

.activity-rights-user-row__authorizations :deep(.av-select__collapse) {
  position: fixed;
  z-index: 1000;
  max-width: calc(100vw - 2rem);
}
</style>
