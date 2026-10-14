import type { Component } from 'vue'

export interface SectionNavigationItem {
  id: string
  label: string
  icon: string
}

export interface SectionSelection {
  itemId: string
  parentId?: string
}

type PropsOf<TComponent> =
  TComponent extends abstract new (...args: never[]) => { $props: infer P }
    ? P
    : never

export type SectionPropsBySection<TComponents extends Record<string, Component>> = {
  [K in keyof TComponents]?: Partial<PropsOf<TComponents[K]>>
}
