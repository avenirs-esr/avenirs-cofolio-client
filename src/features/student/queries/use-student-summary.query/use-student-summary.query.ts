import type { BaseApiException } from '@/common/exceptions'
import type { CommonMutationArgs } from '@/features/student/queries/types'
import type {
  DeliverableOverviewDTO,
  EventOverviewDTO,
  PageOverviewDTO,
  ResumeOverviewDTO,
  StudentHeaderSummaryDTO,
} from '@/types'
import {
  mockedDeliverablesOverview,
  mockedEventsOverview,
  mockedHeaderOverview,
  mockedPagesOverview,
  mockedResumesOverview
} from '@/__mocks__/fixtures/student'
import {
  deleteUserPhoto,
  EUserCategory,
  EUserPhotoType,
  getProfile,
  getStudentProgressOverview,
  getTraceOverview,
  type ProfileOverviewDTO,
  type ProfileUpdateRequest,
  type StudentProgressOverviewDTO,
  type TraceOverviewDTO,
  updateProfile,
  updateProfilePhoto,
  type UpdateProfilePhotoBody
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { useMutation, useQuery, type UseQueryDefinedReturnType, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']
const studentSummaryQueryKeys = [...commonQueryKeys, 'summary']
const headerSummaryQueryKeys = [...commonQueryKeys, 'header']
// TODO:  use enum UserProfile instead of this constant

export function useStudentSummaryQuery (): UseQueryReturnType<ProfileOverviewDTO, BaseApiException> {
  const queryKey = computed(() => studentSummaryQueryKeys)
  return useQuery<ProfileOverviewDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<ProfileOverviewDTO> => {
      return getProfile(EUserCategory.STUDENT)
    }
  })
}

export function useStudentCoursesSummaryQuery (): UseQueryDefinedReturnType<StudentProgressOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'skills'])
  return useQuery<StudentProgressOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    queryFn: async (): Promise<StudentProgressOverviewDTO[]> => {
      return getStudentProgressOverview()
    }
  })
}

export function useStudentDeliverablesSummaryQuery (): UseQueryDefinedReturnType<DeliverableOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'deliverables'])
  return useQuery<DeliverableOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/formations/deliverables/overview when the endpoint and client are ready
    queryFn: async (): Promise<DeliverableOverviewDTO[]> => {
      return mockedDeliverablesOverview
    }
  })
}

export function useStudentEventsSummaryQuery (): UseQueryDefinedReturnType<EventOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'events'])
  return useQuery<EventOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/formations/events/overview when the endpoint and client are ready
    queryFn: async (): Promise<EventOverviewDTO[]> => {
      return mockedEventsOverview
    }
  })
}

export function useStudentHeaderSummaryQuery (): UseQueryReturnType<StudentHeaderSummaryDTO, BaseApiException> {
  const queryKey = computed(() => headerSummaryQueryKeys)
  return useQuery<StudentHeaderSummaryDTO, BaseApiException>({
    queryKey,
    // TODO: call /me/header/overview when the endpoint and client are ready
    queryFn: async (): Promise<StudentHeaderSummaryDTO> => {
      return mockedHeaderOverview
    }
  })
}

export function useStudentPagesSummaryQuery (): UseQueryDefinedReturnType<PageOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'pages'])
  return useQuery<PageOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/pages/overview when the endpoint and client are ready
    queryFn: async (): Promise<PageOverviewDTO[]> => {
      return mockedPagesOverview
    }
  })
}

export function useStudentResumesSummaryQuery (): UseQueryDefinedReturnType<ResumeOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'resumes'])
  return useQuery<ResumeOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/resumes/overview when the endpoint and client are ready
    queryFn: async (): Promise<ResumeOverviewDTO[]> => {
      return mockedResumesOverview
    }
  })
}

export function useStudentTracesSummaryQuery (): UseQueryDefinedReturnType<TraceOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'traces'])
  return useQuery<TraceOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    queryFn: async (): Promise<TraceOverviewDTO[]> => {
      return getTraceOverview()
    }
  })
}

export interface UpdateProfileVariables {
  profile: EUserCategory
  profileUpdateRequest: ProfileUpdateRequest
}

export function useUpdateProfileMutation ({ onError, onSuccess }: CommonMutationArgs = {}) {
  const invalidateStudentSummaryQuery = useInvalidateQuery(studentSummaryQueryKeys)
  const invalidateHeaderSummaryQuery = useInvalidateQuery(headerSummaryQueryKeys)
  return useMutation<string, BaseApiException, UpdateProfileVariables>({
    mutationFn: async ({ profile, profileUpdateRequest }: UpdateProfileVariables): Promise<string> => {
      return await updateProfile(profile, profileUpdateRequest)
    },
    onSuccess: async (data) => {
      await invalidateStudentSummaryQuery()
      await invalidateHeaderSummaryQuery()
      onSuccess?.(data)
    },
    onError
  })
}

export interface UpdateProfileCoverVariables {
  profile: EUserCategory
  updateProfileCoverBody: UpdateProfilePhotoBody
}

export function useUpdateProfileCoverMutation ({ onError, onSuccess }: CommonMutationArgs = {}) {
  return useMutation<string, BaseApiException, UpdateProfileCoverVariables>({
    mutationFn: async ({ profile, updateProfileCoverBody }: UpdateProfileCoverVariables): Promise<string> => {
      const uploadedPhoto = await updateProfilePhoto(profile, EUserPhotoType.COVER, updateProfileCoverBody)
      return uploadedPhoto.id
    },
    onSuccess,
    onError
  })
}

export interface UpdateProfilePhotoVariables {
  profile: EUserCategory
  updateProfilePhotoBody: UpdateProfilePhotoBody
}

export function useUpdateProfilePhotoMutation ({ onError, onSuccess }: CommonMutationArgs = {}) {
  return useMutation<string, BaseApiException, UpdateProfilePhotoVariables>({
    mutationFn: async ({ profile, updateProfilePhotoBody }: UpdateProfilePhotoVariables): Promise<string> => {
      const uploadedPhoto = await updateProfilePhoto(profile, EUserPhotoType.PROFILE, updateProfilePhotoBody)
      return uploadedPhoto.id
    },
    onSuccess,
    onError
  })
}

interface DeleteUserPhotoVariables {
  fileId: string
}

export interface UseDeletePhotoMutationArgs {
  onSuccess?: () => void
  onError?: (error: BaseApiException) => void
}

export function useDeletePhotoMutation ({ onError, onSuccess }: UseDeletePhotoMutationArgs = {}) {
  const invalidateStudentSummaryQuery = useInvalidateQuery(studentSummaryQueryKeys)
  return useMutation<string, BaseApiException, DeleteUserPhotoVariables>({
    mutationFn: async ({ fileId }: DeleteUserPhotoVariables): Promise<string> => {
      return await deleteUserPhoto(fileId)
    },
    onSuccess: async () => {
      await invalidateStudentSummaryQuery()
      onSuccess?.()
    },
    onError
  })
}
