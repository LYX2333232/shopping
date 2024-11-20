<template>
  <Header />
  <view class="all">
    <view class="card header">
      <view class="background" v-if="order.statte_text === '待分享'">
        拼团剩余时间
        <CountDown :time="Math.floor((new Date(order.order_end) - new Date()) / 1000)" background="#EE2532"
          textColor="#FFF" />
      </view>
      <view class="title">
        {{ order.statte_text }}
      </view>
      <!-- 拼团部分 -->
      <view v-if="order.teamwork" class="others">
        <image v-for="(user, index) in order.teamwork.users" :key="index" :src="user" mode="scaleToFill"
          class="avatar" />
        <view v-if="order.teamwork.state === 0">
          已有{{ order.teamwork.seng_count }}人拼团，
          <text style="color:#EE2532">还差{{ order.teamwork.count - order.teamwork.seng_count }}人</text>
        </view>
        <view v-else-if="order.teamwork.state === 1">拼团成功！商家正在备货</view>
        <view v-else>拼团失败</view>
      </view>
      <view v-else-if="order.statte_text === '待发货'" class="desc">商家正在备货</view>
      <TnButton v-if="order.statte_text === '待分享' || order.statte_text === '拼团中'" width="100%" height="80" shape="round"
        type="success">
        邀请好友拼单
      </TnButton>

      <view v-if="order.statte_text === '待收货'">
        {{ deliver[order.state] }}
      </view>
      <TnButton v-if="order.statte_text === '待收货'" width="100%" height="80" shape="round" type="success">
        确认收货
      </TnButton>

      <!-- 待付款部分 -->
      <view v-if="order.statte_text === '待付款'" class="desc">
        15分钟后订单关闭，请尽快支付哦
      </view>
      <TnButton v-if="order.statte_text === '待付款'" width="100%" height="80" shape="round" type="success">
        去支付
        <TnCountDown :time="Math.floor((new Date(order.order_end) - new Date()) / 1000)" text-color="#FFF"
          separator-color="#FFF" />
      </TnButton>
    </view>
    <view class="card deliver">
      <view class="title">
        配送信息
      </view>
      <view class="tn-flex-start-start tn-m-lg tn-w-full">
        <TnIcon name="map" size="40" />
        <view class="tn-ml-sm">
          <view class="location">
            {{ order.used_address.address }}
          </view>
          <view class="info">
            {{ order.used_address.name }} {{ order.used_address.phone }}
          </view>
        </view>
      </view>
    </view>
    <view class="card goods">
      <view class="tn-flex-center-between tn-w-full">
        <view class="tn-flex-center-start">
          <view class="title">
            商品信息
          </view>
          <view class="type">
            共{{ order.order_com.length }}种
          </view>
        </view>
        <TnIcon name="right" />
      </view>
      <view v-for="good in order.order_com" :key="good.id" class="good">
        <image :src="good.path" mode="scaleToFill" class="image" />
        <view class="right">
          <view class="tn-flex-center-between tn-w-full">
            <view class="title">{{ good.name }}</view>
            <view class="total">
              ￥ {{ good.should_price }}
            </view>
          </view>
          <view class="tn-flex-center-between tn-w-full">
            <view>
              规格：{{ good.item_name }}/袋
            </view>
            <view>
              {{ good.cont }}袋
            </view>
          </view>
          <view>
            单价：￥ {{ good.price }}
            <text v-if="good.old_price" class="old">￥{{ good.old_price }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="card order">
      <view class="tn-flex-center-between tn-w-full">
        <view class="title">
          商品金额
        </view>
        <view class="right">
          ￥ {{ order.price }}
        </view>
      </view>
      <view class="tn-flex-center-between tn-w-full">
        <view class="title">
          配送费
        </view>
        <view class="right">
          ￥ {{ order.freight }}
        </view>
      </view>
      <view v-if="order.coupon_price" class="tn-flex-center-between tn-w-full">
        <view class="title">
          共优惠
        </view>
        <view class="discount">
          <!-- !缺少优惠券 -->
          -￥ {{ order.coupon_price }}
        </view>
      </view>
      <view v-if="order.coupon_price" class="sub-card">
        <view class="tn-flex-center-between tn-w-full" v-for="discount in order.coupon_price" :key="discount.name">
          <view class="title" style="font-size:24rpx">
            {{ discount.name }}
          </view>
          <view class="discount" style="font-size:24rpx">
            -￥ {{ discount.price }}
          </view>
        </view>
      </view>
      <view class="tn-flex-center-end">
        <TnButton shape="round" type="info" plain>取消订单</TnButton>
        <view class="total">
          应付合计：￥{{ order.should_price }}
        </view>
      </view>
    </view>
    <view class="card order_info">
      <view class="tn-flex-center-between tn-w-full">
        <view class="title">
          下单时间
        </view>
        <view class="right">
          {{ order.created_at }}
        </view>
      </view>
      <view class="tn-flex-center-between tn-w-full">
        <view class="title">
          订单编号
        </view>
        <view class="tn-flex-center-start">
          <view class="right">
            <!-- !缺少订单编号 -->
            {{ order.time }}
          </view>
          <TnButton shape="round" type="info" plain>复制</TnButton>
        </view>
      </view>
    </view>
  </view>
  <view class="bottom">
    <TnButton type="info" plain shape="round">客服</TnButton>
    <TnButton type="info" plain shape="round">取消订单</TnButton>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import TnButton from '@tuniao/tnui-vue3-uniapp/components/button/src/button.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnCountDown from '@tuniao/tnui-vue3-uniapp/components/count-down/src/count-down.vue'
import CountDown from '@/components/CountDown'
import Header from '@/components/header'
import { get_order_detail } from '@/api/order/order'
import { getRandomImage } from '@/utils/constant'

const deliver = {
  10: '正在等待接单',
  20: '骑手已经接单',
  30: '骑手已到店',
  40: '商品配送中',
  50: '配送已完成',
  60: '配送已取消',
  70: '配送失败'
}

const order = ref({})
const getDetail = id => {
  get_order_detail(id).then(res => {
    console.log(res)
    order.value = res.data
  })
  // order.value = {
  //   state: 1,
  //   end: new Date().setDate(new Date().getDate() + 1),
  //   address: '海街道高新南2路科兴科学园A1栋201',
  //   name: '张三',
  //   phone: '13800138000',
  //   goods: [
  //     {
  //       id: 1,
  //       path: getRandomImage(),
  //       title: '新疆克伦生无籽红提',
  //       item_name: '1000g/袋',
  //       price: 29.9,
  //       old_price: 49.9,
  //       number: 2
  //     },
  //     {
  //       id: 2,
  //       path: getRandomImage(),
  //       title: '新疆克伦生无籽红提',
  //       item_name: '1000g/袋',
  //       price: 29.9,
  //       old_price: 49.9,
  //       number: 2
  //     }
  //   ],
  //   statte_text: '待收货',
  //   // teamwork: {
  //   //   count: 3,
  //   //   seng_count: 2,
  //   //   state: 1,
  //   //   end: 1759161600,
  //   //   users: [
  //   //     {
  //   //       id: 38,
  //   //       name: "丫ㄅㄩㄉㄛㄩ",
  //   //       avatar: "https://senmei.top/upload/images/66d2cb8616bf1.jpeg",
  //   //     },
  //   //     {
  //   //       id: 10,
  //   //       name: "可dl.sir1",
  //   //       avatar: "https://senmei.top/upload/images/660fb7af4b121.jpeg"
  //   //     }
  //   //   ]
  //   // },
  //   deliver: 2,
  //   discount: [
  //     {
  //       name: '活动优惠',
  //       price: 20,
  //     },
  //     {
  //       name: '会员优惠',
  //       price: 10,
  //     }
  //   ],
  //   time: '2024-10-29 14:09',
  //   deliver_id: "20248403984095203"
  // }
}

// const res = computed(() => order.value.goods.reduce((total, cur) => total + cur.price * cur.number, 0) + order.value.deliver - order.value.discount.reduce((total, cur) => total + cur.price, 0))

onLoad(options => {
  console.log(options)
  getDetail(options.id)
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: #F6F6F6;
  padding: 190rpx 20rpx 0;
}

.card {
  width: 100%;
  background: #FFF;
  margin: 20rpx 0;
}

.header {
  padding: 0 0 30rpx;

  .background {
    width: 100%;
    background: #FFF3DD;
    color: #EE2532;
    display: flex;
    justify-content: center;
    padding: 20rpx;
  }

  .others {
    padding: 30rpx;
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

  .title {
    padding: 20rpx 30rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 38rpx;
    color: #131313;
    line-height: 53rpx;
    text-align: left;
    font-style: normal;
  }

  .desc {
    padding: 30rpx;
  }
}

.deliver {
  padding: 30rpx 20rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #131313;
    line-height: 45rpx;
    text-align: left;
    font-style: normal;
    margin: 30rpx 20rpx;
  }

  .location {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 30rpx;
    color: #131313;
    line-height: 42rpx;
    text-align: left;
    font-style: normal;
  }

  .info {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #999999;
    line-height: 37rpx;
    text-align: left;
    font-style: normal;
  }

  .desc {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }
}

.goods {
  padding: 30rpx 20rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #131313;
    line-height: 45rpx;
    text-align: left;
    font-style: normal;
  }

  .type {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #999999;
    line-height: 37rpx;
    text-align: left;
    font-style: normal;
    margin-left: 20rpx;
  }

  .good {
    margin-top: 40rpx;
    width: 100%;
    display: flex;

    .image {
      width: 140rpx;
      height: 140rpx;
      border-radius: 15rpx;
      margin-right: 20rpx;
    }

    .right {
      width: 100%;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 33rpx;
      text-align: left;
      font-style: normal;

      .title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #131313;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
      }

      .total {
        font-family: WeChat-Sans-Std, WeChat-Sans-Std;
        font-weight: bold;
        font-size: 30rpx;
        color: #131313;
        line-height: 33rpx;
        text-align: center;
        font-style: normal;
      }

      .old {
        text-decoration: line-through;
      }
    }
  }
}

