import { ICONS } from '@avenirs-esr/shared'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'

export const ASSOCIATION_TYPE_ICONS: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: ICONS.TRACES,
  [EAssociationContextType.DECLARED_ACTIVITY]: ICONS.ACTIVITY,
  [EAssociationContextType.DECLARED_SKILL]: ICONS.SKILLS,
  [EAssociationContextType.DECLARED_EXPERIENCE]: ICONS.EXPERIENCES,
  [EAssociationContextType.DECLARED_PROGRAM]: ICONS.DECLARED_PROGRAMS,
}
