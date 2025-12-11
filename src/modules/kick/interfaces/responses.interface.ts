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

export interface SubscribeResponse {
  data: {
    error: string;
    name: string;
    subscription_id: string;
    version: number;
  }[];
  message: string;
}

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

// Generic Response
export interface ErrorResponse {
  data: null;
  message: string;
}
