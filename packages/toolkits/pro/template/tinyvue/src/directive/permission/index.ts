import {useUserStore} from '@/store';
import {getRoleInfo} from "@/api/role";

async function checkPermission(el: any, binding: any) {
  const {value} = binding;
  // 获取role的permission
  const userStore = useUserStore();
  const {roleId} = userStore
  let permissionList = [] as any;
  if(localStorage.getItem(`role-permission:${roleId}`)){
    permissionList = JSON.parse(localStorage.getItem(`role-permission:${roleId}`))
  }else{
    const {data} = await getRoleInfo(roleId)
    const permissions = data.permission;
    for (let i = 0; i < permissions.length; i += 1) {
      permissionList.push(permissions[i].name)
    }
    localStorage.setItem(`role-permission:${roleId}`,JSON.stringify(permissionList));
  }
  const hasPermission = permissionList.includes(value) || permissionList.includes('*');
  if (!hasPermission && el.parentNode) {
    el.parentNode.removeChild(el)
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
