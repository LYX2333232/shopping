<template>
  <view class="top">
    <view class="map" @click="address_visible = true">
      <TnIcon name="map" size="40" />
      <view class="text">
        {{
          address.address.address_name + address.address.detail ?? "定位失败"
        }}
      </view>
      <TnIcon name="down" size="40" />
    </view>
    <view class="tn-flex-center-between">
      <view class="title"> 购物车 </view>
      <view class="delete"> 管理 </view>
    </view>
  </view>
  <view class="all">
    <view v-if="dataList.length > 0" class="card">
      <uni-swipe-action>
        <uni-swipe-action-item
          v-for="(data, index) in dataList"
          :key="data.id"
          :right-options="swipe_options"
          @click="del(data)"
        >
          <shoppingCard
            :index="index"
            :data="data"
            @change="change"
            @changeNum="changeNum"
          ></shoppingCard>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
    <view v-if="deleteList.length > 0" class="card">
      <deleteCard
        v-for="(data, index) in deleteList"
        :key="index"
        :data="data"
        @delete="Delete"
      />
    </view>
    <view v-if="is_empty" class="empty">
      <TnEmpty mode="cart">
        <template #icon>
          <image
            src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhTcBKpUgwer5OCCic51cf2LcV60EdpTKrgv3dLu4wuOFc8iapxtqboZT3lFKDKrgqic8JOzmdT0nQevg/0?wx_fmt=png"
            mode=" scaleToFill"
          />
        </template>
        <template #tips>
          <view> 您还没有添加商品 </view>
        </template>
      </TnEmpty>
    </view>
    <view class="suggest">
      <image
        src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhTcBKpUgwer5OCCic51cf2LcTZxA5rVFQEGxtVt0kIP1dxic6tTEgrte4Uelyw6FcO7HaVDicj9RUnqA/0?wx_fmt=png"
        mode="scaleToFill"
        class="logo"
      />
      <view class="suggest-goods">
        <TnWaterFall :data="infoList" mode="calc">
          <template #left="{ item }">
            <view class="block3" @click="toDetail(item)">
              <image :src="item.path" mode="aspectFit" class="image"></image>
              <view class="name">
                {{ item.name }}
              </view>
              <view class="good-desc">
                {{ item.desc }}
              </view>
              <view class="bottom">
                <view class="left">
                  <view class="price"> ¥{{ item.price }} </view>
                  <view v-if="item.or_price" class="old">
                    ￥{{ item.or_price }}
                  </view>
                </view>
                <TnButton
                  icon="cart"
                  bg-color="#14BF20"
                  text-color="#FFF"
                  shape="circle"
                  font-size="40"
                ></TnButton>
              </view>
            </view>
          </template>
          <template #right="{ item }">
            <view class="block3 item-right" @click="toDetail(item)">
              <image :src="item.path" mode="aspectFit" class="image"></image>
              <view class="name">
                {{ item.name }}
              </view>
              <view class="good-desc">
                {{ item.desc }}
              </view>
              <view class="bottom">
                <view class="left">
                  <view class="price"> ¥{{ item.price }} </view>
                  <view v-if="item.or_price" class="old">
                    ￥{{ item.or_price }}
                  </view>
                </view>
                <TnButton
                  icon="cart"
                  bg-color="#14BF20"
                  text-color="#FFF"
                  shape="circle"
                  font-size="40"
                ></TnButton>
              </view>
            </view>
          </template>
        </TnWaterFall>
      </view>
    </view>
  </view>
  <view class="fix-bottom">
    <view class="free" v-if="!addon_visible">
      <view class="left">
        <image class="image" :src="`${image_url}`" mode="aspectFit"> </image>
        <view class="orange">满99包邮</view>
        <view class="desc">
          |
          {{
            differ > addon_all ? ` 再买 ${differ - addon_all} 元免邮` : "已免邮"
          }}
        </view>
      </view>
      <TnButton
        plain
        border-color="#FF4121"
        text-color="#FF4121"
        shape="round"
        font-size="26rpx"
        @click="addOn"
      >
        去凑单
      </TnButton>
    </view>
    <view class="in_popup" v-else-if="differ > addon_all">
      再买
      <text style="color: #ffd744"> {{ differ - addon_all }}元 </text>
      ，免配送费
    </view>
    <view class="in_popup" v-else> 已免配送费 </view>
    <view class="bottom">
      <view class="tn-flex-center-start">
        <TnCheckbox
          v-model="orderAll"
          :indeterminate="orderSome"
          @change="changeOrderAll"
          checked-shape="circle"
          size="lg"
          active-color="#14bf20"
        ></TnCheckbox>
        <view class="button">全选</view>
      </view>
      <view class="right">
        <view class="text-price">
          <view class="tn-flex-center-start">
            <view class="text">总计</view>
            <view class="price">¥{{ total.toFixed(2) }} </view>
          </view>
          <view class="freight" v-if="total >= 99">已免配送费</view>
          <view class="freight" v-else-if="total > 0"
            >配送费：{{ freight }}</view
          >
        </view>
        <TnButton
          width="220"
          height="80"
          bg-color="#14BF20"
          text-color="#FFF"
          shape="round"
          font-size="30"
          @click="tocaculate"
        >
          结算（{{ select_goods.length }}）
        </TnButton>
      </view>
    </view>
  </view>
  <AddressPopup :visible="address_visible" @close="address_visible = false" />
  <OutPopup :visible="output_visible" @close="close" @toEdit="toEdit" />
  <AddonPopup
    :visible="addon_visible"
    @close="addon_visible = false"
    @changeSelect="changeSelect"
    :differ="differ"
  />
