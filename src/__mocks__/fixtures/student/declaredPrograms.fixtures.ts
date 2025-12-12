import { type DeclaredProgramViewDTO, EProgramStatus } from '@/api/avenir-esr'

export const declaredProgramViewDTOFixture: DeclaredProgramViewDTO = {
  id: 'declared-program-123-456-789',
  status: EProgramStatus.NOT_STARTED,
  title: 'Master en Informatique',
  description: 'Formation approfondie en développement logiciel et intelligence artificielle',
  organization: 'Université Paris-Saclay',
  result: 'Mention Très Bien',
  sourceOfInformation: 'Site web de l\'université',
  link: 'https://www.universite-paris-saclay.fr/master-informatique',
  startDate: '2023-09',
  endDate: '2025-06',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}
