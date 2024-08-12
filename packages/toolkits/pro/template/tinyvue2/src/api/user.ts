import type { User } from "@/stores/user";
import axios from "axios";

export interface LoginData {
  email: string;
  password: string;
}

export interface LogoutData {
  token: string | null;
}

export interface LoginRes {
  token: string;
  userInfo: User;
}

export function login(data: LoginData){
  return axios.post<LoginRes>('/api/auth/login', data)
}

export function logout(data: LogoutData) {
  return axios.post<LoginRes>('/api/auth/logout', data);
}

// 获取单个用户
export function getUserInfo(email: string) {
  return axios.get<User>(`/api/user/info/${email}`);
}

export function getUserData(){
  return axios.get('/mock/user/data')
}

export function updateUserInfo(data: any) {
  return axios.patch('/api/user/update', data);
}

