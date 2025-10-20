import { useDrawer } from '@/common/composables/use-drawer/use-drawer'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a useDrawer composable', () => {
  BddTest().and('a fresh drawer instance', () => {
    let useDrawerResult: ReturnType<typeof useDrawer>

    beforeEach(() => {
      useDrawerResult = useDrawer()
    })

    BddTest().when('the composable is initialized', () => {
      BddTest().then('the drawer should be hidden by default', () => {
        expect(useDrawerResult.showDrawer.value).toBe(false)
      })

      BddTest().then('all expected properties and methods should be returned', () => {
        expect(useDrawerResult).toHaveProperty('showDrawer')
        expect(useDrawerResult).toHaveProperty('displayDrawer')
        expect(useDrawerResult).toHaveProperty('hideDrawer')

        expect(typeof useDrawerResult.displayDrawer).toBe('function')
        expect(typeof useDrawerResult.hideDrawer).toBe('function')
        expect(typeof useDrawerResult.showDrawer.value).toBe('boolean')
      })

      BddTest().then('the showDrawer should be a reactive ref', () => {
        const initialValue = useDrawerResult.showDrawer.value
        expect(initialValue).toBe(false)
        expect(typeof useDrawerResult.showDrawer.value).toBe('boolean')
      })
    })

    BddTest().when('displayDrawer is called', () => {
      beforeEach(() => {
        useDrawerResult.displayDrawer()
      })

      BddTest().then('the drawer should be visible', () => {
        expect(useDrawerResult.showDrawer.value).toBe(true)
      })

      BddTest().then('the ref should be reactive and changed from initial state', () => {
        expect(useDrawerResult.showDrawer.value).toBe(true)
      })

      BddTest().when('hideDrawer is called after displaying', () => {
        beforeEach(() => {
          useDrawerResult.hideDrawer()
        })

        BddTest().then('the drawer should be hidden', () => {
          expect(useDrawerResult.showDrawer.value).toBe(false)
        })
      })
    })

    BddTest().when('hideDrawer is called on a hidden drawer', () => {
      beforeEach(() => {
        useDrawerResult.hideDrawer()
      })

      BddTest().then('the drawer should remain hidden', () => {
        expect(useDrawerResult.showDrawer.value).toBe(false)
      })
    })
  })

  BddTest().and('a drawer instance with show/hide cycles', () => {
    let drawerInstance: ReturnType<typeof useDrawer>

    beforeEach(() => {
      drawerInstance = useDrawer()
    })

    BddTest().when('multiple show/hide operations are performed', () => {
      beforeEach(() => {
        drawerInstance.displayDrawer()
        drawerInstance.hideDrawer()
        drawerInstance.displayDrawer()
        drawerInstance.hideDrawer()
      })

      BddTest().then('the drawer should end in hidden state', () => {
        expect(drawerInstance.showDrawer.value).toBe(false)
      })
    })

    BddTest().when('alternating between show and hide states', () => {
      BddTest().then('each state change should be correctly reflected', () => {
        expect(drawerInstance.showDrawer.value).toBe(false)

        drawerInstance.displayDrawer()
        expect(drawerInstance.showDrawer.value).toBe(true)

        drawerInstance.hideDrawer()
        expect(drawerInstance.showDrawer.value).toBe(false)

        drawerInstance.displayDrawer()
        expect(drawerInstance.showDrawer.value).toBe(true)

        drawerInstance.hideDrawer()
        expect(drawerInstance.showDrawer.value).toBe(false)
      })
    })
  })

  BddTest().and('multiple independent drawer instances', () => {
    let drawer1: ReturnType<typeof useDrawer>
    let drawer2: ReturnType<typeof useDrawer>

    beforeEach(() => {
      drawer1 = useDrawer()
      drawer2 = useDrawer()
    })

    BddTest().when('both instances are created', () => {
      BddTest().then('both should be hidden initially', () => {
        expect(drawer1.showDrawer.value).toBe(false)
        expect(drawer2.showDrawer.value).toBe(false)
      })
    })

    BddTest().when('first drawer is displayed', () => {
      beforeEach(() => {
        drawer1.displayDrawer()
      })

      BddTest().then('only the first drawer should be visible', () => {
        expect(drawer1.showDrawer.value).toBe(true)
        expect(drawer2.showDrawer.value).toBe(false)
      })

      BddTest().when('second drawer is also displayed', () => {
        beforeEach(() => {
          drawer2.displayDrawer()
        })

        BddTest().then('both drawers should be visible', () => {
          expect(drawer1.showDrawer.value).toBe(true)
          expect(drawer2.showDrawer.value).toBe(true)
        })

        BddTest().when('first drawer is hidden', () => {
          beforeEach(() => {
            drawer1.hideDrawer()
          })

          BddTest().then('only the second drawer should remain visible', () => {
            expect(drawer1.showDrawer.value).toBe(false)
            expect(drawer2.showDrawer.value).toBe(true)
          })
        })
      })
    })
  })
})
