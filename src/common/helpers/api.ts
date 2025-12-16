import axios, { AxiosRequestConfig } from 'axios';
import { ErrorResponse } from 'src/modules/kick/responses/responses.interface';

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorResponse };

export class Api {
  static async Get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios.get<T>(url, config);

      return { success: true, data: response.data };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data as ErrorResponse,
      };
    }
  }

  static async Post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios.post<T>(url, data, config);

      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data as ErrorResponse,
      };
    }
  }
}
