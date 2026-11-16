import type { AssociationsDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { Component } from 'vue'
import type { AllAssociationsType, AllCardsProps } from '@/features/student/associations/types/associations.types'

export interface ElementAssociationsCardsConfig {
  component: Component
  getAssociations: (association: AssociationsDTO) => AllAssociationsType[]
  getCardProps: (association: AllAssociationsType) => AllCardsProps
}
