<template>
  <Header
    background="rgba(255, 255, 255, 0.6)"
    border="1rpx solid rgba(151, 151, 151, 0.2)"
  />
  <view style="position: relative">
    <swiper
      :indicator-dots="false"
      autoplay="false"
      circular
      @change="changeSwiper"
      style="height: 750rpx"
    >
      <swiper-item v-for="item in swiperImg" :key="'swiperImg' + item.id">
        <image
          :src="item.path"
          mode="aspectFill"
          style="width: 750rpx; height: 750rpx"
          @click="toWeb(item.path)"
        >
        </image>
      </swiper-item>
    </swiper>
    <view class="show">
      <view>
        <view v-if="other" class="other">
          <image :src="other.avatar" mode="scaleToFill" class="avatar" />
          <view>
            {{ other.name + other.text }}
          </view>
        </view>
      </view>
      <view class="index">
        <view class="current">
          {{ current }}
        </view>
        <view class="total">
          {{ swiperImg.length }}
        </view>
      </view>
    </view>
  </view>
  <view class="all">
    <view class="white_boxs">
      <view class="tn-flex-center-between">
        <view class="tn-flex-center-start">
          <view class="now"> ¥{{ size[sizeIndex].price }} </view>
          <view v-show="size[sizeIndex].or_price" class="old">
            原价：{{ size[sizeIndex].or_price }}
          </view>
        </view>
        <view class="sold"> 已售 {{ sell }} </view>
      </view>
      <view class="free">满99包邮</view>
      <view class="info">
        {{ name }}
      </view>
      <view class="tn-flex-center-start">
        <view class="type" v-for="item in typeList" :key="item.id">
          {{ item }}
        </view>
      </view>
    </view>
    <view class="size">
      <view class="title"> 选择规格 </view>
      <uni-section
        title="更多样式 - tag"
        subTitle="使用mode=tag属性使用标签样式"
        type="line"
      >
        <view class="uni-px-5">
          <uni-data-checkbox
            mode="tag"
            v-model="sizeIndex"
            :localdata="size"
            selectedColor="#14BF20"
          ></uni-data-checkbox>
        </view>
      </uni-section>
      <view class="tn-flex-center-between">
        <view class="title">数量</view>
        <view>
          <uni-section title="基本用法" type="line" padding>
            <uni-number-box v-model="cont" :min="1" />
          </uni-section>
        </view>
      </view>
    </view>
    <view class="recommend card">
      <view class="title">为您推荐</view>
      <view class="items">
        <view
          class="item"
          v-for="item in recommend"
          :key="item.id"
          @click="toDetail(item.id)"
        >
          <image class="recommend-image" :src="item.path" mode="aspectFill">
          </image>
          <view class="name">{{ item.name }}</view>
          <view class="tn-flex-center-between">
            <view class="price">￥{{ item.price }}</view>
            <TnIcon :name="`${preUrl}add.png`" size="48rpx" />
          </view>
        </view>
      </view>
    </view>
    <view class="detail">
      <view class="title" style="width: 90%; margin: 0 auto">
        <text>商品详情</text>
      </view>
      <view
        v-for="item in swiperVideo"
        :key="'swiperVideo' + item.id"
        style="width: 90%; margin: 0 auto"
      >
        <video
          style="width: 100%"
          :src="'https://senmei.top/' + item.url"
        ></video>
      </view>
      <view style="width: 90%; margin: 10rpx 5%">
        <rich-text :nodes="content"></rich-text>
      </view>
    </view>
  </view>
  <GoodNav
    :id="size[sizeIndex].id"
    :like="size[sizeIndex].is_like"
    :normal="true"
    @addToCart="addToCart"
    @buy="buy"
    @changeLike="changeLike"
  />
  <!-- 分享定义在组件goods-nav中 -->
</template>

