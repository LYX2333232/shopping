<template>
  <Header />
  <view class="all">
    <view class="tabs">
      <view v-for="(item, index) in tabs" :key="index" class="tab"
        :style="index === tab + 1 ? 'font-weight: 200;font-size: 45rpx;color: #000000;' : 'font-weight: 800;font-size: 30rpx;color: #717171;'"
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
      <view v-if="card.state !== 2" class="tn-flex-center-end tn-mt-lg">
        <TnButton bg-color="#C7BAA7" text-color="#FFFFFF" width="250" height="60"
          :custom-style="{ marginRight: '10rpx' }" @click="order_click(card)" shape="round">
          {{ card.state === 0 ? '去付款' : card.state === 1 ? '催促发货' : card.state === 4 ? '申请售后' : '' }}
        </TnButton>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'
import { get_order, repay_order } from '@/api/order/order'


const tab = ref()
const tabs = ref(['全部', '待付款', '待发货', '待收货', '退款/售后'])

let page = 1

const switchTab = (index) => {
  tab.value = index - 1
  page = 1
  const i = index === 0 ? undefined : index - 1
  get_order(page, i).then(res => {
    console.log(res)
    orders.value = res.data.data
  })
}

const orders = ref([])

const order_click = (card) => {
  console.log(card)
  // 重新付款
  if (card.state === 0) {
    uni.showToast({
      title: '已重新付款',
      icon: 'none'
    })
    repay_order(card.id).then(res => {
      console.log(res)
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success: function (res) {
          console.log('success', res)
          if (res.errMsg === 'requestPayment:ok') {
            uni.showToast({
              title: '支付成功',
              icon: 'none'
            })
          }
        },
        fail: function (err) {
          console.log('fail', err)
        },
        complete: () => {
          console.log('complete')
          switchTab(tab.value + 1)
        },
      })
    })
    // uni.navigateTo({  
    //   url: '/pages/me/order/pay/index?order_id=' + card.id
    // })
  }
  // 催促发货
  else if (card.state === 1) {
    uni.showToast({
      title: '已催促发货',
      icon: 'none'
    })
  }
  // 退款售后
  else if (card.state === 4) {
    uni.showToast({
      title: '已申请售后',
      icon: 'none'
    })
    // uni.navigateTo({
    //   url: '/pages/me/order/after-sale/index?order_id=' + card.id
    // })
  }

}

onLoad((options) => {
  switchTab(parseInt(options.index) + 1)
})

onReachBottom(() => {
  page++
  const i = tab.value === -1 ? undefined : tab.value
  get_order(page, i, search_value).then(res => {
    orders.value = orders.value.concat(res.data.data)
  })
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
  padding-top: 100rpx;
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