<template>
  <Header title="确认订单" />
  <view class="all">
    <view class="card address" @click="showAddress">
      <view v-if="order.address" class="info">
        <image
          src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhRZ79seDfEequ1Hb9ickvPefV9FlF1NZbibwytQibaoEFxqbxzfnoXYxx72t1xcTG5QxEclNf797DAVA/0?wx_fmt=png"
          mode="scaleToFill"
          class="map"
        />
        <view>
          <view class="title">
            {{ order.address.address_name + " " + order.address.detail }}
          </view>
          <view class="desc">
            {{ order.address.name }} {{ order.address.phone }}
          </view>
        </view>
      </view>
      <view v-else class="info"> 请选择收货地址 </view>
      <TnIcon name="right" />
    </view>
    <view class="card goods_list">
      <view class="goods">
        <image
          v-for="good in order.com_item"
          :key="good.id"
          :src="good.path"
          class="image"
          mode="scaleToFill"
        />
      </view>
      <view class="right">
        共{{ order.com_item?.length }}件
        <TnIcon name="right" />
      </view>
    </view>
    <view class="card price">
      <view class="title">价格明细</view>
      <view class="price_item">
        <view class="left">商品金额</view>
        <view class="right"> ￥ {{ order.show_price }} </view>
      </view>
      <view class="price_item">
        <view class="left">
          <view>配送费</view>
        </view>
        <view class="right">
          <view> ￥ {{ order.freight }} </view>
        </view>
      </view>
      <view v-if="type" class="price_item">
        <view class="left"> 活动优惠 </view>
        <view class="discount"> -￥ {{ order.discount_price }} </view>
      </view>
      <view v-if="type === 0" class="price_item" @click="showCoupon">
        <view class="left">
          <image
            src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhRZ79seDfEequ1Hb9ickvPefN6opIhUMaphx7TnXfSmuBfib7aSODM2zvb8ibvY2VZc5tUAo2ibHDbjEQ/0?wx_fmt=png"
            mode="scaleToFill"
            class="coupon"
          />
          <view> 优惠券 </view>
        </view>
        <view class="right">
          <view v-if="order.coupon" class="discount">
            - ￥{{ coupon_price.toFixed(2) }}
          </view>
          <view v-else class="old">
            {{ usable_list?.length === 0 ? "暂无优惠券" : "请选择优惠券" }}
          </view>
          <TnIcon name="right" />
        </view>
      </view>
      <view class="total">
        <view class="discount text"> 共优惠 </view>
        <view class="discount pay">
          -￥ {{ (order.discount_price + coupon_price).toFixed(2) }}
        </view>
        <view class="res text"> 小计： </view>
        <view class="res pay"> ￥ {{ order.price }} </view>
      </view>
    </view>
    <view class="card price">
      <view class="title"> 支付方式 </view>
      <view class="price_item">
        <view class="left">
          <image
            src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhRZ79seDfEequ1Hb9ickvPefcDLgnn0x3soldkgUfGnxj3XuEYibYVlQUYEibpO4Ar4Bd7lMRqbJa4Uw/0?wx_fmt=png"
            mode="scaleToFill"
            class="wechat"
          />
          微信支付
        </view>
        <TnCheckbox
          active-color="#14bf20"
          checked-shape="circle"
          v-model="pay_way"
          disabled
        />
      </view>
    </view>
  </view>
  <view class="bottom">
    <view class="res">
      应付：
      <view class="pay"> ￥{{ order.price }} </view>
    </view>
    <TnButton type="success" size="xl" shape="round" @click="pay">
      去支付
    </TnButton>
  </view>
  <AddressPopup
    :visible="address_visible"
    :select_id="order.address?.id"
    @close="address_visible = false"
    @changeAddress="changeAddress"
  />
  <TnPopup
    v-model="coupon_visible"
    open-direction="bottom"
    height="750"
    @close="coupon_visible = false"
  >
    <view class="coupon-all">
      <view class="header"> 选择优惠券 </view>
      <view class="title"> 可用优惠券 </view>
      <view
        v-for="coupon in usable_list"
        :key="coupon.id"
        class="coupon usable tn-mb-lg"
        @click="selectCoupon(coupon)"
      >
        <view class="left">
          <view class="coupon-price">
            <view class="type">
              {{ coupon.type_text }}
            </view>
            <view class="discount">
              {{
                coupon.type_text === "折扣券"
                  ? `${coupon.price}折`
                  : `￥${coupon.price}`
              }}
            </view>
            <view class="desc">
              {{ descText(coupon) }}
            </view>
          </view>
          <view class="main">
            <view class="name">
              {{ coupon.name }}
            </view>
            <view class="desc" v-if="coupon.bk_text">
              {{ coupon.bk_text }}
            </view>
            <view class="time"> 有效期至：{{ coupon.end }} </view>
          </view>
        </view>
        <TnCheckbox
          v-model="coupon.isSelect"
          active-color="#14bf20"
          checked-shape="circle"
        />
      </view>
      <view class="title"> 不可用优惠券 </view>
      <view v-for="coupon in unusable_list" :key="coupon.id" class="tn-mb-lg">
        <view class="coupon unusable">
          <view class="left">
            <view class="coupon-price">
              <view class="type">
                {{ coupon.type_text }}
              </view>
              <view class="discount">
                {{
                  coupon.type_text === "折扣券"
                    ? `${coupon.price}折`
                    : `￥${coupon.price}`
                }}
              </view>
              <view class="desc">
                {{ descText(coupon) }}
              </view>
            </view>
            <view class="main">
              <view class="name">
                {{ coupon.name }}
              </view>
              <view class="desc" v-if="coupon.bk_text">
                {{ coupon.bk_text }}
              </view>
              <view class="time"> 有效期至：{{ coupon.end }} </view>
            </view>
          </view>
          <view></view>
        </view>
        <view class="reason">
          {{ coupon.reason }}
        </view>
      </view>
    </view>
  </TnPopup>
