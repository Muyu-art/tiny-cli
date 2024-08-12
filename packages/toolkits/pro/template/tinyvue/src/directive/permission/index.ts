import {useUserStore} from '@/store';

async function checkPermission(el: any, binding: any) {
  const {value} = binding;
  // 获取role的permission
  const userStore = useUserStore();
  const {rolePermission} = userStore
  const permissionList = rolePermission
  const hasPermission = permissionList.includes(value) || permissionList.includes('*');
  if (!hasPermission) {
    el.remove()
  }
}

export default {
  mounted(el: any, binding: any) {
    checkPermission(el, binding);
  },
  updated(el: any, binding: any) {
    checkPermission(el, binding);
  }
};
