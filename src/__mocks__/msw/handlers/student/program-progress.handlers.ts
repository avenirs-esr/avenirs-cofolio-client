import { mockedAllMyProgramsProgress, mockedProgramsProgressOverview, mockedProgramsProgressView } from '@/__mocks__/fixtures/student'
import {
  getGetAllProgramProgressUrl,
  getGetSkillsOverviewUrl,
  getGetSkillsViewUrl,
  type ProgramProgressDTO,
  type ProgramProgressOverviewDTO,
  type ProgramProgressViewDTO
} from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'

export const programProgressHandlers = [
  http.get(`*${getGetAllProgramProgressUrl()}`, () => {
    return HttpResponse.json<ProgramProgressDTO[]>(mockedAllMyProgramsProgress, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get(`*${getGetSkillsViewUrl()}`, () => {
    return HttpResponse.json<ProgramProgressViewDTO[]>(mockedProgramsProgressView, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get(`*${getGetSkillsOverviewUrl()}`, () => {
    return HttpResponse.json<ProgramProgressOverviewDTO[]>(mockedProgramsProgressOverview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
]