</template>

<script setup>
import { ref, computed } from "vue"
import { onLoad } from "@dcloudio/uni-app"

import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import TnCheckbox from "@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue"
import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"
import TnPopup from "@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue"

import Header from "@/components/header"
import AddressPopup from "@/components/AddressPopup"
import { get_usable_coupon } from "@/api/coupon/coupon"
import { new_order, get_order_price } from "@/api/order/order"
import { CartStore } from "@/store"

const cart = CartStore()

const order = ref({})
const pay_way = ref(true)
var flash_com_id
var teamwork_com_id
var com_cont
var ids
var shopping_cart_ids

/**
 * 获取订单价格和运费
 */
const getOrderPrice = () => {
  const address = order.value.address
  console.log(address)
  // 秒杀商品
  if (flash_com_id) {
    get_order_price({ flash_com_id, com_cont, address_id: address?.id }).then(
      (res) => {
        order.value = {
          ...res.data,
          com_item: [res.data.com_item],
          address,
        }
        type.value = 2
      }
    )
    return
  }
  if (teamwork_com_id) {
    get_order_price({ teamwork_com_id, com_cont }).then((res) => {
      order.value = {
        ...res.data,
        com_item: [res.data.com_item],
        address,
      }
      type.value = 1
    })
    return
  }

  // 普通商品
  get_order_price({
    ids,
    address_id: address?.id,
    coupon_id: order.value.coupon?.id,
  }).then((res) => {
    console.log(res.data)
    order.value = {
      ...res.data,
      address,
    }
  })
  get_usable_coupon({ ids }).then((res) => {
    usable_list.value = res.data.keyong.map((item) => ({
      ...item,
      isSelect: false,
    }))
    unusable_list.value = res.data.bukeyong
  })
}

// 判断是普通商品还是活动商品 0普通 1拼团 2秒杀
const type = ref(0)

const address_visible = ref(false)
/**
 * 展示选择地址弹窗，并获取地址数据
 */
const showAddress = () => {
  address_visible.value = true
}
const changeAddress = (item) => {
  order.value.address = item
  getOrderPrice()
}

