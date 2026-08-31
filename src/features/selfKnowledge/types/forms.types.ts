import type {
  useAddSelfKnowledgeCategoryElementForm
} from '@/features/selfKnowledge/components/overlays/AddSelfKnowledgeCategoryElementDrawer/use-add-self-knowledge-category-element-form/use-add-self-knowledge-category-element-form'
import type {
  useUpdateSelfKnowledgeElementForm
} from '@/features/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/use-update-self-knowledge-element-form/use-update-self-knowledge-element-form'

export interface SelfKnowledgeCategoryElementFormData {
  title: string
  description: string
  rating: number | null
  valorized: boolean
}

export type AddSelfKnowledgeCategoryElementForm = ReturnType<typeof useAddSelfKnowledgeCategoryElementForm>['form']
export type UpdateSelfKnowledgeCategoryElementForm = ReturnType<typeof useUpdateSelfKnowledgeElementForm>['form']
