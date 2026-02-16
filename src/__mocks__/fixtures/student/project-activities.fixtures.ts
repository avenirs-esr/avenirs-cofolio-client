import { type ActivityDetailDTO, EActivityThematic } from '@/api/avenir-esr'

export const mockedActivityDetail: ActivityDetailDTO = {
  id: 'activity-1',
  title: 'Activité “Connaissance de soi” : Définir ses valeurs',
  banner: {
    fileId: 'activity-1-banner',
    url: 'https://cdn.welcometothejungle.co/uploads/article/social_image/3009/159196/large_jaredd-craig-HH4WBGNyltc-unsplash.jpg',
    fileName: 'Image de l’activité Connaissance de soi - Définir ses valeurs'
  },
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  summary: 'Activité faisant partie de la catégorie Connaissance de soi. Activité au cours de laquelle l’étudiant.e détermine des valeurs auxquelles il/elle est attaché.e et réfléchit à la façon dont ces valeurs s’incarnent dans ses comportements et ses pratiques quotidiennes. Cette activité constitue un préalable aux activités axées sur le projet de vie.',
  executionPeriodInfo: '- À réaliser en amont d’un entretien avec un.e conseiller/conseillère ou chargé.e d’orientation et/ou d’insertion professionnelle\n- avant une autre activité si parcours d’activités Cofolio',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}
