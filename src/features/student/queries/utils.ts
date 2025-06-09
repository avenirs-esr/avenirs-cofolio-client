import {
  type CourseOverviewDTO,
  LevelStatus,
} from '@/types'

export const mockedCourses: CourseOverviewDTO[] = [
  {
    id: 'course-2',
    name: 'Master Électronique Énergie électrique et automatique - Spécialité Ingénierie des systèmes temps réel',
    skills: [
      {
        id: 'skill-2-2',
        name: 'Comprendre les risques électriques liés au travail en hauteur, en milieu humide, en point chaud et appréhender la consignation',
        trackCount: 6,
        activityCount: 3,
        levels: [
          { id: 'lvl-2-2-3', name: 'Niveau 3', status: LevelStatus.TO_EVALUATE },
          { id: 'lvl-2-2-2', name: 'Niveau 2', status: LevelStatus.NOT_VALIDATED },
        ],
      },
      {
        id: 'skill-2-4',
        name: 'Réaliser un cahier des charges fonctionnels',
        trackCount: 8,
        activityCount: 1,
        levels: [
          { id: 'lvl-2-4-3', name: 'Niveau 3', status: LevelStatus.TO_EVALUATE },
          { id: 'lvl-2-4-2', name: 'Niveau 2', status: LevelStatus.VALIDATED },
        ],
      },
      {
        id: 'skill-2-1',
        name: 'Réaliser un circuit électrique',
        trackCount: 5,
        activityCount: 4,
        levels: [
          { id: 'lvl-2-1-4', name: 'Niveau 4', status: LevelStatus.UNDER_REVIEW },
          { id: 'lvl-2-1-3', name: 'Niveau 3', status: LevelStatus.VALIDATED },
        ],
      },
      {
        id: 'skill-2-3',
        name: 'Réaliser une étude de marché',
        trackCount: 7,
        activityCount: 2,
        levels: [
          { id: 'lvl-2-3-1', name: 'Niveau 1', status: LevelStatus.UNDER_REVIEW },
        ],
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
        trackCount: 4,
        activityCount: 5,
        levels: [
          { id: 'lvl-1-4-3', name: 'Niveau 3', status: LevelStatus.TO_EVALUATE },
          { id: 'lvl-1-4-2', name: 'Niveau 2', status: LevelStatus.VALIDATED },
        ],
      },
      {
        id: 'skill-1-3',
        name: 'Évaluer l’impact environnemental et économique',
        trackCount: 3,
        activityCount: 6,
        levels: [
          { id: 'lvl-1-3-2', name: 'Niveau 2', status: LevelStatus.UNDER_REVIEW },
          { id: 'lvl-1-3-1', name: 'Niveau 1', status: LevelStatus.VALIDATED },
        ],
      },
      {
        id: 'skill-1-2',
        name: 'Mettre en place des filières d’économies circulaires',
        trackCount: 2,
        activityCount: 7,
        levels: [
          { id: 'lvl-1-2-1', name: 'Niveau 1', status: LevelStatus.NOT_VALIDATED },
        ],
      },
      {
        id: 'skill-1-1',
        name: 'Prévenir la pollution à la source',
        trackCount: 1,
        activityCount: 8,
        levels: [
          { id: 'lvl-1-1-2', name: 'Niveau 2', status: LevelStatus.UNDER_REVIEW },
          { id: 'lvl-1-1-1', name: 'Niveau 1', status: LevelStatus.VALIDATED },
        ],
      },
    ],
  },
]
