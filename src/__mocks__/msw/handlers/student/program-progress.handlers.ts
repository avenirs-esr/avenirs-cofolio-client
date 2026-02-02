import { mockedProgramsProgressOverview, mockedProgramsProgressView, mockedStudentProgress } from '@/__mocks__/fixtures/student'
import {
  getGetAllStudentProgressUrl,
  getGetStudentProgressOverviewUrl,
  getGetStudentProgressViewUrl,
  type StudentProgressDTO,
  type StudentProgressOverviewDTO,
  type StudentProgressViewDTO
} from '@/api/avenir-esr'
import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { StudentProgressViewSortableFields } from '@/features/student/skills'
import { http, HttpResponse } from 'msw'

export function createProgramProgressViewHandler (payload: StudentProgressViewDTO[]) {
  return http.get(`*${getGetStudentProgressViewUrl()}`, () => {
    return HttpResponse.json<StudentProgressViewDTO[]>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const programProgressViewErrorHandler = http.get(`*${getGetStudentProgressViewUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
})

export function createStudentProgressOverviewHandler (payload: StudentProgressOverviewDTO[]) {
  return http.get(`*${getGetStudentProgressOverviewUrl()}`, () => {
    return HttpResponse.json<StudentProgressOverviewDTO[]>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const programProgressHandlers = [
  http.get(`*${getGetAllStudentProgressUrl()}`, () => {
    return HttpResponse.json<StudentProgressDTO[]>(mockedStudentProgress, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get(`*${getGetStudentProgressViewUrl()}`, ({ request }) => {
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

  http.get(`*${getGetStudentProgressOverviewUrl()}`, () => {
    return HttpResponse.json<StudentProgressOverviewDTO[]>(mockedProgramsProgressOverview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
]
