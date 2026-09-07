import { defineMockEndpoint, defineMockEndpoints, field, file, nullable, number, optional, string, type Compute, type Schema } from "@/__mocks__/msw/core"
import { EActivityThematic, getAddDraftFileUrl, getGetActivitiesViewUrl, type FileDTO, type PagedResponseActivityOverviewDTO } from "@/api/avenir-esr"
import type { BaseApiErrorBody } from "@/common/exceptions"
import { HttpStatusCode } from "@/common/utils"
import { HttpResponse } from "msw"

export const activityEndpoints = defineMockEndpoints({
  addDraftFile: defineMockEndpoint({
    method: 'POST',
    path: `*${getAddDraftFileUrl(':activityDraftId')}`,

    request: {
      params: {
        activityDraftId: string
      },

      formData: {
        file: file(),
      }
    },

    handler: ({ params, formData }) => {
      const { activityDraftId } = params
      const { file } = formData

      void activityDraftId
      void file

      return HttpResponse.json<FileDTO>(null, {
        status: HttpStatusCode.OK,
        headers: { 'Content-Type': 'application/json' }
      })
    },
  }),
})
