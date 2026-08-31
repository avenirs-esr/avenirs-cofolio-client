import { EAssociationContextType } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'

export const ASSOCIATION_TYPE_ICONS: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: ICONS.TRACES,
  [EAssociationContextType.DECLARED_ACTIVITY]: ICONS.ACTIVITY,
  [EAssociationContextType.DECLARED_SKILL]: ICONS.SKILLS,
  [EAssociationContextType.DECLARED_EXPERIENCE]: ICONS.EXPERIENCES,
}

export const ASSOCIATION_TYPE_LABEL_KEYS: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: 'global.associations.elementsToAssociate.traces',
  [EAssociationContextType.DECLARED_ACTIVITY]: 'global.associations.elementsToAssociate.activities',
  [EAssociationContextType.DECLARED_SKILL]: 'global.associations.elementsToAssociate.skills',
  [EAssociationContextType.DECLARED_EXPERIENCE]: 'global.associations.elementsToAssociate.experiences',
}

export const ASSOCIATION_TYPE_ITEM_NAMES: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: 'traces',
  [EAssociationContextType.DECLARED_ACTIVITY]: 'activities',
  [EAssociationContextType.DECLARED_SKILL]: 'skills',
  [EAssociationContextType.DECLARED_EXPERIENCE]: 'experiences',
}
