<template>
  <Header />
  <view class="all">
    <view class="tabs">
      <view v-for="(item, index) in tabs" :key="index" class="tab"
        :style="index === tab + 1 ? 'font-weight: 200;font-size: 45rpx;color: #000000;width: 200rpx' : 'font-weight: 800;font-size: 30rpx;color: #717171;width:150rpx;'"
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
          {{ card.state === 0 ? '待付款' : card.state === 1 ? '待发货' : card.state === 2 ? '待收货' : card.state === 3 ? '已完成'
        :
        card.state === 4 ? '待退货' : card.state === 5 ? '拒绝退款' : card.state === 6 ? '已退款' : card.state === 7 ? '拼团中' :
          card.state === 8 ? '取消拼团' : '' }}
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
      <view v-if="[0, 2, 3, 5, 7, 8].includes(card.state)" class="tn-flex-center-end tn-mt-lg">
        <TnButton v-if="card.state === 5" bg-color="#C7BAA7" text-color="#FFFFFF" width="250" height="60"
          :custom-style="{ marginRight: '30rpx' }" @click="re_apply(card)" shape="round">
          再次申请
        </TnButton>
        <TnButton bg-color="#C7BAA7" text-color="#FFFFFF" width="250" height="60"
          :custom-style="{ marginRight: '10rpx' }" @click="order_click(card)" shape="round">
          {{ card.state === 0 ? '去付款' : card.state === 2 ? '确认收货' : card.state === 3 ? '申请退款' : card.state === 5 ?
        '拒绝原因' : card.state === 7 ? '取消拼团' : card.state === 8 ? '再次拼团' : '' }}
        </TnButton>
      </view>
    </view>
    <TnPopup v-model="refundVisible" width="650" height="500" @close="resetRefund">
      <view style="width: 100%;display: flex;flex-direction: column;align-items: center">
        <view class="refund_title">退款原因</view>
        <view style="width: 600rpx;margin-bottom: 30rpx;">
          <TnInput type="textarea" v-model="refund_reason" height="300" placeholder="请输入退款原因">
          </TnInput>
        </view>
        <view class="tn-flex-center-around tn-w-full">
          <TnButton type="info" width="250" height="60" @click="resetRefund" shape="round">
            取消
          </TnButton>
          <TnButton bg-color="#C7BAA7" text-color="#FFFFFF" width="250" height="60" @click="refund_order" shape="round">
            提交
          </TnButton>
        </view>
      </view>
    </TnPopup>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'
import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
import TnInput from '@/uni_modules/tuniaoui-vue3/components/input/src/input.vue'
import { get_order, repay_order, post_refund, post_receive } from '@/api/order/order'


const tab = ref()
const tabs = ref(['全部', '待付款', '待发货', '待收货', '已完成', '待退货', '拒绝退款', '已退款', '拼团中', '取消拼团'])

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

const select_order = ref({})

// 申请退款
const refundVisible = ref(false)
const refund_reason = ref('')
const refund_order = () => {
  post_refund(select_order.value.id, refund_reason.value).then(res => {
    console.log(res)
    if (res.code = 200) {
      refundVisible.value = false
      uni.showToast({
        title: '申请成功',
        icon: 'none'
      })
      switchTab(tab.value + 1)
    }
    else
      uni.showToast({
        title: '提交失败',
        icon: 'none'
      })
  })
}
const resetRefund = () => {
  refundVisible.value = false
  refund_reason.value = ''
}

// 再次申请
const re_apply = (card) => {
  refundVisible.value = true
  refund_reason.value = ''
  select_order.value = card
}


const order_click = (card) => {
  console.log(card)
  select_order.value = card
  // 重新付款
  if (card.state === 0) {
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
  // 确认收货
  if (card.state === 2) {
    uni.showModal({
      title: '确认收货',
      content: '是否确认收货',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          post_receive(card.id).then(res => {
            switchTab(tab.value + 1)
          })
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  }
  // 申请退款
  if (card.state === 3) {
    refundVisible.value = true
  }
  // 拒绝原因
  if (card.state === 5) {
    uni.showModal({
      title: '拒绝原因',
      content: card.refuse,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
        }
      }
    })
  }
  // 取消拼团
  if (card.state === 7) {
    uni.showModal({
      title: '取消拼团',
      content: '是否取消拼团',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          switchTab(tab.value + 1)
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  }
  // 再次拼团
  if (card.state === 8) {
    uni.showModal({
      title: '再次拼团',
      content: '是否再次拼团',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          switchTab(tab.value + 1)
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
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
  padding-top: 150rpx;
}

.top {
  width: 90%;
  margin-top: 100rpx;
  display: flex;
  align-items: center;
}

.tabs {
  position: relative;
  width: 100vw;
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
}

.tab {
  flex-grow: 1;
  flex-shrink: 0;
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

.refund_title {
  font-family: Inter, Inter;
  font-weight: normal;
  font-size: 40rpx;
  color: #000000;
  line-height: 46rpx;
  text-align: center;
  margin: 20rpx 0;
}
</style>