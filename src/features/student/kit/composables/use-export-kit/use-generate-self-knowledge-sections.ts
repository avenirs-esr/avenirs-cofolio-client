import { ESelfKnowledgeCategory, type SelfKnowledgeElementViewDTO, useGetSelfKnowledgeElements } from '@/api/avenir-esr'
import { HeadingLevel, Paragraph, TextRun } from 'docx'
import { useI18n } from 'vue-i18n'

export function useGenerateSelfKnowledgeSections () {
  const { t } = useI18n()

  const { data: selfKnowledgeElements, isFetching } = useGetSelfKnowledgeElements(
    computed(() => ({ isValorized: true, pageSize: 100 }))
  )

  function getSelfKnowledgeElementsByCategory (category: ESelfKnowledgeCategory) {
    return (selfKnowledgeElements.value?.data ?? []).filter(
      element => element.category.type === category
    )
  }

  const interests = computed(() => getSelfKnowledgeElementsByCategory(ESelfKnowledgeCategory.INTERESTS))
  const strengths = computed(() => getSelfKnowledgeElementsByCategory(ESelfKnowledgeCategory.STRENGTHS))
  const values = computed(() => getSelfKnowledgeElementsByCategory(ESelfKnowledgeCategory.VALUES))
  const aspirations = computed(() => getSelfKnowledgeElementsByCategory(ESelfKnowledgeCategory.ASPIRATIONS))
  const motivation = computed(() => getSelfKnowledgeElementsByCategory(ESelfKnowledgeCategory.MOTIVATION))
  const improvement = computed(() => getSelfKnowledgeElementsByCategory(ESelfKnowledgeCategory.IMPROVEMENT))
  const inspirations = computed(() => getSelfKnowledgeElementsByCategory(ESelfKnowledgeCategory.INSPIRATIONS))
  const obligations = computed(() => getSelfKnowledgeElementsByCategory(ESelfKnowledgeCategory.OBLIGATIONS))
  const testimonials = computed(() => getSelfKnowledgeElementsByCategory(ESelfKnowledgeCategory.TESTIMONIALS))

  const interestsSection = computed<Paragraph[]>(() => [
    new Paragraph({
      children: [
        new TextRun({
          text: t(`student.selfKnowledge.categories.${ESelfKnowledgeCategory.INTERESTS}.title`).toUpperCase(),
          bold: true,
        }),
      ],
      heading: HeadingLevel.HEADING_1
    }),
    new Paragraph({
      children: [new TextRun(interests.value.map(element => element.title).join(', '))],
    })
  ])

  function generateSection (category: ESelfKnowledgeCategory, elements: SelfKnowledgeElementViewDTO[]) {
    if (elements.length === 0) {
      return []
    }
    return [
      new Paragraph({
        children: [
          new TextRun(t('global.colon', { before: t(`student.selfKnowledge.categories.${category}.title`) })),
          new TextRun(elements.map(element => element.title).join(', '))
        ],
      })
    ]
  }

  const strengthsSection = computed<Paragraph[]>(() => generateSection(ESelfKnowledgeCategory.STRENGTHS, strengths.value))
  const valuesSection = computed<Paragraph[]>(() => generateSection(ESelfKnowledgeCategory.VALUES, values.value))
  const aspirationsSection = computed<Paragraph[]>(() => generateSection(ESelfKnowledgeCategory.ASPIRATIONS, aspirations.value))
  const motivationSection = computed<Paragraph[]>(() => generateSection(ESelfKnowledgeCategory.MOTIVATION, motivation.value))
  const improvementSection = computed<Paragraph[]>(() => generateSection(ESelfKnowledgeCategory.IMPROVEMENT, improvement.value))
  const inspirationsSection = computed<Paragraph[]>(() => generateSection(ESelfKnowledgeCategory.INSPIRATIONS, inspirations.value))
  const obligationsSection = computed<Paragraph[]>(() => generateSection(ESelfKnowledgeCategory.OBLIGATIONS, obligations.value))
  const testimonialsSection = computed<Paragraph[]>(() => generateSection(ESelfKnowledgeCategory.TESTIMONIALS, testimonials.value))

  const selfKnowledgeSections = computed<Paragraph[]>(() => [
    ...interestsSection.value,
    ...strengthsSection.value,
    ...valuesSection.value,
    ...aspirationsSection.value,
    ...motivationSection.value,
    ...improvementSection.value,
    ...inspirationsSection.value,
    ...obligationsSection.value,
    ...testimonialsSection.value,
  ])

  return {
    selfKnowledgeSections,
    isLoading: isFetching
  }
}
