<template>
  <view class="header" :style="{ paddingTop: `${top}px` }">
    <view class="search">
      <view style="flex: 1">
        <TnIcon name="search" size="40" />
      </view>
      <input
        style="flex: auto"
        type="text"
        v-model="searchInfo"
        @confirm="search"
      />
      <view class="flex:1">
        <TnButton
          bg-color="#14BF20"
          text-color="#FFF"
          shape="round"
          @click="search"
          >搜索</TnButton
        >
      </view>
    </view>
    <view class="indexes">
      <view
        :class="['index', indexs_index === index ? 'active' : '']"
        v-for="(item, index) in indexs"
        :key="item.id"
        @click="changeIndexs(index)"
      >
        <image :src="item.path" mode="scaleToFill" class="image" />
        <view class="text">
          {{ indexs[index].name }}
        </view>
      </view>
    </view>
  </view>
  <view
    class="goods"
    style="display: flex; background-color: rgba(255, 255, 255, 1)"
  >
    <view class="tags" :style="{ minHeight: `calc(100vh - ${height}px)` }">
      <view
        :class="['tag', tag.id === tag_index ? 'active' : '']"
        v-for="tag in tag_list"
        :key="tag.id"
        @click="changeTag(tag.id)"
      >
        <view class="text">
          <image
            style="width: 28rpx; height: 28rpx; margin-right: 6rpx"
            :src="tag.icon"
            v-if="tag.icon"
            mode="aspectFit"
          >
          </image>
          {{ tag.name }}
        </view>
      </view>
    </view>
    <view class="main">
      <view class="total">全部({{ total }})</view>
      <view
        class="good"
        v-for="good in goods_list"
        :key="good.id"
        @click="toDetail(good)"
      >
        <image :src="good.path" mode="scaleToFill" class="image" />
        <view class="right">
          <view class="name">
            {{ good.name }}
          </view>
          <view class="bottom">
            <view class="left">
              <view class="price"> ￥{{ good.price }} </view>
              <!-- 拼团价图标 -->
              <view v-if="good.type === 1">
                <image
                  :src="teamwork_image"
                  mode="aspectFill"
                  style="height: 30rpx; width: 90rpx"
                />
              </view>
              <view v-if="good.or_price" class="old">
                ￥{{ good.or_price }}
              </view>
            </view>
            <!-- 普通商品 -->
            <TnIcon
              v-if="good.type === 0"
              :name="`${preUrl}cart.png`"
              size="56rpx"
            />
            <TnButton v-if="good.type === 1" shape="round" type="danger"
              >去参团</TnButton
            >
            <TnButton v-if="good.type === 2" shape="round" type="danger"
              >立即抢</TnButton
            >
          </view>
          <view class="HOT">
            <TnIcon
              :name="`${preUrl}honor.png`"
              size="28rpx"
              style="margin-right: 8rpx"
            />
            热销榜 第1名
            <TnIcon name="right" color="#c39248" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue"
import { onShow, onLoad, onHide, onReachBottom } from "@dcloudio/uni-app"

import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"
import { get_type_list, get_goods_list } from "@/api/goods/goods"

let t_id = undefined

const searchInfo = ref("")

const preUrl = import.meta.env.VITE_BASE_URL + "/mini_app/static/goods/"

const search = () => {
  page = 1
  getGoodsList()
}

const indexs = ref([])
const indexs_index = ref(0)
/**
 * 修改顶部的index
 * @param index 点击的index
 */
const changeIndexs = (index) => {
  indexs_index.value = index
  tag_list.value = indexs.value[index].new_children
  tag_index.value = indexs.value[index].new_children[0].id
  console.log(indexs.value)
  console.log(indexs.value[index])
  page = 1
  getGoodsList()
}

// 选中的list的index
const tag_index = ref(1)
const tag_list = ref([])

const total = ref(0)
let page = 1

const changeTag = (item) => {
  tag_index.value = item
  page = 1
  getGoodsList()
}

const flash_image = ref(
  "http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrziajOqDoIHQNbEWZkibQEMnpZbiaKmSDL6gWEk1rJGLMOwBSZw9bw3IGoA/0?wx_fmt=png"
)
const teamwork_image = ref(
  "http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrztIUKU5XBXWLppz530Olq6E5QlT1iceOzhaZFiat3OtKOfzibMxbBGXN5g/0?wx_fmt=png"
)

const goods_list = ref([])
const toDetail = (good) => {
  var url = ""
  switch (good.type) {
    case 0:
      url = "/pages/goods/goods_detail?id=" + good.id
      break
    case 1:
      url = "/pages/index/today/detail/index?id=" + good.teamwork_id
      break
    case 2:
      url = "/pages/index/seckill/detail/index?id=" + good.flash_id
      break
  }
  uni.navigateTo({
    url: url,
  })
}
// 判断是普通商品(0)、拼团商品(1)、还是秒杀商品(2)
const checkType = (good) => {
  const { flash_id, flash_price, teamwork_id, teamwork_price } = good
  if (!flash_id)
    if (!teamwork_id) return 0
    else return 1
  else if (!teamwork_id) return 2
  else if (parseFloat(flash_price) < parseFloat(teamwork_price)) return 2
  else return 1
}

