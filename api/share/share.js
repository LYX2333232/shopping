import request from '@/utils/request'

// let baseUrl = import.meta.env.VITE_API_BASE_URL

export const get_share = () => request.get('/share/qrcode')
// {
//     return new Promise((resolve, reject) => {
//         wx.request({
//             url: baseUrl + '/share/qrcode',
//             responseType: 'arraybuffer',  // 设置响应类型为 'arraybuffer'
//             success(res) {
//                 // const base64 = wx.arrayBufferToBase64(res.data);  // 将 ArrayBuffer 数据转成 Base64 字符串
//                 // const src = 'data:image/jpeg;base64,' + base64;  // 拼接成 Data URL
//                 // resolve(src);
//                 resolve(res)
//             },
//             fail(err) {
//                 reject(err);
//             }
//         });
//     });
// }