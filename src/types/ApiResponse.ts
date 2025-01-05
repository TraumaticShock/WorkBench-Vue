// API 响应的类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
