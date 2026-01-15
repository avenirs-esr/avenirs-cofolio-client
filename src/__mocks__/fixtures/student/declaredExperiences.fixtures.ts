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

export const mockedDeclaredExperiences: DeclaredExperienceViewDTO[] = [
  {
    id: 'declared-experience-1',
    title: 'Développeur Web Full Stack',
    experienceType: EExperienceType.PROFESSIONAL,
    organization: 'Tech Startup Paris',
    activitySector: 'Technologie',
    location: 'La Poste',
    startDate: '2023-01',
    endDate: '2024-06',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'declared-experience-2',
    title: 'Stage en Marketing Digital',
    experienceType: EExperienceType.PROFESSIONAL,
    organization: 'Agence Marketing Lyon',
    activitySector: 'Marketing',
    location: 'Les Subsistances, Lyon',
    startDate: '2022-06',
    endDate: '2022-12',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'declared-experience-3',
    title: 'Bénévolat Association Sportive',
    experienceType: EExperienceType.PERSONAL,
    organization: 'Club de Football Local',
    location: 'La Poste',
    startDate: '2021-09',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'declared-experience-4',
    title: 'Projet Personnel Open Source',
    experienceType: EExperienceType.PERSONAL,
    organization: 'GitHub',
    location: 'Les Subsistances, Lyon',
    description: 'Contribution à des projets open source',
    startDate: '2020-01',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'declared-experience-5',
    title: 'Assistant Commercial',
    experienceType: EExperienceType.PROFESSIONAL,
    organization: 'Grande Distribution SA',
    activitySector: 'Commerce',
    location: 'Marseille, France',
    startDate: '2019-07',
    endDate: '2020-08',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
]

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
