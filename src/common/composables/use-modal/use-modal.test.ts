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
        expect(useModalResult.modalOpened.value).toBe(false)
      })

      BddTest().then('all expected properties and methods should be returned', () => {
        expect(useModalResult).toHaveProperty('modalOpened')
        expect(useModalResult).toHaveProperty('openModal')
        expect(useModalResult).toHaveProperty('closeModal')

        expect(typeof useModalResult.openModal).toBe('function')
        expect(typeof useModalResult.closeModal).toBe('function')
        expect(typeof useModalResult.modalOpened.value).toBe('boolean')
      })

      BddTest().then('the modalOpened should be a reactive ref', () => {
        const initialValue = useModalResult.modalOpened.value
        expect(initialValue).toBe(false)
        expect(typeof useModalResult.modalOpened.value).toBe('boolean')
      })
    })

    BddTest().when('openModal is called', () => {
      beforeEach(() => {
        useModalResult.openModal()
      })

      BddTest().then('the modal should be visible', () => {
        expect(useModalResult.modalOpened.value).toBe(true)
      })

      BddTest().then('the ref should be reactive and changed from initial state', () => {
        expect(useModalResult.modalOpened.value).not.toBe(false)
        expect(useModalResult.modalOpened.value).toBe(true)
      })

      BddTest().when('closeModal is called after displaying', () => {
        beforeEach(() => {
          useModalResult.closeModal()
        })

        BddTest().then('the modal should be hidden', () => {
          expect(useModalResult.modalOpened.value).toBe(false)
        })
      })
    })

    BddTest().when('closeModal is called on a hidden modal', () => {
      beforeEach(() => {
        useModalResult.closeModal()
      })

      BddTest().then('the modal should remain hidden', () => {
        expect(useModalResult.modalOpened.value).toBe(false)
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
        modalInstance.openModal()
        modalInstance.closeModal()
        modalInstance.openModal()
        modalInstance.closeModal()
      })

      BddTest().then('the modal should end in hidden state', () => {
        expect(modalInstance.modalOpened.value).toBe(false)
      })
    })

    BddTest().when('alternating between show and hide states', () => {
      BddTest().then('each state change should be correctly reflected', () => {
        expect(modalInstance.modalOpened.value).toBe(false)

        modalInstance.openModal()
        expect(modalInstance.modalOpened.value).toBe(true)

        modalInstance.closeModal()
        expect(modalInstance.modalOpened.value).toBe(false)

        modalInstance.openModal()
        expect(modalInstance.modalOpened.value).toBe(true)

        modalInstance.closeModal()
        expect(modalInstance.modalOpened.value).toBe(false)
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
        expect(modal1.modalOpened.value).toBe(false)
        expect(modal2.modalOpened.value).toBe(false)
      })
    })

    BddTest().when('first modal is displayed', () => {
      beforeEach(() => {
        modal1.openModal()
      })

      BddTest().then('only the first modal should be visible', () => {
        expect(modal1.modalOpened.value).toBe(true)
        expect(modal2.modalOpened.value).toBe(false)
      })

      BddTest().when('second modal is also displayed', () => {
        beforeEach(() => {
          modal2.openModal()
        })

        BddTest().then('both modals should be visible', () => {
          expect(modal1.modalOpened.value).toBe(true)
          expect(modal2.modalOpened.value).toBe(true)
        })

        BddTest().when('first modal is hidden', () => {
          beforeEach(() => {
            modal1.closeModal()
          })

          BddTest().then('only the second modal should remain visible', () => {
            expect(modal1.modalOpened.value).toBe(false)
            expect(modal2.modalOpened.value).toBe(true)
          })
        })
      })
    })
  })
})
