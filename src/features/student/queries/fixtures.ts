import {
  AmsStatus,
  type AmsViewDTO,
  type AmsViewResponse,
  type ProgramProgressOverviewDTO,
  type ProgramProgressViewDTO,
  SkillLevelStatus,
  type TraceConfigurationInfo,
  TraceStatus,
  type TracesViewResponse,
  type TraceViewDTO,
  type UnassociatedTracesSummaryDTO
} from '@/api/avenir-esr'

export const mockedAmss: AmsViewDTO[] = [
  {
    id: 'ams1',
    title: 'Stage 2.1 SMB CHIMIOTEK, réalisation d’un audit environnemental et proposition d’un plan d’amélioration des performances d’un procédé...',
    countSkills: 2,
    countTraces: 3,
    status: AmsStatus.IN_PROGRESS,
    progress: {
      startedActivities: 2,
      totalActivities: 4
    }
  },
  {
    id: 'ams2',
    title: 'Stage 2.1 SMB CHIMIOTEK, Optimisation d’un procédé industriel pour réduire la production de déchets à la source',
    countSkills: 2,
    countTraces: 3,
    status: AmsStatus.SUBMITTED,
    progress: {
      startedActivities: 1,
      totalActivities: 1
    }
  },
  {
    id: 'ams3',
    title: 'AMS SAP 4.1 Conception d’un solvant écologique pour une application industrielle',
    countSkills: 2,
    countTraces: 3,
    status: AmsStatus.NOT_STARTED,
    progress: {
      startedActivities: 0,
      totalActivities: 0
    }
  },
  {
    id: 'ams4',
    title: 'SAE 1.1 Réaliser l’audit environnemental d’un procédé de synthèse chimique',
    countSkills: 1,
    countTraces: 4,
    status: AmsStatus.COMPLETED,
    progress: {
      startedActivities: 3,
      totalActivities: 3
    }
  }
]

export const mockedCourses: ProgramProgressOverviewDTO[] = [
  {
    id: 'course-2',
    name: 'Master Électronique Énergie électrique et automatique - Spécialité Ingénierie des systèmes temps réel',
    skills: [
      {
        id: 'skill-2-2',
        name: 'Comprendre les risques électriques liés au travail en hauteur, en milieu humide, en point chaud et appréhender la consignation',
        traceCount: 6,
        activityCount: 3,
        currentSkillLevel: { id: 'lvl-2-2-3', name: 'Niveau 3', status: SkillLevelStatus.TO_BE_EVALUATED }
      },
      {
        id: 'skill-2-4',
        name: 'Réaliser un cahier des charges fonctionnels',
        traceCount: 8,
        activityCount: 1,
        currentSkillLevel: { id: 'lvl-2-4-3', name: 'Niveau 3', status: SkillLevelStatus.TO_BE_EVALUATED },
      },
      {
        id: 'skill-2-1',
        name: 'Réaliser un circuit électrique',
        traceCount: 5,
        activityCount: 4,
        currentSkillLevel: { id: 'lvl-2-1-4', name: 'Niveau 4', status: SkillLevelStatus.UNDER_REVIEW }
      },
      {
        id: 'skill-2-3',
        name: 'Réaliser une étude de marché',
        traceCount: 7,
        activityCount: 2,
        currentSkillLevel: { id: 'lvl-2-3-1', name: 'Niveau 1', status: SkillLevelStatus.UNDER_REVIEW },
      },
    ],
  },
  {
    id: 'course-1',
    name: 'Master Chimie Verte et Éco-innovations',
    skills: [
      {
        id: 'skill-1-4',
        name: 'Concevoir des synthèses chimiques durables',
        traceCount: 4,
        activityCount: 5,
        currentSkillLevel: { id: 'lvl-1-4-3', name: 'Niveau 3', status: SkillLevelStatus.TO_BE_EVALUATED },
      },
      {
        id: 'skill-1-3',
        name: 'Évaluer l’impact environnemental et économique',
        traceCount: 3,
        activityCount: 6,
        currentSkillLevel: { id: 'lvl-1-3-2', name: 'Niveau 2', status: SkillLevelStatus.UNDER_REVIEW },
      },
      {
        id: 'skill-1-2',
        name: 'Mettre en place des filières d’économies circulaires',
        traceCount: 2,
        activityCount: 7,
        currentSkillLevel: { id: 'lvl-1-2-1', name: 'Niveau 1', status: SkillLevelStatus.NOT_STARTED },
      },
      {
        id: 'skill-1-1',
        name: 'Prévenir la pollution à la source',
        traceCount: 1,
        activityCount: 8,
        currentSkillLevel: { id: 'lvl-1-1-2', name: 'Niveau 2', status: SkillLevelStatus.UNDER_REVIEW },
      },
    ],
  },
]

