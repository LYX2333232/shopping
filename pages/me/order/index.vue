<template>
  <Header />
  <view class="all">
    <view class="header">
      <view class="search">
        <TnIcon name="search" />
        <input type="text" placeholder="搜索订单" />
      </view>
      <view class="tabs">
        <view
          v-for="(item, index) in tabs"
          :key="index"
          :class="['tab', index === tab + 1 ? 'active' : 'inactive']"
          @click="switchTab(index)"
        >
          {{ item }}
        </view>
      </view>
    </view>
    <view v-if="is_empty" class="empty">
      <TnEmpty mode="cart">
        <template #icon>
          <image
            src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhTcBKpUgwer5OCCic51cf2LcV60EdpTKrgv3dLu4wuOFc8iapxtqboZT3lFKDKrgqic8JOzmdT0nQevg/0?wx_fmt=png"
            mode="scaleToFill"
          />
        </template>
        <template #tips>
          <view> 您还没有添加商品 </view>
        </template>
      </TnEmpty>
    </view>
    <view
      class="card"
      v-for="card in orders"
      :key="card.id"
      @click="toDetail(card)"
    >
      <view class="title">
        <view class="time">
          {{ card.created_at }}
        </view>
        <text
          class="right"
          :style="{ color: card.state === 1 ? '#EE2532' : '#131313' }"
        >
          {{ card.statte_text }}
        </text>
      </view>
      <view class="tn-flex-center-start tn-w-full">
        <view class="goods">
          <view v-for="good in card.order_com" :key="good.id">
            <image :src="good.path" mode="scaleToFill" class="image" />
          </view>
        </view>
        <view class="right">
          <view> 共{{ card.order_com.length }}种 </view>
          <view> {{ card.conts }}件 </view>
        </view>
      </view>
      <!-- 待付款：展示订单剩余支付时间 -->
      <view v-if="card.state === 0" class="toPay">
        <TnCountDown
          :time="Math.floor((new Date(card.order_end) - new Date()) / 1000)"
          separator-mode="cn"
          text-color="#EE2532"
          separator-color="#EE2532"
          :show-hour="false"
        />
        后订单关闭，请及时付款
      </view>
      <!-- 待收货，显示送货阶段 -->
      <view v-if="card.state >= 10" class="deliver">
        <TnIcon name="cart" color="#14BF20" />
        {{ deliver[card.state] }}
      </view>
      <view class="tn-flex-center-between">
        <view>
          <view v-if="card.teamwork" class="others">
            <image
              v-for="(_, index) in card.teamwork.users"
              :key="index"
              :src="getRandomImage(50, 50)"
              mode="scaleToFill"
              class="avatar"
            />
            <view v-if="card.teamwork.state === 0">
              已有{{ card.teamwork.seng_count }}人拼团，
              <text style="color: #ee2532"
                >还差{{
                  card.teamwork.count - card.teamwork.seng_count
                }}人</text
              >
            </view>
            <view v-else-if="card.teamwork.state === 1">拼团成功</view>
            <view v-else>拼团失败</view>
          </view>
        </view>
        <view class="price">
          {{ card.state === 0 ? "需付款" : "实付款" }}￥ {{ card.price }}
        </view>
      </view>
      <view class="tn-flex-center-end tn-w-full tn-mt-lg">
        <TnButton
          v-for="(btn, index) in buttons[card.statte_text]"
          :key="index"
          :bg-color="btn.type ? '#14BF20' : '#FFF'"
          :text-color="btn.type ? '#FFF' : '#000'"
          :custom-style="{ marginLeft: '20rpx' }"
          :plain="!btn.type"
          shape="round"
          @click="btn.fun(card)"
          click-modifiers="stop"
        >
          {{ btn.title }}
        </TnButton>
      </view>
    </view>
    <TnPopup
      v-model="refundVisible"
      width="650"
      height="500"
      @close="resetRefund"
    >
      <view
        style="
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        "
      >
        <view class="refund_title">退款原因</view>
        <view style="width: 600rpx; margin-bottom: 30rpx">
          <TnInput
            type="textarea"
            v-model="refund_reason"
            height="300"
            placeholder="请输入退款原因"
          >
          </TnInput>
        </view>
        <view class="tn-flex-center-around tn-w-full">
          <TnButton
            type="info"
            width="250"
            height="60"
            @click="resetRefund"
            shape="round"
          >
            取消
          </TnButton>
          <TnButton
            bg-color="#C7BAA7"
            text-color="#FFFFFF"
            width="250"
            height="60"
            @click="refund_order"
            shape="round"
          >
            提交
          </TnButton>
        </view>
      </view>
    </TnPopup>
  </view>
</template>

<script setup>
import { ref } from "vue"
import { onLoad, onReachBottom } from "@dcloudio/uni-app"

