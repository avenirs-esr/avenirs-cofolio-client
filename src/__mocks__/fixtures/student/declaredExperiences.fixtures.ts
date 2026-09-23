import {
  type DeclaredExperienceViewDTO,
  EExperienceType,
  ESortField,
  ESortOrder,
  type PagedResponseDeclaredExperienceViewDTO,
} from '@/api/avenir-esr'

export const declaredExperienceViewDTOFixture: DeclaredExperienceViewDTO = {
  id: 'declared-experience-123-456-789',
  title: 'Développeur Web Full Stack',
  experienceType: EExperienceType.PROFESSIONAL,
  organization: 'Tech Startup Paris',
  activitySector: 'Technologie de l\'information',
  location: 'Paris, France',
  description: 'Développement d\'applications web avec Vue.js et Node.js',
  sourceOfInformation: 'LinkedIn',
  summary: 'Expérience enrichissante en startup',
  externalLink: 'https://www.techstartup.fr',
  startDate: '2023-01',
  endDate: '2024-06',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  declaredExperienceAssociationCountDTO: {
    traceAssociationsCount: 3,
    declaredSkillAssociationsCount: 4
  }
}

export function createMockedDeclaredExperiences (count: number, withoutDescription = false): DeclaredExperienceViewDTO[] {
  const experiencesExample = [
    { title: 'Développeur Junior', experienceType: EExperienceType.PROFESSIONAL, location: 'La Poste', description: 'Développement et maintenance d\'applications internes en équipe agile.' },
    { title: 'Assistant Marketing', experienceType: EExperienceType.PROFESSIONAL, location: 'Les Subsistances, Lyon', description: 'Gestion des réseaux sociaux et création de supports de communication.' },
    { title: 'Bénévole Associatif', experienceType: EExperienceType.VOLUNTEER, location: 'La Poste', description: 'Distribution alimentaire hebdomadaire auprès des personnes en difficulté.' },
    { title: 'Contributeur Github', experienceType: EExperienceType.PERSONAL, location: 'Les Subsistances, Lyon', description: 'Contributions open source sur des projets Vue.js et TypeScript.' },
    { title: 'Conseiller Vendeur', experienceType: EExperienceType.PROFESSIONAL, location: 'Marseille, France', description: 'Accueil et conseil client en magasin, gestion des stocks.' }
  ]
  const experiences: DeclaredExperienceViewDTO[] = []

  for (let i = 1; i <= count; i++) {
    const experience = experiencesExample[i % 5]
    experiences.push({
      id: `declared-experience-${i}`,
      title: `${experience.title} - ${i}`,
      experienceType: experience.experienceType,
      organization: `Organization ${i}`,
      location: experience.location,
      description: withoutDescription ? undefined : experience.description,
      startDate: `2023-${String((i % 12) + 1).padStart(2, '0')}`,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      declaredExperienceAssociationCountDTO: {
        traceAssociationsCount: i % 4,
        declaredSkillAssociationsCount: i % 3
      }
    })
  }

  return experiences
}

export const mockedDeclaredExperiences: DeclaredExperienceViewDTO[] = createMockedDeclaredExperiences(60)

export function countMockedDeclaredExperiencesByType (type: EExperienceType): number {
  return mockedDeclaredExperiences.filter(experience => experience.experienceType === type).length
}

export function sortDeclaredExperiences (
  experiences: DeclaredExperienceViewDTO[],
  sortField: ESortField = ESortField.NAME,
  sortOrder: ESortOrder = ESortOrder.ASC
): DeclaredExperienceViewDTO[] {
  return [...experiences].sort((a, b) => {
    const comparison = sortField === ESortField.DATE
      ? (a.startDate ?? '').localeCompare(b.startDate ?? '')
      : a.title.localeCompare(b.title)

    return sortOrder === ESortOrder.DESC ? -comparison : comparison
  })
}

export function createMockedDeclaredExperiencesPagedResponse (
  pageSize: number,
  totalElements: number,
  page: number,
  typeFilter?: EExperienceType[],
  sortField: ESortField = ESortField.NAME,
  sortOrder: ESortOrder = ESortOrder.ASC
): PagedResponseDeclaredExperienceViewDTO {
  const filteredExperiences = mockedDeclaredExperiences
    .slice(0, totalElements)
    .filter(experience =>
      !typeFilter
      || typeFilter.length === 0
      || typeFilter.includes(experience.experienceType!))

  const sortedExperiences = sortDeclaredExperiences(filteredExperiences, sortField, sortOrder)

  const start = page * pageSize
  const end = start + pageSize
  const paginatedData = sortedExperiences.slice(start, end)

  return {
    data: paginatedData,
    page: {
      page,
      pageSize,
      totalElements: sortedExperiences.length,
      totalPages: Math.ceil(sortedExperiences.length / pageSize)
    }
  }
}

export function createMockedDeclaredExperienceViewDTO (experienceId: string): DeclaredExperienceViewDTO {
  return {
    id: experienceId,
    title: 'Développeur Web Full Stack',
    experienceType: EExperienceType.PROFESSIONAL,
    organization: 'Tech Startup Paris',
    activitySector: 'Technologie',
    location: 'La Poste',
    description: 'Développeur Fullstack au sein d\'une équipe agile, j\'ai piloté la conception d\'applications web robustes. Mon rôle consistait à bâtir des API performantes avec Java (Spring Boot) et à concevoir des interfaces utilisateur réactives et intuitives avec React.js. J\'ai assuré l\'intégration continue, la gestion de bases de données SQL et la maintenance corrective du parc applicatif.',
    sourceOfInformation: 'Eleve',
    summary: 'Cette mission a renforcé ma maîtrise de l\'écosystème Java/React, notamment sur la gestion d\'états complexes et la sécurisation des échanges (JWT). J\'ai livré 3 modules majeurs en respectant des délais serrés, tout en améliorant la performance frontend de 20%. Mon autonomie technique et ma capacité à vulgariser des enjeux complexes ont été des atouts clés pour la réussite du projet.',
    externalLink: 'https://spring.io/projects/spring-boot',
    startDate: '2023-01',
    endDate: '2024-06',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    declaredExperienceAssociationCountDTO: {
      traceAssociationsCount: 3,
      declaredSkillAssociationsCount: 4
    }
  }
}

export function searchDeclaredExperienceById (
  id: string
): DeclaredExperienceViewDTO | undefined {
  return mockedDeclaredExperiences.find(p => p.id === id)
}
