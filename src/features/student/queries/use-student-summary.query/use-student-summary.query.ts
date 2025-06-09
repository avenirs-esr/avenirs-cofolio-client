import type { BaseApiException } from '@/common/exceptions'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import {
  type CourseOverviewDTO,
  type DeliverableDTO,
  type EventDTO,
  LevelStatus,
  type PageDTO,
  type ResumeDTO,
  type SkillOverviewDTO,
  type StudentHeaderSummaryDTO,
  type StudentSummaryDTO,
  type TrackDTO,
  TrackType
} from '@/types'
import { useQuery, type UseQueryDefinedReturnType, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

function useStudentSummaryQuery (): UseQueryReturnType<StudentSummaryDTO, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'summary'])
  return useQuery<StudentSummaryDTO, BaseApiException>({
    queryKey,
    // TODO: call /user/{profile}/overview when the endpoint and client are ready
    queryFn: async (): Promise<StudentSummaryDTO> => {
      return {
        id: '123456789',
        firstname: 'Jeanne',
        lastname: 'Moulin',
        profilePicture: profile_picture_placeholder,
        coverPicture: profile_banner_placeholder,
        bio: 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète. Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
      }
    }
  })
}

function useStudentCoursesSummaryQuery (): UseQueryDefinedReturnType<CourseOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'skills'])
  return useQuery<CourseOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/formations/skills/overview when the endpoint and client are ready
    queryFn: async (): Promise<CourseOverviewDTO[]> => {
      const mockedSkills: Array<SkillOverviewDTO> = [
        {
          id: 'skill1',
          name: 'Prévenir la pollution à la source',
          trackCount: 1,
          activityCount: 8,
          levels: [
            { id: 'Niv1', name: 'Niv.1', status: LevelStatus.VALIDATED },
            { id: 'Niv2', name: 'Niv.2', status: LevelStatus.TO_EVALUATE }
          ]
        },
        {
          id: 'skill2',
          name: 'Mettre en place des filières d’économies circulaires',
          trackCount: 2,
          activityCount: 7,
          levels: [
            { id: 'Niv1', name: 'Niv.1', status: LevelStatus.VALIDATED },
            { id: 'Niv2', name: 'Niv.2', status: LevelStatus.TO_EVALUATE }
          ]
        },
        {
          id: 'skill3',
          name: 'Évaluer l’impact environnemental et économique',
          trackCount: 3,
          activityCount: 6,
          levels: [
            { id: 'Niv1', name: 'Niv.1', status: LevelStatus.NOT_VALIDATED },
            { id: 'Niv2', name: 'Niv.2', status: LevelStatus.UNDER_REVIEW }
          ]
        },
        {
          id: 'skill4',
          name: 'Concevoir des synthèses chimiques durables',
          trackCount: 4,
          activityCount: 5,
          levels: [{ id: 'Niv2', name: 'Niv.2', status: LevelStatus.VALIDATED }]
        },
        {
          id: 'skill5',
          name: 'Réaliser un circuit électrique',
          trackCount: 5,
          activityCount: 4,
          levels: [
            { id: 'Niv1', name: 'Niv.1', status: LevelStatus.VALIDATED },
            { id: 'Niv2', name: 'Niv.2', status: LevelStatus.TO_EVALUATE }
          ]
        },
        {
          id: 'skill6',
          name: 'Comprendre les risques électriques liés au travail en hauteur, en milieu humide, en point chaud et appréhender la consignation',
          trackCount: 6,
          activityCount: 3,
          levels: [
            { id: 'Niv1', name: 'Niv.1', status: LevelStatus.VALIDATED },
            { id: 'Niv2', name: 'Niv.2', status: LevelStatus.TO_EVALUATE }
          ]
        },
        {
          id: 'skill7',
          name: 'Réaliser une étude de marché',
          trackCount: 7,
          activityCount: 2,
          levels: [
            { id: 'Niv1', name: 'Niv.1', status: LevelStatus.NOT_VALIDATED },
            { id: 'Niv2', name: 'Niv.2', status: LevelStatus.UNDER_REVIEW }
          ]
        },
        {
          id: 'skill8',
          name: 'Réaliser un cahier des charges fonctionnels',
          trackCount: 8,
          activityCount: 1,
          levels: [{ id: 'Niv2', name: 'Niv.2', status: LevelStatus.VALIDATED }]
        },
      ]

      return [
        { id: 'course2', name: 'Master Électronique Énergie électrique et automatique - Spécialité Ingénierie des systèmes temps réel', skills: mockedSkills },
        { id: 'course1', name: 'Master Chimie Verte et Éco-innovations', skills: mockedSkills },
      ]
    }
  })
}

