import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
} from '@/api/user';
import { clearToken, getToken, setToken } from '@/utils/auth';
import { getRoleInfo } from '@/api/role';

interface LoginData {
  email: string;
  password: string;
}

export type RoleType = '' | '*' | 'admin' | 'user';

export type Role = {
  id: number;
  name: string;
  permission: {
    name: string;
    desc: string;
    id: number;
  }[];
};

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  employeeType: string;
  job: string;
  probationStart: string;
  probationEnd: string;
  probationDuration: string;
  protocolStart: string;
  protocolEnd: string;
  address: string;
  status: string;
  role: string;
  sort: 1;
  startTime: string;
  endTime: string;
  filterStatus: any[];
  filterType: any[];
  submit: boolean;
  reset: boolean;
  roleId: number;
  rolePermission: string[];
}

export const useUserStore = defineStore('user', {
  state: (): User => ({
    id: '',
    name: '',
    email: '',
    department: '',
    employeeType: '',
    job: '',
    probationStart: '',
    probationEnd: '',
    probationDuration: '',
    protocolStart: '',
    protocolEnd: '',
    address: '',
    status: '',
    role: '',
    sort: 1,
    startTime: '',
    endTime: '',
    filterStatus: [],
    filterType: [],
    submit: false,
    reset: false,
    roleId: 0,
    rolePermission: [],
  }),

  getters: {
    userInfo(state: User): User {
      return state;
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<User>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    async fetchInfo() {
      const { data } = await getUserInfo();
      this.setInfo(data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        const { token } = res.data;
        setToken(token);
        const userRes = await getUserInfo(loginForm.email);
        const userInfo = {
          id: userRes.data.id,
          name: userRes.data.name,
          email: userRes.data.email,
          role: '',
          department: userRes.data.department,
          employeeType: userRes.data.employeeType,
          job: '',
          probationStart: userRes.data.probationStart,
          probationEnd: userRes.data.probationEnd,
          probationDuration: userRes.data.probationDuration,
          protocolStart: userRes.data.protocolStart,
          protocolEnd: userRes.data.protocolEnd,
          address: userRes.data.address,
          status: userRes.data.status,
          roleId: 0,
          rolePermission: [],
        };
        if (userRes.data.role) {
          userInfo.role = userRes.data.role[0].name;
          userInfo.job = userRes.data.role[0].name;
          userInfo.roleId = userRes.data.role[0].id;
        }
        const { data } = await getRoleInfo(userInfo.roleId);
        const permissions = data.permission;
        for (let i = 0; i < permissions.length; i += 1) {
          userInfo.rolePermission.push(permissions[i].name);
        }
        this.setInfo(userInfo);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // Logout
    async logout() {
      const data = {
        token: getToken(),
      };
      await userLogout(data);
      this.resetInfo();
      clearToken();
    },
  },
});
