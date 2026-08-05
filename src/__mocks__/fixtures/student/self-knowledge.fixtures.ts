import { ESelfKnowledgeCategory, type PagedResponseSelfKnowledgeElementViewDTO, type SelfKnowledgeCategoryDTO, type SelfKnowledgeElementDetailsDTO, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'

export const mockedSelfKnowledgeCategories: SelfKnowledgeCategoryDTO[] = [
  {
    type: ESelfKnowledgeCategory.STRENGTHS,
    mandatory: true
  },
  {
    type: ESelfKnowledgeCategory.VALUES,
    mandatory: true
  },
  {
    type: ESelfKnowledgeCategory.ASPIRATIONS,
    mandatory: true
  }
]

export const mockedSelfKnowledgeElementDetails: SelfKnowledgeElementDetailsDTO = {
  id: 'element-123',
  title: 'Créativité',
  description: 'Je suis capable de trouver des solutions originales et innovantes aux problèmes',
  rating: 4,
  createdAt: '2023-10-10T10:00:00Z',
  updatedAt: '2023-10-15T12:00:00Z'
}

const strengthsElements = [
  { title: 'Créativité', description: 'Je suis capable de trouver des solutions originales et innovantes aux problèmes' },
  { title: 'Esprit d\'équipe', description: 'Je travaille efficacement avec les autres et favorise la collaboration' },
  { title: 'Leadership', description: 'Je sais prendre des initiatives et guider une équipe vers ses objectifs' },
  { title: 'Persévérance', description: 'Je continue mes efforts même face aux difficultés' },
  { title: 'Communication', description: 'Je m\'exprime clairement et j\'écoute activement les autres' },
  { title: 'Adaptabilité', description: 'Je m\'ajuste facilement aux changements et aux nouvelles situations' },
  { title: 'Organisation', description: 'Je planifie et structure mes tâches de manière efficace' },
  { title: 'Empathie', description: 'Je comprends et partage les émotions des autres' },
  { title: 'Curiosité', description: 'Je suis toujours désireux d\'apprendre et de découvrir de nouvelles choses' },
  { title: 'Autonomie', description: 'Je travaille efficacement de manière indépendante' }
]

const valuesElements = [
  { title: 'Respect', description: 'Traiter les autres avec considération et dignité' },
  { title: 'Honnêteté', description: 'Agir avec intégrité et transparence dans toutes mes interactions' },
  { title: 'Solidarité', description: 'Soutenir et aider les autres dans le besoin' },
  { title: 'Justice', description: 'Promouvoir l\'équité et l\'égalité des chances pour tous' },
  { title: 'Liberté', description: 'Respecter l\'autonomie et les choix de chacun' },
  { title: 'Engagement', description: 'M\'investir pleinement dans mes projets et responsabilités' },
  { title: 'Bienveillance', description: 'Faire preuve de compassion et de gentillesse envers autrui' },
  { title: 'Excellence', description: 'Viser la qualité et l\'amélioration continue' },
  { title: 'Innovation', description: 'Encourager la créativité et le changement positif' },
  { title: 'Authenticité', description: 'Rester fidèle à moi-même et à mes convictions' }
]

const aspirationsElements = [
  { title: 'Développer mes compétences techniques', description: 'Approfondir mes connaissances dans mon domaine d\'expertise' },
  { title: 'Manager une équipe', description: 'Acquérir de l\'expérience en gestion et leadership' },
  { title: 'Voyager à l\'étranger', description: 'Découvrir de nouvelles cultures et élargir mes horizons' },
  { title: 'Créer mon entreprise', description: 'Développer un projet entrepreneurial qui me passionne' },
  { title: 'Continuer mes études', description: 'Poursuivre ma formation académique dans un domaine qui m\'intéresse' },
  { title: 'Contribuer à des projets sociaux', description: 'M\'engager dans des initiatives à impact positif' },
  { title: 'Équilibrer vie pro et perso', description: 'Trouver un meilleur équilibre entre travail et vie personnelle' },
  { title: 'Développer mon réseau', description: 'Créer des connexions professionnelles enrichissantes' },
  { title: 'Maîtriser de nouvelles langues', description: 'Apprendre et pratiquer de nouvelles langues étrangères' },
  { title: 'Partager mes connaissances', description: 'Transmettre mon savoir et former d\'autres personnes' }
]

export function getCategoryElements (categoryType: ESelfKnowledgeCategory): Array<{ title: string, description: string }> {
  switch (categoryType) {
    case ESelfKnowledgeCategory.STRENGTHS:
      return strengthsElements
    case ESelfKnowledgeCategory.VALUES:
      return valuesElements
    case ESelfKnowledgeCategory.ASPIRATIONS:
      return aspirationsElements
    default:
      return []
  }
}

export function createMockedPagedResponseSelfKnowledgeElementViewDTO (
  categoryType: ESelfKnowledgeCategory,
  pageSize: number,
  totalElements: number,
  page: number
): PagedResponseSelfKnowledgeElementViewDTO {
  const categoryElements = getCategoryElements(categoryType)
  const mockedElements: SelfKnowledgeElementViewDTO[] = []

  const actualTotalElements = Math.min(totalElements, categoryElements.length)

  for (let i = 0; i < actualTotalElements; i++) {
    const element: SelfKnowledgeElementViewDTO = {
      id: crypto.randomUUID(),
      title: categoryElements[i].title,
      description: categoryElements[i].description,
      rating: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined,
      category: { type: categoryType, mandatory: true }
    }
    mockedElements.push(element)
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedElements = mockedElements.slice(start, end)
  const totalPages = Math.ceil(actualTotalElements / pageSize)

  return {
    data: paginatedElements,
    page: { pageSize, totalElements: actualTotalElements, totalPages, page }
  }
}

export const mockedSelfKnowledgeCategoriesAvailable: SelfKnowledgeCategoryDTO[] = [
  ESelfKnowledgeCategory.MOTIVATION,
  ESelfKnowledgeCategory.IMPROVEMENT,
  ESelfKnowledgeCategory.INTERESTS,
  ESelfKnowledgeCategory.INSPIRATIONS,
  ESelfKnowledgeCategory.OBLIGATIONS,
  ESelfKnowledgeCategory.TESTIMONIALS
].map(type => ({ type, mandatory: false }))