</template>

<script setup>
import { ref, computed, watchEffect } from "vue"
import { onShow, onReachBottom } from "@dcloudio/uni-app"

import TnCheckbox from "@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue"
import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"
import TnEmpty from "@/uni_modules/tuniaoui-vue3/components/empty/src/empty.vue"
import TnWaterFall from "@/uni_modules/tuniaoui-vue3/components/water-fall/src/water-fall.vue"
import deleteCard from "@/components/shopping/deleteCard.vue"
import shoppingCard from "@/components/shopping/shoppingCard.vue"

import AddressPopup from "@/components/AddressPopup"
import OutPopup from "@/components/OutPopup"
import AddonPopup from "@/components/AddonPopup"

import { get_commodity } from "@/api/index/index"
import { get_order_price } from "@/api/order/order"
import { get_cart_list, del_cart } from "@/api/cart/cart"
import { AddressStore } from "@/store"

const address = AddressStore()

const address_visible = ref(false)
const preUrl = import.meta.env.VITE_BASE_URL + "/mini_app/static/shopping"

const image_url = preUrl + "/free.png"

let page = 1

const swipe_options = ref([
  {
    text: "删除",
    style: {
      width: "140rpx",
      backgroundColor: "#FF4121",
      fontFamily: "PingFangSC, PingFang SC",
      fontWeight: 400,
      fontSize: "28rpx",
      color: "#FFFFFF",
      fontStyle: "normal",
    },
  },
])

// 用来标记是否要显示没有购物车数据，避免用户已进入先看到空
const is_empty = computed(() => {
  return dataList.value.length === 0
})

const dataList = ref([])

const select_goods = ref([])

const deleteList = ref([])

const infoList = ref([])

const updateTotal = () => {
  select_goods.value = dataList.value.filter((item) => item.order)
  get_order_price({
    ids: select_goods.value.map((item) => {
      const obj = { cont: item.cont }
      if (item.flash) obj.flash_com_id = item.flash.flash_com_id
      else obj.id = item.item_id
      return obj
    }),
  }).then((res) => {
    // console.log(res)
    freight.value = res.data.freight
    total.value = res.data.price
    differ.value = res.data.differ
  })
}

// 改变选中状态
const change = (e, i, j) => {
  dataList.value[j].order = e
}

// 修改数量
const changeNum = (e, i, j) => {
  dataList.value[j].cont = e
}

// 全选
const orderAll = computed({
  get: () => {
    return dataList.value.every((item) => item.order)
  },
  set: (val) => {
    dataList.value.forEach((item) => {
      item.order = val
    })
  },
})

// 部分选中
const orderSome = computed(() => {
  return dataList.value.some((item) => item.order)
})

// 全选
const changeOrderAll = (e) => {
  orderAll.value = e
}

