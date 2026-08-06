import { mockedTraceOverview } from '@/__mocks__/fixtures/student/traces.fixtures'
import {
  type AssociationSearchResultDeclaredExperienceDTO,
  type DeclaredExperienceAssociationDTO,
  type DeclaredExperienceAssociationsDTO,
  type DeclaredExperienceViewDTO,
  EExperienceType,
  type PagedResponseAssociationSearchResultDeclaredExperienceDTO,
  type PagedResponseDeclaredExperienceViewDTO,
  type TraceOverviewDTO,
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

function createMockedDeclaredExperiences (count: number): DeclaredExperienceViewDTO[] {
  const experiencesExample = [
    { title: 'Développeur Junior', experienceType: EExperienceType.PROFESSIONAL, location: 'La Poste', description: 'Développement et maintenance d\'applications internes en équipe agile.' },
    { title: 'Assistant Marketing', experienceType: EExperienceType.PROFESSIONAL, location: 'Les Subsistances, Lyon', description: 'Gestion des réseaux sociaux et création de supports de communication.' },
    { title: 'Bénévole Associatif', experienceType: EExperienceType.PERSONAL, location: 'La Poste', description: 'Distribution alimentaire hebdomadaire auprès des personnes en difficulté.' },
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
      description: experience.description,
      startDate: '2023-01',
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

export function createMockedDeclaredExperiencesAssociations (count: number): DeclaredExperienceAssociationDTO[] {
  return createMockedDeclaredExperiences(count).map((declaredExperience, index) => ({
    associationId: `declared-experience-association-${index + 1}`,
    declaredExperience
  }))
}

export function createMockedDeclaredExperienceAssociationsDTO (
  traces: TraceOverviewDTO[] = mockedTraceOverview
): DeclaredExperienceAssociationsDTO {
  return {
    traceAssociations: traces.map((trace, index) => ({
      associationId: `declared-experience-trace-association-${index + 1}`,
      trace
    })),
    declaredSkillAssociations: []
  }
}

export const mockedExperienceSearchResults: AssociationSearchResultDeclaredExperienceDTO[] = [
  {
    id: 'experience-search-1',
    title: 'Définir ses valeurs',
    experienceType: EExperienceType.PERSONAL,
    disabled: false
  },
  {
    id: 'experience-search-2',
    title: 'Explorer ses pistes d\'orientation',
    experienceType: EExperienceType.PROFESSIONAL,
    disabled: false
  },
  {
    id: 'experience-search-3',
    title: 'Développeur Web Full Stack',
    experienceType: EExperienceType.PROFESSIONAL,
    disabled: true
  }
]

export function createMockedSearchExperiencesForAssociationResponse (
  params?: { keyword?: string, page?: number, pageSize?: number }
): PagedResponseAssociationSearchResultDeclaredExperienceDTO {
  const { keyword, page = 0, pageSize = 100 } = params ?? {}

  let filtered = mockedExperienceSearchResults

  if (keyword?.trim()) {
    filtered = filtered.filter(experience =>
      experience.title.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedData = filtered.slice(start, end)

  return {
    data: paginatedData,
    page: {
      page,
      pageSize,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize)
    }
  }
}
