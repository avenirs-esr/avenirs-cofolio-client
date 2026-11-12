import type { ManageEntityDropdownProps } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'

export const PLURAL_COUNT_FOR_FEMININE = 2
export const PLURAL_COUNT_FOR_MASCULINE = 1

type AllowedActions = Action.UPDATE | Action.DELETE

export const OWN_ACTIONS: ManageEntityDropdownProps['actions'] = [
  Action.UPDATE,
  Action.DELETE
]

export function handleEntityDropdownAction (
  action: Action,
  handleAction: (action: Action) => void,
  emit: (action: AllowedActions) => void
) {
  switch (action) {
    case Action.ASSOCIATE:
    case Action.DISSOCIATE:
      handleAction(action)
      break
    case Action.UPDATE:
    case Action.DELETE:
      emit(action)
      break
  }
}
