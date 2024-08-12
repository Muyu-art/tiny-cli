import {useUserStore} from '@/store';
import {getRoleInfo} from "@/api/role";

let permissionList = [];
const EXPIRE = 60 * 1000;
async function setPermissionList(roleId: number){
  const {data} = await getRoleInfo(roleId)
  const permissions = data.permission;
  for (let i = 0; i < permissions.length; i += 1) {
    permissionList.push(permissions[i].name)
  }
}
async function checkPermission(el: any, binding: any) {
  const {value} = binding;
  // 获取role的permission
  const userStore = useUserStore();
  const {roleId} = userStore
  if (!permissionList.length){
    setPermissionList(roleId)
    setTimeout(()=>{
      permissionList = [];
      setPermissionList(roleId)
    }, EXPIRE)
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
