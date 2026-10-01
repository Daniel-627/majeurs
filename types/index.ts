export type ConversationStatus = "open" | "answered" | "timed_out";

export interface Conversation {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: ConversationStatus;
  created_at: string;
  replied_at: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: "visitor" | "staff" | "system";
  body: string;
  created_at: string;
}
