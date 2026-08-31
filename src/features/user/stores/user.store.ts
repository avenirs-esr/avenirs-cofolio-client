import { EFileType, ERole, EUserCategory, getProfile, useGetProfile, useGetQuickLinks, type FileDTO, type ProfileOverviewDTO, type QuickLinksDTO } from '@/api/avenir-esr'
import { useBaseApiExceptionToast, useLanguageSwitcher } from '@/common/composables'
import { QUICK_LINKS_REFRESH_INTERVAL, ROUTES } from '@/common/constants'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { defineStore } from 'pinia'
import type { RouteLocationRaw } from 'vue-router'

const UNSUPPORTED_ROLE: ERole = '__UNSUPPORTED_ROLE' as unknown as ERole

const UNSUPPORTED_USER_CATEGORY: EUserCategory = '__UNSUPPORTED_USER_CATEGORY' as unknown as EUserCategory

const UNSUPPORTED_HOME: RouteLocationRaw = {} as unknown as RouteLocationRaw

const EMPTY_IMAGE = {
  id: '',
  fileName: '',
  fileType: EFileType.JPEG,
  fileSize: 0,
  url: '',
  uploadedAt: '',
} as unknown as FileDTO

const UNSUPPORTED_PROFILE: ProfileOverviewDTO = {
  id: '',
  firstname: '',
  lastname: '',
  bio: '',
  email: '',
  profilePicture: EMPTY_IMAGE,
  coverPicture: EMPTY_IMAGE,
} as unknown as ProfileOverviewDTO

const UNSUPPORTED_QUICK_LINKS: QuickLinksDTO = {
  userId: '',
  firstname: '',
  lastname: '',
  hasUnseenNotification: false,
  unreadNotifications: 0,
  notificationEnabled: false,
} as unknown as QuickLinksDTO

const ROLE_PRIORITY: Record<ERole, number> = {
  [UNSUPPORTED_ROLE]: 0,
  [ERole.ROLE_STUDENT]: 1,
  [ERole.ROLE_STAFF]: 2,
  [ERole.ROLE_SUPER_ADMIN]: 99,
}

function getHighestRole (roles: readonly ERole[]): ERole {
  return roles.reduce<ERole>((role2, role1) => {
    const priority1 = ROLE_PRIORITY[role1]

    return priority1 !== undefined && priority1 > ROLE_PRIORITY[role2] ? role1 : role2
  }, UNSUPPORTED_ROLE)
}

function roleToCategory (role: ERole): EUserCategory {
  switch (role) {
    case ERole.ROLE_STUDENT:
      return EUserCategory.STUDENT
    case ERole.ROLE_STAFF:
    case ERole.ROLE_SUPER_ADMIN:
      return EUserCategory.STAFF
    default:
      return UNSUPPORTED_USER_CATEGORY
  }
}

function roleToHome (role: ERole): RouteLocationRaw {
  switch (role) {
    case ERole.ROLE_STUDENT:
      return ROUTES.STUDENT.HOME
    case ERole.ROLE_STAFF:
    case ERole.ROLE_SUPER_ADMIN:
      return ROUTES.STAFF.HOME
    default:
      return UNSUPPORTED_HOME
  }
}

export const useStudentUserStore = defineStore('studentUser', () => {
  const { session } = useAuthStore()
  const { languageSelector, selectLanguage } = useLanguageSwitcher()

  const highestRole = computed(() => getHighestRole(session.roles))
  const canSwitchRole = computed(() => session.roles.length > 0)

  const currentRole = ref<ERole>(highestRole.value)
  const category = computed(() => roleToCategory(currentRole.value))
  const home = computed(() => roleToHome(currentRole.value))

  const {
    data: profileData,
    isPending: profilePending,
    error: profileError
  } = useGetProfile(category, {
    query: {
      enabled: category.value !== UNSUPPORTED_USER_CATEGORY
    }
  })
  useBaseApiExceptionToast(profileError)

  const {
    data: quickLinksData,
    isPending: quickLinksPending,
    error: quickLinksError
  } = useGetQuickLinks(category, {
    query: {
      enabled: category.value !== UNSUPPORTED_USER_CATEGORY,
      refetchInterval: QUICK_LINKS_REFRESH_INTERVAL
    }
  })
  useBaseApiExceptionToast(quickLinksError)

  const profile = computed(() => category.value === UNSUPPORTED_USER_CATEGORY || !profileData.value ? UNSUPPORTED_PROFILE : profileData.value)
  const quickLinks = computed(() => category.value === UNSUPPORTED_USER_CATEGORY || !quickLinksData.value ? UNSUPPORTED_QUICK_LINKS : quickLinksData.value)

  function hasRole (role: ERole): boolean {
    return session.roles.includes(role)
  }

  function hasRoles (roles: readonly ERole[]): boolean {
    return roles.every(role => session.roles.includes(role))
  }

  function hasAnyRole (roles: readonly ERole[]): boolean {
    return roles.some(role => session.roles.includes(role))
  }

  function switchRole (role: ERole) {
    if (role === currentRole.value || !canSwitchRole.value || !hasRole(role)) {
      return
    }
    currentRole.value = role
  }

  function hasPermission (_permission: unknown): boolean {
    return true
  }

  function hasPermissions (_permissions: unknown): boolean {
    return true
  }

  function hasAnyPermission (_permissions: unknown): boolean {
    return true
  }

  return {
    currentRole,
    highestRole,
    canSwitchRole,
    hasRole,
    hasRoles,
    hasAnyRole,
    switchRole,
    hasPermission,
    hasPermissions,
    hasAnyPermission,
    category,
    home,
    profile,
    profilePending,
    quickLinks,
    quickLinksPending,
    languageSelector,
    selectLanguage
  }
}, {
  persist: {
    pick: [
      'languageSelector',
    ]
  }
})
