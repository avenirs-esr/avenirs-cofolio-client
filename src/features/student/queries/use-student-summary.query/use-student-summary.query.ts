import type { BaseApiException } from '@/common/exceptions'
import {
  mockedDeliverablesOverview,
  mockedEventsOverview,
  mockedHeaderOverview,
  mockedPagesOverview,
  mockedResumesOverview
} from '@/__mocks__/fixtures/student'
import {
  getProfile,
  getSkillsOverview,
  type ProfileOverviewDTO,
  type ProgramProgressOverviewDTO,
} from '@/api/avenir-esr'
import {
  type DeliverableOverviewDTO,
  type EventOverviewDTO,
  type PageOverviewDTO,
  type ResumeOverviewDTO,
  type StudentHeaderSummaryDTO,
  type TraceOverviewDTO,
  TraceType
} from '@/types'
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
      return [
        {
          id: 'trace1',
          name: 'Prévenir la pollution à la source',
          skillCount: 1,
          activityCount: 8,
          type: TraceType.GROUP,
          filedAt: '2024-05-13T08:42:17',
          course: 'Master Chimie Verte et Éco-innovations'
        },
        {
          id: 'trace2',
          name: 'Mettre en place des filières d’économies circulaires',
          skillCount: 2,
          activityCount: 7,
          type: TraceType.INDIVIDUAL,
          filedAt: '2024-11-29T19:15:03'
        },
        {
          id: 'trace3',
          name: 'Évaluer l’impact environnemental et économique',
          skillCount: 3,
          activityCount: 6,
          type: TraceType.INDIVIDUAL,
          filedAt: '2025-02-07T23:08:51',
          course: 'Master Chimie Verte et Éco-innovations'
        },
        {
          id: 'trace4',
          name: 'Concevoir des synthèses chimiques durables',
          skillCount: 4,
          activityCount: 5,
          type: TraceType.GROUP,
          filedAt: '2024-08-21T04:26:39'
        },
      ]
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
