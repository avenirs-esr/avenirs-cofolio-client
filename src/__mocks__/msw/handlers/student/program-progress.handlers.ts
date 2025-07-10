import { mockedAllMyProgramsProgress, mockedProgramsProgressOverview, mockedProgramsProgressView } from '@/__mocks__/fixtures/student'
import {
  getGetAllTrainingPathsUrl,
  getGetSkillsOverviewUrl,
  getGetSkillsViewUrl,
  type StudentProgressOverviewDTO,
  type StudentProgressViewDTO,
  type TrainingPathDTO
} from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'

export const programProgressHandlers = [
  http.get(`*${getGetAllTrainingPathsUrl()}`, () => {
    return HttpResponse.json<TrainingPathDTO[]>(mockedAllMyProgramsProgress, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get(`*${getGetSkillsViewUrl()}`, () => {
    return HttpResponse.json<StudentProgressViewDTO[]>(mockedProgramsProgressView, {
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
