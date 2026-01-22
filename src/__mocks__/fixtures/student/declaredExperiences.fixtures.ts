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
    { title: 'Développeur Web', experienceType: EExperienceType.PROFESSIONAL, location: 'La Poste' },
    { title: 'Stage Marketing', experienceType: EExperienceType.PROFESSIONAL, location: 'Les Subsistances, Lyon' },
    { title: 'Bénévolat Association', experienceType: EExperienceType.PERSONAL, location: 'La Poste' },
    { title: 'Projet Open Source', experienceType: EExperienceType.PERSONAL, location: 'Les Subsistances, Lyon' },
    { title: 'Assistant Commercial', experienceType: EExperienceType.PROFESSIONAL, location: 'Marseille, France' }
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
