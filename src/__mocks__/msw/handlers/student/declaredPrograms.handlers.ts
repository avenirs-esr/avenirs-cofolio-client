import { declaredProgramIdFixture } from '@/__mocks__/fixtures/student/declaredPrograms.fixtures'
import { getCreateDeclaredProgramUrl } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'

export const createDeclaredProgramErrorHandler = http.post(
  '*/me/declared/programs',
  () => {
    return HttpResponse.json(
      {
        status: 500,
        message: 'Internal Server Error',
        error: 'Failed to create declared program'
      },
      { status: 500 }
    )
  }
)

export const declaredProgramsHandlers = [
  http.post(
    `*${getCreateDeclaredProgramUrl()}`,
    () => {
      return HttpResponse.json(declaredProgramIdFixture, { status: 200 })
    }
  )
]
