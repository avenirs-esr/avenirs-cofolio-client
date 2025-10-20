import { useModal } from '@/common/composables/use-modal/use-modal'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an useModal composable', () => {
  BddTest().and('a fresh modal instance', () => {
    let useModalResult: ReturnType<typeof useModal>

    beforeEach(() => {
      useModalResult = useModal()
    })

    BddTest().when('the composable is initialized', () => {
      BddTest().then('the modal should be hidden by default', () => {
        expect(useModalResult.showModal.value).toBe(false)
      })

      BddTest().then('all expected properties and methods should be returned', () => {
        expect(useModalResult).toHaveProperty('showModal')
        expect(useModalResult).toHaveProperty('displayModal')
        expect(useModalResult).toHaveProperty('hideModal')

        expect(typeof useModalResult.displayModal).toBe('function')
        expect(typeof useModalResult.hideModal).toBe('function')
        expect(typeof useModalResult.showModal.value).toBe('boolean')
      })

      BddTest().then('the showModal should be a reactive ref', () => {
        const initialValue = useModalResult.showModal.value
        expect(initialValue).toBe(false)
        expect(typeof useModalResult.showModal.value).toBe('boolean')
      })
    })

    BddTest().when('displayModal is called', () => {
      beforeEach(() => {
        useModalResult.displayModal()
      })

      BddTest().then('the modal should be visible', () => {
        expect(useModalResult.showModal.value).toBe(true)
      })

      BddTest().then('the ref should be reactive and changed from initial state', () => {
        expect(useModalResult.showModal.value).not.toBe(false)
        expect(useModalResult.showModal.value).toBe(true)
      })

      BddTest().when('hideModal is called after displaying', () => {
        beforeEach(() => {
          useModalResult.hideModal()
        })

        BddTest().then('the modal should be hidden', () => {
          expect(useModalResult.showModal.value).toBe(false)
        })
      })
    })

    BddTest().when('hideModal is called on a hidden modal', () => {
      beforeEach(() => {
        useModalResult.hideModal()
      })

      BddTest().then('the modal should remain hidden', () => {
        expect(useModalResult.showModal.value).toBe(false)
      })
    })
  })

  BddTest().and('a modal instance with show/hide cycles', () => {
    let modalInstance: ReturnType<typeof useModal>

    beforeEach(() => {
      modalInstance = useModal()
    })

    BddTest().when('multiple show/hide operations are performed', () => {
      beforeEach(() => {
        modalInstance.displayModal()
        modalInstance.hideModal()
        modalInstance.displayModal()
        modalInstance.hideModal()
      })

      BddTest().then('the modal should end in hidden state', () => {
        expect(modalInstance.showModal.value).toBe(false)
      })
    })

    BddTest().when('alternating between show and hide states', () => {
      BddTest().then('each state change should be correctly reflected', () => {
        expect(modalInstance.showModal.value).toBe(false)

        modalInstance.displayModal()
        expect(modalInstance.showModal.value).toBe(true)

        modalInstance.hideModal()
        expect(modalInstance.showModal.value).toBe(false)

        modalInstance.displayModal()
        expect(modalInstance.showModal.value).toBe(true)

        modalInstance.hideModal()
        expect(modalInstance.showModal.value).toBe(false)
      })
    })
  })

  BddTest().and('multiple independent modal instances', () => {
    let modal1: ReturnType<typeof useModal>
    let modal2: ReturnType<typeof useModal>

    beforeEach(() => {
      modal1 = useModal()
      modal2 = useModal()
    })

    BddTest().when('both instances are created', () => {
      BddTest().then('both should be hidden initially', () => {
        expect(modal1.showModal.value).toBe(false)
        expect(modal2.showModal.value).toBe(false)
      })
    })

    BddTest().when('first modal is displayed', () => {
      beforeEach(() => {
        modal1.displayModal()
      })

      BddTest().then('only the first modal should be visible', () => {
        expect(modal1.showModal.value).toBe(true)
        expect(modal2.showModal.value).toBe(false)
      })

      BddTest().when('second modal is also displayed', () => {
        beforeEach(() => {
          modal2.displayModal()
        })

        BddTest().then('both modals should be visible', () => {
          expect(modal1.showModal.value).toBe(true)
          expect(modal2.showModal.value).toBe(true)
        })

        BddTest().when('first modal is hidden', () => {
          beforeEach(() => {
            modal1.hideModal()
          })

          BddTest().then('only the second modal should remain visible', () => {
            expect(modal1.showModal.value).toBe(false)
            expect(modal2.showModal.value).toBe(true)
          })
        })
      })
    })
  })
})
