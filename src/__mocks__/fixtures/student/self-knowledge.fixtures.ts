import { ESelfKnowledgeCategoryType, type SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'

export const mockedSelfKnowledgeCategories: SelfKnowledgeCategoryDTO[] = [
  {
    id: '4aec2faa-d986-4553-a14b-2ecabba415c8',
    title: 'Mes points forts',
    description: 'Identifier et valoriser mes qualités, talents et réussites marquantes.',
    type: ESelfKnowledgeCategoryType.STRENGTHS
  },
  {
    id: 'a0c79a9a-b5c0-411b-ba54-68d73de72225',
    title: 'Mes valeurs',
    description: 'Préciser ce qui est important pour moi et ce qui guide mes décisions au quotidien.',
    type: ESelfKnowledgeCategoryType.VALUES
  },
  {
    id: '609965be-ebb1-44b3-bf8b-458a7ece6fb7',
    title: 'Mes envies',
    description: 'Clarifier ce que j\'ai envie d\'explorer, d\'apprendre ou de vivre à court et moyen terme.',
    type: ESelfKnowledgeCategoryType.ASPIRATIONS
  }
]
