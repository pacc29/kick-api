export interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// {
//   access_token: 'ODAWZJVMYZITNDA3OC0ZZDA0LTLLOTQTMWEYMJM4MZG3ZWU3',
//   expires_in: 5184000,
//   token_type: 'Bearer'
// }

export interface GetSubscriptionsResponse {
  data: {
    app_id: string;
    broadcaster_user_id: number;
    created_at: string;
    event: string;
    id: string;
    method: string;
    updated_at: string;
    version: number;
  }[];
  message: string;
}

export interface SubscribeToEventResponse {
  data: {
    error: string;
    name: string;
    subscription_id: string;
    version: number;
  }[];
  message: string;
}

export interface GetChannelInfoResponse {
  data: {
    banner_picture: string;
    broadcaster_user_id: number;
    category: {
      id: number;
      name: string;
      thumbnail: string;
    };
    channel_description: string;
    slug: string;
    stream: {
      custom_tags: string[];
      is_live: boolean;
      is_mature: boolean;
      key: string;
      language: string;
      start_time: string;
      thumbnail: string;
      url: string;
      viewer_count: number;
    };
    stream_title: string;
  }[];
  message: string;
}

// Generic Error Response
export interface ErrorResponse {
  data: null;
  message: string;
}
