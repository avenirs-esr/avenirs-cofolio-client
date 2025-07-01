import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import type {
  DeliverableOverviewDTO,
  EventOverviewDTO,
  PageOverviewDTO,
  ResumeOverviewDTO,
  StudentHeaderSummaryDTO
} from '@/types'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'

export const mockedProfileOverview: ProfileOverviewDTO = {
  firstname: 'Jeanne',
  lastname: 'Moulin',
  profilePicture: profile_picture_placeholder,
  coverPicture: profile_banner_placeholder,
  bio: 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète. Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
}

export const mockedDeliverablesOverview: DeliverableOverviewDTO[] = [
  {
    id: 'deliverable1',
    skill: 'Prévenir la pollution à la source',
    activity: 'SAE 1.1 Séquence 4 - Validation des recommandations et élaboration d’un plan d’action',
    deliverableUntil: '2025-06-13T08:42:17',
  },
  {
    id: 'deliverable2',
    skill: 'Mettre en place des filières d’économies circulaires',
    activity: 'SAE 1.1 Séquence 4 - Validation des recommandations et élaboration d’un plan d’action',
    deliverableUntil: '2025-07-29T19:15:03'
  },
  {
    id: 'deliverable3',
    skill: 'Évaluer l’impact environnemental et économique',
    activity: 'SAE 1.1 Séquence 4 - Un nom de séquence méga long pour tester les ellipses validation des recommandations et élaboration d’un plan d’action',
    deliverableUntil: '2025-08-07T23:08:51',

  },
  {
    id: 'deliverable4',
    skill: 'Concevoir des synthèses chimiques durables',
    activity: 'SAE 1.1 Séquence 4 - Validation des recommandations et élaboration d’un plan d’action',
    deliverableUntil: '2025-09-21T04:26:39'
  },
]

export const mockedEventsOverview: EventOverviewDTO[] = [
  {
    id: 'event1',
    name: 'Forum de l’écologie et la chimie',
    startDate: '2025-05-19T08:00',
    endDate: '2025-05-19T18:00',
    location: 'Paris'
  },
  {
    id: 'event2',
    name: 'Super forum de la mécanique quantique',
    startDate: '2025-06-25T08:30',
    endDate: '2025-06-25T17:30',
    location: 'Toulouse'
  },
  {
    id: 'event3',
    name: 'Le café des associations',
    startDate: '2025-07-03T09:00',
    endDate: '2025-07-03T17:00',
    location: 'Bordeaux'
  },
  {
    id: 'event4',
    name: 'Assemblée générale ESUP',
    startDate: '2025-08-08T09:30',
    endDate: '2025-08-08T12:15',
    location: 'Brest'
  },
] as EventOverviewDTO[]

export const mockedHeaderOverview: StudentHeaderSummaryDTO = {
  id: '123456789',
  name: 'J. Moulin',
  messagesCount: 2,
  notificationsCount: 2,
}

export const mockedPagesOverview: PageOverviewDTO[] = [
  { id: 'page1', name: 'analyse-ams-13-02-2024', updatedAt: '2025-02-22' },
  { id: 'page2', name: 'projetdevie-trajectoires', updatedAt: '2024-12-20' },
  { id: 'page3', name: 'Recherche-stage-SAP-3-avril202', updatedAt: '2024-10-04' },
  { id: 'page4', name: 'analyse-projet-de-vie', updatedAt: '2024-09-08' },
]

export const mockedResumesOverview: ResumeOverviewDTO [] = [
  { id: 'resume1', name: 'cv-version1-05-2024', updatedAt: '2025-05-19T00:00:00.000Z' },
  { id: 'resume2', name: 'cv-version1-04-2024', updatedAt: '2025-04-25T00:00:00.000Z' },
  { id: 'resume3', name: 'cv-version1-03-2024-with-a-very-long-name', updatedAt: '2025-03-03T00:00:00.000Z' },
  { id: 'resume4', name: 'cv-version1-02-2024', updatedAt: '2025-02-08T00:00:00.000Z' },
]