.order {
  padding: 30rpx 20rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }

  .right {
    font-family: WeChat-Sans-Std, WeChat-Sans-Std;
    font-weight: 400;
    font-size: 28rpx;
    color: #131313;
    line-height: 31rpx;
    text-align: left;
    font-style: normal;
  }

  .discount {
    font-family: WeChat-Sans-Std, WeChat-Sans-Std;
    font-weight: 400;
    font-size: 28rpx;
    color: #EE2532;
    line-height: 31rpx;
    text-align: left;
    font-style: normal;
  }

  .sub-card {
    width: 100%;
    margin: 20rpx 0;
    background: #F7F7F7;
    border-radius: 8rpx;
    padding: 20rpx;
  }

  .total {
    font-family: WeChat-Sans-Std, WeChat-Sans-Std;
    font-weight: bold;
    font-size: 40rpx;
    color: #131313;
    line-height: 44rpx;
    text-align: left;
    font-style: normal;
    margin-left: 10rpx;
  }
}

.order_info {
  padding: 30rpx 20rpx;

  title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }

  .right {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #666666;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    margin-right: 10rpx;
  }
}

.bottom {
  width: 100%;
  padding: 10rpx 30rpx;
  background: #FFF;
  margin-top: 30rpx;
  display: flex;
  justify-content: flex-end;
}
</style>