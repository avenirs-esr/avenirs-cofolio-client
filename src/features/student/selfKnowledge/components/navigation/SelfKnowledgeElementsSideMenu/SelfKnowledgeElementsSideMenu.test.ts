import { ESelfKnowledgeCategory, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { SideMenuStub } from '@/common/components/navigation/SideMenu/SideMenu.stub'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { SelfKnowledgeElementCompactCardStub } from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCompactCard/SelfKnowledgeElementCompactCard.stub'
import SelfKnowledgeElementsSideMenu, { type SelfKnowledgeElementsSideMenuProps } from '@/features/student/selfKnowledge/components/navigation/SelfKnowledgeElementsSideMenu/SelfKnowledgeElementsSideMenu.vue'
import { AvBadgeStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given(' a SelfKnowledgeElementsSideMenu component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementsSideMenu>>

  const dummyElements: SelfKnowledgeElementViewDTO[] = [
    {
      id: '1',
      title: 'Intitulé de l\'élément n°1 sur deux lignes maximum',
      description: 'Petit texte qui explique comment l\'étudiant a développé cet élément, dans quelles formation, exp...',
      rating: 3,
      category: { type: ESelfKnowledgeCategory.STRENGTHS, mandatory: true }
    },
    {
      id: '2',
      title: 'Force de communication',
      description: 'J\'ai développé cette compétence lors de mes projets de groupe et mes présentations en classe.',
      rating: 4,
      category: { type: ESelfKnowledgeCategory.STRENGTHS, mandatory: true }
    },
    {
      id: '3',
      title: 'Créativité',
      description: 'Ma créativité s\'exprime dans mes projets artistiques et mes solutions innovantes.',
      rating: 5,
      category: { type: ESelfKnowledgeCategory.STRENGTHS, mandatory: true }
    },
  ]

  const props: SelfKnowledgeElementsSideMenuProps = {
    categoryType: ESelfKnowledgeCategory.STRENGTHS,
    elements: dummyElements,
    selectedElementId: '2'
  }

  const stubs = {
    AvBadge: AvBadgeStub,
    AvIconText: AvIconTextStub,
    SideMenu: SideMenuStub,
    FloatingIconCard: FloatingIconCardStub,
    SelfKnowledgeElementCompactCard: SelfKnowledgeElementCompactCardStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(SelfKnowledgeElementsSideMenu, { props, global: { stubs } })
    })

    BddTest().then('it should render the side menu with the correct number of elements', () => {
      const sideMenu = wrapper.findComponent(SideMenuStub)
      expect(sideMenu.exists()).toBe(true)

      const elementItems = sideMenu.findAllComponents(SelfKnowledgeElementCompactCardStub)
      expect(elementItems.length).toBe(dummyElements.length)
    })

    BddTest().then('it should not render the AvIconText', () => {
      const iconText = wrapper.findComponent(AvIconTextStub)
      expect(iconText.exists()).toBe(false)
    })

    BddTest().then('it should highlight the selected element', () => {
      const selectedItem = wrapper.findAll('a[role="button"]').find(item =>
        item.text() === 'Force de communication'
      )
      expect(selectedItem?.classes()).toContain('self-knowledge-elements-side-menu__element--selected')
    })

    BddTest().and('an element is clicked', () => {
      beforeEach(async () => {
        const elementItems = wrapper.findAll('a[role="button"]')
        await elementItems[0].trigger('click')
      })

      BddTest().then('it should emit selectElement event', async () => {
        expect(wrapper.emitted('selectElement')).toBeTruthy()
        expect(wrapper.emitted('selectElement')?.[0]).toEqual(['1'])
      })
    })

    BddTest().and('a keyboard enter is pressed on an element', () => {
      beforeEach(async () => {
        const elementItems = wrapper.findAll('a[role="button"]')
        await elementItems[2].trigger('keydown.enter')
      })

      BddTest().then('it should emit selectElement event', async () => {
        expect(wrapper.emitted('selectElement')).toBeTruthy()
        expect(wrapper.emitted('selectElement')?.[0]).toEqual(['3'])
      })
    })

    BddTest().and('a keyboard space is pressed on an element', () => {
      beforeEach(async () => {
        const elementItems = wrapper.findAll('a[role="button"]')
        await elementItems[2].trigger('keydown.space')
      })

      BddTest().then('it should emit selectElement event', async () => {
        expect(wrapper.emitted('selectElement')).toBeTruthy()
        expect(wrapper.emitted('selectElement')?.[0]).toEqual(['3'])
      })
    })

    BddTest().and('the side menu is collapsed', () => {
      beforeEach(async () => {
        wrapper.findComponent(SideMenuStub).vm.$emit('update:collapsed', true)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the collapsed state', () => {
        const sideMenu = wrapper.findComponent(SideMenuStub)
        expect(sideMenu.props('collapsed')).toBe(true)
      })
    })
  })
})
