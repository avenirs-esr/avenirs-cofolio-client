import type { Component } from 'vue'
import type { SectionNavigationItem } from '@/common/components/layout/SectionNavigationLayout/SectionNavigationLayout.types'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { LoaderStub } from '@avenirs-esr/shared/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { markRaw } from 'vue'
import SectionNavigationLayout
  from '@/common/components/layout/SectionNavigationLayout/SectionNavigationLayout.vue'
import { SideNavigationStub } from '@/common/components/navigation/SideNavigation/SideNavigation.stub'

const useAvBreakpointsMock = vi.fn()

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => useAvBreakpointsMock(),
  }
})

const FirstSectionComponentStub = defineComponent({
  name: 'FirstSectionComponentStub',
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
  },
  template: `
    <div data-testid="first-section">
      {{ title }}
    </div>
  `,
})

const SecondSectionComponentStub = defineComponent({
  name: 'SecondSectionComponentStub',
  props: {
    description: {
      type: String,
      required: false,
      default: '',
    },
  },
  template: `
    <div data-testid="second-section">
      {{ description }}
    </div>
  `,
})

BddTest().given('a section navigation layout component', () => {
  let wrapper: ReturnType<typeof mount<typeof SectionNavigationLayout>>

  const items: SectionNavigationItem[] = [
    {
      id: 'first-section',
      label: 'Première section',
      icon: 'icon-1',
    },
    {
      id: 'second-section',
      label: 'Deuxième section',
      icon: 'icon-2',
    },
  ]

  const componentBySection = {
    'first-section': markRaw(FirstSectionComponentStub),
    'second-section': markRaw(SecondSectionComponentStub),
  } satisfies Record<string, Component>

  const propsBySection = {
    'first-section': {
      title: 'Titre de la première section',
    },
    'second-section': {
      description: 'Description de la seconde section',
    },
  }

  const stubs = {
    Loader: LoaderStub,
    SideNavigation: SideNavigationStub,
    AvSelect: AvSelectStub,
  }

  BddTest().when('the component is mounted on desktop', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      useAvBreakpointsMock.mockReturnValue({ isMobile: false })

      wrapper = mount(SectionNavigationLayout, {
        props: {
          items,
          defaultSection: 'first-section',
          componentBySection,
          propsBySection,
          sideNavigationWidth: '20rem',
          selectPlaceholder: 'Choisir une section',
          selectLabel: 'Navigation des sections',
        },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render the layout container', () => {
      expect(wrapper.find('[data-testid="section-navigation-layout"]').exists()).toBe(true)
    })

    BddTest().then('it should render the desktop side navigation', () => {
      expect(wrapper.find('[data-testid="section-navigation-side-navigation"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the mobile select navigation', () => {
      expect(wrapper.find('[data-testid="section-navigation-select-navigation"]').exists()).toBe(false)
    })

    BddTest().then('it should render the default section component', () => {
      expect(wrapper.find('[data-testid="first-section"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="second-section"]').exists()).toBe(false)
    })

    BddTest().then('it should pass the correct props to the default section component', () => {
      const firstSectionComponent = wrapper.findComponent(FirstSectionComponentStub)

      expect(firstSectionComponent.exists()).toBe(true)
      expect(firstSectionComponent.props('title')).toBe('Titre de la première section')
    })

    BddTest().then('it should pass side navigation props', () => {
      const sideNavigation = wrapper.findComponent(SideNavigationStub)

      expect(sideNavigation.exists()).toBe(true)
      expect(sideNavigation.props('selectedItem')).toEqual({
        itemId: 'first-section',
      })
      expect(sideNavigation.props('items')).toEqual([
        {
          id: 'first-section',
          label: 'Première section',
          icon: 'icon-1',
        },
        {
          id: 'second-section',
          label: 'Deuxième section',
          icon: 'icon-2',
        },
      ])
    })

    BddTest().and('the side navigation selects the second section', () => {
      beforeEach(async () => {
        wrapper.findComponent(SideNavigationStub).vm.$emit(
          'update:selectedItem',
          { itemId: 'second-section' },
        )
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should render the second section component', () => {
        expect(wrapper.find('[data-testid="second-section"]').exists()).toBe(true)
      })

      BddTest().then('it should no longer render the first section component', () => {
        expect(wrapper.find('[data-testid="first-section"]').exists()).toBe(false)
      })

      BddTest().then('it should pass the correct props to the second section component', () => {
        const secondSectionComponent = wrapper.findComponent(SecondSectionComponentStub)

        expect(secondSectionComponent.exists()).toBe(true)
        expect(secondSectionComponent.props('description')).toBe('Description de la seconde section')
      })

      BddTest().then('it should emit the selected item and its label', () => {
        expect(wrapper.emitted('selectedItem')?.at(-1)).toEqual([
          { itemId: 'second-section', parentId: undefined },
        ])
        expect(wrapper.emitted('selectedItemLabel')?.at(-1)).toEqual([
          'Deuxième section',
        ])
      })
    })

    BddTest().and('the side navigation emits a selected item with parent id', () => {
      beforeEach(async () => {
        wrapper.findComponent(SideNavigationStub).vm.$emit(
          'update:selectedItem',
          {
            itemId: 'second-section',
            parentId: 'parent-section',
          },
        )
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should preserve the selected parent id', () => {
        expect(wrapper.findComponent(SideNavigationStub).props('selectedItem')).toEqual({
          itemId: 'second-section',
          parentId: 'parent-section',
        })
      })

      BddTest().then('it should render the selected section component', () => {
        expect(wrapper.find('[data-testid="second-section"]').exists()).toBe(true)
      })

      BddTest().then('it should emit the selected item with its parent id', () => {
        expect(wrapper.emitted('selectedItem')?.at(-1)).toEqual([
          { itemId: 'second-section', parentId: 'parent-section' },
        ])
      })
    })

    BddTest().and('the side navigation emits an invalid selected item', () => {
      beforeEach(async () => {
        wrapper.findComponent(SideNavigationStub).vm.$emit(
          'update:selectedItem',
          { itemId: 'invalid-section' },
        )
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should keep the default section component', () => {
        expect(wrapper.find('[data-testid="first-section"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="second-section"]').exists()).toBe(false)
      })
    })

    BddTest().and('the default section prop changes externally', () => {
      beforeEach(async () => {
        await wrapper.setProps({ defaultSection: 'second-section' })
        await flushPromises()
      })

      BddTest().then('it should resync the selected item with the new default section', () => {
        expect(wrapper.findComponent(SideNavigationStub).props('selectedItem')).toEqual({
          itemId: 'second-section',
        })
      })

      BddTest().then('it should render the new default section component', () => {
        expect(wrapper.find('[data-testid="second-section"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="first-section"]').exists()).toBe(false)
      })
    })
  })

  BddTest().when('the component is mounted on mobile', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      useAvBreakpointsMock.mockReturnValue({ isMobile: true })

      wrapper = mount(SectionNavigationLayout, {
        props: {
          items,
          defaultSection: 'first-section',
          componentBySection,
          propsBySection,
          selectPlaceholder: 'Choisir une section',
          selectLabel: 'Navigation des sections',
        },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should render the mobile select navigation', () => {
      expect(wrapper.find('[data-testid="section-navigation-select-navigation"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the desktop side navigation', () => {
      expect(wrapper.find('[data-testid="section-navigation-side-navigation"]').exists()).toBe(false)
    })

    BddTest().then('it should render the default section component', () => {
      expect(wrapper.find('[data-testid="first-section"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="second-section"]').exists()).toBe(false)
    })

    BddTest().then('it should pass the select props and options', () => {
      const selectNavigation = wrapper.findComponent(AvSelectStub)

      expect(selectNavigation.exists()).toBe(true)
      expect(selectNavigation.props('modelValue')).toEqual({
        value: 'first-section',
        label: 'Première section',
      })
      expect(selectNavigation.props('selectedText')).toBe('Première section')
      expect(selectNavigation.props('placeholder')).toBe('Choisir une section')
      expect(selectNavigation.props('label')).toBe('Navigation des sections')
      expect(selectNavigation.props('options')).toEqual([
        {
          value: 'first-section',
          label: 'Première section',
        },
        {
          value: 'second-section',
          label: 'Deuxième section',
        },
      ])
    })

    BddTest().and('the select navigation selects the second section', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvSelectStub).vm.$emit(
          'update:modelValue',
          { value: 'second-section', label: 'Deuxième section' },
        )
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should render the second section component', () => {
        expect(wrapper.find('[data-testid="second-section"]').exists()).toBe(true)
      })

      BddTest().then('it should no longer render the first section component', () => {
        expect(wrapper.find('[data-testid="first-section"]').exists()).toBe(false)
      })

      BddTest().then('it should update the selected option', () => {
        expect(wrapper.findComponent(AvSelectStub).props('modelValue')).toEqual({
          value: 'second-section',
          label: 'Deuxième section',
        })
      })

      BddTest().then('it should pass the correct props to the second section component', () => {
        const secondSectionComponent = wrapper.findComponent(SecondSectionComponentStub)

        expect(secondSectionComponent.exists()).toBe(true)
        expect(secondSectionComponent.props('description')).toBe('Description de la seconde section')
      })

      BddTest().then('it should emit the selected item and its label', () => {
        expect(wrapper.emitted('selectedItem')?.at(-1)).toEqual([
          { itemId: 'second-section', parentId: undefined },
        ])
        expect(wrapper.emitted('selectedItemLabel')?.at(-1)).toEqual([
          'Deuxième section',
        ])
      })
    })

    BddTest().and('the select navigation emits a selected option with parent id', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvSelectStub).vm.$emit(
          'update:modelValue',
          {
            value: 'second-section',
            label: 'Deuxième section',
            parentId: 'parent-section',
          },
        )
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should preserve the parent id in the selected item event', () => {
        expect(wrapper.emitted('selectedItem')?.at(-1)).toEqual([
          { itemId: 'second-section', parentId: 'parent-section' },
        ])
      })

      BddTest().then('it should render the selected section component', () => {
        expect(wrapper.find('[data-testid="second-section"]').exists()).toBe(true)
      })

      BddTest().then('it should display the selected option without changing its label', () => {
        expect(wrapper.findComponent(AvSelectStub).props('modelValue')).toEqual({
          value: 'second-section',
          label: 'Deuxième section',
        })
      })
    })

    BddTest().and('the select navigation emits an invalid selected option', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvSelectStub).vm.$emit(
          'update:modelValue',
          { value: 'invalid-section', label: 'Section inconnue' },
        )
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should keep the default section component displayed', () => {
        expect(wrapper.find('[data-testid="first-section"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="second-section"]').exists()).toBe(false)
      })
    })
  })

  BddTest().when('the select label is not provided', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      useAvBreakpointsMock.mockReturnValue({ isMobile: true })

      wrapper = mount(SectionNavigationLayout, {
        props: {
          items,
          defaultSection: 'first-section',
          componentBySection,
          propsBySection,
          selectPlaceholder: 'Choisir une section',
        },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should use the placeholder as select label', () => {
      expect(wrapper.findComponent(AvSelectStub).props('label')).toBe('Choisir une section')
    })
  })

  BddTest().when('props by section is not provided', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      useAvBreakpointsMock.mockReturnValue({ isMobile: false })

      wrapper = mount(SectionNavigationLayout, {
        props: {
          items,
          defaultSection: 'first-section',
          componentBySection,
          selectPlaceholder: 'Choisir une section',
        },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should still render the default section component', () => {
      expect(wrapper.find('[data-testid="first-section"]').exists()).toBe(true)
    })
  })
})
