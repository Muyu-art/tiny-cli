import {useUserStore} from '@/store';
import {getRoleInfo} from "@/api/role";

async function checkPermission(el: any, binding: any) {
  const {value} = binding;
  if(value){
    // 获取role的permission
    const userStore = useUserStore();
    const { roleId } = userStore;
    const { data } = await getRoleInfo(roleId)
    const permissions = data.permission;
    let permissionList = [] as any;
    for ( let i = 0; i < permissions.length; i += 1 ){
      permissionList.push(permissions[i].name)
    }
    const hasPermission = permissionList.includes(value) || permissionList.includes('*');
    if(!hasPermission && el.parentNode){
      el.parentNode.removeChild(el)
    }
  }else{
    throw new Error(`need permissions! Like v-permission="'user::add'"`);
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
