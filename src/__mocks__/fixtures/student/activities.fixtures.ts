import { createMockedDeclaredActivityAssociations } from '@/__mocks__/fixtures/student/declaredSkills.fixtures'
import {
  type ActivityNavigationDTO,
  type ActivityPresentationDTO,
  type DeclaredActivityAssociationsDTO,
  type DeclaredActivityDetailsDTO,
  type DeclaredActivityViewDTO,
  EActivityThematic,
  EDeclaredActivityStatus,
  EFeedbackStatus,
  EFileType,
  ETraceAuthorType,
  type PagedResponseAssociationSearchResultDeclaredActivityDTO,
  type PagedResponseDeclaredActivityViewDTO,
  type TraceAssociationDTO
} from '@/api/avenir-esr'
import { ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities'

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
        title: 'Identifier ses centres d\'intérêt'
      }
    ]
  },
  {
    title: 'FUTURE_PLANS',
    items: [
      {
        id: 'c1e8b9a7-2d55-4f1a-8b5f-3c7e4a9d6f20',
        title: 'Explorer ses pistes d\'orientation'
      },
      {
        id: '7b3d4e91-6f2a-4c88-9a1e-5d3f7b2c8e44',
        title: 'Formuler un projet professionnel provisoire'
      },
      {
        id: '5e2c9f41-8b7d-4a10-9c6a-3f1e7b2d4c55',
        title: 'Explorer les métiers d\'un secteur'
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
        title: 'Renforcer sa capacité d\'adaptation'
      },
      {
        id: '5f2a7c91-8d4e-4b22-9a6c-3e1f7d2b4c99',
        title: 'Développer son esprit d\'équipe'
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
    id: '2d6a9b4f-7c3e-4a11-8f5b-6e2c9d7a3b12',
    title: 'Activité “Connaissance de soi” : Définir ses valeurs',
    summary: 'Activité faisant partie de la catégorie Connaissance de soi. Activité au cours de laquelle l\'étudiant.e détermine des valeurs auxquelles il/elle est attaché.e et réfléchit à la façon dont ces valeurs s\'incarnent dans ses comportements et ses pratiques quotidiennes. Cette activité constitue un préalable aux activités axées sur le projet de vie.',
    description: '<h3>Objectifs de l\'activité</h3><ul><li><p>Permettre à l\'étudiant.e de déterminer des valeurs auxquelles il/elle est attaché.e</p></li><li><p>Encourager l\'étudiant.e à réfléchir à la façon dont ces valeurs s\'incarnent dans ses comportements et ses pratiques quotidiennes</p></li></ul><h3>Contenu de l\'activité</h3><p>L\'activité se compose de plusieurs étapes :</p><ol><li><p>Identification des valeurs personnelles clés</p></li><li><p>Réflexion sur la manière dont ces valeurs s\'incarnent dans les comportements et les pratiques quotidiens</p></li><li><p>Mise en perspective de ces valeurs avec le projet de vie envisagé</p></li></ol>',
    executionPeriodInfo: '- À réaliser en amont d\'un entretien avec un.e conseiller/conseillère ou chargé.e d\'orientation et/ou d\'insertion professionnelle\n- avant une autre activité si parcours d\'activités Cofolio',
  },
  reflection: `<h1>Mes valeurs</h1><p>Je me rends compte que mes valeurs sont :</p><ul><li><p><strong>autonomie</strong></p></li><li><p><strong>créativité</strong></p></li><li><p><strong>impact social</strong></p></li></ul><p>Je vois que je les incarne dans</p><ol><li><p><em>engagement associatif</em></p></li><li><p><em>projets personnels</em></p></li><li><p><em>choix de stage l'été dernier</em></p></li></ol><p></p>`,
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

export const mockedDeclaredActivityDetails: DeclaredActivityDetailsDTO = {
  ...commonMockedDeclaredActivityProps,
  activity: {
    ...commonMockedDeclaredActivityProps.activity,
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    enableReflection: true,
    traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
    feedbackAllowedIterations: ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  status: EDeclaredActivityStatus.IN_PROGRESS,
  finishedAt: '',
}

// TODO: changes this to activities returned by seeder in dev
export const mockedDeclaredActivityViewDTO: DeclaredActivityViewDTO = {
  id: 'declared-activity-1',
  activityId: '2d6a9b4f-7c3e-4a11-8f5b-6e2c9d7a3b12',
  title: 'Activité "Connaissance de soi" : Définir ses valeurs',
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  status: EDeclaredActivityStatus.IN_PROGRESS,
  summary: 'Activité faisant partie de la catégorie Connaissance de soi. Activité au cours de laquelle l\'étudiant.e détermine des valeurs auxquelles il/elle est attaché.e et réfléchit à la façon dont ces valeurs s\'incarnent dans ses comportements et ses pratiques quotidiennes.',
  description: '<h3>Objectifs de l\'activité</h3><ul><li><p>Permettre à l\'étudiant.e de déterminer des valeurs auxquelles il/elle est attaché.e</p></li><li><p>Encourager l\'étudiant.e à réfléchir à la façon dont ces valeurs s\'incarnent dans ses comportements et ses pratiques quotidiennes</p></li></ul><h3>Contenu de l\'activité</h3><p>L\'activité se compose de plusieurs étapes :</p><ol><li><p>Identification des valeurs personnelles clés</p></li><li><p>Réflexion sur la manière dont ces valeurs s\'incarnent dans les comportements et les pratiques quotidiens</p></li><li><p>Mise en perspective de ces valeurs avec le projet de vie envisagé</p></li></ol>',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-06-30T00:00:00Z',
}

const allDeclaredActivities: DeclaredActivityViewDTO[] = [
  mockedDeclaredActivityViewDTO,
  {
    id: 'DECLARED_ACTIVITY_WITH_NO_ASSOCIATIONS',
    activityId: 'DECLARED_ACTIVITY_WITH_NO_ASSOCIATIONS',
    title: 'Activité "CV" : Construire son parcours',
    thematic: EActivityThematic.RESUMES,
    status: EDeclaredActivityStatus.SUBSCRIBED,
    summary: 'Activité permettant à l\'étudiant.e de construire et de valoriser son parcours académique et professionnel.',
    description: '<h3>Objectifs de l\'activité</h3><ul><li><p>Permettre à l\'étudiant.e de construire un CV structuré et valorisant</p></li><li><p>Guider l\'étudiant.e dans la valorisation de son parcours académique et professionnel</p></li></ul><h3>Contenu de l\'activité</h3><p>L\'activité se compose de plusieurs étapes :</p><ol><li><p>Identification des expériences et compétences clés à valoriser</p></li><li><p>Structuration du CV en fonction du projet professionnel</p></li><li><p>Rédaction de descriptions impactantes pour chaque expérience</p></li><li><p>Conseils pour adapter le CV à différentes offres d\'emploi ou de stage</p></li></ol>',
  },
  {
    id: 'declared-activity-2',
    activityId: 'declared-activity-2',
    title: 'Activité : Construire son parcours (soumise)',
    thematic: EActivityThematic.RESUMES,
    status: EDeclaredActivityStatus.SUBMITTED,
    summary: 'Activité permettant à l\'étudiant.e de construire et de valoriser son parcours académique et professionnel.',
    description: '<h3>Objectifs de l\'activité</h3><ul><li><p>Permettre à l\'étudiant.e de construire un CV structuré et valorisant</p></li><li><p>Guider l\'étudiant.e dans la valorisation de son parcours académique et professionnel</p></li></ul><h3>Contenu de l\'activité</h3><p>L\'activité se compose de plusieurs étapes :</p><ol><li><p>Identification des expériences et compétences clés à valoriser</p></li><li><p>Structuration du CV en fonction du projet professionnel</p></li><li><p>Rédaction de descriptions impactantes pour chaque expérience</p></li><li><p>Conseils pour adapter le CV à différentes offres d\'emploi ou de stage</p></li></ol>',
  },
  {
    id: 'declared-activity-3',
    activityId: 'declared-activity-3',
    title: 'Activité "Trajectoires" : Explorer ses voies',
    thematic: EActivityThematic.TRAJECTORIES,
    status: EDeclaredActivityStatus.COMPLETED,
    summary: 'Activité au cours de laquelle l\'étudiant.e explore différentes voies professionnelles et académiques.',
    description: '<h3>Objectifs de l\'activité</h3><ul><li><p>Permettre à l\'étudiant.e d\'explorer différentes voies professionnelles et académiques</p></li></ul><h3>Contenu de l\'activité</h3><p>L\'activité se compose de plusieurs étapes :</p><ol><li><p>Identification des voies professionnelles et académiques possibles</p></li><li><p>Analyse des compétences et intérêts personnels</p></li><li><p>Évaluation des options et choix d\'une voie</p></li></ol>',
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
    description: '<h3>Objectifs de l\'activité</h3><ul><li><p>Permettre à l\'étudiant.e de valoriser ses expériences personnelles et professionnelles</p></li></ul><h3>Contenu de l\'activité</h3><p>L\'activité se compose de plusieurs étapes :</p><ol><li><p>Identification des expériences et compétences clés à valoriser</p></li><li><p>Structuration des expériences en fonction du projet professionnel</p></li><li><p>Rédaction de descriptions impactantes pour chaque expérience</p></li><li><p>Conseils pour adapter les expériences à différentes offres d\'emploi ou de stage</p></li></ol>',
    startDate: '2024-02-01T00:00:00Z',
  },
  {
    id: 'declared-activity-5',
    activityId: 'declared-activity-5',
    title: 'Activité "Trajectoires" : Construire son projet professionnel',
    thematic: EActivityThematic.TRAJECTORIES,
    status: EDeclaredActivityStatus.SUBSCRIBED,
    summary: 'Activité guidant l\'étudiant.e dans la construction d\'un projet professionnel cohérent avec ses aspirations.',
    description: '<h3>Objectifs de l\'activité</h3><ul><li><p>Guider l\'étudiant.e dans la construction d\'un projet professionnel cohérent avec ses aspirations</p></li></ul><h3>Contenu de l\'activité</h3><p>L\'activité se compose de plusieurs étapes :</p><ol><li><p>Identification des aspirations professionnelles et personnelles</p></li><li><p>Exploration des options professionnelles possibles</p></li><li><p>Évaluation de la cohérence entre les aspirations et les options</p></li><li><p>Construction d\'un projet professionnel provisoire</p></li></ol>',
  },
  {
    id: 'declared-activity-6',
    activityId: 'declared-activity-6',
    title: 'Activité "Connaissance de soi" : Identifier ses compétences',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    status: EDeclaredActivityStatus.COMPLETED,
    summary: 'Activité permettant à l\'étudiant.e d\'identifier et de nommer ses compétences acquises.',
    description: '<h3>Objectifs de l\'activité</h3><ul><li><p>Permettre à l\'étudiant.e d\'identifier et de nommer ses compétences acquises</p></li></ul><h3>Contenu de l\'activité</h3><p>L\'activité se compose de plusieurs étapes :</p><ol><li><p>Identification des expériences significatives</p></li><li><p>Analyse des compétences mobilisées dans ces expériences</p></li><li><p>Nomination des compétences identifiées</p></li><li><p>Valorisation des compétences dans le projet professionnel</p></li></ol>',
    startDate: '2023-11-01T00:00:00Z',
    endDate: '2024-03-31T00:00:00Z',
  },
]

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

export const mockedActivityDetail: ActivityPresentationDTO = {
  id: 'activity-1',
  title: 'Activité “Connaissance de soi” : Définir ses valeurs',
  banner: {
    id: 'activity-1-banner',
    url: 'https://cdn.welcometothejungle.co/uploads/article/social_image/3009/159196/large_jaredd-craig-HH4WBGNyltc-unsplash.jpg',
    fileName: 'Image de l\'activité Connaissance de soi - Définir ses valeurs',
    fileSize: 1000,
    fileType: EFileType.PNG,
    uploadedAt: '2025-06-13T08:42:17',
  },
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  summary: 'Activité faisant partie de la catégorie Connaissance de soi. Activité au cours de laquelle l\'étudiant.e détermine des valeurs auxquelles il/elle est attaché.e et réfléchit à la façon dont ces valeurs s\'incarnent dans ses comportements et ses pratiques quotidiennes. Cette activité constitue un préalable aux activités axées sur le projet de vie.',
  description: '<h3>Objectifs de l\'activité</h3><ul><li><p>Permettre à l\'étudiant.e de déterminer des valeurs auxquelles il/elle est attaché.e</p></li><li><p>Encourager l\'étudiant.e à réfléchir à la façon dont ces valeurs s\'incarnent dans ses comportements et ses pratiques quotidiennes</p></li></ul><h3>Contenu de l\'activité</h3><p>L\'activité se compose de plusieurs étapes :</p><ol><li><p>Identification des valeurs personnelles clés</p></li><li><p>Réflexion sur la manière dont ces valeurs s\'incarnent dans les comportements et les pratiques quotidiens</p></li><li><p>Mise en perspective de ces valeurs avec le projet de vie envisagé</p></li></ol>',
  executionPeriodInfo: '- À réaliser en amont d\'un entretien avec un.e conseiller/conseillère ou chargé.e d\'orientation et/ou d\'insertion professionnelle\n- avant une autre activité si parcours d\'activités Cofolio',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

export const mockedSubscribedActivityDetail: ActivityPresentationDTO = { ...mockedActivityDetail, subscribedDeclaredActivity: 'cf31aa91-1ac4-4e6d-9ce4-477410966fe7' }

export const mockedFinishedDeclaredActivityDetails: DeclaredActivityDetailsDTO = {
  ...mockedDeclaredActivityDetails,
  status: EDeclaredActivityStatus.COMPLETED,
  finishedAt: '2026-01-01T00:00:00Z',
}

export function createMockedDeclaredActivityDetails (id: string, options?: { withFeedback?: boolean }): DeclaredActivityDetailsDTO {
  const selectedActivity = allDeclaredActivities.find(activity => activity.id === id)

  const activity = selectedActivity
    ? {
        ...selectedActivity,
        executionPeriodInfo: mockedDeclaredActivityDetails.activity.executionPeriodInfo,
        createdAt: mockedDeclaredActivityDetails.activity.createdAt,

      }
    : {
        ...mockedDeclaredActivityDetails.activity!,
        status: mockedDeclaredActivityDetails.status,
      }

  return {
    ...activity,
    id: activity.id ?? id,
    activity: {
      ...mockedDeclaredActivityDetails.activity,
      id: activity.id ?? mockedDeclaredActivityDetails.activity.id,
      title: activity.title ?? mockedDeclaredActivityDetails.activity.title,
      summary: activity.summary ?? mockedDeclaredActivityDetails.activity.summary,
      enableReflection: true,
      executionPeriodInfo: activity.executionPeriodInfo ?? mockedDeclaredActivityDetails.activity.executionPeriodInfo,
      traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
      feedbackAllowedIterations: ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT,
      createdAt: activity.createdAt ?? mockedDeclaredActivityDetails.activity.createdAt,
      updatedAt: activity.updatedAt ?? mockedDeclaredActivityDetails.activity.updatedAt,
    },
    endDate: mockedDeclaredActivityDetails.endDate?.slice(0, 10) ?? '',
    createdAt: mockedDeclaredActivityDetails.createdAt,
    updatedAt: mockedDeclaredActivityDetails.updatedAt,
    finishedAt: activity.status === EDeclaredActivityStatus.COMPLETED
      ? mockedFinishedDeclaredActivityDetails.finishedAt
      : '',
    reflection: mockedDeclaredActivityDetails.reflection,
    feedbacks: options?.withFeedback
      ? [{
          id: 'feedback-new-1',
          status: EFeedbackStatus.NEW,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-16T10:00:00Z',
          staff: { id: 'staff-1', firstName: 'Marc', lastName: 'Dupont', email: 'marc.dupont@university.com' },
          student: { id: 'student-1', firstName: 'Lucas', lastName: 'Tessier', email: 'lucas.tessier@university.com' },
        }]
      : undefined,
  }
}

export function createMockedTraceAssociations (
  traceCount: number,
  idsToAssociate?: string[]
): TraceAssociationDTO[] {
  const traceAssociations: TraceAssociationDTO[] = []

  for (let i = 1; i <= traceCount; i++) {
    traceAssociations.push({
      associationId: `association-${i}`,
      trace: {
        id: idsToAssociate?.[i - 1] ?? `trace-${i}`,
        title: `Trace #${i} associée à l\'activité`,
        programName: `Programme de la trace #${i} associée`,
        authorType: i % 2 === 0 ? ETraceAuthorType.COLLECTIVE : ETraceAuthorType.PERSONAL,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    })
  }

  return traceAssociations
}

export const mockedDeclaredActivityAssociations: DeclaredActivityAssociationsDTO = {
  traceAssociations: createMockedTraceAssociations(6),
  declaredSkillAssociations: createMockedDeclaredActivityAssociations(3)
}

export function createMockedDeclaredActivityAssociationsDTO (
  idsToAssociate: string[]
): DeclaredActivityAssociationsDTO {
  return {
    traceAssociations: createMockedTraceAssociations(idsToAssociate.length - 1, idsToAssociate),
    declaredSkillAssociations: createMockedDeclaredActivityAssociations(1)
  }
}

export function createMockedPagedResponseAssociationSearchResultDeclaredActivityDTO (
  pageSize: number,
  page: number,
  keyword = ''
): PagedResponseAssociationSearchResultDeclaredActivityDTO {
  const normalizedKeyword = keyword.toLowerCase()

  const filteredActivities = allDeclaredActivities.filter(activity =>
    normalizedKeyword.length === 0
    || activity.title.toLowerCase().includes(normalizedKeyword)
  )

  const start = page * pageSize
  const end = start + pageSize
  const paginatedActivities = filteredActivities.slice(start, end)
  const totalPages = Math.ceil(filteredActivities.length / pageSize)

  return {
    data: paginatedActivities.map(activity => ({
      id: activity.id,
      title: activity.title,
      thematic: activity.thematic,
      disabled: false,
      summary: activity.summary,
      executionPeriodInfoSummary: 'Execution period info',
      status: activity.status,
      startDate: activity.startDate,
      endDate: activity.endDate,
      updatedAt: '2026-01-01T00:00:00Z'
    })),
    page: {
      pageSize,
      totalElements: filteredActivities.length,
      totalPages,
      page
    }
  }
}
