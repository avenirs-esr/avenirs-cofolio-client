import { mockedAllMyProgramsProgress, mockedProgramsProgressOverview, mockedProgramsProgressView } from '@/__mocks__/fixtures/student'
import {
  getGetAllTrainingPathsUrl,
  getGetSkillsOverviewUrl,
  getGetSkillsViewUrl,
  type StudentProgressOverviewDTO,
  type StudentProgressViewDTO,
  type TrainingPathDTO
} from '@/api/avenir-esr'
import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { StudentProgressViewSortableFields } from '@/features/student/types'
import { http, HttpResponse } from 'msw'

export function createProgramProgressViewHandler (payload: StudentProgressViewDTO[]) {
  return http.get(`*${getGetSkillsViewUrl()}`, () => {
    return HttpResponse.json<StudentProgressViewDTO[]>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const programProgressViewErrorHandler = http.get(`*${getGetSkillsViewUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
})

export const programProgressHandlers = [
  http.get(`*${getGetAllTrainingPathsUrl()}`, () => {
    return HttpResponse.json<TrainingPathDTO[]>(mockedAllMyProgramsProgress, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get(`*${getGetSkillsViewUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams.entries())
    const sort = params.sort || formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC)

    const [, sortOrder] = (sort).split(',')
    const sortedData = mockedProgramsProgressView.map((program) => {
      return {
        ...program,
        skills: program.skills.sort((a, b) => {
          if (sortOrder === SortDirection.ASC) {
            return a.name > b.name ? 1 : -1
          }
          else if (sortOrder === SortDirection.DESC) {
            return a.name < b.name ? 1 : -1
          }
          return 0
        })
      }
    })

    return HttpResponse.json<StudentProgressViewDTO[]>(sortedData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get(`*${getGetSkillsOverviewUrl()}`, () => {
    return HttpResponse.json<StudentProgressOverviewDTO[]>(mockedProgramsProgressOverview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
]
