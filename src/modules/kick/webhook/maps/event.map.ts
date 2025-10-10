import { EVENT_TYPE } from '../headers/event-type.header';
import { LiveStreamMetadataUpdatedDto } from '../payloads/livestream-medatada-updated.dto';
import { LiveStreamStatusUpdatedDto } from '../payloads/livestream-status-updated.dto';

export type EventBodyMap = {
  [EVENT_TYPE.LIVESTREAM_STATUS_STREAM_UPDATED]: LiveStreamStatusUpdatedDto;
  [EVENT_TYPE.LIVESTREAM_STATUS_METADATA_UPDATED]: LiveStreamMetadataUpdatedDto;
};
