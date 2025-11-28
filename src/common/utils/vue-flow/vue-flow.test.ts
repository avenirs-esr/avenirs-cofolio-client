import { getEdgeId, remToPx } from '@/common/utils/vue-flow/vue-flow'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a rem to px conversion utility', () => {
  BddTest().and('a number input', () => {
    let result: number

    beforeEach(() => {
      result = remToPx(2)
    })

    BddTest().when('the function is called with a number', () => {
      BddTest().then('it should return the correct pixel value', () => {
        const fontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
        expect(result).toBe(2 * fontSize)
      })
    })
  })

  BddTest().and('a string input with rem unit', () => {
    let result: number

    beforeEach(() => {
      result = remToPx('3rem')
    })

    BddTest().when('the function is called with a rem string', () => {
      BddTest().then('it should return the correct pixel value', () => {
        const fontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
        expect(result).toBe(3 * fontSize)
      })
    })
  })

  BddTest().and('an invalid string input', () => {
    let result: number

    beforeEach(() => {
      result = remToPx('invalid')
    })

    BddTest().when('the function is called with an invalid string', () => {
      BddTest().then('it should return 0', () => {
        expect(result).toBe(0)
      })
    })
  })

  BddTest().and('an invalid string input with rem unit', () => {
    let result: number

    beforeEach(() => {
      result = remToPx('a12brem')
    })

    BddTest().then('it should return 0', () => {
      expect(result).toBe(0)
    })
  })
})

BddTest().given('an edge ID generation utility', () => {
  let edgeId: string

  BddTest().when('the function is called with an edge object', () => {
    const edgeWithoutId = {
      source: 'node-1',
      target: 'node-2',
      sourceHandle: 'handle-1',
      targetHandle: 'handle-2',
    }

    beforeEach(() => {
      edgeId = getEdgeId(edgeWithoutId)
    })

    BddTest().then('it should return the correct edge ID', () => {
      expect(edgeId).toBe('enode-1:handle-1->node-2:handle-2')
    })
  })

  BddTest().when('the function is called with another edge object', () => {
    const edgeWithoutId = {
      source: 'a',
      target: 'b',
      sourceHandle: null,
      targetHandle: null,
    }

    beforeEach(() => {
      edgeId = getEdgeId(edgeWithoutId)
    })

    BddTest().then('it should return the correct edge ID', () => {
      expect(edgeId).toBe('ea:null->b:null')
    })
  })
})
