<template>
  <Header />
  <view class="all">
    <view class="top">
      <image src="https://source.unsplash.com/random" mode="scaleToFill"
        style="width:60rpx;height:60rpx;border-radius: 50%;margin-right:20rpx" />
      <uni-easyinput v-model="search_value" type="text" placeholder="搜索订单" @confirm="search" prefixIcon="search">
        <template #right>
          <TnButton bg-color="#C7BAA7" text-color="#FFFFFF" width="90" height="50"
            :custom-style="{ marginRight: '10rpx' }" @click="search" shape="round">搜索</TnButton>
        </template>
      </uni-easyinput>
    </view>

    <view class="tabs">
      <view v-for="(item, index) in tabs" :key="index" class="tab"
        :style="index === tab ? 'font-weight: 200;font-size: 45rpx;color: #000000;' : 'font-weight: 800;font-size: 30rpx;color: #717171;'"
        @click="switchTab(index)">
        {{ item }}
      </view>
    </view>

    <view class="card" v-for="card in orders" :key="card.id">
      <view class="title">
        <view class="tn-flex-center-start">
          <TnIcon name="shop" size="50"></TnIcon>
          <text class="left">{{ card.name }}</text>
        </view>
        <text class="right">
          {{ card.state === 0 ? '待付款' : card.state === 1 ? '待发货' : card.state === 2 ? '待收货' : card.state === 3 ? '待评价' :
        card.state === 4 ? '退货' : '' }}
        </text>
      </view>
      <view class="tn-flex-center-between">
        <image :src="card.path" mode="scaleToFill" style="width:160rpx;height:160rpx;border-radius: 15rpx;" />
        <view class="main">
          <view class="good">
            {{ card.name }}
          </view>
          <text class="size">
            {{ card.item_name }}
          </text>
          <text class="number">
            x{{ card.com_cont }}
          </text>
          <view class="tn-flex-center-between">
            <view class="tn-flex-center-start">
              <TnTag v-for="(tag, index) in card.tags" :key="index" width="100" font-size="20" shape="round"
                bg-color="#C7BAA7" text-color="#FFFFFF" :custom-style="{ marginRight: '20rpx' }">
                {{ tag }}
              </TnTag>
            </view>
            <view class="price">
              实付款：￥{{ card.price }}
            </view>
          </view>
        </view>
      </view>
      <view v-if="card.state !== 3" class="tn-flex-center-end tn-mt-lg">
        <TnButton bg-color="#C7BAA7" text-color="#FFFFFF" width="250" height="60"
          :custom-style="{ marginRight: '10rpx' }" @click="back_page" shape="round">
          {{ card.state === 1 ? '去付款' : card.state === 2 ? '催促发货' : card.state === 4 ? '申请售后' : '' }}
        </TnButton>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'
import { get_order } from '@/api/order/order'


const search_value = ref('')
const search = (e) => {
  console.log(e)
}

const tab = ref()
const tabs = ref(['全部', '待付款', '待发货', '待收货', '退款/售后'])

const switchTab = (index) => {
  tab.value = index
  get_order(page, index, search_value).then(res => {
    orders.value = res.data.data
  })
}

const orders = ref([])

let page = 1

const getData = () => {
  get_order(1, tab.value, search_value).then(res => {
    orders.value = res.data.data
  })
  // 请求数据
  // const list = [
  //   {
  //     title: '三只松鼠旗舰店',
  //     img: 'https://source.unsplash.com/random',
  //     good: '休闲芒果干大礼包，50g一包休闲芒果干大礼包，50g一包休闲芒果干大礼包，50g一包休闲芒果干大礼包，50g一包休闲芒果干大礼包，50g一包休闲芒果干大礼包，50g一包休闲芒果干大礼包，50g一包休闲芒果干大礼包，50g一包',
  //     size: '50g',
  //     number: 1,
  //     price: 9.9,
  //     tags: ['正品保障', '七天退换'],
  //     state: '待付款'
  //   },
  //   {
  //     title: '三只松鼠旗舰店',
  //     img: 'https://source.unsplash.com/random',
  //     good: '休闲芒果干大礼包，50g一包',
  //     size: '50g',
  //     number: 1,
  //     price: 9.9,
  //     tags: ['正品保障', '七天退换'],
  //     state: '待发货'
  //   },
  //   {
  //     title: '三只松鼠旗舰店',
  //     img: 'https://source.unsplash.com/random',
  //     good: '休闲芒果干大礼包，50g一包',
  //     size: '50g',
  //     number: 1,
  //     price: 9.9,
  //     tags: ['正品保障', '七天退换'],
  //     state: '待收货'
  //   },
  //   {
  //     title: '三只松鼠旗舰店',
  //     img: 'https://source.unsplash.com/random',
  //     good: '休闲芒果干大礼包，50g一包',
  //     size: '50g',
  //     number: 1,
  //     price: 9.9,
  //     tags: ['正品保障', '七天退换'],
  //     state: '退款/售后'
  //   }
  // ]
  // orders.value = list
}

onLoad((options) => {
  switchTab(parseInt(options.index) + 1)
  getData()
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: #F2F2F2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50rpx;
}

.top {
  width: 90%;
  margin-top: 100rpx;
  display: flex;
  align-items: center;
}

.tabs {
  display: flex;
}

.tab {
  font-family: Inter, Inter;
  line-height: 46rpx;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin: 40rpx 25rpx;
}

.card {
  width: 90%;
  background: #FFFFFF;
  padding: 25rpx;
  margin-top: 25rpx;

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      margin-left: 15rpx;
      font-family: Inter, Inter;
      font-weight: normal;
      font-size: 31rpx;
      color: #000000;
      line-height: 46rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }

    .right {
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 29rpx;
      color: #834820;
      line-height: 43rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }

  .main {
    height: 160rpx;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;

    .good {
      width: 420rpx;
      font-family: Inter, Inter;
      font-weight: normal;
      font-size: 29rpx;
      color: #000000;
      line-height: 43rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .size {
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 25rpx;
      color: #9F9F9F;
      line-height: 38rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }

    .number {
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 25rpx;
      color: #9F9F9F;
      line-height: 38rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .price {
      font-family: Inter, Inter;
      font-weight: normal;
      font-size: 29rpx;
      color: #000000;
      line-height: 43rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>