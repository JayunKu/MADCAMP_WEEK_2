import { useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 기본 axios 인스턴스
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  withCredentials: true,
});

// 간단한 요청용 커스텀 훅
export function useAxios<T = any, R = AxiosResponse<T>>(
  config?: AxiosRequestConfig
) {
  const request = useCallback(
    async (overrideConfig?: AxiosRequestConfig): Promise<R> => {
      const mergedConfig = { ...config, ...overrideConfig };
      return axiosInstance.request<T, R>(mergedConfig);
    },
    [config]
  );

  return request;
}

// 사용 예시:
// const request = useAxios({ url: '/user', method: 'get' });
// useEffect(() => { request().then(res => ...); }, [request]);
