import { useModal } from '@/common/composables/use-modal/use-modal'
import { beforeEach, describe, expect } from 'vitest'

describe('useModal', () => {
  describe('given a fresh modal instance', () => {
    let useModalResult: ReturnType<typeof useModal>

    beforeEach(() => {
      useModalResult = useModal()
    })

    describe('when the composable is initialized', () => {
      it('then the modal should be hidden by default', () => {
        expect(useModalResult.showModal.value).toBe(false)
      })

      it('then all expected properties and methods should be returned', () => {
        expect(useModalResult).toHaveProperty('showModal')
        expect(useModalResult).toHaveProperty('displayModal')
        expect(useModalResult).toHaveProperty('hideModal')

        expect(typeof useModalResult.displayModal).toBe('function')
        expect(typeof useModalResult.hideModal).toBe('function')
        expect(typeof useModalResult.showModal.value).toBe('boolean')
      })

      it('then the showModal should be a reactive ref', () => {
        const initialValue = useModalResult.showModal.value
        expect(initialValue).toBe(false)
        expect(typeof useModalResult.showModal.value).toBe('boolean')
      })
    })

    describe('when displayModal is called', () => {
      beforeEach(() => {
        useModalResult.displayModal()
      })

      it('then the modal should be visible', () => {
        expect(useModalResult.showModal.value).toBe(true)
      })

      it('then the ref should be reactive and changed from initial state', () => {
        expect(useModalResult.showModal.value).not.toBe(false)
        expect(useModalResult.showModal.value).toBe(true)
      })

      describe('when hideModal is called after displaying', () => {
        beforeEach(() => {
          useModalResult.hideModal()
        })

        it('then the modal should be hidden', () => {
          expect(useModalResult.showModal.value).toBe(false)
        })
      })
    })

    describe('when hideModal is called on a hidden modal', () => {
      beforeEach(() => {
        useModalResult.hideModal()
      })

      it('then the modal should remain hidden', () => {
        expect(useModalResult.showModal.value).toBe(false)
      })
    })
  })

  describe('given a modal instance with show/hide cycles', () => {
    let modalInstance: ReturnType<typeof useModal>

    beforeEach(() => {
      modalInstance = useModal()
    })

    describe('when multiple show/hide operations are performed', () => {
      beforeEach(() => {
        modalInstance.displayModal()
        modalInstance.hideModal()
        modalInstance.displayModal()
        modalInstance.hideModal()
      })

      it('then the modal should end in hidden state', () => {
        expect(modalInstance.showModal.value).toBe(false)
      })
    })

    describe('when alternating between show and hide states', () => {
      it('then each state change should be correctly reflected', () => {
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

  describe('given multiple independent modal instances', () => {
    let modal1: ReturnType<typeof useModal>
    let modal2: ReturnType<typeof useModal>

    beforeEach(() => {
      modal1 = useModal()
      modal2 = useModal()
    })

    describe('when both instances are created', () => {
      it('then both should be hidden initially', () => {
        expect(modal1.showModal.value).toBe(false)
        expect(modal2.showModal.value).toBe(false)
      })
    })

    describe('when first modal is displayed', () => {
      beforeEach(() => {
        modal1.displayModal()
      })

      it('then only the first modal should be visible', () => {
        expect(modal1.showModal.value).toBe(true)
        expect(modal2.showModal.value).toBe(false)
      })

      describe('when second modal is also displayed', () => {
        beforeEach(() => {
          modal2.displayModal()
        })

        it('then both modals should be visible', () => {
          expect(modal1.showModal.value).toBe(true)
          expect(modal2.showModal.value).toBe(true)
        })

        describe('when first modal is hidden', () => {
          beforeEach(() => {
            modal1.hideModal()
          })

          it('then only the second modal should remain visible', () => {
            expect(modal1.showModal.value).toBe(false)
            expect(modal2.showModal.value).toBe(true)
          })
        })
      })
    })
  })
})
