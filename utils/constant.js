/**
 * 获取一个随机图片
 * @param {*} w 图片宽度
 * @param {*} h 图片高度
 * @returns
 */
export const getRandomImage = (w = 100, h = 100) =>
  `https://picsum.photos/${w}/${h}`
