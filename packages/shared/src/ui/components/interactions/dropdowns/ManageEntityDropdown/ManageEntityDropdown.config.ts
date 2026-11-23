import { ICONS } from '#shared/constants/icons'
import { Action } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { MDI_ICONS, MS_ICONS, PH_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

interface ActionConfig {
  icon?: string
  labelKey: string
  separatorBefore?: boolean
}

/**
 * Do not necessarily alphabetically sort this list of actions.
 * The order represents the intended display order in the dropdown.
 * Destructive actions should come after actions for displaying, creating, and modifying items.
 */
export const moreActionConfig: Record<Action, ActionConfig> = {
  [Action.NAVIGATE_TO_FEEDBACKS]: { icon: MDI_ICONS.ARROW_RIGHT, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.navigateToFeedbacks' },
  [Action.ADD]: { icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.add' },
  [Action.UPDATE]: { icon: MDI_ICONS.PENCIL_OUTLINE, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.update' },
  [Action.ASSOCIATE]: { icon: ICONS.ASSOCIATE, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.associate' },
  [Action.COLLAPSE]: { icon: MDI_ICONS.MINUS, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.collapse' },
  [Action.DOWNLOAD]: { icon: MDI_ICONS.DOWNLOAD_OUTLINE, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.download' },
  [Action.EXPAND]: { icon: MDI_ICONS.PLUS, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.expand' },
  [Action.PUBLISH]: { icon: MS_ICONS.SEND_OUTLINE_ROUNDED, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.publish' },
  [Action.RESUBSCRIBE]: { icon: PH_ICONS.NOTE_PENCIL, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.resubscribe' },
  [Action.UPDATE_IN_PROFILE]: { icon: MDI_ICONS.TRAY_UPLOAD, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.updateInProfile' },
  [Action.CLONE]: { icon: MS_ICONS.CONTENT_COPY_OUTLINE, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.clone' },
  [Action.DISSOCIATE]: { icon: ICONS.DISSOCIATE, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.dissociate', separatorBefore: true },
  [Action.UNPUBLISH]: { icon: RI_ICONS.EYE_OFF_LINE, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.unpublish', separatorBefore: true },
  [Action.UNSUBSCRIBE]: { icon: MDI_ICONS.EXIT_TO_APP, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.unsubscribe', separatorBefore: true },
  [Action.DELETE]: { icon: MDI_ICONS.TRASH_CAN_OUTLINE, labelKey: 'global.components.interactions.dropdowns.ManageEntityDropdown.actions.delete', separatorBefore: true },
}