// 优惠券列表
const usable_list = ref([])
const unusable_list = ref([])
const coupon_visible = ref(false)
const showCoupon = () => {
  if (usable_list.value.length === 0) {
    uni.showToast({ title: "暂无优惠券", icon: "none" })
    return
  }
  coupon_visible.value = true
}
const descText = (coupon) => {
  if (coupon.type_text === "现金券") return ""
  if (coupon.type_text === "满减券") return `满${coupon.full}减${coupon.reduce}`
  if (coupon.type_text === "类目券") return ""
  if (coupon.type_text === "折扣券") return `打${coupon.price}折`
}
const selectCoupon = (coupon) => {
  // 清除其他选择
  usable_list.value.forEach((item) => {
    if (item.id !== coupon.id) {
      item.isSelect = false
    }
  })
  coupon.isSelect = true
  order.value.coupon = coupon
  getOrderPrice()
}
// 计算使用优惠券降价
const coupon_price = computed(() => {
  if (!order.value.coupon) return 0
  if (order.value.coupon.type_text === "折扣券")
    return order.value.show_price * (1 - order.value.coupon.price / 10)
  return order.value.coupon.price
})

/**
 * 支付订单
 */
const pay = async () => {
  var res
  // 普通商品
  if (type.value === 0)
    res = await new_order({
      ids,
      address_id: order.value.address.id,
      coupon_id: order.value.coupon ? order.value.coupon.id : undefined,
      shopping_cart_ids,
    })
  // 拼团商品
  else if (type.value === 1)
    res = await new_order({
      address_id: order.value.address.id,
      teamwork_com_id,
      com_cont,
    })
  // 秒杀商品
  else
    res = await new_order({
      address_id: order.value.address.id,
      flash_com_id,
      com_cont,
    })
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
    complete: () => {
      uni.reLaunch({ url: "/pages/me/order/detail?id=" + res.data.order_id })
      cart.update()
    },
  })
}

onLoad((options) => {
  flash_com_id = options.flash_id
  teamwork_com_id = options.teamwork_id
  com_cont = options.com_cont
  if (options.ids) {
    ids = JSON.parse(options.ids)
    shopping_cart_ids = JSON.parse(options.shopping)
  }
  getOrderPrice()
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  position: relative;
  padding: 200rpx 0 100rpx;
  background: #f5f5f5;
  z-index: 0;
}

.all::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 560rpx;
  background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhRZ79seDfEequ1Hb9ickvPeftGpjvxq7dKHqF0IPP2bpExe4szbAaPK2wOG52haKkCu8ZuiaIcprFdw/0?wx_fmt=png")
    no-repeat;
  background-size: 100% auto;
  z-index: -1;
}

.card {
  width: 90%;
  border-radius: 24rpx;
  padding: 20rpx;
  background: #fff;
  margin: 20rpx 5%;
}

