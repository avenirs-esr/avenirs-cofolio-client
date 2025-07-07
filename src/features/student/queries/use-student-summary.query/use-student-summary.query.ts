import type { BaseApiException } from '@/common/exceptions'
import type {
  DeliverableOverviewDTO,
  EventOverviewDTO,
  PageOverviewDTO,
  ResumeOverviewDTO,
  StudentHeaderSummaryDTO,
  TraceOverviewDTO
} from '@/types'
import {
  getProfile,
  getSkillsOverview,
  type ProfileOverviewDTO,
  type ProgramProgressOverviewDTO,
} from '@/api/avenir-esr'
import {
  mockedDeliverablesOverview,
  mockedEventsOverview,
  mockedHeaderOverview,
  mockedPagesOverview,
  mockedResumesOverview,
  mockedTracesOverview
} from '@/features/student/queries/fixtures'
import { useQuery, type UseQueryDefinedReturnType, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']
// TODO:  use enum UserProfile instead of this constant
const PROFILE = 'student'

function useStudentSummaryQuery (): UseQueryReturnType<ProfileOverviewDTO, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'summary'])
  return useQuery<ProfileOverviewDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<ProfileOverviewDTO> => {
      return getProfile(PROFILE)
    }
  })
}

function useStudentCoursesSummaryQuery (): UseQueryDefinedReturnType<ProgramProgressOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'skills'])
  return useQuery<ProgramProgressOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    queryFn: async (): Promise<ProgramProgressOverviewDTO[]> => {
      return getSkillsOverview()
    }
  })
}

function useStudentDeliverablesSummaryQuery (): UseQueryDefinedReturnType<DeliverableOverviewDTO[], BaseApiException> {
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

function useStudentEventsSummaryQuery (): UseQueryDefinedReturnType<EventOverviewDTO[], BaseApiException> {
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

function useStudentHeaderSummaryQuery (): UseQueryReturnType<StudentHeaderSummaryDTO, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'header'])
  return useQuery<StudentHeaderSummaryDTO, BaseApiException>({
    queryKey,
    // TODO: call /me/header/overview when the endpoint and client are ready
    queryFn: async (): Promise<StudentHeaderSummaryDTO> => {
      return mockedHeaderOverview
    }
  })
}

function useStudentPagesSummaryQuery (): UseQueryDefinedReturnType<PageOverviewDTO[], BaseApiException> {
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

function useStudentResumesSummaryQuery (): UseQueryDefinedReturnType<ResumeOverviewDTO[], BaseApiException> {
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

function useStudentTracesSummaryQuery (): UseQueryDefinedReturnType<TraceOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'traces'])
  return useQuery<TraceOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/formations/traces/overview when the endpoint and client are ready
    queryFn: async (): Promise<TraceOverviewDTO[]> => {
      return mockedTracesOverview
    }
  })
}

export {
  useStudentCoursesSummaryQuery,
  useStudentDeliverablesSummaryQuery,
  useStudentEventsSummaryQuery,
  useStudentHeaderSummaryQuery,
  useStudentPagesSummaryQuery,
  useStudentResumesSummaryQuery,
  useStudentSummaryQuery,
  useStudentTracesSummaryQuery
}
