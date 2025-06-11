import type {
  ProfileOverviewDTO,
  ProgramProgressOverviewDTO
} from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { mockedCourses } from '@/features/student/queries/utils'
import {
  type DeliverableOverviewDTO,
  type EventOverviewDTO,
  type PageOverviewDTO,
  type ResumeOverviewDTO,
  type StudentHeaderSummaryDTO,
  type TraceOverviewDTO,
  TraceType
} from '@/types'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { describe, expect, it } from 'vitest'
import { unref } from 'vue'
import {
  useStudentCoursesSummaryQuery,
  useStudentDeliverablesSummaryQuery,
  useStudentEventsSummaryQuery,
  useStudentHeaderSummaryQuery,
  useStudentPagesSummaryQuery,
  useStudentResumesSummaryQuery,
  useStudentSummaryQuery,
  useStudentTracesSummaryQuery
} from './use-student-summary.query'

describe('useStudentSummaryQuery', () => {
  const mockedData = {
    firstname: 'Jeanne',
    lastname: 'Moulin',
    profilePicture: profile_picture_placeholder,
    coverPicture: profile_banner_placeholder,
    bio: 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète. Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
  }

  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<ProfileOverviewDTO, BaseApiException>>(
      () => useStudentSummaryQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('firstname')
    expect(result).toHaveProperty('lastname')
    expect(result).toHaveProperty('profilePicture')
    expect(result).toHaveProperty('coverPicture')
    expect(result).toHaveProperty('bio')
    expect(result).toEqual(mockedData)
  })
})

describe('useStudentCoursesSummaryQuery', () => {
  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<ProgramProgressOverviewDTO[], BaseApiException>>(
      () => useStudentCoursesSummaryQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveLength(2)
    expect(result![0]).toHaveProperty('id')
    expect(result![0]).toHaveProperty('name')
    expect(result![0]).toHaveProperty('skills')
    expect(result).toEqual(mockedCourses)
  })
})

describe('useStudentDeliverablesSummaryQuery', () => {
  const mockedData = [
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

  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<DeliverableOverviewDTO[], BaseApiException>>(
      () => useStudentDeliverablesSummaryQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveLength(4)
    expect(result![0]).toHaveProperty('id')
    expect(result![0]).toHaveProperty('skill')
    expect(result![0]).toHaveProperty('activity')
    expect(result![0]).toHaveProperty('deliverableUntil')
    expect(result).toEqual(mockedData)
  })
})

describe('useStudentEventsSummaryQuery', () => {
  const mockedData = [
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
  ]

  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<EventOverviewDTO[], BaseApiException>>(
      () => useStudentEventsSummaryQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveLength(4)
    expect(result![0]).toHaveProperty('id')
    expect(result![0]).toHaveProperty('name')
    expect(result![0]).toHaveProperty('startDate')
    expect(result![0]).toHaveProperty('endDate')
    expect(result![0]).toHaveProperty('location')
    expect(result).toEqual(mockedData)
  })
})

describe('useStudentHeaderSummaryQuery', () => {
  const mockedData = {
    id: '123456789',
    name: 'J. Moulin',
    messagesCount: 2,
    notificationsCount: 2,
  }

  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<StudentHeaderSummaryDTO, BaseApiException>>(
      () => useStudentHeaderSummaryQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('messagesCount')
    expect(result).toHaveProperty('notificationsCount')
    expect(result).toEqual(mockedData)
  })
})

describe('useStudentPagesSummaryQuery', () => {
  const mockedData = [
    { id: 'page1', name: 'analyse-ams-13-02-2024', updatedAt: '2025-02-22' },
    { id: 'page2', name: 'projetdevie-trajectoires', updatedAt: '2024-12-20' },
    { id: 'page3', name: 'Recherche-stage-SAP-3-avril202', updatedAt: '2024-10-04' },
    { id: 'page4', name: 'analyse-projet-de-vie', updatedAt: '2024-09-08' },
  ]

  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<PageOverviewDTO[], BaseApiException>>(
      () => useStudentPagesSummaryQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveLength(4)
    expect(result![0]).toHaveProperty('id')
    expect(result![0]).toHaveProperty('name')
    expect(result![0]).toHaveProperty('updatedAt')
    expect(result).toEqual(mockedData)
  })
})

describe('useStudentResumesSummaryQuery', () => {
  const mockedData = [
    { id: 'resume1', name: 'cv-version1-05-2024', updatedAt: '2025-05-19T00:00:00.000Z' },
    { id: 'resume2', name: 'cv-version1-04-2024', updatedAt: '2025-04-25T00:00:00.000Z' },
    { id: 'resume3', name: 'cv-version1-03-2024-with-a-very-long-name', updatedAt: '2025-03-03T00:00:00.000Z' },
    { id: 'resume4', name: 'cv-version1-02-2024', updatedAt: '2025-02-08T00:00:00.000Z' },
  ]

  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<ResumeOverviewDTO[], BaseApiException>>(
      () => useStudentResumesSummaryQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveLength(4)
    expect(result![0]).toHaveProperty('id')
    expect(result![0]).toHaveProperty('name')
    expect(result![0]).toHaveProperty('updatedAt')
    expect(result).toEqual(mockedData)
  })
})

describe('useStudentTracesSummaryQuery', () => {
  const mockedData = [
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

  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<TraceOverviewDTO[], BaseApiException>>(
      () => useStudentTracesSummaryQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveLength(4)
    expect(result![0]).toHaveProperty('id')
    expect(result![0]).toHaveProperty('name')
    expect(result![0]).toHaveProperty('skillCount')
    expect(result![0]).toHaveProperty('activityCount')
    expect(result![0]).toHaveProperty('type')
    expect(result![0]).toHaveProperty('filedAt')
    expect(result).toEqual(mockedData)
  })
})
