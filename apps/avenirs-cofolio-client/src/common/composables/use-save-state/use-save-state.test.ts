import type { Mock } from 'vitest'
import type { Ref } from 'vue'
import type { SaveSource, SaveState } from '@/common/composables/use-save-state/use-save-state'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { useSaveState } from '@/common/composables/use-save-state/use-save-state'

interface MockSaveSource extends SaveSource {
  hasPendingChanges: Ref<boolean>
  isSaving: Ref<boolean>
  saveNow: Mock<() => Promise<void>>
}

function createSource (canSave?: Ref<boolean>): MockSaveSource {
  return {
    hasPendingChanges: ref(false),
    isSaving: ref(false),
    canSave,
    saveNow: vi.fn(async () => {}),
  }
}

BddTest().given('a useSaveState composable', () => {
  let source1: MockSaveSource
  let source2: MockSaveSource
  let canSaveSource1: Ref<boolean>
  let state: SaveState

  beforeEach(() => {
    canSaveSource1 = ref(false)
    source1 = createSource(canSaveSource1)
    source2 = createSource()
    state = useSaveState([source1, source2])
  })

  BddTest().when('no source has changes', () => {
    BddTest().then('it should be neither busy nor saving', () => {
      expect(state.hasPendingChanges.value).toBe(false)
      expect(state.isSaving.value).toBe(false)
      expect(state.isBusy.value).toBe(false)
    })

    BddTest().then('it should not allow saving', () => {
      expect(state.canSave.value).toBe(false)
    })

    BddTest().and('saveNow is called', () => {
      beforeEach(async () => {
        await state.saveNow()
      })

      BddTest().then('it should not save any source', () => {
        expect(source1.saveNow).not.toHaveBeenCalled()
        expect(source2.saveNow).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('a source has pending changes', () => {
    beforeEach(() => {
      source2.hasPendingChanges.value = true
    })

    BddTest().then('it should be busy without saving', () => {
      expect(state.hasPendingChanges.value).toBe(true)
      expect(state.isSaving.value).toBe(false)
      expect(state.isBusy.value).toBe(true)
    })

    BddTest().then('it should allow saving, by default as soon as there are pending changes', () => {
      expect(state.canSave.value).toBe(true)
    })

    BddTest().and('saveNow is called', () => {
      beforeEach(async () => {
        await state.saveNow()
      })

      BddTest().then('it should only save the sources that can be saved', () => {
        expect(source1.saveNow).not.toHaveBeenCalled()
        expect(source2.saveNow).toHaveBeenCalledOnce()
      })
    })
  })

  BddTest().when('a source has pending changes that cannot be saved', () => {
    beforeEach(() => {
      source1.hasPendingChanges.value = true
      canSaveSource1.value = false
    })

    BddTest().then('it should be busy', () => {
      expect(state.isBusy.value).toBe(true)
    })

    BddTest().then('it should not allow saving', () => {
      expect(state.canSave.value).toBe(false)
    })
  })

  BddTest().when('both sources can be saved', () => {
    beforeEach(async () => {
      source1.hasPendingChanges.value = true
      canSaveSource1.value = true
      source2.hasPendingChanges.value = true
      await state.saveNow()
    })

    BddTest().then('saveNow should save both sources', () => {
      expect(source1.saveNow).toHaveBeenCalledOnce()
      expect(source2.saveNow).toHaveBeenCalledOnce()
    })
  })

  BddTest().when('a source is saving', () => {
    beforeEach(() => {
      source1.isSaving.value = true
    })

    BddTest().then('it should be saving and busy', () => {
      expect(state.isSaving.value).toBe(true)
      expect(state.isBusy.value).toBe(true)
    })

    BddTest().then('it should not report pending changes', () => {
      expect(state.hasPendingChanges.value).toBe(false)
    })
  })
})
