import { EAssociationContextType } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'

export const ASSOCIATION_TYPE_ICONS: Record<EAssociationContextType, string> = {
  [EAssociationContextType.TRACE]: ICONS.TRACES,
  [EAssociationContextType.DECLARED_ACTIVITY]: ICONS.ACTIVITY,
  [EAssociationContextType.DECLARED_SKILL]: ICONS.SKILLS,
  [EAssociationContextType.DECLARED_EXPERIENCE]: ICONS.EXPERIENCES,
}
