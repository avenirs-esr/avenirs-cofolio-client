import type { VueWrapper } from '@vue/test-utils'
import { ToolBannerStub } from '#shared/ui/components/base/ToolBanner/ToolBanner.stub'
import { ToolInstitutionStub } from '#shared/ui/components/base/ToolInstitution/ToolInstitution.stub'
import { QuerySuspenseStub } from '#shared/ui/components/containers/QuerySuspense/QuerySuspense.stub'
import ToolDetailsContainer from '#shared/ui/components/containers/ToolDetailsContainer/ToolDetailsContainer.vue'
import { ToolDescriptionTextareaStub } from '#shared/ui/components/interactions/inputs/ToolDescriptionTextarea/ToolDescriptionTextarea.stub'
import { ToolNameInputStub } from '#shared/ui/components/interactions/inputs/ToolNameInput/ToolNameInput.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, beforeEach, expect, vi } from 'vitest'

BddTest().given('a tool details container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolDetailsContainer>>

  const stubs = {
    ToolNameInput: ToolNameInputStub,
    ToolDescriptionTextarea: ToolDescriptionTextareaStub,
    QuerySuspense: QuerySuspenseStub,
    ToolBanner: ToolBannerStub,
    ToolInstitution: ToolInstitutionStub,
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getNameInput = () => wrapper.findComponent(ToolNameInputStub)
  const getDescriptionTextarea = () => wrapper.findComponent(ToolDescriptionTextareaStub)
  const getBanner = () => wrapper.findComponent(ToolBannerStub)
  const getToolInstitution = () => wrapper.findComponent(ToolInstitutionStub)

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
      expect(getNameInput().props()).toMatchObject({
        modelValue: 'Outil national 0',
        disabled: true,
      })
      expect(getDescriptionTextarea().props()).toMatchObject({
        modelValue: 'Description pour l\'outil national 0',
        disabled: true,
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

    BddTest().then('it should render the tool institution component', () => {
      expect(getToolInstitution().exists()).toBe(true)
    })
  })

  BddTest().when('a local tool has loaded', () => {
    beforeEach(async () => {
      await mountWith('LOCAL_ID', false)
    })

    BddTest().then('it should display the local tool details', () => {
      expect(getNameInput().props('modelValue')).toBe('Outil local 0')
      expect(wrapper.get('a').attributes('href')).toBe('https://example.com/local-tool-0')
    })

    BddTest().then('it should render the tool institution component', () => {
      expect(getToolInstitution().exists()).toBe(true)
    })
  })

  BddTest().when('the tool query fails', () => {
    beforeEach(async () => {
      await mountWith('INVALID_ID', true)
    })

    BddTest().then('it should forward the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBeTruthy()
      expect(getNameInput().exists()).toBe(false)
      expect(getDescriptionTextarea().exists()).toBe(false)
    })
  })
})
