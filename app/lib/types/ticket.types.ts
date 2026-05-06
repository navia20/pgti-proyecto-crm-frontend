export type TicketPriority = "urgent" | "high" | "medium" | "low";
export type TicketStatus = "open" | "in-progress" | "resolved";
export type SlaStatus = "ok" | "warning" | "critical";

export interface Ticket {
  id: string;
  title: string;
  priority: TicketPriority;
  status: TicketStatus;
  agent: string;
  category: string;
  time: string;
  slaPercent: number;
}

export interface TicketMessage {
  id: number;
  author: string;
  initials: string;
  timestamp: string;
  content: string;
  isStaff: boolean;
}

export interface TicketActivity {
  id: number;
  type: "status_change" | "assignment" | "priority_change" | "tag_added";
  user: string;
  timestamp: string;
  from?: string;
  to?: string;
  assignee?: string;
  tag?: string;
}

export interface TicketDetail extends Ticket {
  assignee: { name: string; initials: string };
  reporter: { name: string; email: string; initials: string };
  created: string;
  updated: string;
  tags: string[];
  messages: TicketMessage[];
  activity: TicketActivity[];
}

export interface WeeklyChartData {
  day: string;
  tickets: number;
}