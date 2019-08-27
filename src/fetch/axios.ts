/*
 * @Author: sunyonghua
 * @Date: 2019-08-27 11:58:55
 * @Description: 请求库配置
 */
import axios, {AxiosResponse, AxiosRequestConfig} from 'axios'

axios.create({
  baseURL: '',
})
// 添加请求拦截器
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  // 在发送请求之前做些什么
  return config;
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use((response: AxiosResponse) => {
  return response.data
}, (error) => {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default axios