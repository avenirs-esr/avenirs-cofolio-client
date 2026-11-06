import type { TraceDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'

export function isFeedbackTraceWithFile (element: FeedbackAssociatedElement): element is { type: EAssociationContextType.TRACE, data: TraceDetailDTO } {
  return element.type === EAssociationContextType.TRACE && !!(element.data as TraceDetailDTO).attachment
}

export function isFeedbackTraceWithLink (element: FeedbackAssociatedElement): element is { type: EAssociationContextType.TRACE, data: TraceDetailDTO } {
  return element.type === EAssociationContextType.TRACE && !!(element.data as TraceDetailDTO).link
}
