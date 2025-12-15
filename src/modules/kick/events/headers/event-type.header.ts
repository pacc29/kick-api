export enum EVENT_TYPE {
  // CHAT_MESSAGE_SENT = 'chat.message.sent',
  LIVESTREAM_STATUS_STREAM_UPDATED = 'livestream.status.updated',
  LIVESTREAM_STATUS_METADATA_UPDATED = 'livestream.metadata.updated',
}

export type KICK_WEBHOOK_HEADERS = {
  'kick-event-message-id': string; // ULID
  'kick-event-subscription-id': string; // ULID
  'kick-event-signature': string; // Base64
  'kick-event-message-timestamp': string; // RFC3339 Date-time
  'kick-event-type': EVENT_TYPE[keyof EVENT_TYPE]; // usa enum para valores posibles
  'kick-event-version': string; // ej. '1'
};
