<script setup lang="ts">
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { useI18n } from 'vue-i18n'
import SectionNavigationLayout
  from '@/common/components/layout/SectionNavigationLayout/SectionNavigationLayout.vue'
import { useSectionNavigationLayout } from '@/common/composables'
import { ICONS } from '@/common/constants'
import UserDetailsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserDetailsSection/UserDetailsSection.vue'
import UserGroupsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserGroupsSection/UserGroupsSection.vue'
import UserPermissionsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserPermissionsSection/UserPermissionsSection.vue'
import UserProgramsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserProgramsSection/UserProgramsSection.vue'
import { UserSections } from '@/features/staff/admin/views/InstitutionUserDetailedView/InstitutionUserDetailedView.types'

export interface UserLayoutProps {
  user: ExternalUserDetailDTO
  isLoading?: boolean
  error?: BaseApiException | null
}

const { user, isLoading, error } = defineProps<UserLayoutProps>()

const emit = defineEmits<{
  (e: 'selectedSection', section: string): void
}>()

const { t } = useI18n()

const items = computed(() => [
  {
    id: UserSections.DETAILS,
    label: t('staff.admin.views.InstitutionUserDetailedView.components.layout.UserLayout.sections.DETAILS.navItem'),
    icon: ICONS.USER,
  },
  {
    id: UserSections.PROGRAMS,
    label: t('staff.admin.views.InstitutionUserDetailedView.components.layout.UserLayout.sections.PROGRAMS.navItem'),
    icon: ICONS.PROGRAMS,
  },
  {
    id: UserSections.GROUPS,
    label: t('staff.admin.views.InstitutionUserDetailedView.components.layout.UserLayout.sections.GROUPS.navItem'),
    icon: ICONS.GROUPS,
  },
  {
    id: UserSections.PERMISSIONS,
    label: t('staff.admin.views.InstitutionUserDetailedView.components.layout.UserLayout.sections.PERMISSIONS.navItem'),
    icon: ICONS.PERMISSIONS,
  },
])

const componentBySection = {
  [UserSections.DETAILS]: UserDetailsSection,
  [UserSections.PROGRAMS]: UserProgramsSection,
  [UserSections.GROUPS]: UserGroupsSection,
  [UserSections.PERMISSIONS]: UserPermissionsSection,
}

const propsBySection = computed(() => ({
  [UserSections.DETAILS]: { user, isLoading, error },
  [UserSections.PROGRAMS]: { user, isLoading, error },
  [UserSections.GROUPS]: { user, isLoading, error },
  [UserSections.PERMISSIONS]: { user, isLoading, error },
}))

const {
  defaultSection,
  navigateToSelectedSection,
} = useSectionNavigationLayout<UserSections>({
  items,
  fallbackSection: UserSections.DETAILS,
})
</script>

<template>
  <SectionNavigationLayout
    :items="items"
    :default-section="defaultSection"
    :component-by-section="componentBySection"
    :props-by-section="propsBySection"
    :select-placeholder="t('global.navigation.accessTo')"
    side-navigation-width="fit-content"
    @selected-item-label="(label) => emit('selectedSection', label)"
    @selected-item="(item) => navigateToSelectedSection(item.itemId)"
  />
</template>
