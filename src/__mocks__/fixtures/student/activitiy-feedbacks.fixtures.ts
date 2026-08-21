import { EFeedbackStatus, EFileType, type FeedbackOverviewDTO } from '@/api/avenir-esr'

export const feedback: FeedbackOverviewDTO = {
  id: 'feedback-1',
  staff: {
    id: 'staff-1',
    email: 'staff@test.fr',
    firstName: 'Marc',
    lastName: 'Perceval',
  },
  student: {
    id: 'student-1',
    email: 'student@test.fr',
    firstName: 'Alice',
    lastName: 'Martin',
  },
  feedback: 'Un retour détaillé',
  status: EFeedbackStatus.NEW,
  createdAt: '2025-05-05T10:00:00.000Z',
  updatedAt: '2025-05-05T10:00:00.000Z',
  attachments: [
    {
      id: 'file-1',
      fileName: 'document-1.pdf',
      fileSize: 1024,
      fileType: EFileType.PDF,
      url: 'https://example.com/document-1.pdf',
      uploadedAt: '2025-05-05T10:00:00.000Z',
    },
    {
      id: 'file-2',
      fileName: 'document-2.pdf',
      fileSize: 2048,
      fileType: EFileType.PDF,
      url: 'https://example.com/document-2.pdf',
      uploadedAt: '2025-05-05T10:00:00.000Z',
    },
  ],
}
