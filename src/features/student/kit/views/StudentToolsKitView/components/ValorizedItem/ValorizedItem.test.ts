import type { VueWrapper } from '@vue/test-utils'
import { selfKnowledgeCategoriesErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { type ValorizedElementType, ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import ValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { AvButtonStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return { ...actual, useTextTruncation: () => ({ isTruncated: mockIsTruncated }) }
})

const ITEM_ID = 'item-123'
const PARENT_ID = 'parent-456'
const TITLE = 'Test Title'

BddTest().given('a ValorizedItem component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedItem>>

  const stubs = {
    AvButton: AvButtonStub,
    AvTooltip: AvTooltipStub,
  }

  function mountValorizedItem (type: ValorizedElementType, parentId?: string) {
    wrapper = mountComponent(ValorizedItem, {
      props: {
        title: TITLE,
        itemId: ITEM_ID,
        parentId,
        type,
      },
      global: { stubs },
    })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      mountValorizedItem(ValorizedItemType.DECLARED_EXPERIENCE)
      await flushPromises()
    })

    BddTest().then('it should render the valorized item', () => {
      expect(wrapper.find('[data-testid="valorized-item"]').exists()).toBe(true)
    })

    BddTest().then('it should display the title in the tooltip', () => {
      const tooltip = wrapper.findComponent(AvTooltipStub)
      expect(tooltip.exists()).toBe(true)
      expect(tooltip.props('content')).toBe(TITLE)
    })

    BddTest().then('it should render the slot content', async () => {
      const slotWrapper = mountComponent(ValorizedItem, {
        props: { title: TITLE, itemId: ITEM_ID, type: ValorizedItemType.DECLARED_EXPERIENCE },
        global: { stubs },
        slots: { default: '<div data-testid="slot-content" />' },
      })
      await flushPromises()
      expect(slotWrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
    })
  })

  BddTest().when('mounted with ASSOCIATED_TRACE type', () => {
    beforeEach(async () => {
      mountValorizedItem(ValorizedItemType.ASSOCIATED_TRACE)
      await flushPromises()
    })

    BddTest().then('it should render the access button pointing to TOOLS_TRACE route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.TOOLS_TRACE.name,
        params: { id: ITEM_ID },
      })
    })
  })

  BddTest().when('mounted with NON_ASSOCIATED_TRACE type', () => {
    beforeEach(async () => {
      mountValorizedItem(ValorizedItemType.NON_ASSOCIATED_TRACE)
      await flushPromises()
    })

    BddTest().then('it should render the access button pointing to TOOLS_TRACE route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.TOOLS_TRACE.name,
        params: { id: ITEM_ID },
      })
    })
  })

  BddTest().when('mounted with DECLARED_EXPERIENCE type', () => {
    beforeEach(async () => {
      mountValorizedItem(ValorizedItemType.DECLARED_EXPERIENCE)
      await flushPromises()
    })

    BddTest().then('it should render the access button pointing to DECLARED_EXPERIENCE route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
        params: { id: ITEM_ID },
      })
    })
  })

  BddTest().when('mounted with DECLARED_PROGRAM type', () => {
    beforeEach(async () => {
      mountValorizedItem(ValorizedItemType.DECLARED_PROGRAM)
      await flushPromises()
    })

    BddTest().then('it should render the access button pointing to PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
        params: { id: ITEM_ID },
      })
    })
  })

  BddTest().when('mounted with DECLARED_SKILL type', () => {
    beforeEach(async () => {
      mountValorizedItem(ValorizedItemType.DECLARED_SKILL)
      await flushPromises()
    })

    BddTest().then('it should render the access button pointing to PROJECT_DECLARED_SKILL route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.PROJECT_DECLARED_SKILL.name,
        params: { id: ITEM_ID },
      })
    })
  })

  BddTest().when('mounted with a self-knowledge type and categories are loaded', () => {
    beforeEach(async () => {
      mountValorizedItem(ESelfKnowledgeCategory.STRENGTHS, PARENT_ID)
      await flushPromises()
    })

    BddTest().then('it should render the access button pointing to SELFKNOWLEDGE_CATEGORY route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
        params: { id: PARENT_ID },
        query: { elementId: ITEM_ID },
      })
    })
  })

  BddTest().when('mounted with a self-knowledge type and categories fail to load', () => {
    beforeEach(async () => {
      server.use(selfKnowledgeCategoriesErrorHandler)
      mountValorizedItem(ESelfKnowledgeCategory.STRENGTHS, PARENT_ID)
      await flushPromises()
    })

    BddTest().then('it should not render the access button', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(false)
    })
  })
})
