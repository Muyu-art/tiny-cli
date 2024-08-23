import axios from 'axios';
import type { Lang } from './lang';

export type I18Table = {
  [lang: string]: {
    [key: string]: string;
  };
};
export interface Locals {
  items: Local[];
  meta: Meta;
}
export interface Local {
  content: string;
  id: number;
  key: string;
  lang: Lang;
}
export interface Meta {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
export interface CreateLocal {
  content: string;
  key: string;
  lang: number;
}
export interface CreateLocalReturn {
  content: string;
  id: number;
  key: string;
  lang: Lang;
}

type DeleteLocaleRet = Omit<CreateLocalReturn, 'id'>;

export const getLocalTable = (lang?: string) => {
  return axios.get<I18Table>('/api/i18/format', { params: { lang } });
};

export const getAllLocalItems = (
  page?: number,
  limit?: number,
  all?: number
) => {
  return axios.get<Locals>('/api/i18', { params: { page, limit, all } });
};

export const createLocalItem = (data: CreateLocal) => {
  return axios.post<CreateLocalReturn>('/api/i18', data);
};
export const deleteLocale = (id: number) => {
  return axios.delete<DeleteLocaleRet>(`/api/i18/${id}`);
};
export const patchLocal = (id: number, data: Partial<CreateLocal>) => {
  return axios.patch(`/api/i18/${id}`, data);
};