.address {
  min-height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .info {
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 32rpx;
    color: #131313;
    line-height: 45rpx;
    text-align: left;
    font-style: normal;

    .map {
      width: 50rpx;
      height: 50rpx;
      margin-right: 20rpx;
    }

    .title {
      //单行显示，超出省略号
      max-width: 555rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .desc {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #666666;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
    }
  }
}

.goods_list {
  display: flex;
  align-items: center;
  justify-content: start;

  .goods {
    width: 80%;
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;

    .image {
      flex-shrink: 0; //防止被压缩
      width: 140rpx;
      height: 140rpx;
      margin-right: 20rpx;
    }
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #666666;
    line-height: 33rpx;
    text-align: left;
    font-style: normal;

    .old {
      font-family: WeChat-Sans-Std, WeChat-Sans-Std;
      font-weight: 400;
      font-size: 28rpx;
      color: #999999;
      line-height: 31rpx;
      text-align: center;
      font-style: normal;
      text-decoration-line: line-through;
    }
  }
}

.price {
  padding: 30rpx 20rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 30rpx;
    color: #131313;
    line-height: 42rpx;
    text-align: left;
    font-style: normal;
    padding-bottom: 30rpx;
    border-bottom: 1rpx solid #eeeeee;
  }

  .price_item {
    width: 100%;
    margin: 20rpx 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;

    .left {
      display: flex;
      align-items: center;

      .tag {
        margin-left: 10rpx;
        color: #999999;
        border: 1rpx dotted #999999;
      }

      .coupon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
      }

      .wechat {
        width: 64rpx;
        height: 64rpx;
        margin-right: 20rpx;
      }
    }

    .right {
      display: flex;
      align-items: center;
    }

    .discount {
      font-family: WeChat-Sans-Std, WeChat-Sans-Std;
      font-weight: 400;
      font-size: 28rpx;
      color: #ee2532;
      line-height: 31rpx;
      text-align: center;
      font-style: normal;
    }
  }

  .total {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 30rpx;
    border-top: 1rpx solid #eeeeee;

    .discount {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      line-height: 33rpx;
      text-align: center;
      font-style: normal;
      color: #999999;
    }

    .pay {
      margin: 0 10rpx;
      color: #ee2532;
    }

    .res {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      line-height: 37rpx;
      text-align: center;
      font-style: normal;
      color: #131313;
    }
  }
}

.bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 10rpx 20rpx;
  align-items: center;
  background: #fff;
  justify-content: flex-end;

  .res {
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #333333;
    line-height: 37rpx;
    text-align: left;
    font-style: normal;

    .pay {
      color: #ee2532;
    }

    margin-right: 20rpx;
  }
}

.coupon-all {
  height: 750rpx;
  width: 100%;
  overflow: auto;
  padding: 30rpx 20rpx;

  .header {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #0f0d0d;
    line-height: 45rpx;
    text-align: center;
    font-style: normal;
  }

  .title {
    margin: 30rpx 0;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 34rpx;
    color: #131313;
    line-height: 48rpx;
    font-style: normal;
  }

  .coupon {
    width: 100%;
    height: 180rpx;
    padding-right: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      position: relative;

      .coupon-price {
        width: 180rpx;
        height: 180rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .type {
          position: absolute;
          top: 0;
          left: 0;
          width: 136rpx;
          height: 40rpx;
          text-align: center;
          color: #fff;
          border-radius: 8rpx 0rpx 8rpx 0rpx;
        }

        .discount {
          font-family: WeChat-Sans-Std, WeChat-Sans-Std;
          font-weight: bold;
          font-size: 60rpx;
          line-height: 66rpx;
          text-align: left;
          font-style: normal;
        }

        .desc {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 22rpx;
          line-height: 30rpx;
          text-align: left;
          font-style: normal;
        }
      }

      .main {
        margin-left: 100rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 22rpx;
        line-height: 30rpx;
        text-align: left;
        font-style: normal;

        .name {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 28rpx;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
          margin-bottom: 10rpx;
        }

        .time {
          margin-top: 10rpx;
        }
      }
    }
  }

  .usable {
    background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhSicr23JD01fOs8hzEmFwb8vfCq3Kefaic0OH4dos360FCvZwQ2ib43ohBUcIfm3Wy0FaweEgFuFzhZA/0?wx_fmt=png")
      no-repeat;
    background-size: 100% 100%;

    .left {
      color: #ee2532;

      .type {
        background: #ff4121;
      }

      .main {
        color: #666;

        .name {
          color: #131313;
        }
      }
    }
  }

  .unusable {
    background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhSicr23JD01fOs8hzEmFwb8vLNxgsBK2ficyplPp60mpfuVmGd1mwzITWiamyQFZ02S3vcicAKUxM07Ag/0?wx_fmt=png")
      no-repeat;
    background-size: 100% 100%;

    .left {
      color: #999999;

      .type {
        background: #c2c2c2;
      }

      .main {
        color: #999;
      }
    }
  }

  .reason {
    width: 100%;
    padding: 20rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    background: #f6f6f6;
    color: #131313;
    line-height: 37rpx;
    text-align: left;
    font-style: normal;
  }
}
</style>