<script setup>
import { ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"

import { get_goods_detail } from "@/api/goods/goods"
import { add_to_cart } from "@/api/cart/cart"
import Header from "@/components/header.vue"
import swiper from "@/uni_modules/tuniaoui-vue3/components/swiper/src/swiper.vue"
import GoodNav from "@/components/goodNav"
import { CartStore } from "@/store"
import { getRandomImage } from "@/utils/constant"

const cart = CartStore()

// 轮播图相关
const swiperVideo = ref([])
const swiperImg = ref([])
const current = ref(1)
const changeSwiper = (e) => {
  if (e && e.detail && e.detail.current !== undefined) {
    current.value = e.detail.current + 1
  } else {
    console.error("Invalid event object:", e)
  }
}
const toWeb = (path) => {
  uni.navigateTo({
    url: "/pages/web/index?src=" + path,
  })
}

// 其他用户的购买信息
const other = ref({})

const c_id = ref("")

// 商品售价
const sell = ref(0)
const name = ref("")
const typeList = ref([])

// 商品规格
const size = ref([{}])
const sizeIndex = ref(0)

// 数量
const cont = ref(1)

// 推荐商品
const recommend = ref([])
// 详细描述
const content = ref("")

// 底部信息
const like = ref(0)

const changeLike = () => {
  size.value[sizeIndex.value].is_like = size.value[sizeIndex.value].is_like
    ? 0
    : 1
}

function addToCart() {
  // 加入购物车
  add_to_cart(size.value[sizeIndex.value].id, cont.value).then((res) => {
    if (res.code == 200) {
      uni.showToast({
        title: "加入购物车成功",
        icon: "none",
      })
      cart.update()
    } else
      uni.showToast({
        title: res.msg,
        icon: "none",
      })
  })
}

/**
 * 立即购买
 */
function buy() {
  // uni.navigateTo({
  //   url: `/pages/me/order/new_order?flash_id=${flash_id}&com_cont=${cont.value}`,
  // })
  uni.navigateTo({
    url: `/pages/me/order/new_order?ids=${JSON.stringify([
      { id: size.value[sizeIndex.value].id, cont: cont.value },
    ])}`, // 将id传到订单页面
  })
}

const toDetail = (id) => {
  uni.navigateTo({
    url: "/pages/goods/goods_detail?id=" + id,
  })
}

onLoad((options) => {
  const that = this
  get_goods_detail({ id: options.id }).then((res) => {
    // 轮播图
    swiperImg.value = res.data.paths
    // 视频轮播图
    swiperVideo.value = res.data.videost

    c_id.value = res.data.id

    other.value = res.data.users[0]

    // 规格
    size.value = res.data.items.map((item, index) => {
      return {
        ...item,
        text: item.name,
        value: index,
      }
    })
    sizeIndex.value = 0

    // 商品名称
    name.value = res.data.name

    typeList.value = res.data.labels

    recommend.value = res.data.recommend

    content.value = res.data.content.replace(
      /(<img [^>]*)(style="[^"]*")?/gi,
      '$1 style="width:100%;"'
    )

    like.value = res.data.is_like

    sell.value = res.data.volume
  })
  getRecommend()
})
</script>

<style lang="scss" scoped>
page {
  background: #f6f6f6;
}

.show {
  position: absolute;
  width: 100%;
  bottom: 20rpx;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .other {
    background: #000;
    opacity: 0.6;
    display: flex;
    align-items: center;
    height: 60rpx;
    padding: 0 20rpx;
    border-radius: 0 30rpx 30rpx 0;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #ffffff;
    line-height: 33rpx;
    text-align: left;
    font-style: normal;

    .avatar {
      margin: 0 20rpx;
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
    }
  }

  .index {
    margin-right: 20rpx;
    background: rgba($color: #000000, $alpha: 0.4);
    width: 80rpx;
    height: 40rpx;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #ffffff;
    line-height: 40rpx;

    .current {
      width: 40rpx;
      height: 40rpx;
      text-align: center;
      border-radius: 30rpx 0 30rpx 30rpx;
      background: rgba($color: #000000, $alpha: 0.2);
    }

    .total {
      width: 40rpx;
      height: 40rpx;
      text-align: center;
    }
  }
}

.all {
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}

.white_boxs {
  width: 710rpx;
  margin: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 24rpx;

  .now {
    font-family: WeChat-Sans-Std, WeChat-Sans-Std;
    font-weight: bold;
    font-size: 50rpx;
    color: #ee2532;
    line-height: 31rpx;
    text-align: left;
    font-style: normal;
    margin-right: 30rpx;
  }

  .old {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #999999;
    line-height: 37rpx;
    text-align: left;
    font-style: normal;
    text-decoration-line: line-through;
  }

  .sold {
    width: 100%;
    font-family: Inter, Inter;
    font-weight: 400;
    font-size: 23rpx;
    margin-top: 15rpx;
    color: #8a8a8a;
    line-height: 35rpx;
    padding-bottom: 40rpx;
    text-align: right;
  }

  .free {
    width: 131rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffefef;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 22rpx;
    color: #ff4121;
    line-height: 30rpx;
    font-style: normal;
  }

  .info {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 34rpx;
    color: #131313;
    line-height: 44rpx;
    text-align: left;
    font-style: normal;
    margin: 20rpx 0;
  }

  .type {
    height: 35rpx;
    margin-top: 20rpx;
    margin-right: 15rpx;
    padding: 5rpx 10rpx;
    font-size: 25rpx;
    color: #999;
    border: 2rpx dotted #999;
    line-height: 35rpx;
    display: flex;
    align-items: center;
  }
}

.deliver {
  width: 100%;
  display: flex;
  background: #fff;
  padding: 30rpx 20rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #131313;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;

  .label {
    color: #999999;
  }

  .text {
    margin-left: 30rpx;
  }
}

.size {
  width: 100%;
  background-color: #fff;
  margin: 20rpx;
  padding: 30rpx 20rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #999999;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }

  .uni-px-5 {
    padding-top: 15rpx;
    padding-right: 15px;
    padding-bottom: 35rpx;
  }
}

.param {
  width: 100%;
  background-color: #fff;
  margin: 20rpx;
  padding: 30rpx 20rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    margin-bottom: 30rpx;
  }

  .card {
    border-radius: 16rpx;
    border: 1rpx solid #d0d0d0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .item {
      width: 100%;
      padding: 20rpx;
      display: flex;
      align-items: center;

      .label {
        width: 120rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
      }

      .text {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #131313;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
      }
    }

    .block {
      width: 100%;
      margin: 0 20rpx;
      height: 1rpx;
      background-color: #eee;
    }
  }
}

.card {
  width: 710rpx;
  margin: 20rpx 0;
  padding: 0rpx 20rpx;
  background-color: #fff;
  border-radius: 24rpx;
}

.recommend {
  .title {
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #131313;
    line-height: 40rpx;
    margin: 30rpx 20rpx;
  }
  .items {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    .item {
      .recommend-image {
        width: 210rpx;
        height: 210rpx;
        border-radius: 20rpx 20rpx 0 0;
      }
      .name {
        margin: 12rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #1f2024;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
      }

      .price {
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 500;
        font-size: 24rpx;
        color: #ee2532;
        line-height: 36rpx;
        text-align: left;
        font-style: normal;
      }
    }
  }
}

.detail {
  width: 100%;
  background-color: #fff;
  margin: 20rpx;
  padding-bottom: 150rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    margin: 20rpx 30rpx;
  }
}

.comment {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 20rpx 0 150rpx;

  .text1 {
    font-family: Inter, Inter;
    font-weight: 600;
    font-size: 27rpx;
    color: #75694a;
    line-height: 40rpx;
    text-align: left;
  }

  .card {
    margin-top: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 200rpx;

    .name {
      font-family: Noto Sans SC, Noto Sans SC;
      font-weight: 500;
      font-size: 23rpx;
      color: #494949;
      line-height: 27rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}

.goods-carts {
  height: 146rpx;
  background: #ffffff;
  box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.2);
  border-radius: 50rpx 50rpx 0rpx 0rpx;

  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  position: fixed;
  left: 0;
  right: 0;
  /* #ifdef H5 */
  left: var(--window-left);
  right: var(--window-right);
  /* #endif */
  bottom: 0;
  z-index: 100;
}
</style>
