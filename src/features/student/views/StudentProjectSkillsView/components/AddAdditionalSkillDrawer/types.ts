import type { AvAutocompleteOption } from '@/ui'

export interface AdditionalSkillOption extends AvAutocompleteOption {
  id: string
  title: string
  pathSegments: string[]
  type: string
}

export interface AdditionalSkillFormData {
  selectedSkills: AdditionalSkillOption[]
}
