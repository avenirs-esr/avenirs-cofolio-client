<script lang="ts" setup>
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { refDebounced } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { EUserCategory, useGetAffiliations } from '@/api/avenir-esr'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import Autocomplete from '@/common/components/interaction/selects/Autocomplete/Autocomplete.vue'
import { toFullName } from '@/common/utils/user/user'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'
import DeleteOverlay from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.vue'

const { t } = useI18n()

const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const selectedUsers = ref<AvAutocompleteOption[]>([])

const params = computed(() => ({
  keyword: debouncedSearch.value || undefined,
  categories: [EUserCategory.STAFF],
}))

const { data, error, isFetching } = useGetAffiliations(params, {
  query: { placeholderData: keepPreviousData },
})

const options = computed<AvAutocompleteOption[]>(() =>
  (data.value?.data ?? []).map(user => ({
    value: user.id,
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

function removeUser (id: string) {
  selectedUsers.value = selectedUsers.value.filter(option => option.value !== id)
}

watch(() => data.value?.data, (users) => {
  for (const user of users ?? []) {
    knownUsers.set(user.id, user)
  }
}, { immediate: true })
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

          <ul class="av-row av-wrap av-gap-sm av-p-sm av-list-reset">
            <li
              v-for="user in selectedItems"
              :key="user.id"
            >
              <DeleteOverlay @delete="() => removeUser(user.id)">
                <UserInfo
                  :user="user"
                  class="av-py-xs av-pl-sm av-pr-xl av-border-width-sm av-border-style-solid av-border-stroke av-radius-md av-background-base"
                />
              </DeleteOverlay>
            </li>
          </ul>
        </div>
      </div>
    </QuerySuspense>
  </IconTitleCardContainer>
</template>

<style lang="scss" scoped>
:deep(.activity-rights-section__dropdown) {
  position: static !important;
}
</style>
