import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { HttpStatusCode } from '@avenirs-esr/shared'
import { afterEach, expect, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

BddTest().given('the shared runtime constants', () => {
  BddTest().when('the HTTP status public entry point is imported', () => {
    BddTest().then('it preserves status numbers and the enum reverse mapping', () => {
      expect(HttpStatusCode.CONTINUE).toBe(100)
      expect(HttpStatusCode.OK).toBe(200)
      expect(HttpStatusCode.CREATED).toBe(201)
      expect(HttpStatusCode.NO_CONTENT).toBe(204)
      expect(HttpStatusCode.FOUND).toBe(302)
      expect(HttpStatusCode.BAD_REQUEST).toBe(400)
      expect(HttpStatusCode.UNAUTHORIZED).toBe(401)
      expect(HttpStatusCode.FORBIDDEN).toBe(403)
      expect(HttpStatusCode.NOT_FOUND).toBe(404)
      expect(HttpStatusCode.I_AM_A_TEAPOT).toBe(418)
      expect(HttpStatusCode.UNPROCESSABLE_ENTITY).toBe(422)
      expect(HttpStatusCode.INTERNAL_SERVER_ERROR).toBe(500)
      expect(HttpStatusCode.BAD_GATEWAY).toBe(502)
      expect(HttpStatusCode.SERVICE_UNAVAILABLE).toBe(503)
      expect(HttpStatusCode.NETWORK_AUTHENTICATION_REQUIRED).toBe(511)
      expect(HttpStatusCode[HttpStatusCode.NO_CONTENT]).toBe('NO_CONTENT')
    })
  })
})
