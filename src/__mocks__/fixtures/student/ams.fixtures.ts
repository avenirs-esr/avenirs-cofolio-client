import { AmsStatus, type AmsViewDTO, type PagedResponseAmsViewDTO } from '@/api/avenir-esr'

function getRandomAmsStatus (): AmsStatus {
  const statuses = Object.values(AmsStatus)
  const randomIndex = Math.floor(Math.random() * statuses.length)
  return statuses[randomIndex]
}

function getRandomAmsProgress (status: AmsStatus): AmsViewDTO['progress'] {
  const totalActivities = Math.floor(Math.random() * 5) + 3
  let startedActivities = totalActivities - 2
  if (status === AmsStatus.NOT_STARTED) {
    startedActivities = 0
  }
  else if (status === AmsStatus.COMPLETED) {
    startedActivities = totalActivities
  }
  return { startedActivities, totalActivities }
}

export function createMockedPagedResponseAmsViewDTO (pageSize: number, totalElements: number, page: number, studentProgressId: string): PagedResponseAmsViewDTO {
  const mockedAmss: AmsViewDTO[] = []
  for (let i = 1; i <= totalElements; i++) {
    const randomStatus = getRandomAmsStatus()
    const ams = {
      id: crypto.randomUUID(),
      title: `Ma super activité de mise en situation ${i} - ${studentProgressId}`,
      countSkills: Math.floor(Math.random() * 10),
      countTraces: Math.floor(Math.random() * 10),
      status: randomStatus,
      progress: getRandomAmsProgress(randomStatus)
    }
    mockedAmss.push(ams)
  }

  const start = page * pageSize
  const end = start + pageSize
  const paginatedAmss = mockedAmss.slice(start, end)
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data: paginatedAmss,
    page: { pageSize, totalElements, totalPages, page }
  }
}
