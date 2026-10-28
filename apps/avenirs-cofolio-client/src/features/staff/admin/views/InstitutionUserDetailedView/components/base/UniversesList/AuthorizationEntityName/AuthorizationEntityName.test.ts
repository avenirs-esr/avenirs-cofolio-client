import type { VueWrapper } from '@vue/test-utils'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from '@avenirs-esr/shared/test-utils/unit'
import { RouterLinkStub } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import { EActivityStatus, EAuthorizationEntityType } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import AuthorizationEntityName from '@/features/staff/admin/views/InstitutionUserDetailedView/components/base/UniversesList/AuthorizationEntityName/AuthorizationEntityName.vue'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useTextTruncation: () => ({
      isTruncated: mockIsTruncated,
    }),
  }
})

const mockEntity = {
  id: 'activity-1',
  name: 'Activité de démonstration',
  type: EAuthorizationEntityType.ACTIVITY,
}

BddTest().given('an authorization entity name', () => {
  let wrapper: VueWrapper<InstanceType<typeof AuthorizationEntityName>>

  const stubs = {
    AvTooltip: AvTooltipStub,
    RouterLink: RouterLinkStub,
  }

  const mountWith = async (
    withNav = false,
    entity = mockEntity,
  ) => {
    wrapper = await mountWithRouter<typeof AuthorizationEntityName>(AuthorizationEntityName, {
      props: { entity, withNav },
      global: { stubs },
    })
  }

  const getAvTooltip = () => wrapper.findComponent(AvTooltipStub)
  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getNameContent = () => wrapper.get('[data-testid="entity-name-content"]')
  const getContainer = () => wrapper.get('[data-testid="entity-name"]')

  beforeEach(() => {
    mockIsTruncated.value = false
  })

  BddTest().when('the component is rendered with navigation activated', () => {
    beforeEach(async () => {
      await mountWith(true)
    })

    BddTest().then('it should display the entity name', () => {
      expect(getNameContent().text()).toContain(mockEntity.name)
    })

    BddTest().then('it should expose the entity id on the container and link', () => {
      expect(getContainer().attributes('data-entity-id')).toBe(mockEntity.id)
      expect(getNameContent().attributes('data-entity-id')).toBe(mockEntity.id)
    })

    BddTest().then('it should link to the published activity', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: {
          id: mockEntity.id,
          status: EActivityStatus.PUBLISHED,
        },
      })
    })

    BddTest().then('it should open the link in a new tab', () => {
      expect(getRouterLink().attributes('target')).toBe('_blank')
      expect(getRouterLink().attributes('rel')).toBe('noopener noreferrer')
    })

    BddTest().then('it should display the external link icon', () => {
      expect(getNameContent().findComponent({ name: 'AvIcon' }).exists()).toBe(true)
    })

    BddTest().then('it should pass the entity name as tooltip content', () => {
      expect(getAvTooltip().props('content')).toBe(mockEntity.name)
    })

    BddTest().then('it should disable the tooltip when the name is not truncated', () => {
      expect(getAvTooltip().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the component is rendered without navigation activated', () => {
    beforeEach(async () => {
      await mountWith(false)
    })

    BddTest().then('it should display the entity name', () => {
      expect(getNameContent().text()).toBe(mockEntity.name)
    })

    BddTest().then('it should not render a router link', () => {
      expect(getRouterLink().exists()).toBe(false)
    })

    BddTest().then('it should not display the external link icon', () => {
      expect(getNameContent().findComponent({ name: 'AvIcon' }).exists()).toBe(false)
    })
  })

  BddTest().when('the entity is an activity draft', () => {
    beforeEach(async () => {
      await mountWith(true, {
        ...mockEntity,
        type: EAuthorizationEntityType.ACTIVITY_DRAFT,
      })
    })

    BddTest().then('it should link to the draft activity', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: {
          id: mockEntity.id,
          status: EActivityStatus.DRAFT,
        },
      })
    })
  })

  BddTest().when('the entity name is truncated', () => {
    beforeEach(async () => {
      mockIsTruncated.value = true
      await mountWith(true)
    })

    BddTest().then('it should enable the tooltip', () => {
      expect(getAvTooltip().props('disabled')).toBe(false)
    })
  })
})