const getGoodsList = async () => {
  const history = uni.getStorageSync("history")
  if (searchInfo.value !== "") {
    if (history.includes(searchInfo.value)) {
      // 将该项放到第一位
      history.splice(history.indexOf(searchInfo.value), 1)
    }
    history.unshift(searchInfo.value)
    uni.setStorageSync("history", history)
  }
  const option = {}
  // 搜索商品
  option.value = searchInfo.value
  // 页码
  option.page = page
  // 类别
  option.t_id = tag_index.value
  option.f_t_id = indexs.value[indexs_index.value].id

  const res = await get_goods_list(option)
  console.log(res)
  total.value = res.data.total
  if (res.data.data.length === 0) {
    page--
    if (page === 0) goods_list.value = []
    return
  }
  if (page > 1)
    goods_list.value = goods_list.value.concat(
      res.data.data.map((item) => ({ ...item, type: checkType(item) }))
    )
  else
    goods_list.value = res.data.data.map((item) => ({
      ...item,
      type: checkType(item),
    }))
}

const getData = () => {
  // 获取分类列表
  get_type_list(t_id).then((res) => {
    indexs.value = res.data
    if (uni.getStorageSync("index")) {
      indexs_index.value = uni.getStorageSync("index")
      uni.clearStorageSync("index")
    }
    tag_list.value = res.data[indexs_index.value].new_children
    tag_index.value = res.data[indexs_index.value].new_children[0].id
    getGoodsList()
  })
}

const top = ref(0)
const height = ref(0)

onShow(() => {
  if (uni.getStorageSync("index")) {
    getData()
  }
})

onLoad(() => {
  top.value = uni.getMenuButtonBoundingClientRect().top
  uni
    .createSelectorQuery()
    .in(getCurrentInstance())
    .select(".header")
    .boundingClientRect((rect) => {
      console.log(rect)
      height.value = rect.height
    })
    .exec()
  searchInfo.value = uni.getStorageSync("searchInfo") ?? ""
  t_id = uni.getStorageSync("t_id") ?? undefined
  getData()
})

onHide(() => {
  uni.setStorageSync("searchInfo", undefined)
  uni.setStorageSync("t_id", undefined)
})

onReachBottom(() => {
  page++
  getGoodsList()
})
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  padding: 0 20rpx 20rpx;
  background: linear-gradient(180deg, #f1ffe9 0%, #e0ffe3 100%);
  background-size: 100% 100%;

  .search {
    display: flex;
    align-items: center;
    width: 530rpx;
    background: #fff;
    border-radius: 40rpx;
    padding: 10rpx 20rpx;
    margin-bottom: 20rpx;
  }

  .indexes {
    margin: 0 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .index {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #333333;
      line-height: 33rpx;
      text-align: left;
      font-style: normal;

      .image {
        width: 72rpx;
        height: 72rpx;
        border-radius: 20rpx;
        border: 5rpx transparent solid;
        margin-bottom: 8rpx;
      }

      .text {
        padding: 1rpx 10rpx;
      }
    }
    .active {
      .image {
        border: 5rpx solid #14bf20;
      }
      .text {
        background: #14bf20;
        border-radius: 20rpx;
        color: #fff;
      }
    }
  }
}

.goods {
  display: flex;
  align-items: stretch;

  .tags {
    width: 250rpx;
    overflow-y: auto;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;

    .tag {
      position: relative;
      width: 100%;
      height: 110rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #333333;
      font-style: normal;
      display: flex;
      align-items: center;
      justify-content: center;

      .text {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    }

    .active {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 26rpx;
      color: #14bf20;
      font-style: normal;
      background: #fff;
    }

    .active::after {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 48rpx;
      background: #14bf20;
      border-radius: 4rpx;
    }
  }

  .main {
    width: 100%;

    .total {
      margin: 20rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 22rpx;
      color: #999999;
      line-height: 30rpx;
      text-align: left;
      font-style: normal;
    }

    .good {
      margin: 30rpx 0;
      padding: 0 20rpx;
      width: 100%;
      min-height: 220rpx;
      display: flex;

      .image {
        width: 185rpx;
        height: 185rpx;
        margin-right: 16rpx;
        flex-shrink: 0;
      }

      .right {
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-bottom: 1rpx solid #dedede;

        padding-bottom: 30rpx;

        .name {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 26rpx;
          color: #333333;
          line-height: 37rpx;
          text-align: left;
          font-style: normal;
          margin-bottom: 10rpx;
        }

        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .left {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .price {
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              font-size: 32rpx;
              color: #ee2532;
              line-height: 45rpx;
              text-align: left;
              font-style: normal;
              margin-right: 7rpx;
            }

            .old {
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 24rpx;
              color: #999999;
              line-height: 33rpx;
              text-align: left;
              font-style: normal;
              text-decoration-line: line-through;
            }
          }
        }

        .HOT {
          width: 100%;
          height: 38rpx;
          margin-top: 14rpx;
          background: #fff5e5;
          box-sizing: border-box;
          padding: 0 8rpx;
          display: flex;
          align-items: center;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 22rpx;
          color: #c39248;
          line-height: 30rpx;
          text-align: left;
          font-style: normal;
        }
      }
    }
  }
}
</style>
