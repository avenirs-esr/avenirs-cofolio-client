import CompactCardSelector, { type CompactCardSelectorProps } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { SelectorOverlayStub } from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.stub'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a compact card selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof CompactCardSelector>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
    SelectorOverlay: SelectorOverlayStub
  }

  BddTest().when('the component is mounted with elements', () => {
    const props: CompactCardSelectorProps = {
      elements: [{ id: '1', title: 'Element 1' }, { id: '2', title: 'Element 2', showSlot: true }],
      readonly: false,
      icon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
      color: 'var(--color)',
      backgroundColor: 'var(--background-color)',
      iconBorderColor: 'var(--icon-border-color)',
      checkboxColor: 'var(--checkbox-color)',
      overlayColor: 'var(--overlay-color)',
      overlayOpacity: 0.5,
    }

    const slots = {
      default: '<div data-testid="default-slot">Default Slot</div>'
    }

    beforeEach(() => {
      wrapper = mount(CompactCardSelector, { props, slots, global: { stubs } })
    })

    BddTest().then('it should render the floating icon cards with the correct props', () => {
      const cards = wrapper.findAllComponents(FloatingIconCardStub)
      expect(cards).toHaveLength(props.elements.length)

      cards.forEach((card, index) => {
        expect(card.props('title')).toEqual(props.elements[index].title)
        expect(card.props('iconOptions')).toMatchObject({
          name: props.icon,
          color: props.color,
          borderColor: props.iconBorderColor
        })
        expect(card.props('titleColor')).toEqual(props.color)
        expect(card.props('color')).toEqual(props.backgroundColor)
      })
    })

    BddTest().then('it should render only one default slot', () => {
      const defaultSlots = wrapper.findAll('[data-testid="default-slot"]')
      expect(defaultSlots).toHaveLength(1)
    })

    BddTest().and('an element is clicked', () => {
      beforeEach(async () => {
        expect(wrapper.find('[data-testid="selector-overlay"]').exists()).toBe(true)
        await wrapper.find('[data-testid="selector-overlay"]').trigger('click')
      })

      BddTest().then('it should update the model with the element id', () => {
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([props.elements[0].id])
      })

      BddTest().and('the element is clicked again', () => {
        beforeEach(async () => {
          expect(wrapper.find('[data-testid="selector-overlay"]').exists()).toBe(true)
          await wrapper.find('[data-testid="selector-overlay"]').trigger('click')
        })

        BddTest().then('it should update the model to remove the element id', () => {
          expect(wrapper.emitted('update:modelValue')?.[1][0]).toEqual([])
        })
      })
    })
  })

  BddTest().when('the component is mounted in readonly mode', () => {
    const props: CompactCardSelectorProps = {
      elements: [{ id: '1', title: 'Element 1', }],
      icon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
      color: 'var(--color)',
      backgroundColor: 'var(--background-color)',
      readonly: true
    }

    beforeEach(() => {
      wrapper = mount(CompactCardSelector, { props, global: { stubs } })
    })

    BddTest().then('it should not render the overlay', () => {
      expect(wrapper.find('[data-testid="selector-overlay"]').exists()).toBe(false)
    })
  })
})
