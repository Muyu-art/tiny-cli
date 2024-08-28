import axios from 'axios';

// 获取detail表单的初始数据选项
export function getDetailData() {
  return axios.get('/mock/api/detail/getdata');
}
