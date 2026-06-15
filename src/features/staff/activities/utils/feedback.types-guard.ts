import type { FeedbackAssociatedElement } from '@/features/staff/activities/types/feedback.types'
import { EAssociationContextType, type TraceDetailDTO } from '@/api/avenir-esr'

export function isFeedbackTraceWithFile (element: FeedbackAssociatedElement): element is { type: EAssociationContextType.TRACE, data: TraceDetailDTO } {
  return element.type === EAssociationContextType.TRACE && !!(element.data as TraceDetailDTO).attachment
}

export function isFeedbackTraceWithLink (element: FeedbackAssociatedElement): element is { type: EAssociationContextType.TRACE, data: TraceDetailDTO } {
  return element.type === EAssociationContextType.TRACE && !!(element.data as TraceDetailDTO).link
}