import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"
import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import TnPopup from "@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue"
import TnInput from "@/uni_modules/tuniaoui-vue3/components/input/src/input.vue"
import TnEmpty from "@/uni_modules/tuniaoui-vue3/components/empty/src/empty.vue"
import TnCountDown from "@/uni_modules/tuniaoui-vue3/components/count-down/src/count-down.vue"
import Header from "@/components/header.vue"
import {
  get_order,
  repay_order,
  post_refund,
  post_receive,
  close_teamwork,
  post_delete_order,
  get_refund_agreement,
} from "@/api/order/order"
import { get_today_detail } from "@/api/index/today/today"
import { getRandomImage } from "@/utils/constant"

const tab = ref()
const tabs = ref(["全部", "待付款", "待发货", "待收货", "退款/售后"])

const deliver = ref({
  10: "待接单",
  20: "已接单",
  30: "已到店",
  40: "配送中",
  50: "已完成",
  60: "已取消",
  70: "配送失败",
})

let page = 1

const switchTab = (index) => {
  tab.value = index - 1
  page = 1
  const i = index - 1
  get_order(page, i)
    .then((res) => {
      console.log("res", res)
      orders.value = res.data.data
      is_empty.value = !res.data.data.length
    })
    .catch((err) => {
      console.log("err", err)
      is_empty.value = true
    })
}

const is_empty = ref(false)

const orders = ref([])

const select_order = ref({})

const toDetail = (card) =>
  uni.navigateTo({
    url: "/pages/me/order/detail?id=" + card.id,
  })

// 删除订单
const delete_order = (card) => {
  uni.showModal({
    title: "提示",
    content: "确定删除订单吗？",
    success: function (res) {
      if (res.confirm) {
        post_delete_order(card.id).then((res) => {
          if (res.code === 200) {
            uni.showToast({
              title: "删除成功",
              icon: "none",
            })
            switchTab(tab.value + 1)
          } else
            uni.showToast({
              title: "删除失败",
              icon: "none",
            })
        })
      }
    },
  })
}

/**
 * 重新付款
 * @params card 订单信息
 */
const toPay = (card) => {
  repay_order(card.id).then((res) => {
    uni.requestPayment({
      provider: "wxpay",
      timeStamp: res.data.timeStamp,
      nonceStr: res.data.nonceStr,
      package: res.data.package,
      signType: res.data.signType,
      paySign: res.data.paySign,
      success: function (res) {
        if (res.errMsg === "requestPayment:ok") {
          uni.showToast({
            title: "支付成功",
            icon: "none",
          })
        }
      },
      fail: function (err) {
        console.log("fail", err)
      },
    })
  })
}

// 确认收货
const receive = (card) => {
  uni.showModal({
    title: "确认收货",
    content: "是否确认收货",
    success: function (res) {
      if (res.confirm) {
        post_receive(card.id).then((res) => {
          switchTab(tab.value + 1)
        })
      }
    },
  })
}

// 确定退款
const refundVisible = ref(false)
const refund_reason = ref("")
const refund_order = () => {
  post_refund(select_order.value.id, refund_reason.value).then((res) => {
    if ((res.code = 200)) {
      refundVisible.value = false
      uni.showToast({
        title: "申请成功",
        icon: "none",
      })
      switchTab(tab.value + 1)
    } else
      uni.showToast({
        title: "提交失败",
        icon: "none",
      })
  })
}

const resetRefund = () => {
  refundVisible.value = false
  refund_reason.value = ""
}
const cancelRefund = (card) => {
  console.log("cancelRefund")
}
const showRefundDetail = (card) => {
  console.log("showDetail")
}

/**
 * 分享拼团
 */
const share = () => {
  console.log("share")
}

const applyForAnswer = (card) => {
  get_refund_agreement(card.id).then((res) => {
    uni.showModal({
      title: "违约金",
      content: `同城配送需要赔付违约金${res.data}元`,
      confirmText: "同意",
      success: (res) => {
        if (res.confirm) {
          select_order.value = card
          refundVisible.value = true
        }
      },
      cancelText: "拒绝",
    })
    console.log(res)
  })
}

