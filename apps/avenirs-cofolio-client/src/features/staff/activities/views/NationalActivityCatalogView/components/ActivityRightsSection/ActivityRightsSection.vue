<script lang="ts" setup>
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { ActivityAuthorizationDTO, EActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvButton, AvCard, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { ConfirmationModal, FormCancelConfirmButtons, QuerySuspense, useApiErrors, useModal, useUnsavedChangesGuard } from '@avenirs-esr/shared'
import { EActivityRight, EAuthorization, invalidateGetActivityAuthorizations, useDefineActivityAuthorizations, useGetActivityAuthorizations, useSearchActivityAuthorizationCandidates } from '@avenirs-esr/shared/api/avenir-esr'
import { keepPreviousData, useQueryClient } from '@tanstack/vue-query'
import { refDebounced } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import Autocomplete from '@/common/components/interaction/selects/Autocomplete/Autocomplete.vue'
import { toFullName } from '@/common/utils/user/user'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import ActivityRightsUserRow from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityRightsUserRow/ActivityRightsUserRow.vue'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'
import AuthorizationTypeBadge from '@/features/staff/admin/views/InstitutionUserDetailedView/components/badges/AuthorizationTypeBadge/AuthorizationTypeBadge.vue'
import { useToasterStore } from '@/store'

export interface ActivityRightsSectionProps {
  activityId: string
  status: EActivityStatus
  canEdit?: boolean
}

const { activityId, status, canEdit = false } = defineProps<ActivityRightsSectionProps>()

const emit = defineEmits<{
  dirtyChange: [isDirty: boolean]
}>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const queryClient = useQueryClient()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { getErrorMessage } = useApiErrors()

const isEditing = ref(false)
const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const selectedUsers = ref<AvAutocompleteOption[]>([])

const params = computed(() => ({
  keyword: debouncedSearch.value || undefined,
}))

const { data, error, isFetching } = useSearchActivityAuthorizationCandidates(() => status, () => activityId, params, {
  query: { placeholderData: keepPreviousData, enabled: isEditing },
})

const candidates = computed(() => data.value?.data ?? [])

const options = computed<AvAutocompleteOption[]>(() =>
  candidates.value.map(user => ({
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

const rightsByUser = reactive(new Map<string, EActivityRight[]>())

const { profile } = useCurrentUser()

const { mutate: defineAuthorizations, isPending: isSaving } = useDefineActivityAuthorizations({
  mutation: {
    onSuccess: async () => {
      addSuccessMessage(t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.saveSuccess'))
      isEditing.value = false
      await invalidateGetActivityAuthorizations(queryClient, status, activityId)
    },
    onError: (error) => {
      addErrorMessage({
        title: t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.saveError'),
        description: getErrorMessage(error),
      })
    },
  },
})

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
  })
}

function removeUser (id: string) {
  selectedUsers.value = selectedUsers.value.filter(option => option.value !== id)
  rightsByUser.delete(id)
}

const { data: activityAuthorizations, error: authorizationsError, isLoading: isLoadingAuthorizations } = useGetActivityAuthorizations(() => status, () => activityId)

function syncWithAuthorizations (authorizations: ActivityAuthorizationDTO[] = []) {
  selectedUsers.value = authorizations.map(({ staff }) => ({
    value: staff.id,
    label: toFullName(staff.firstName, staff.lastName),
  }))

  rightsByUser.clear()
  authorizations.forEach(({ staff, rights }) => rightsByUser.set(staff.id, rights))
}

const readOnlyRows = computed(() =>
  (activityAuthorizations.value ?? []).map(({ staff, rights }) => ({
    user: { ...staff, email: '' } satisfies UserInfoType,
    rights: (rights.includes(EActivityRight.LEADER) ? Object.values(EActivityRight) : rights).map(right => EAuthorization[right]),
  })),
)

function isRowLocked (userId: string) {
  return userId === profile.data.value.id || !!rightsByUser.get(userId)?.includes(EActivityRight.LEADER)
}

const isDirty = computed(() => {
  if (!isEditing.value) {
    return false
  }

  const saved = new Map((activityAuthorizations.value ?? []).map(({ staff, rights }) => [staff.id, new Set(rights)]))
  const current = selectedUsers.value.map(({ value }) => String(value))

  return current.length !== saved.size || current.some((id) => {
    const savedRights = saved.get(id)
    const currentRights = rightsByUser.get(id) ?? []

    return !savedRights || savedRights.size !== currentRights.length || currentRights.some(right => !savedRights.has(right))
  })
})

const { modalOpened, openModal, closeModal } = useModal()
const { canLeave, confirm, cancel } = useUnsavedChangesGuard({ isDirty, openModal, closeModal })

function startEditing () {
  syncWithAuthorizations(activityAuthorizations.value)
  isEditing.value = true
}

async function cancelEditing () {
  if (!await canLeave()) {
    return
  }

  search.value = ''
  syncWithAuthorizations(activityAuthorizations.value)
  isEditing.value = false
}

watch(candidates, (users) => {
  users.forEach(user => knownUsers.set(user.id, user))
}, { immediate: true })

watch(activityAuthorizations, (authorizations) => {
  if (!isEditing.value) {
    syncWithAuthorizations(authorizations)
  }
}, { immediate: true })

watch(isDirty, dirty => emit('dirtyChange', dirty), { immediate: true })
</script>

<template>
  <IconTitleCardContainer
    :title="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.title')"
    :title-icon="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
    data-testid="activity-rights-section"
  >
    <template
      v-if="!isEditing"
      #title
    >
      <AvButton
        :icon="MDI_ICONS.PENCIL_OUTLINE"
        :label="t('global.buttons.update')"
        :is-loading="isLoadingAuthorizations"
        :disabled="!canEdit"
        :disabled-tooltip="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.editDisabledTooltip')"
        variant="OUTLINED"
        data-testid="activity-rights-edit-button"
        @click="startEditing"
      />
    </template>

    <QuerySuspense
      v-if="!isEditing"
      :error="authorizationsError"
      :error-title="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.fetchAuthorizationsError')"
      :is-loading="isLoadingAuthorizations"
      :is-empty="readOnlyRows.length === 0"
      :empty-state-message="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.emptyState')"
    >
      <ul
        class="av-col av-gap-sm av-list-reset"
        :class="{ 'activity-rights-section__list--scrollable': !isMobile }"
        data-testid="activity-rights-readonly-list"
      >
        <li
          v-for="{ user, rights } in readOnlyRows"
          :key="user.id"
          class="activity-rights-section__item"
          data-testid="activity-rights-readonly-row"
        >
          <AvCard>
            <div
              class="av-gap-md av-py-sm av-px-md"
              :class="isMobile ? 'av-col' : 'activity-rights-section__readonly-row--desktop av-row av-align-center'"
            >
              <UserInfo
                :user="user"
                class="av-flex-fill"
              />
              <ul class="av-flex-fill av-row av-wrap av-gap-sm av-list-reset">
                <li
                  v-for="right in rights"
                  :key="right"
                >
                  <AuthorizationTypeBadge :type="right" />
                </li>
              </ul>
            </div>
          </AvCard>
        </li>
      </ul>
    </QuerySuspense>

    <QuerySuspense
      v-else
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
            class="av-col av-gap-sm av-list-reset"
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
                :locked="isRowLocked(user.id)"
                :model-value="rightsByUser.get(user.id)"
                @update:model-value="rightsByUser.set(user.id, $event)"
                @delete="removeUser(user.id)"
              />
            </li>
          </ul>
        </div>

        <div class="av-row av-justify-end">
          <FormCancelConfirmButtons
            :is-submitting="isSaving"
            :is-form-valid="isDirty"
            :confirm-disabled-tooltip="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.saveDisabledTooltip')"
            data-testid="activity-rights-form-buttons"
            @cancel="cancelEditing"
            @submit="save"
          />
        </div>
      </div>
    </QuerySuspense>
  </IconTitleCardContainer>

  <ConfirmationModal
    :opened="modalOpened"
    :description="t('staff.activities.views.NationalActivityCatalogView.ActivityRightsSection.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>

<style lang="scss" scoped>
.activity-rights-section__list--scrollable {
  max-height: calc(5 * 6rem);
  overflow-y: auto;
}

.activity-rights-section__readonly-row--desktop {
  min-height: 3rem;
}

.activity-rights-section__item {
  flex-shrink: 0;
}

:deep(.activity-rights-section__dropdown .av-list-item--selected:not(:hover, :focus-visible) .caption-light) {
  color: var(--color-primary-text-flat);
}
</style>
