import type {
  useAddSelfKnowledgeCategoryElementForm
} from '@/features/student/selfKnowledge/components/overlays/AddSelfKnowledgeCategoryElementDrawer/use-add-self-knowledge-category-element-form/use-add-self-knowledge-category-element-form'

export interface SelfKnowledgeCategoryElementFormData {
  title: string
  description: string
  rating: number | null
}

export type AddSelfKnowledgeCategoryElementForm = ReturnType<typeof useAddSelfKnowledgeCategoryElementForm>['form']
