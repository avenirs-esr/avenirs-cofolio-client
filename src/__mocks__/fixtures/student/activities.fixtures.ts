import {
  type ActivityDetailDTO,
  type ActivityNavigationDTO,
  ActivityThematic,
  type DeclaredActivity,
  type DeclaredActivityAssociationsDTO,
  type DeclaredActivityDetailsDTO,
  DeclaredActivityStatus,
  type DeclaredActivityTraceAssociationDTO,
  type DeclaredActivityViewDTO,
  EActivityThematic,
  EDeclaredActivityStatus,
  type PagedResponseDeclaredActivityViewDTO
} from '@/api/avenir-esr'

export const activitiesNavigationMock: ActivityNavigationDTO[] = [
  {
    title: 'SELF_KNOWLEDGE',
    items: [
      {
        id: '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1',
        title: 'Définir ses valeurs'
      },
      {
        id: '9a12e6b4-8c3f-4d22-bf55-6d4c1f2a7e33',
        title: 'Identifier ses motivations profondes'
      },
      {
        id: 'c9d4e1f2-7a21-4f7d-9b44-1a3e8f6c2b10',
        title: 'Clarifier son identité personnelle'
      },
      {
        id: '1a7f3b29-6c55-4d82-9a33-7e2d1c4f8b90',
        title: 'Identifier ses centres d’intérêt'
      }
    ]
  },
  {
    title: 'FUTURE_PLANS',
    items: [
      {
        id: 'c1e8b9a7-2d55-4f1a-8b5f-3c7e4a9d6f20',
        title: 'Explorer ses pistes d’orientation'
      },
      {
        id: '7b3d4e91-6f2a-4c88-9a1e-5d3f7b2c8e44',
        title: 'Formuler un projet professionnel provisoire'
      },
      {
        id: '5e2c9f41-8b7d-4a10-9c6a-3f1e7b2d4c55',
        title: 'Explorer les métiers d’un secteur'
      },
      {
        id: '8b4f2d77-3c1a-4e66-9f2b-6d8c3a5e1f22',
        title: 'Comparer plusieurs projets possibles'
      }
    ]
  },
  {
    title: 'PROGRAMS',
    items: [
      {
        id: 'e4a2c7f8-1b9d-4a77-8c6f-9e3b2a5d1c66',
        title: 'Analyser son parcours de formation'
      },
      {
        id: '5c8f2a91-3d7b-4e66-9b2f-1a4c8e7d9f55',
        title: 'Identifier les compétences acquises en formation'
      },
      {
        id: '2f6a8b91-5d33-4c77-8e4a-1b9f3c7d2a11',
        title: 'Analyser la cohérence de sa formation'
      },
      {
        id: '7c3d9a12-4e88-4f55-9a1d-5b6e2c7f3a44',
        title: 'Identifier les compétences académiques clés'
      }
    ]
  },
  {
    title: 'EXPERIENCES',
    items: [
      {
        id: '2d6a9b4f-7c3e-4a11-8f5b-6e2c9d7a3b12',
        title: 'Analyser une expérience significative'
      },
      {
        id: '8f3c1e7a-2b6d-4c55-9a4e-7d2b6f9c8a33',
        title: 'Valoriser une expérience professionnelle'
      },
      {
        id: '4d8f1c77-2a5b-4e11-9c2d-6f3b7a9e2c88',
        title: 'Analyser un stage réalisé'
      },
      {
        id: '9e2b6a41-3c7d-4f99-8a55-2d1c6b7e4f33',
        title: 'Identifier ses réussites marquantes'
      }
    ]
  },
  {
    title: 'TRAJECTORIES',
    items: [
      {
        id: '6a1f9c2e-4b7d-4d99-8c2f-3e7b5a1d8c21',
        title: 'Cartographier son parcours'
      },
      {
        id: '1c7e4b9a-5d2f-4a33-8b6e-9f1c2d7a4b88',
        title: 'Identifier les tournants décisifs'
      },
      {
        id: '6a4c2e91-8f7d-4b22-9a1f-3c5e7d2b8f10',
        title: 'Retracer les étapes clés de son parcours'
      },
      {
        id: '1f8b3c77-5d2a-4e66-9a4c-7b2e6d9f1a55',
        title: 'Analyser une réorientation'
      }
    ]
  },
  {
    title: 'RESUMES',
    items: [
      {
        id: '4b9e2c7d-1f6a-4d55-9c3b-2e8f7a1c5d44',
        title: 'Rédiger un CV structuré'
      },
      {
        id: '9d3b7a1c-2e6f-4c88-8a5d-7b2f6e9a3c11',
        title: 'Adapter son CV à une offre'
      },
      {
        id: '3b7a2c91-6d4e-4f88-8c1a-5e9f2b7d4c66',
        title: 'Structurer son CV'
      },
      {
        id: '8c5d1f77-2a9e-4b33-9f6c-1e4b7a2d9c11',
        title: 'Rédiger une lettre de motivation'
      }
    ]
  },
  {
    title: 'TRANSVERSAL',
    items: [
      {
        id: '7e2a4c9b-5d1f-4a77-8b3c-6f9a2e1d4c55',
        title: 'Développer ses compétences transversales'
      },
      {
        id: '2a9f6c4d-8b1e-4d33-9c7a-5e2b8f1c6d77',
        title: 'Renforcer sa capacité d’adaptation'
      },
      {
        id: '5f2a7c91-8d4e-4b22-9a6c-3e1f7d2b4c99',
        title: 'Développer son esprit d’équipe'
      },
      {
        id: '2c9e4b77-6a1f-4d55-8b3c-7e2d1a9f4c22',
        title: 'Renforcer sa communication orale'
      }
    ]
  }
]