export const mockedPrograms: ProgramProgressViewDTO[] = mockedCourses.map(course => ({
  id: `program-${course.id}`,
  name: course.name,
  skills: [...course.skills].map((skill) => {
    const currentLevel = skill.currentSkillLevel

    const levelCount = {
      'skill-1-1': 5,
      'skill-1-2': 4,
      'skill-1-3': 3,
      'skill-1-4': 3,
      'skill-2-1': 4,
      'skill-2-2': 5,
      'skill-2-3': 1,
      'skill-2-4': 3,
    }[skill.id] ?? 3

    const shortDescription = {
      'skill-1-1': 'Analyser et optimiser les procédés pour prévenir la pollution à la source',
      'skill-1-2': 'Structurer et déployer des boucles de réutilisation et de valorisation des ressources',
      'skill-1-3': 'Mesurer les effets écologiques et économiques d’un procédé ou d’un produit',
      'skill-1-4': 'Développer des voies de synthèse respectueuses de l’environnement et efficaces',
      'skill-2-1': 'Concevoir et assembler un circuit en respectant les contraintes techniques et de sécurité',
      'skill-2-2': 'Identifier les dangers électriques spécifiques et appliquer les procédures de consignation',
      'skill-2-3': 'Analyser les besoins clients et la concurrence pour orienter une offre technique',
      'skill-2-4': 'Formuler précisément les besoins utilisateurs et les traduire en exigences techniques',
    }[skill.id] ?? `Description courte de ${currentLevel.name}`

    return {
      id: skill.id,
      name: skill.name,
      traceCount: skill.traceCount,
      activityCount: skill.activityCount,
      levelCount,
      currentSkillLevel: {
        ...currentLevel,
        shortDescription,
      },
    }
  }),
}))

function getRandomAmsStatus (): AmsStatus {
  const statuses = Object.values(AmsStatus)
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

function getRandomAmsProgress (status: AmsStatus): AmsViewDTO['progress'] {
  const totalActivities = Math.floor(Math.random() * 5) + 3
  let startedActivities = totalActivities - 2
  if (status === AmsStatus.NOT_STARTED) {
    startedActivities = 0
  }
  else if (status === AmsStatus.COMPLETED) {
    startedActivities = totalActivities
  }
  return { startedActivities, totalActivities }
}

export function createMockedAmsViewResponse (pageSize: number, totalElements: number, number: number, programProgressId: string): AmsViewResponse {
  const mockedAmss: AmsViewDTO[] = []
  for (let i = 1; i <= totalElements; i++) {
    const randomStatus = getRandomAmsStatus()
    const ams = {
      id: crypto.randomUUID(),
      title: `Ma super activité de mise en situation ${i} - ${programProgressId}`,
      countSkills: Math.floor(Math.random() * 10),
      countTraces: Math.floor(Math.random() * 10),
      status: randomStatus,
      progress: getRandomAmsProgress(randomStatus)
    }
    mockedAmss.push(ams)
  }

  const start = number * pageSize
  const end = start + pageSize
  const paginatedAmss = mockedAmss.slice(start, end)
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data: paginatedAmss,
    page: { pageSize, totalElements, totalPages, number }
  }
}

export const mockedTracesConfiguration: TraceConfigurationInfo = {
  maxDayRemaining: 30,
  maxDayRemainingWarning: 15,
  maxDayRemainingCritical: 7,
}

export function createMockedTracesViewResponse (pageSize: number, totalElements: number, number: number): TracesViewResponse {
  const mockedTraces: TraceViewDTO[] = []
  for (let i = 1; i <= totalElements; i++) {
    const rawDay = (i % 28) + 1
    const dayNumber = rawDay < 10 ? `0${rawDay}` : `${rawDay}`
    const rand = Math.floor(Math.random() * 31) + 1
    const randomDayNumber = rand < 10 ? `0${rand}` : rand
    const trace = {
      id: `trace${i}`,
      title: `Ma super trace numéro ${i}`,
      status: TraceStatus.UNASSOCIATED,
      createdAt: `2025-06-${dayNumber}T10:42:00.000Z`,
      updatedAt: `2025-06-${dayNumber}T11:42:00.000Z`,
      deletionDate: `2026-07-${randomDayNumber}T10:42:00.000Z`
    }
    mockedTraces.push(trace)
  }

  const start = number * pageSize
  const end = start + pageSize
  const paginatedTraces = mockedTraces.slice(start, end)
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data: { traces: paginatedTraces },
    page: { pageSize, totalElements, totalPages, number }
  }
}

export const mockedUnassignedTracesSummary: UnassociatedTracesSummaryDTO = {
  total: 20,
  totalWarnings: 5,
  totalCriticals: 2,
}

export const createDeletedTraceIdMock = (traceId: string) => `${traceId}-deleted`
