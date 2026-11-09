import type { GetDeclaredActivitiesViewParams } from '@avenirs-esr/shared/api/avenir-esr'

export type DeclaredActivityFilters = Pick<GetDeclaredActivitiesViewParams, 'keyword' | 'thematics' | 'statuses' | 'sortField' | 'sortOrder'>
