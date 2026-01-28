import {
  type DeclaredExperienceViewDTO,
  EExperienceType,
  type PagedResponseDeclaredExperienceViewDTO
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
  updatedAt: '2024-01-15T10:30:00Z'
}

function createMockedDeclaredExperiences (count: number): DeclaredExperienceViewDTO[] {
  const experiencesExample = [
    { title: 'Développeur Junior', experienceType: EExperienceType.PROFESSIONAL, location: 'La Poste' },
    { title: 'Assistant Marketing', experienceType: EExperienceType.PROFESSIONAL, location: 'Les Subsistances, Lyon' },
    { title: 'Bénévole Associatif', experienceType: EExperienceType.PERSONAL, location: 'La Poste' },
    { title: 'Contributeur Github', experienceType: EExperienceType.PERSONAL, location: 'Les Subsistances, Lyon' },
    { title: 'Conseiller Vendeur', experienceType: EExperienceType.PROFESSIONAL, location: 'Marseille, France' }
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
      startDate: '2023-01',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    })
  }

  return experiences
}

export const mockedDeclaredExperiences: DeclaredExperienceViewDTO[] = createMockedDeclaredExperiences(60)

export function createMockedDeclaredExperiencesPagedResponse (
  pageSize: number,
  totalElements: number,
  page: number
): PagedResponseDeclaredExperienceViewDTO {
  const start = page * pageSize
  const end = Math.min(start + pageSize, totalElements)
  const paginatedData = mockedDeclaredExperiences.slice(start, end)

  return {
    data: paginatedData,
    page: {
      page,
      pageSize,
      totalElements,
      totalPages: Math.ceil(totalElements / pageSize)
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
    updatedAt: '2024-01-15T10:30:00Z'
  }
}

export function searchDeclaredExperienceById (
  id: string
): DeclaredExperienceViewDTO | undefined {
  return mockedDeclaredExperiences.find(p => p.id === id)
}
