import type { Component } from 'vue'
import type { AssociationsDTO } from '@/api/avenir-esr'
import type { AllAssociationsType, AllCardsProps } from '@/features/student/associations/types/associations.types'

export interface AssociatedCardConfig {
  component: Component
  getAssociations: (association: AssociationsDTO) => AllAssociationsType[]
  getCardProps: (association: AllAssociationsType) => AllCardsProps
}
