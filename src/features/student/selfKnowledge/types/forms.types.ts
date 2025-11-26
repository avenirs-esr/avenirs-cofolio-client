import type { FormApi } from '@tanstack/vue-form'

export interface SelfKnowledgeCategoryElementFormData {
  title: string
  description: string
  rating: number | null
}

export type AddSelfKnowledgeCategoryElementForm = FormApi<SelfKnowledgeCategoryElementFormData, unknown>
