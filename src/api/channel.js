// 频道请求模块
import request from '@/utils/request'

// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: 'v1_0/channels'
  })
}

// 添加用户频道（调用时加中括号，因为channels是数组形式）
// export const addUserChannel = (channels) => {
//   return request({
//     method: 'PATCH',
//     url: 'v1_0/user/channels',
//     data: {
//       channels
//     }
//   })
// }

// 添加用户频道（直接用中括号包裹，调用时就不用数组形式了）
export const addUserChannel = (channel) => {
  return request({
    method: 'PATCH',
    url: 'v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}

// 删除指定用户频道
export const deleteUserChannel = (channelId) => {
  return request({
    method: 'DELETE',
    url: `v1_0/user/channels/${channelId}`
  })
}
