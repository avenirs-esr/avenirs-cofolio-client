import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { MDI_ICONS, MS_ICONS, PH_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

interface ActionConfig {
  icon?: string
  labelKey: string
}

export const moreActionConfig: Record<Action, ActionConfig> = {
  [Action.ADD]: { icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE, labelKey: 'global.buttons.add' },
  [Action.CLONE]: { icon: MS_ICONS.CONTENT_COPY_OUTLINE, labelKey: 'global.buttons.clone' },
  [Action.COLLAPSE]: { icon: MDI_ICONS.MINUS, labelKey: 'global.buttons.collapse' },
  [Action.DOWNLOAD]: { icon: MDI_ICONS.DOWNLOAD_OUTLINE, labelKey: 'global.buttons.download' },
  [Action.EXPAND]: { icon: MDI_ICONS.PLUS, labelKey: 'global.buttons.expand' },
  [Action.PUBLISH]: { icon: MS_ICONS.SEND_OUTLINE_ROUNDED, labelKey: 'global.buttons.publish' },
  [Action.RESUBSCRIBE]: { icon: PH_ICONS.NOTE_PENCIL, labelKey: 'global.buttons.resubscribe' },
  [Action.DELETE]: { icon: MDI_ICONS.TRASH_CAN_OUTLINE, labelKey: 'global.buttons.remove' },
  [Action.UNPUBLISH]: { icon: RI_ICONS.EYE_OFF_LINE, labelKey: 'global.buttons.unpublish' },
  [Action.UNSUBSCRIBE]: { icon: MDI_ICONS.EXIT_TO_APP, labelKey: 'global.buttons.unsubscribe' },
  [Action.UPDATE]: { icon: MDI_ICONS.PENCIL_OUTLINE, labelKey: 'global.buttons.update' },
  [Action.UPDATE_IN_PROFILE]: { icon: MDI_ICONS.TRAY_UPLOAD, labelKey: 'global.vueFlow.NodeDropdown.updateInProfile' },
}
