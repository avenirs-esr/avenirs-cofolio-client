import { Action } from '@/common/components/interaction/dropdowns/MoreActionsDropdown/MoreActionsDropdown.types'
import { MDI_ICONS, MS_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

interface ActionConfig {
  icon?: string
  labelKey: string
}

export const moreActionConfig: Record<Action, ActionConfig> = {
  [Action.ADD]: { icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE, labelKey: 'global.buttons.add' },
  [Action.UPDATE]: { icon: MDI_ICONS.PENCIL_OUTLINE, labelKey: 'global.buttons.update' },
  [Action.CLONE]: { icon: MS_ICONS.CONTENT_COPY_OUTLINE, labelKey: 'global.buttons.clone' },
  [Action.PUBLISH]: { icon: MS_ICONS.SEND_OUTLINE_ROUNDED, labelKey: 'global.buttons.publish' },
  [Action.UNPUBLISH]: { icon: RI_ICONS.EYE_OFF_LINE, labelKey: 'global.buttons.unpublish' },
  [Action.DOWNLOAD]: { icon: MDI_ICONS.DOWNLOAD_OUTLINE, labelKey: 'global.buttons.download' },
  [Action.DELETE]: { icon: MDI_ICONS.TRASH_CAN_OUTLINE, labelKey: 'global.buttons.remove' }
}
