import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AvPagination from './AvPagination.vue'

describe('avPagination', () => {
  const pagesMock = [
    { title: '1', label: '1', href: '#page-1' },
    { title: '2', label: '2', href: '#page-2' },
    { title: '3', label: '3', href: '#page-3' },
    { title: '4', label: '4', href: '#page-4' },
  ]

  it('should render correctly in classic mode', () => {
    const wrapper = mount(AvPagination, {
      props: {
        currentPage: 1,
        pages: pagesMock,
        compact: false,
      }
    })

    const links = wrapper.findAll('a.fr-pagination__link')
    expect(links.length).toBeGreaterThan(0)
    expect(links[0].attributes('href')).toBe('#page-1')

    expect(wrapper.attributes('aria-label')).toBe('Pagination')

    const currentPageLink = links.find(a => a.attributes('aria-current') === 'page')
    expect(currentPageLink?.text()).toContain('2')
  })

  it('should render compact mode text', () => {
    const wrapper = mount(AvPagination, {
      props: {
        currentPage: 2,
        pages: pagesMock,
        compact: true,
      }
    })

    expect(wrapper.text()).toContain('Page 3 sur 4')
    const pageNumberLinks = wrapper.findAll('a.fr-pagination__link.fr-unhidden-lg')
    expect(pageNumberLinks.length).toBe(0)
  })

  it('should emit update:current-page on navigation clicks', async () => {
    const wrapper = mount(AvPagination, {
      props: {
        currentPage: 1,
        pages: pagesMock,
        compact: false,
      }
    })

    await wrapper.find('a[title="Page suivante"]').trigger('click')
    expect(wrapper.emitted('update:current-page')).toBeTruthy()
    expect(wrapper.emitted('update:current-page')![0]).toEqual([2])

    await wrapper.find('a[title="Page précédente"]').trigger('click')
    expect(wrapper.emitted('update:current-page')![1]).toEqual([0])

    await wrapper.find('a[title="Première page"]').trigger('click')
    expect(wrapper.emitted('update:current-page')![2]).toEqual([0])

    await wrapper.find('a[title="Dernière page"]').trigger('click')
    expect(wrapper.emitted('update:current-page')![3]).toEqual([pagesMock.length - 1])

    const pageLinks = wrapper.findAll('a.fr-pagination__link.fr-unhidden-lg')
    await pageLinks[2].trigger('click')
    expect(wrapper.emitted('update:current-page')![4]).toEqual([2])
  })

  it('should disable previous navigation buttons on first page', () => {
    const wrapper = mount(AvPagination, {
      props: {
        currentPage: 0,
        pages: pagesMock,
      }
    })

    expect(wrapper.find('a[title="Page précédente"]').attributes('aria-disabled')).toBe('true')
    expect(wrapper.find('a[title="Première page"]').attributes('aria-disabled')).toBe('true')
  })

  it('should disable next navigation buttons on last page', () => {
    const wrapper = mount(AvPagination, {
      props: {
        currentPage: pagesMock.length - 1,
        pages: pagesMock,
      }
    })

    expect(wrapper.find('a[title="Page suivante"]').attributes('aria-disabled')).toBe('true')
    expect(wrapper.find('a[title="Dernière page"]').attributes('aria-disabled')).toBe('true')
  })
})
