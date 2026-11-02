import type { GetDeclaredActivitiesViewParams } from '@/api/avenir-esr'

export type DeclaredActivityFilters = Pick<GetDeclaredActivitiesViewParams, 'keyword' | 'thematics' | 'statuses' | 'sortField' | 'sortOrder'>
