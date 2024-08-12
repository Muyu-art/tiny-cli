import {defineStore} from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
} from '@/api/user';
import {clearToken, getToken, setToken} from '@/utils/auth';

interface LoginData {
  email: string;
  password: string;
}

export type RoleType = '' | '*' | 'admin' | 'user';
export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  employeeType?: string;
  job?: string;
  probationStart?: string;
  probationEnd?: string;
  probationDuration?: string;
  protocolStart?: string;
  protocolEnd?: string;
  address?: string;
  status?: string;
  role: RoleType;
  updateTime?: any;
  createTime?: any;
}


export const useUserStore = defineStore('user', {
  state: (): User => ({
    id: '10000',
    name: 'admin',
    email: 'admin@no-reply.com',
    department: 'Tiny-Vue-Pro',
    employeeType: 'social recruitment',
    job: 'Front end',
    probationStart: '2021-04-19',
    probationEnd: '2021-10-15',
    probationDuration: '180',
    protocolStart: '2021-04-19',
    protocolEnd: '2024-04-19',
    address: '',
    status: '',
    role: '',
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

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        const { token } = res.data;
        setToken(token);
        const userRes = await getUserInfo(loginForm.email)
        const userInfo: User = {
          id: userRes.data.id,
          name:userRes.data.name,
          email:userRes.data.email,
          role:'',
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
        }
        if(userRes.data.role){
          userInfo.role = userRes.data.role[0].name;
          userInfo.job = userRes.data.role[0].name;
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
        token:getToken()
      }
      await userLogout(data);
      this.resetInfo();
      clearToken();
    },
  },
});