const commonMockedDeclaredActivityProps = {
  id: 'declared-activity-1',
  activity: {
    id: 'activity-1',
    title: 'Activité “Connaissance de soi” : Définir ses valeurs',
    summary: 'Activité faisant partie de la catégorie Connaissance de soi. Activité au cours de laquelle l’étudiant.e détermine des valeurs auxquelles il/elle est attaché.e et réfléchit à la façon dont ces valeurs s’incarnent dans ses comportements et ses pratiques quotidiennes. Cette activité constitue un préalable aux activités axées sur le projet de vie.',
    executionPeriodInfo: '- À réaliser en amont d’un entretien avec un.e conseiller/conseillère ou chargé.e d’orientation et/ou d’insertion professionnelle\n- avant une autre activité si parcours d’activités Cofolio',
  },
  reflection: `<h1>Mes valeurs</h1><p>Je me rends compte que mes valeurs sont :</p><ul><li><p><strong>autonomie</strong></p></li><li><p><strong>créativité</strong></p></li><li><p><strong>impact social</strong></p></li></ul><p>Je vois que je les incarne dans</p><ol><li><p><em>engagement associatif</em></p></li><li><p><em>projets personnels</em></p></li><li><p><em>choix de stage l'été dernier</em></p></li></ol><p></p>`,
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

export const mockedDeclaredActivity: DeclaredActivity = {
  ...commonMockedDeclaredActivityProps,
  activity: {
    ...commonMockedDeclaredActivityProps.activity,
    thematic: ActivityThematic.ABOUT_ME,
  },
  hasStarted: true,
  status: DeclaredActivityStatus.IN_PROGRESS
}

export const mockedDeclaredActivityDetails: DeclaredActivityDetailsDTO = {
  ...commonMockedDeclaredActivityProps,
  activity: {
    ...commonMockedDeclaredActivityProps.activity,
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  status: EDeclaredActivityStatus.IN_PROGRESS,
  finishedAt: '',
}

export function createMockedTraceAssociations (traceCount: number): DeclaredActivityTraceAssociationDTO[] {
  const traceAssociations: DeclaredActivityTraceAssociationDTO[] = []

  for (let i = 1; i <= traceCount; i++) {
    traceAssociations.push({
      associationId: `association-${i}`,
      trace: {
        traceId: `trace-${i}`,
        title: `Trace #${i} associée à l’activité`,
        skillCount: (i * 2) % 5,
        AMSCount: i % 3,
        programName: `Programme de la trace #${i} associée`,
        isGroup: i % 2 === 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    })
  }

  return traceAssociations
}

export const mockedDeclaredActivityAssociations: DeclaredActivityAssociationsDTO = {
  traceAssociations: createMockedTraceAssociations(6)
}

// TODO: changes this to activities returned by seeder in dev
export const mockedDeclaredActivityViewDTO: DeclaredActivityViewDTO = {
  id: 'declared-activity-1',
  activityId: 'declared-activity-1',
  title: 'Activité "Connaissance de soi" : Définir ses valeurs',
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  status: EDeclaredActivityStatus.IN_PROGRESS,
  summary: 'Activité faisant partie de la catégorie Connaissance de soi. Activité au cours de laquelle l\'étudiant.e détermine des valeurs auxquelles il/elle est attaché.e et réfléchit à la façon dont ces valeurs s\'incarnent dans ses comportements et ses pratiques quotidiennes.',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-06-30T00:00:00Z',
}

const allDeclaredActivities: DeclaredActivityViewDTO[] = [
  mockedDeclaredActivityViewDTO,
  {
    id: 'declared-activity-2',
    activityId: 'declared-activity-2',
    title: 'Activité "CV" : Construire son parcours',
    thematic: EActivityThematic.RESUMES,
    status: EDeclaredActivityStatus.SUBSCRIBED,
    summary: 'Activité permettant à l\'étudiant.e de construire et de valoriser son parcours académique et professionnel.',
  },
  {
    id: 'declared-activity-3',
    activityId: 'declared-activity-3',
    title: 'Activité "Trajectoires" : Explorer ses voies',
    thematic: EActivityThematic.TRAJECTORIES,
    status: EDeclaredActivityStatus.COMPLETED,
    summary: 'Activité au cours de laquelle l\'étudiant.e explore différentes voies professionnelles et académiques.',
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2024-01-31T00:00:00Z',
  },
  {
    id: 'declared-activity-4',
    activityId: 'declared-activity-4',
    title: 'Activité "Expériences" : Valoriser ses expériences',
    thematic: EActivityThematic.EXPERIENCES,
    status: EDeclaredActivityStatus.IN_PROGRESS,
    summary: 'Activité permettant à l\'étudiant.e de valoriser ses expériences personnelles et professionnelles.',
    startDate: '2024-02-01T00:00:00Z',
  },
  {
    id: 'declared-activity-5',
    activityId: 'declared-activity-5',
    title: 'Activité "Trajectoires" : Construire son projet professionnel',
    thematic: EActivityThematic.TRAJECTORIES,
    status: EDeclaredActivityStatus.SUBSCRIBED,
    summary: 'Activité guidant l\'étudiant.e dans la construction d\'un projet professionnel cohérent avec ses aspirations.',
  },
  {
    id: 'declared-activity-6',
    activityId: 'declared-activity-6',
    title: 'Activité "Connaissance de soi" : Identifier ses compétences',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    status: EDeclaredActivityStatus.COMPLETED,
    summary: 'Activité permettant à l\'étudiant.e d\'identifier et de nommer ses compétences acquises.',
    startDate: '2023-11-01T00:00:00Z',
    endDate: '2024-03-31T00:00:00Z',
  },
]

export function createMockedDeclaredActivity (id: string): DeclaredActivity {
  const selectedActivity = allDeclaredActivities.find(activity => activity.id === id)

  if (!selectedActivity) {
    return {
      ...mockedDeclaredActivity,
      id,
    }
  }

  const statusMap: Record<EDeclaredActivityStatus, DeclaredActivityStatus> = {
    [EDeclaredActivityStatus.SUBSCRIBED]: DeclaredActivityStatus.SUBSCRIBED,
    [EDeclaredActivityStatus.IN_PROGRESS]: DeclaredActivityStatus.IN_PROGRESS,
    [EDeclaredActivityStatus.COMPLETED]: DeclaredActivityStatus.COMPLETED,
  }

  return {
    ...mockedDeclaredActivity,
    id: selectedActivity.id,
    activity: {
      ...mockedDeclaredActivity.activity,
      id: selectedActivity.activityId,
      title: selectedActivity.title,
      summary: selectedActivity.summary,
    },
    startDate: selectedActivity.startDate ?? mockedDeclaredActivity.startDate,
    endDate: selectedActivity.endDate ?? mockedDeclaredActivity.endDate,
    status: statusMap[selectedActivity.status],
    hasStarted: selectedActivity.status !== EDeclaredActivityStatus.SUBSCRIBED,
  }
}

export function createMockedPagedResponseDeclaredActivityViewDTO (
  pageSize: number,
  totalElements: number,
  page: number
): PagedResponseDeclaredActivityViewDTO {
  const actualTotalElements = Math.min(totalElements, allDeclaredActivities.length)
  const start = page * pageSize
  const end = start + pageSize
  const paginatedActivities = allDeclaredActivities.slice(start, end)
  const totalPages = Math.ceil(actualTotalElements / pageSize)

  return {
    data: paginatedActivities,
    page: { pageSize, totalElements: actualTotalElements, totalPages, page }
  }
}

const allDeclaredActivitiesLarge: DeclaredActivityViewDTO[] = []
for (let i = 0; i < 10; i++) {
  allDeclaredActivitiesLarge.push(...allDeclaredActivities.map(activity => ({
    ...activity,
    id: `${activity.id}-${i + 1}`,
    activityId: `${activity.activityId}-${i + 1}`,
    title: `${activity.title} (${i + 1})`
  })))
}

export function createLargeMockedPagedResponseDeclaredActivityViewDTO (
  pageSize: number,
  page: number
): PagedResponseDeclaredActivityViewDTO {
  const start = page * pageSize
  const end = start + pageSize
  const paginatedActivities = allDeclaredActivitiesLarge.slice(start, end)
  const totalPages = Math.ceil(allDeclaredActivitiesLarge.length / pageSize)

  return {
    data: paginatedActivities,
    page: { pageSize, totalElements: allDeclaredActivitiesLarge.length, totalPages, page }
  }
}

export const mockedActivityDetail: ActivityDetailDTO = {
  id: 'activity-1',
  title: 'Activité “Connaissance de soi” : Définir ses valeurs',
  banner: {
    fileId: 'activity-1-banner',
    url: 'https://cdn.welcometothejungle.co/uploads/article/social_image/3009/159196/large_jaredd-craig-HH4WBGNyltc-unsplash.jpg',
    fileName: 'Image de l’activité Connaissance de soi - Définir ses valeurs'
  },
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  summary: 'Activité faisant partie de la catégorie Connaissance de soi. Activité au cours de laquelle l’étudiant.e détermine des valeurs auxquelles il/elle est attaché.e et réfléchit à la façon dont ces valeurs s’incarnent dans ses comportements et ses pratiques quotidiennes. Cette activité constitue un préalable aux activités axées sur le projet de vie.',
  executionPeriodInfo: '- À réaliser en amont d’un entretien avec un.e conseiller/conseillère ou chargé.e d’orientation et/ou d’insertion professionnelle\n- avant une autre activité si parcours d’activités Cofolio',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

export const mockedSubscribedActivityDetail: ActivityDetailDTO = { ...mockedActivityDetail, subscribedDeclaredActivity: 'cf31aa91-1ac4-4e6d-9ce4-477410966fe7' }

export const mockedFinishedDeclaredActivityDetails: DeclaredActivityDetailsDTO = {
  ...mockedDeclaredActivityDetails,
  status: EDeclaredActivityStatus.COMPLETED,
  finishedAt: '2026-01-01T00:00:00Z',
}

export function createMockedDeclaredActivityDetails (id: string): DeclaredActivityDetailsDTO {
  const declaredActivity = createMockedDeclaredActivity(id)

  const activity = declaredActivity.activity ?? mockedDeclaredActivity.activity!

  const mappedStatus: EDeclaredActivityStatus
    = declaredActivity.status === DeclaredActivityStatus.COMPLETED
      ? EDeclaredActivityStatus.COMPLETED
      : declaredActivity.status === DeclaredActivityStatus.SUBSCRIBED
        ? EDeclaredActivityStatus.SUBSCRIBED
        : EDeclaredActivityStatus.IN_PROGRESS

  return {
    ...mockedDeclaredActivityDetails,
    id: declaredActivity.id ?? id,
    activity: {
      ...mockedDeclaredActivityDetails.activity,
      id: activity.id ?? mockedDeclaredActivityDetails.activity.id,
      title: activity.title ?? mockedDeclaredActivityDetails.activity.title,
      summary: activity.summary ?? mockedDeclaredActivityDetails.activity.summary,
      executionPeriodInfo: activity.executionPeriodInfo ?? mockedDeclaredActivityDetails.activity.executionPeriodInfo,
      createdAt: activity.createdAt ?? mockedDeclaredActivityDetails.activity.createdAt,
      updatedAt: activity.updatedAt ?? mockedDeclaredActivityDetails.activity.updatedAt,
    },
    status: mappedStatus,
    startDate: declaredActivity.startDate?.slice(0, 10) ?? '',
    endDate: declaredActivity.endDate?.slice(0, 10) ?? '',
    createdAt: declaredActivity.createdAt ?? mockedDeclaredActivityDetails.createdAt,
    updatedAt: declaredActivity.updatedAt ?? mockedDeclaredActivityDetails.updatedAt,
    finishedAt: mappedStatus === EDeclaredActivityStatus.COMPLETED
      ? mockedFinishedDeclaredActivityDetails.finishedAt
      : '',
    reflection: declaredActivity.reflection ?? mockedDeclaredActivityDetails.reflection,
  }
}
