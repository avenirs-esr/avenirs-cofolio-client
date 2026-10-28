import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { hasStringField } from '@avenirs-esr/shared'
import { afterEach, beforeEach, expect, vi } from 'vitest'

function inheritedMessage () {
  class InheritedMessage {
    get message () {
      return 'inherited message'
    }
  }

  return new InheritedMessage()
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

BddTest().given('the shared hasStringField guard', () => {
  const cases: { label: string, value: unknown, field: string, expected: boolean }[] = [
    { label: 'an own nonempty string', value: { message: 'present' }, field: 'message', expected: true },
    { label: 'an own empty string', value: { message: '' }, field: 'message', expected: true },
    { label: 'another field name', value: { code: 'CUSTOM' }, field: 'code', expected: true },
    { label: 'an array own index', value: ['present'], field: '0', expected: true },
    { label: 'a null-prototype object', value: Object.assign(Object.create(null), { message: 'present' }), field: 'message', expected: true },
    { label: 'a shadowed hasOwnProperty function', value: { message: 'present', hasOwnProperty: () => false }, field: 'message', expected: true },
    { label: 'an inherited getter', value: inheritedMessage(), field: 'message', expected: false },
    { label: 'a missing own field', value: {}, field: 'message', expected: false },
    { label: 'an inherited Object method', value: {}, field: 'toString', expected: false },
    { label: 'a number', value: { message: 1 }, field: 'message', expected: false },
    { label: 'a boolean', value: { message: false }, field: 'message', expected: false },
    { label: 'an undefined field', value: { message: undefined }, field: 'message', expected: false },
    { label: 'a null field', value: { message: null }, field: 'message', expected: false },
    { label: 'null', value: null, field: 'message', expected: false },
    { label: 'undefined', value: undefined, field: 'message', expected: false },
    { label: 'a primitive string index', value: 'present', field: '0', expected: false },
    { label: 'a function with an own string message', value: Object.assign(() => undefined, { message: 'present' }), field: 'message', expected: false },
  ]

  for (const scenario of cases) {
    BddTest().when(`the guard examines ${scenario.label}`, () => {
      let result: boolean

      beforeEach(() => {
        result = hasStringField(scenario.value, scenario.field)
      })

      BddTest().then('it requires an object with an own string-valued property', () => {
        expect(result).toBe(scenario.expected)
      })
    })
  }

  BddTest().when('the guard narrows an unknown object with a literal field name', () => {
    const value: unknown = { message: 'Typed message' }
    let message: string | undefined

    beforeEach(() => {
      if (hasStringField(value, 'message')) {
        message = value.message
      }
    })

    BddTest().then('its public type predicate exposes a string field', () => {
      expect(message).toBe('Typed message')
    })
  })
})
