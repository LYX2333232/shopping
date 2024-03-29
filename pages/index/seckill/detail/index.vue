<template>
  <Header />
  <swiper indicator-dots autoplay circular>
    <swiper-item v-for="(item, index) in swiperImg" :key="'swiper' + index">
      <image :src="item.path" mode="aspectFill" style="width: 100%;height: 575rpx;"></image>
    </swiper-item>
  </swiper>

  <view class="white_boxs">
    <view style=" width: 90%;margin: 0 auto;">
      <view style="display: flex;">
        <view class="now">
          ¥{{ size[sizeIndex].price }}
        </view>
        <view style="color: #767676;padding-top: 26rpx;font-size: 24rpx;">原价：</view>
        <view style="color: #767676;padding-top: 26rpx;font-size: 24rpx;text-decoration:line-through">
          {{ size[sizeIndex].or_price }}
        </view>
      </view>
      <view class="info">
        {{ name }}
      </view>
      <view style="display: flex;">
        <view class="type" v-for="(item, index) in typelist">
          {{ item }}
        </view>
      </view>
      <view class="block1">
        已售 {{ sell }}+
      </view>
    </view>
  </view>
  <view class="detail">
    <view style="width: 90%;margin: 0 auto;">
      <view class="">
        规格
      </view>
      <uni-section title="更多样式 - tag" subTitle="使用mode=tag属性使用标签样式" type="line">
        <view class="uni-px-5">
          <uni-data-checkbox mode="tag" v-model="sizeIndex" :localdata="size"
            selectedColor="rgba(202, 199, 193, 1)"></uni-data-checkbox>
        </view>
      </uni-section>
      <view style="display: flex;justify-content: space-between;">
        <text>数量</text>
        <view>
          <uni-section title="基本用法" type="line" padding>
            <uni-number-box v-model="cont" @change="changeValue" :min="1" />
          </uni-section>
        </view>
      </view>
    </view>
  </view>
  <view class="moredetail">
    <view class="text1" style="width: 90%;margin: 0 auto;">
      <text>商品详情</text>
    </view>
    <!-- <image v-for="image in detailImg" :src="image" mode="widthFix" style="width: 90%;margin: 10rpx 5%;" /> -->
    <view style="width: 90%;margin: 10rpx 5%;" v-html="content">
    </view>
  </view>
  <view class="comment">
    <view class="text1" style="width: 90%;margin: 0 auto;">
      <text>评论</text>
    </view>
    <view class="card" v-for="(comment, index) in commentList" :key="index">
      <view class="tn-flex-center-start tn-w-5-6">
        <image :src="comment.avatar" mode="scaleToFill"
          style="width: 46rpx;height: 46rpx;border-radius: 50%;margin-right: 20rpx;" />
        <text class="name">{{ comment.name }}</text>
      </view>
      <view class="tn-flex-center-start tn-w-5-6 tn-m-lg">
        {{ comment.comment }}
      </view>
      <view class="tn-flex-center-start tn-w-5-6">
        <image v-for="(img, index) in comment.imgs" :key="index" :src="img" mode="aspectFill"
          style="width: 200rpx;height: 200rpx;margin-right: 10rpx;" />
      </view>
    </view>
  </view>

  <GoodNav :id="c_id" :like="true" :normal="false" @buttonClick="buttonClick" />
  <!-- 分享定义在组件goods-nav中 -->
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app';
import { get_goods_detail } from '@/api/index/seckill/seckill'
import Header from '@/components/header.vue'
import swiper from '@/uni_modules/nutui-uni/components/swiper/swiper.vue';
import GoodNav from '@/components/goodNav'

const swiperImg = ref([])

let sell = "150"
const name = ref('')
const typelist = ref([])

// 商品规格
const size = ref([])

let flash_com_id = undefined

const sizeIndex = ref(0)

// 数量
const cont = ref(1)

// 商品详情
const content = ref('')

const commentList = ref([
  {
    avatar: 'https://source.unsplash.com/random',
    name: '用户1',
    star: 4,
    comment: '商品不错',
    imgs: [
      'https://source.unsplash.com/random',
      'https://source.unsplash.com/random',
      'https://source.unsplash.com/random'
    ]
  },
  {
    avatar: 'https://source.unsplash.com/random',
    name: '用户2',
    star: 5,
    comment: '东西挺好',
    imgs: [
      'https://source.unsplash.com/random',
      'https://source.unsplash.com/random',
      'https://source.unsplash.com/random'
    ]
  }
])

function buttonClick(e) {
  uni.navigateTo({
    url: '/pages/index/seckill/address/index?good=' + encodeURIComponent(JSON.stringify({
      id: 1,
      name: name.value,
      price: size.value[sizeIndex.value].price,
      num: cont.value,
      flash_com_id: flash_com_id
    }))
  })
}

onLoad((options) => {
  console.log('id', options.id)
  get_goods_detail(options.id).then(res => {
    console.log(res)
    // 轮播图
    swiperImg.value = res.data.paths

    // 规格
    size.value = [
      {
        ...res.data.item,
        text: res.data.item.name,
        value: 0
      }
    ]
    sizeIndex.value = 0

    // 商品名称
    name.value = res.data.name

    typelist.value = res.data.labels

    // 商品详情
    content.value = res.data.content

    flash_com_id = res.data.flash_com_id
  })
})
</script>

<style lang="scss" scoped>
page {
  background-color: rgba(248, 248, 248, 1);
}

.white_boxs {
  background-color: rgba(255, 255, 255, 1.0);
  margin-top: -40rpx;
  border-radius: 19rpx 19rpx 0rpx 0rpx;
  position: relative;
  z-index: 10;

  .now {
    height: 75rpx;
    font-family: Inter, Inter;
    font-weight: 600;
    font-size: 40rpx;
    color: #834820;
    line-height: 46rpx;
    text-align: left;
    padding-top: 18rpx;
    margin-right: 30rpx;
  }

  .info {
    font-family: Inter, Inter;
    font-weight: 600;
    font-size: 31rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .type {
    width: 120rpx;
    height: 35rpx;
    margin-top: 20rpx;
    margin-right: 15rpx;
    font-size: 19rpx;
    color: #A79A77;
    background: #FAEBD9;
    line-height: 35rpx;
    text-align: center;
    border-radius: 6rpx 6rpx 6rpx 6rpx;
  }

  .block1 {
    font-family: Inter, Inter;
    font-weight: 400;
    font-size: 23rpx;
    margin-top: 15rpx;
    color: #8A8A8A;
    line-height: 35rpx;
    padding-bottom: 40rpx;
  }
}

.detail {
  background-color: #fff;
  height: 240rpx;
  margin-top: 10rpx;
  padding-top: 20rpx;
  font-family: Inter, Inter;
  font-weight: 600;
  font-size: 27rpx;
  color: #75694A;
  line-height: 40rpx;
  text-align: left;

  .uni-px-5 {
    padding-top: 15rpx;
    padding-right: 15px;
    padding-bottom: 35rpx;
  }
}

.moredetail {
  background-color: #fff;
  margin: 20rpx 0 20rpx;
  padding-top: 20rpx;

  .text1 {
    font-family: Inter, Inter;
    font-weight: 600;
    font-size: 27rpx;
    color: #75694A;
    line-height: 40rpx;
    text-align: left;
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
    color: #75694A;
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
  background: #FFFFFF;
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