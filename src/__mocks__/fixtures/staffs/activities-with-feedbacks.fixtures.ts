import type { ActivityItemNavigationDTO, EFeedbackStatus, PagedResponseActivityItemNavigationDTO, PageInfoDTO } from '@/api/avenir-esr'
import { allFeedbacks } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'

export function getMockedActivitiesWithFeedbacks ({ statuses }: { statuses?: EFeedbackStatus[] } = {}): ActivityItemNavigationDTO[] {
  let feedbacks = [...allFeedbacks]

  if (statuses) {
    feedbacks = feedbacks.filter(feedback => statuses.includes(feedback.status!))
  }

  const activities = new Map(feedbacks.map(feedback => [feedback.activity!.id, feedback.activity!])).values()

  return [...activities]
    // Keep the same ordering as the backend to stay consistent with the other
    // activity controller endpoints, which mostly rely on findAll and therefore
    // inherit this ordering. This is an implicit consistency rule, not an
    // explicit business rule.
    .sort((activity1, activity2) => new Date(activity2.createdAt).getTime() - new Date(activity1.createdAt).getTime())
    .map(({ id, title }) => ({ id, title }))
}

export function getMockedActivitiesWithFeedbacksPaginated ({ statuses, page, pageSize }: { statuses?: EFeedbackStatus[], page?: number, pageSize?: number } = {}): PagedResponseActivityItemNavigationDTO {
  const activities = getMockedActivitiesWithFeedbacks({ statuses })

  const pageInfo: PageInfoDTO = {
    page: page ?? 0,
    pageSize: pageSize ?? activities.length,
    totalElements: activities.length,
    totalPages: pageSize ? Math.ceil(activities.length / pageSize) : 1
  }

  const start = pageInfo.page * pageInfo.pageSize
  const pagedActivities = activities.slice(start, start + pageInfo.pageSize)

  return {
    data: pagedActivities,
    page: pageInfo
  }
}
