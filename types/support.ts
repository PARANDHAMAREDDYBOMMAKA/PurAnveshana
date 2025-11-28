export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED'

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface SupportMessage {
  id: string
  ticketId: string
  userId: string
  message: string
  isAdminReply: boolean
  createdAt: Date | string
  profile?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  category?: string | null
  createdAt: Date | string
  updatedAt: Date | string
  closedAt?: Date | string | null
  profile?: {
    id: string
    name: string
    email: string
  }
  messages?: SupportMessage[]
  _count?: {
    messages: number
  }
}

export interface CreateTicketRequest {
  subject: string
  message: string
  category?: string
  priority?: TicketPriority
}

export interface CreateMessageRequest {
  message: string
}

export interface UpdateTicketRequest {
  status?: TicketStatus
  priority?: TicketPriority
  category?: string
}

export interface SupportStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  urgent: number
}