const del = (data) => {
  // 旧版，把选中的所有都删除
  // const list = []
  // uni.showModal({
  //   title: "提示",
  //   content: "确定要删除选中的所有商品吗?",
  //   success: (success) => {
  //     if (success.confirm) {
  //       select_goods.value.forEach((item) => {
  //         list.push(del_cart(item.id))
  //       })
  //       del_cart(select_goods.value.map((item) => item.item_id)).then((res) => {
  //         if (res.code === 200) {
  //           dataList.value = dataList.value.filter(
  //             (item) => !select_goods.value.includes(item)
  //           )
  //           console.log(dataList.value, select_goods.value)
  //           if (dataList.value.length === 0) is_empty.value = true
  //           uni.showToast({
  //             title: "删除成功",
  //             icon: "none",
  //           })
  //           select_goods.value = []
  //         }
  //       })
  //     }
  //   },
  // })
  console.log(data)
  uni.showModal({
    title: "确定要删除该商品吗？",
    success: (success) => {
      if (success.confirm) {
        del_cart(data.id).then((res) => {
          if (res.code === 200) {
            dataList.value = dataList.value.filter(
              (item) => item.id !== data.id
            )
            select_goods.value = select_goods.value.filter(
              (item) => item.id !== data.id
            )
            uni.showToast({
              title: "删除成功",
              icon: "none",
            })
          }
        })
      }
    },
  })
}

const Delete = (id) => {
  del_cart(id).then((res) => {
    if (res.code === 200) {
      deleteList.value = deleteList.value.filter((item) => item.id !== id)
      uni.showToast({
        title: "删除成功",
        icon: "none",
      })
    }
  })
}

const addon_visible = ref(false)
const addon_list = ref([])
const addon_all = computed(() =>
  addon_list.value.reduce((pre, cur) => {
    return pre + cur.cont * cur.price
  }, 0)
)
const addOn = () => {
  addon_visible.value = true
}

// 凑单添加商品
const changeSelect = (good, cont) => {
  good.order = true
  const index = dataList.value.findIndex((item) => item.id === good.id)
  if (index === -1) dataList.value.push(good)
  else dataList.value[index].cont = cont
  dataList.value[index].order = true
  updateTotal()
}

// 点击结算
const tocaculate = () => {
  if (select_goods.value.length === 0) {
    uni.showToast({
      title: "请先选择商品",
      icon: "none",
    })
    return
  }
  //   如果地址不在深圳，弹出提示
  console.log(address)
  if (!address.address.is_same) {
    output_visible.value = true
    return
  }
  const ids = select_goods.value.map((item) => ({
    id: item.item_id,
    cont: item.cont,
  }))
  const shopping = select_goods.value.map((item) => item.id)
  uni.navigateTo({
    url: `/pages/me/order/new_order?ids=${JSON.stringify(
      ids
    )}&shopping=${JSON.stringify(shopping)}`, // 将选中的商品id传到订单页面
  })
}

const differ = ref(99)
const total = ref(0)
const freight = ref(0)
watchEffect(() => {
  updateTotal()
})

const output_visible = ref(false)
const close = () => {
  output_visible.value = false
}
const toEdit = () => {
  output_visible.value = false
  address_visible.value = true
}

const getData = () => {
  get_cart_list(1).then((res) => {
    page = 1
    if (res.data.data.length === 0) {
      is_empty.value = true
      return
    }
    dataList.value = res.data.data
      .filter((item) => !item.is_deleted)
      .map((item) => {
        return {
          ...item,
          order: false,
        }
      })
    console.log(dataList.value)
    deleteList.value = res.data.data
      .filter((item) => item.is_deleted)
      .map((item) => {
        return {
          ...item,
          order: false,
        }
      })
  })
  get_commodity({ ids: infoList.value.map((item) => item.id) }).then((res) => {
    infoList.value = res.data.data.map((item) => ({
      ...item,
      type: item.teamwork_id ? 1 : item.flash_id ? 2 : 0,
    }))
  })
}
onShow(() => {
  getData()
})

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

onReachBottom(() => {
  page++
  get_cart_list(page).then((res) => {
    dataList.value = dataList.value.concat(
      res.data.data.map((item) => {
        return {
          ...item,
          order: false,
        }
      })
    )
  })
  get_commodity({ ids: infoList.value.map((item) => item.id) }).then((res) => {
    infoList.value = infoList.value.concat(res.data.data)
  })
})
</script>

