import axios from 'axios';

export type CreateRole = {
  name: string;
  menuIds: number[];
  permissionIds: number[];
};

export type UpdateRole = Partial<CreateRole> & {
  id: number;
};

export function getAllRole() {
  return axios.get('/api/role');
}

export function getAllRoleDetail() {
  return axios.get('/api/role/detail');
}

export function updateRole(data: UpdateRole) {
  return axios.patch(`/api/role`, data);
}

export function deleteRole(id: number) {
  return axios.delete(`/api/role/${id}`);
}

export function createRole(data: CreateRole) {
  return axios.post(`/api/role`, data);
}

export function getRoleInfo(id: number) {
  return axios.get(`/api/role/info/${id}`);
}
