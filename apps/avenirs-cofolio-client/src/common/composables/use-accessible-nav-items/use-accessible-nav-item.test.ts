import type { Ref } from 'vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { useAccessibleNavItems } from '@/common/composables/use-accessible-nav-items/use-accessible-nav-items'
import { ROUTES } from '@/common/constants'

const { mockUseCanAccessRoute } = vi.hoisted(() => ({
  mockUseCanAccessRoute: vi.fn(),
}))

vi.mock('@/common/composables/use-can-access-route/use-can-access-route', () => ({
  useCanAccessRoute: mockUseCanAccessRoute,
}))

const HOME = { id: 'nav-home', to: ROUTES.STUDENT.HOME, text: 'Home' }
const SKILLS = { id: 'nav-skills', to: ROUTES.STUDENT.SKILLS, text: 'Skills' }
const HELP = { id: 'nav-help', to: 'https://example.com/help', text: 'Help' }
const TRACES = { to: ROUTES.STUDENT.TOOLS_TRACES, text: 'Traces' }
const KIT = { to: ROUTES.STUDENT.TOOLS_KIT, text: 'Kit' }
const TOOLS = { id: 'nav-tools-menu', title: 'Tools', links: [TRACES, KIT] }
const SKILLS_MENU = { id: 'nav-skills-menu', title: 'Skills', links: [{ to: ROUTES.STUDENT.SKILLS, text: 'Skills' }] }

BddTest().given('a use-accessible-nav-items composable', () => {
  const accesses = new Map<string, Ref<boolean>>()
  const accessTo = (route: { readonly name: string }) => {
    if (!accesses.has(route.name)) {
      accesses.set(route.name, ref(true))
    }
    return accesses.get(route.name)!
  }

  let navItems: Readonly<Ref<unknown[]>>
  let unmount: (() => void) | undefined

  function mountWith (items: Parameters<typeof useAccessibleNavItems>[0]) {
    const mounted = mountComposable(() => useAccessibleNavItems(items), {})
    navItems = mounted.result
    unmount = mounted.unmount
  }

  beforeEach(() => {
    accesses.clear()
    mockUseCanAccessRoute.mockReset().mockImplementation(accessTo)
  })

  afterEach(() => {
    unmount?.()
    unmount = undefined
  })

  BddTest().when('the user can access every route', () => {
    beforeEach(() => {
      mountWith([HOME, SKILLS, TOOLS])
    })

    BddTest().then('it should keep every item', () => {
      expect(navItems.value).toEqual([HOME, SKILLS, TOOLS])
    })

    BddTest().then('it should check each route once', () => {
      expect(mockUseCanAccessRoute.mock.calls.map(([route]) => route.name)).toEqual([HOME, SKILLS, TRACES, KIT].map(({ to }) => to.name))
    })
  })

  BddTest().when('the user cannot access the route of an item', () => {
    beforeEach(() => {
      accessTo(SKILLS.to).value = false
      mountWith([HOME, SKILLS, TOOLS])
    })

    BddTest().then('it should leave this item out', () => {
      expect(navItems.value).toEqual([HOME, TOOLS])
    })
  })

  BddTest().when('the user cannot access the route of a link of a menu', () => {
    beforeEach(() => {
      accessTo(KIT.to).value = false
      mountWith([HOME, TOOLS])
    })

    BddTest().then('it should keep the menu, without this link', () => {
      expect(navItems.value).toEqual([HOME, { ...TOOLS, links: [TRACES] }])
    })
  })

  BddTest().when('the user cannot access any route of a menu', () => {
    beforeEach(() => {
      accessTo(TRACES.to).value = false
      accessTo(KIT.to).value = false
      mountWith([HOME, TOOLS])
    })

    BddTest().then('it should leave the menu out', () => {
      expect(navItems.value).toEqual([HOME])
    })
  })

  BddTest().when('the same route appears in several items', () => {
    beforeEach(() => {
      mountWith([SKILLS, SKILLS_MENU])
    })

    BddTest().then('it should check it once', () => {
      expect(mockUseCanAccessRoute).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('an item leads to a URL rather than to a route', () => {
    beforeEach(() => {
      mountWith([HOME, HELP])
    })

    BddTest().then('it should keep it, without checking it', () => {
      expect(navItems.value).toEqual([HOME, HELP])
      expect(mockUseCanAccessRoute).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('the user access changes', () => {
    beforeEach(() => {
      mountWith([HOME, SKILLS, TOOLS])
    })

    BddTest().then('it should follow it', async () => {
      accessTo(SKILLS.to).value = false
      accessTo(KIT.to).value = false
      await nextTick()

      expect(navItems.value).toEqual([HOME, { ...TOOLS, links: [TRACES] }])
    })
  })

  BddTest().when('the items change, but not their routes', () => {
    const items = ref([HOME, SKILLS])

    beforeEach(() => {
      items.value = [HOME, SKILLS]
      mountWith(items)
    })

    BddTest().then('it should follow them, without checking the routes again', async () => {
      items.value = [{ ...HOME, text: 'Accueil' }, SKILLS]
      await nextTick()

      expect(navItems.value).toEqual([{ ...HOME, text: 'Accueil' }, SKILLS])
      expect(mockUseCanAccessRoute).toHaveBeenCalledTimes(2)
    })
  })
})
