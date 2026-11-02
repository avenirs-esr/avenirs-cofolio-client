import type { FileDTO } from '@/api/avenir-esr'
import type {
  useAddSelfKnowledgeCategoryElementForm
} from '@/features/student/selfKnowledge/components/overlays/AddSelfKnowledgeCategoryElementDrawer/use-add-self-knowledge-category-element-form/use-add-self-knowledge-category-element-form'
import type {
  useUpdateSelfKnowledgeElementForm
} from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/use-update-self-knowledge-element-form/use-update-self-knowledge-element-form'

export enum SelfKnowledgeElementType {
  FILE = 'FILE'
}

export interface SelfKnowledgeCategoryElementFormData {
  title: string
  description: string
  rating: number | null
  valorized: boolean
  selfKnowledgeElementType: SelfKnowledgeElementType
  file?: (File | FileDTO)[]
}

export interface SelfKnowledgeCategoryElementFormDataFile extends SelfKnowledgeCategoryElementFormData {
  selfKnowledgeElementType: SelfKnowledgeElementType.FILE
  file: (File | FileDTO)[]
}

export type AddSelfKnowledgeCategoryElementForm = ReturnType<typeof useAddSelfKnowledgeCategoryElementForm>['form']
export type UpdateSelfKnowledgeCategoryElementForm = ReturnType<typeof useUpdateSelfKnowledgeElementForm>['form']
export type SelfKnowledgFormData = SelfKnowledgeCategoryElementFormDataFile
