import { SkillLevelStatus, type StudentProgressOverviewDTO, type StudentProgressViewDTO, TrainingPathDTODurationUnit } from '@/api/avenir-esr'

export const mockedProgramsProgressOverview: StudentProgressOverviewDTO[] = [
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

export const mockedProgramsProgressView: StudentProgressViewDTO[] = mockedProgramsProgressOverview.map(course => ({
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

export const mockedAllMyProgramsProgress = mockedProgramsProgressView.slice(0, 2).map(program => ({
  id: program.id,
  name: program.name,
  durationUnit: TrainingPathDTODurationUnit.YEAR,
  durationCount: 2
}))