<style lang="scss" scoped>
.top {
  padding: 0 20rpx 20rpx;
  width: 100%;
  height: 20vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 999;

  .map {
    display: flex;
    align-items: center;
    margin-bottom: 45rpx;

    .text {
      max-width: 333rpx;
      //设置超出长度时用省略号表示
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      z-index: 1;
      color: #0a3c0b;
    }
  }

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 36rpx;
    color: #333333;
    line-height: 50rpx;
    text-align: left;
    font-style: normal;
  }

  .delete {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #666666;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }
}

.all {
  margin-top: 20vh;
  padding: 20rpx 20rpx 200rpx;
  background: #f7f7f7;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .card {
    margin: 20rpx 0;
    width: 100%;
    padding: 20rpx;
    background: #ffffff;
    border-radius: 13rpx;
  }

  .empty {
    margin-top: 150rpx;
    margin-bottom: 150rpx;
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
}

.suggest {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    width: 225rpx;
    height: 30rpx;
    margin: 40rpx;
  }

  .suggest-goods {
    width: 100%;
  }

  .block3 {
    width: 345rpx;
    background: #fff;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .image {
      width: 345rpx;
      height: 345rpx;
      border-radius: 20rpx 20rpx 0 0;
    }

    .name {
      margin: 14rpx;
      width: 300rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      //最多两行显示
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .good-desc {
      width: 300rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 22rpx;
      color: #999999;
      line-height: 30rpx;
      text-align: left;
      font-style: normal;
      white-space: no-wrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bottom {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14rpx 14rpx 20rpx;

      .left {
        display: flex;
        align-items: center;

        .price {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 36rpx;
          color: #ee2532;
          line-height: 50rpx;
          text-align: left;
          font-style: normal;
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
  }

  .item-right {
    margin-left: 10rpx;
  }
}

.fix-bottom {
  width: 750rpx;
  background: #ffffff;
  position: fixed;
  z-index: 500;
  bottom: 0;

  .free {
    width: 100%;
    height: 68rpx;
    background: #ffeed7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;

    .left {
      display: flex;
      align-items: center;

      .image {
        width: 58rpx;
        height: 28rpx;
        margin-right: 4rpx;
      }

      .orange {
        background: #ff7500;
        border-radius: 4rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 22rpx;
        color: #ffffff;
        line-height: 30rpx;
        text-align: left;
        font-style: normal;
        padding: 0 8rpx;
      }

      .desc {
        margin-left: 10rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
      }
    }
  }

  .in_popup {
    width: 100%;
    height: 72rpx;
    background: #ee2532;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    line-height: 45rpx;
    text-align: right;
    font-style: normal;
  }

  .bottom {
    width: 90%;
    margin: 10rpx auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .button {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #999999;
      line-height: 37rpx;
      text-align: center;
      font-style: normal;
    }

    .right {
      display: flex;
      align-items: center;

      .text-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-right: 22rpx;

        .text {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 24rpx;
          color: #333333;
          line-height: 33rpx;
          text-align: left;
          font-style: normal;
        }

        .price {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 36rpx;
          color: #ee2532;
          line-height: 50rpx;
          text-align: left;
          font-style: normal;
        }

        .coupon {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 33rpx;
          text-align: left;
          font-style: normal;
        }

        .freight {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 33rpx;
          text-align: center;
          font-style: normal;
        }
      }
    }
  }
}

.goods {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 150rpx;
  background: #f5f5f5;

  .detail_address {
    width: 90%;
    display: flex;
    flex-direction: column;
    margin: 30rpx;
    padding: 20rpx;
    background: #ffffff;
  }

  .good {
    width: 90%;
    margin: 10rpx auto;
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 35rpx;
  }

  .btn {
    width: 90%;
    position: fixed;
    bottom: 0;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .total {
      font-size: 35rpx;
      color: #834820;
      margin-right: 20rpx;
    }

    .button {
      width: 258rpx;
      height: 71rpx;
      background: #c8b697;
      border-radius: 10rpx;
      font-weight: 500;
      font-size: 31rpx;
      color: #ffffff;
      text-align: center;
      margin-left: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
