import type { VueWrapper } from '@vue/test-utils'
import { ToolBannerStub } from '#shared/ui/components/base/ToolBanner/ToolBanner.stub'
import { QuerySuspenseStub } from '#shared/ui/components/containers/QuerySuspense/QuerySuspense.stub'
import ToolDetailsContainer from '#shared/ui/components/containers/ToolDetailsContainer/ToolDetailsContainer.vue'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, beforeEach, expect, vi } from 'vitest'

BddTest().given('a tool details container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolDetailsContainer>>

  const stubs = {
    AvInput: AvInputStub,
    QuerySuspense: QuerySuspenseStub,
    ToolBanner: ToolBannerStub,
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getInputs = () => wrapper.findAllComponents(AvInputStub)
  const getBanner = () => wrapper.findComponent(ToolBannerStub)

  const mountWith = async (id: string, isNational: boolean) => {
    wrapper = mountComponent(ToolDetailsContainer, {
      props: { id, isNational },
      global: { stubs },
    })

    await vi.waitFor(() => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
    })
  }

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('a national tool has loaded', () => {
    beforeEach(async () => {
      await mountWith('NATIONAL_ID', true)
    })

    BddTest().then('it should render the tool details in read-only fields', () => {
      expect(getInputs()).toHaveLength(2)
      expect(getInputs()[0].props()).toMatchObject({
        modelValue: 'Outil national 0',
        label: 'Nom de l\'outil',
        disabled: true,
      })
      expect(getInputs()[1].props()).toMatchObject({
        modelValue: 'Description pour l\'outil national 0',
        label: 'Description de l\'outil',
        disabled: true,
        isTextarea: true,
      })
    })

    BddTest().then('it should render the tool URL as a safe external link', () => {
      const link = wrapper.get('a[aria-labelledby="tool-link-label"]')

      expect(link.text()).toBe('https://example.com/national-tool-0')
      expect(link.attributes('href')).toBe('https://example.com/national-tool-0')
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    })

    BddTest().then('it should render the banner using the loaded tool', () => {
      expect(getBanner().exists()).toBe(true)
      expect(getBanner().props('bannerId')).toBeUndefined()
    })
  })

  BddTest().when('a local tool has loaded', () => {
    beforeEach(async () => {
      await mountWith('LOCAL_ID', false)
    })

    BddTest().then('it should display the local tool details', () => {
      expect(getInputs()[0].props('modelValue')).toBe('Outil local 0')
      expect(wrapper.get('a').attributes('href')).toBe('https://example.com/local-tool-0')
    })
  })

  BddTest().when('the tool query fails', () => {
    beforeEach(async () => {
      await mountWith('INVALID_ID', true)
    })

    BddTest().then('it should forward the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBeTruthy()
      expect(getInputs()).toHaveLength(0)
    })
  })
})
