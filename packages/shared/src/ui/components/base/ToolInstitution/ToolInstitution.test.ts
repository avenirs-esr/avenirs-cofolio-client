import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { VueWrapper } from '@vue/test-utils'
import { EToolType } from '#shared/api/avenir-esr/index'
import { ICONS } from '#shared/constants/icons'
import ToolInstitution from '#shared/ui/components/base/ToolInstitution/ToolInstitution.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvIconText: AvIconTextStub,
}

BddTest().given('a tool institution component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolInstitution>>

  const defaultInstitution = {
    id: 'institution-123',
    name: 'Test institution',
  }

  const getAvIconText = () => wrapper.findComponent(AvIconTextStub)

  const mountWith = (tool: Partial<ToolDTO>, typographyClass?: string) => {
    wrapper = mountComponent(ToolInstitution, {
      props: {
        tool,
        typographyClass,
      },
      global: { stubs },
    })
  }

  BddTest().when('the component is mounted with a national tool', () => {
    beforeEach(() => {
      mountWith({
        type: EToolType.NATIONAL,
        institution: defaultInstitution,
      })
    })

    BddTest().then('it should not render the institution information', () => {
      expect(getAvIconText().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a regional tool', () => {
    beforeEach(() => {
      mountWith({
        type: EToolType.REGIONAL,
        institution: defaultInstitution,
      })
    })

    BddTest().then('it should render the institution with regional icon', () => {
      expect(getAvIconText().exists()).toBe(true)
      expect(getAvIconText().props('icon')).toBe(ICONS.REGIONAL)
      expect(getAvIconText().props('text')).toBe(defaultInstitution.name)
    })
  })

  BddTest().when('the component is mounted with a local tool', () => {
    beforeEach(() => {
      mountWith({
        type: EToolType.LOCAL,
        institution: defaultInstitution,
      })
    })

    BddTest().then('it should render the institution with local icon', () => {
      expect(getAvIconText().exists()).toBe(true)
      expect(getAvIconText().props('icon')).toBe(ICONS.LOCAL)
      expect(getAvIconText().props('text')).toBe(defaultInstitution.name)
    })
  })

  BddTest().when('the component is mounted with a custom typography class', () => {
    beforeEach(() => {
      mountWith(
        {
          type: EToolType.REGIONAL,
          institution: defaultInstitution,
        },
        'b2-regular'
      )
    })

    BddTest().then('it should use the custom typography class', () => {
      expect(getAvIconText().props('typographyClass')).toBe('b2-regular')
    })
  })

  BddTest().when('the tool has no institution name', () => {
    beforeEach(() => {
      mountWith({
        type: EToolType.REGIONAL,
        institution: {
          id: 'institution-123',
          name: '',
        },
      })
    })

    BddTest().then('it should not render the institution information', () => {
      expect(getAvIconText().exists()).toBe(false)
    })
  })

  BddTest().when('the tool has no institution', () => {
    beforeEach(() => {
      mountWith({
        type: EToolType.REGIONAL,
      })
    })

    BddTest().then('it should not render the institution information', () => {
      expect(getAvIconText().exists()).toBe(false)
    })
  })

  BddTest().when('the tool has no type', () => {
    beforeEach(() => {
      mountWith({
        institution: defaultInstitution,
      })
    })

    BddTest().then('it should not render the institution information', () => {
      expect(getAvIconText().exists()).toBe(false)
    })
  })
})