// 根据不同的状态设定不同的按钮展示
const buttons = ref({
  // 待付款
  待支付: [
    {
      title: "取消订单",
      fun: delete_order,
    },
    {
      title: "继续支付",
      fun: toPay,
      type: "success",
    },
  ],
  // 待分享
  拼团中: [
    {
      title: "取消订单",
      fun: delete_order,
    },
    {
      title: "邀请好友拼单",
      fun: share,
      type: "success",
    },
  ],
  // 待发货
  待发货: [
    {
      title: "申请退款",
      fun: applyForAnswer,
    },
  ],
  // 待收货
  待收货: [
    {
      title: "申请退款",
      fun: applyForAnswer,
    },
    {
      title: "确认收货",
      fun: receive,
      type: "success",
    },
  ],
  待接单: [
    {
      title: "申请退款",
      fun: applyForAnswer,
    },
    {
      title: "确认收货",
      fun: confirm,
      type: "success",
    },
  ],
  已接单: [
    {
      title: "申请退款",
      fun: applyForAnswer,
    },
    {
      title: "确认收货",
      fun: confirm,
      type: "success",
    },
  ],
  已到店: [
    {
      title: "申请退款",
      fun: applyForAnswer,
    },
    {
      title: "确认收货",
      fun: confirm,
      type: "success",
    },
  ],
  配送中: [
    {
      title: "申请退款",
      fun: applyForAnswer,
    },
    {
      title: "确认收货",
      fun: confirm,
      type: "success",
    },
  ],
  // 已完成
  已完成: [
    {
      title: "删除订单",
      fun: delete_order,
    },
    {
      title: "申请退款",
      fun: applyForAnswer,
    },
  ],
  拼团失败: [
    {
      title: "删除订单",
      fun: delete_order,
    },
  ],
  // 已取消
  已取消: [
    {
      title: "删除订单",
      fun: delete_order,
    },
  ],
  // 交易关闭
  交易关闭: [
    {
      title: "删除订单",
      fun: delete_order,
    },
    {
      title: "申请退款",
      fun: applyForAnswer,
    },
  ],
  // 退款中
  退款中: [
    {
      title: "撤销售后",
      fun: cancelRefund,
    },
    {
      title: "删除订单",
      fun: delete_order,
    },
  ],
  // 退款完成
  退款完成: [
    {
      title: "撤销售后",
      fun: cancelRefund,
    },
    {
      title: "售后详情",
      fun: showRefundDetail,
    },
  ],
  // 退款关闭
  退款关闭: [
    {
      title: "撤销售后",
      fun: cancelRefund,
    },
    {
      title: "删除订单",
      fun: delete_order,
    },
  ],
})

onLoad((options) => {
  switchTab(parseInt(options.index) + 1)
})

onReachBottom(() => {
  page++
  const i = tab.value === -1 ? undefined : tab.value
  get_order(page, i).then((res) => {
    orders.value = orders.value.concat(res.data.data)
  })
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top {
  width: 90%;
  margin-top: 100rpx;
  display: flex;
  align-items: center;
}

.header {
  width: 100%;
  padding-top: 70rpx;
  background: #fff;

  .search {
    margin-left: 80rpx;
    display: flex;
    align-items: center;
    width: 450rpx;
    height: 64rpx;
    background: #f6f6f6;
    border-radius: 35rpx;
  }

  .tabs {
    width: 100vw;
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;

    .tab {
      flex-grow: 1;
      flex-shrink: 0;
      font-family: Inter, Inter;
      line-height: 46rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
      padding: 30rpx 25rpx;
    }

    .active {
      font-weight: bold;
      font-size: 32rpx;
      color: #000000;
    }

    .inactive {
      font-weight: 400;
      font-size: 28rpx;
      color: #666666;
    }
  }
}

.empty {
  margin-top: 150rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 30rpx;
  color: #666666;
  line-height: 42rpx;

  image {
    width: 240rpx;
    height: 240rpx;
  }
}

.card {
  width: 90%;
  background: #ffffff;
  padding: 25rpx;
  margin-top: 25rpx;

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 20rpx;

    .time {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 33rpx;
      text-align: left;
      font-style: normal;
    }

    .right {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 30rpx;
      line-height: 42rpx;
      text-align: left;
      font-style: normal;
    }
  }

  .goods {
    width: 100%;
    display: flex;
    overflow: auto;
  }

  .order {
    font-size: 20rpx;
    color: gray;
    margin: 10rpx 0;
  }

  .image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 20rpx;
    margin-right: 20rpx;
  }

  .right {
    min-width: 100rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: bold;
    font-size: 24rpx;
    color: #999999;
    line-height: 33rpx;
    text-align: left;
    font-style: normal;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .toPay {
    width: 100%;
    height: 64rpx;
    background: #f6f6f6;
    border-radius: 16rpx;
    margin: 20rpx 0;
    padding-left: 20rpx;
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #999;
    line-height: 33rpx;
    font-style: normal;
  }

  .deliver {
    width: 100%;
    height: 64rpx;
    background: #f6f6f6;
    border-radius: 16rpx;
    margin: 20rpx 0;
    padding-left: 20rpx;
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #14bf20;
    line-height: 33rpx;
    font-style: normal;
  }

  .others {
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 22rpx;
    color: #999999;
    line-height: 30rpx;
    text-align: left;
    font-style: normal;

    .avatar {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      margin-left: -10rpx;
    }

    view {
      margin-left: 20rpx;
    }
  }

  .price {
    font-family: WeChat-Sans-Std, WeChat-Sans-Std;
    font-weight: bold;
    font-size: 34rpx;
    color: #131313;
    line-height: 38rpx;
    font-style: normal;
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
