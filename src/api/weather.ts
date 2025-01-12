import request from '@/utils/request';
import type { ApiResponse } from '@/types/ApiResponse';
import type { WeatherInfo } from '@/types/weather';

const API_KEY = '792ca158cac241e790165940b0d592c1';

export const weatherApi = {
  getWeather(longitude: number, latitude: number) {
    return request.get<ApiResponse<WeatherInfo>>('/weather', {
      params: {
        longitude,
        latitude,
      },
    });
  },
};