function useStudentDeliverablesSummaryQuery (): UseQueryDefinedReturnType<DeliverableDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'deliverables'])
  return useQuery<DeliverableDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/formations/deliverables/overview when the endpoint and client are ready
    queryFn: async (): Promise<DeliverableDTO[]> => {
      return [
        {
          id: 'deliverable1',
          skill: 'Prévenir la pollution à la source',
          activity: 'SAE 1.1 Séquence 4 - Validation des recommandations et élaboration d’un plan d’action',
          deliverableUntil: '2025-06-13T08:42:17',
        },
        {
          id: 'deliverable2',
          skill: 'Mettre en place des filières d’économies circulaires',
          activity: 'SAE 1.1 Séquence 4 - Validation des recommandations et élaboration d’un plan d’action',
          deliverableUntil: '2025-07-29T19:15:03'
        },
        {
          id: 'deliverable3',
          skill: 'Évaluer l’impact environnemental et économique',
          activity: 'SAE 1.1 Séquence 4 - Un nom de séquence méga long pour tester les ellipses validation des recommandations et élaboration d’un plan d’action',
          deliverableUntil: '2025-08-07T23:08:51',

        },
        {
          id: 'deliverable4',
          skill: 'Concevoir des synthèses chimiques durables',
          activity: 'SAE 1.1 Séquence 4 - Validation des recommandations et élaboration d’un plan d’action',
          deliverableUntil: '2025-09-21T04:26:39'
        },
      ]
    }
  })
}

function useStudentEventsSummaryQuery (): UseQueryDefinedReturnType<EventDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'events'])
  return useQuery<EventDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/formations/events/overview when the endpoint and client are ready
    queryFn: async (): Promise<EventDTO[]> => {
      return [
        {
          id: 'event1',
          name: 'Forum de l’écologie et la chimie',
          startDate: '2025-05-19T08:00',
          endDate: '2025-05-19T18:00',
          location: 'Paris'
        },
        {
          id: 'event2',
          name: 'Super forum de la mécanique quantique',
          startDate: '2025-06-25T08:30',
          endDate: '2025-06-25T17:30',
          location: 'Toulouse'
        },
        {
          id: 'event3',
          name: 'Le café des associations',
          startDate: '2025-07-03T09:00',
          endDate: '2025-07-03T17:00',
          location: 'Bordeaux'
        },
        {
          id: 'event4',
          name: 'Assemblée générale ESUP',
          startDate: '2025-08-08T09:30',
          endDate: '2025-08-08T12:15',
          location: 'Brest'
        },
      ] as Array<EventDTO>
    }
  })
}

function useStudentHeaderSummaryQuery (): UseQueryReturnType<StudentHeaderSummaryDTO, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'header'])
  return useQuery<StudentHeaderSummaryDTO, BaseApiException>({
    queryKey,
    // TODO: call /me/header/overview when the endpoint and client are ready
    queryFn: async (): Promise<StudentHeaderSummaryDTO> => {
      return {
        id: '123456789',
        name: 'J. Moulin',
        messagesCount: 2,
        notificationsCount: 2,
      }
    }
  })
}

function useStudentPagesSummaryQuery (): UseQueryDefinedReturnType<PageDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'pages'])
  return useQuery<PageDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/pages/overview when the endpoint and client are ready
    queryFn: async (): Promise<PageDTO[]> => {
      return [
        { id: 'page1', name: 'analyse-ams-13-02-2024', updatedAt: '2025-02-22' },
        { id: 'page2', name: 'projetdevie-trajectoires', updatedAt: '2024-12-20' },
        { id: 'page3', name: 'Recherche-stage-SAP-3-avril202', updatedAt: '2024-10-04' },
        { id: 'page4', name: 'analyse-projet-de-vie', updatedAt: '2024-09-08' },
      ]
    }
  })
}

function useStudentResumesSummaryQuery (): UseQueryDefinedReturnType<ResumeDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'resumes'])
  return useQuery<ResumeDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/resumes/overview when the endpoint and client are ready
    queryFn: async (): Promise<ResumeDTO[]> => {
      return [
        { id: 'resume1', name: 'cv-version1-05-2024', updatedAt: '2025-05-19T00:00:00.000Z' },
        { id: 'resume2', name: 'cv-version1-04-2024', updatedAt: '2025-04-25T00:00:00.000Z' },
        { id: 'resume3', name: 'cv-version1-03-2024-with-a-very-long-name', updatedAt: '2025-03-03T00:00:00.000Z' },
        { id: 'resume4', name: 'cv-version1-02-2024', updatedAt: '2025-02-08T00:00:00.000Z' },
      ]
    }
  })
}

function useStudentTracksSummaryQuery (): UseQueryDefinedReturnType<TrackDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'tracks'])
  return useQuery<TrackDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    // TODO: call /me/formations/tracks/overview when the endpoint and client are ready
    queryFn: async (): Promise<TrackDTO[]> => {
      return [
        {
          id: 'track1',
          name: 'Prévenir la pollution à la source',
          skillCount: 1,
          activityCount: 8,
          type: TrackType.GROUP,
          filedAt: '2024-05-13T08:42:17',
          course: 'Master Chimie Verte et Éco-innovations'
        },
        {
          id: 'track2',
          name: 'Mettre en place des filières d’économies circulaires',
          skillCount: 2,
          activityCount: 7,
          type: TrackType.INDIVIDUAL,
          filedAt: '2024-11-29T19:15:03'
        },
        {
          id: 'track3',
          name: 'Évaluer l’impact environnemental et économique',
          skillCount: 3,
          activityCount: 6,
          type: TrackType.INDIVIDUAL,
          filedAt: '2025-02-07T23:08:51',
          course: 'Master Chimie Verte et Éco-innovations'
        },
        {
          id: 'track4',
          name: 'Concevoir des synthèses chimiques durables',
          skillCount: 4,
          activityCount: 5,
          type: TrackType.GROUP,
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
  useStudentTracksSummaryQuery
}
