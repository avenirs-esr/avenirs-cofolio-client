<script lang="ts" setup>
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { EActivityRight, EActivityStatus, ExternalUserAffiliationOverviewDTO } from '@/api/avenir-esr'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvButton, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData, useQueryClient } from '@tanstack/vue-query'
import { refDebounced, whenever } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { invalidateGetActivityAuthorizations, useDefineActivityAuthorizations, useGetActivityAuthorizations, useGetAffiliations } from '@/api/avenir-esr'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import Autocomplete from '@/common/components/interaction/selects/Autocomplete/Autocomplete.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { toFullName } from '@/common/utils/user/user'
import ActivityRightsUserRow from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityRightsUserRow/ActivityRightsUserRow.vue'
import { useToasterStore } from '@/store'

export interface ActivityRightsSectionProps {
  activityId: string
  status: EActivityStatus
}

const { activityId, status } = defineProps<ActivityRightsSectionProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const queryClient = useQueryClient()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { getErrorMessage } = useApiErrors()

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const selectedUsers = ref<AvAutocompleteOption[]>([])

const params = computed(() => ({
  keyword: debouncedSearch.value || undefined,
  cofolioStaff: true,
}))

const { data, error, isFetching } = useGetAffiliations(params, {
  query: { placeholderData: keepPreviousData },
})

type ManageableUser = ExternalUserAffiliationOverviewDTO & { userId: string }

const manageableUsers = computed(() => (data.value?.data ?? []) as ManageableUser[])

const options = computed<AvAutocompleteOption[]>(() =>
  manageableUsers.value.map(user => ({
    value: user.userId,
    label: toFullName(user.firstName, user.lastName),
    description: user.email,
  })),
)

const knownUsers = reactive(new Map<string, UserInfoType>())

const selectedItems = computed(() =>
  selectedUsers.value.map((option) => {
    const id = String(option.value)
    const [firstName = '', ...lastName] = option.label.split(' ')

    return knownUsers.get(id) ?? { id, firstName, lastName: lastName.join(' '), email: option.description ?? '' }
  }),
)

const rightsByUser = reactive(new Map<string, EActivityRight[]>())

const { mutate: defineAuthorizations, isPending: isSaving } = useDefineActivityAuthorizations()

function save () {
  defineAuthorizations({
    activityStatus: status,
    activityId,
    data: {
      authorizations: selectedItems.value.map(user => ({
        staffId: user.id,
        rights: rightsByUser.get(user.id) ?? [],
      })),
    },
  }, {
    onSuccess: async () => {
      addSuccessMessage(t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.saveSuccess'))
      await invalidateGetActivityAuthorizations(queryClient, status, activityId)
    },
    onError: (error) => {
      addErrorMessage({
        title: t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.saveError'),
        description: getErrorMessage(error),
      })
    },
  })
}

function removeUser (id: string) {
  selectedUsers.value = selectedUsers.value.filter(option => option.value !== id)
  rightsByUser.delete(id)
}

const { data: activityAuthorizations } = useGetActivityAuthorizations(() => status, () => activityId)

watch(manageableUsers, (users) => {
  for (const user of users) {
    knownUsers.set(user.userId, { ...user, id: user.userId })
  }
}, { immediate: true })

whenever(activityAuthorizations, (authorizations) => {
  selectedUsers.value = authorizations.map(({ staff }) => ({
    value: staff.id,
    label: toFullName(staff.firstName, staff.lastName),
  }))

  for (const { staff, rights } of authorizations) {
    rightsByUser.set(staff.id, rights)
  }
}, { immediate: true, once: true })
</script>

<template>
  <IconTitleCardContainer
    :title="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.title')"
    :title-icon="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
    data-testid="activity-rights-section"
  >
    <QuerySuspense
      :error="error"
      :error-title="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.fetchError')"
      :is-loading="isFetching"
      preserve-content
    >
      <div class="av-col av-gap-md">
        <Autocomplete
          v-model="selectedUsers"
          v-model:search="search"
          :options="options"
          :loading="isFetching"
          multi-select
          server-side-filtering
          :show-selected-section="false"
          :display-selection-in-input="false"
          :input-options="{
            label: t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.label'),
            placeholder: t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.placeholder'),
          }"
          :items-title-max-lines="2"
          dropdown-class="activity-rights-section__dropdown"
          dropdown-width="100%"
          data-testid="activity-rights-user-autocomplete"
        />

        <div
          v-if="selectedItems.length > 0"
          class="av-col av-gap-md"
          data-testid="activity-rights-selected-users"
        >
          <span class="av-label b2-light">
            {{ t('student.associations.cards.SelectedAssociateItemsContainer.label', { count: selectedItems.length }) }}
          </span>

          <ul
            class="av-col av-gap-sm av-list-reset av-p-0"
            :class="{ 'activity-rights-section__list--scrollable': !isMobile }"
          >
            <li
              v-for="user in selectedItems"
              :key="user.id"
              class="activity-rights-section__item"
              data-testid="activity-rights-user-row"
            >
              <ActivityRightsUserRow
                :user="user"
                :model-value="rightsByUser.get(user.id)"
                @update:model-value="rightsByUser.set(user.id, $event)"
                @delete="removeUser(user.id)"
              />
            </li>
          </ul>
        </div>

        <div class="av-row av-justify-end">
          <AvButton
            :label="t('global.buttons.save')"
            :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
            :is-loading="isSaving"
            @click="save"
          />
        </div>
      </div>
    </QuerySuspense>
  </IconTitleCardContainer>
</template>

<style lang="scss" scoped>
.activity-rights-section__list--scrollable {
  max-height: calc(4 * 4rem + 5rem);
  overflow-y: auto;
}

.activity-rights-section__item {
  flex-shrink: 0;
}

:deep(.activity-rights-section__dropdown) {
  position: static !important;
}
</style>
