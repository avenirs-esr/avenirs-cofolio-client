import { getDownloadMediaUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { http, HttpResponse, type PathParams } from 'msw'

const downloadMediaHandler = http.get<PathParams, Blob>(`*${getDownloadMediaUrl()}`, () => {
  return HttpResponse.json<Blob>(new Blob(), {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/octet-stream' }
  })
})

export const downloadMediaErrorHandler = http.get<PathParams, Blob>(`*${getDownloadMediaUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const studentKitHandlers = [
  downloadMediaHandler
]
