import { BroadcasterDto } from './subtypes/broadcaster.dto';
import { MetadataDto } from './subtypes/metadata.dto';

export class LiveStreamMetadataUpdatedDto {
  broadcaster: BroadcasterDto;

  metadata: MetadataDto
}
