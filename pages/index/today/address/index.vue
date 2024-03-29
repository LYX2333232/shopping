<template>
  <Header title="收货地址" />
  <view class="all">
    <view @click="selectAddress" class="card" v-for="item in addressList" :key="item.id">
      <TnButton width="80" height="80" bg-color="#D8CCB5" text-color="#FFFFFF" @click="selectAddress(item)">
        <div style="white-space:pre-line">
          选择
          地址
        </div>
      </TnButton>
      <view class="left">
        <text class="address">{{ JSON.parse(item.address).join('-') + ' ' + item.detail }}</text>
        <text class="info">{{ item.name }}<text style="margin-left: 30rpx">{{ item.phone }}</text> </text>
      </view>
      <view style="display: flex;flex-direction: column;align-items: center;">
        <TnIcon name="edit-write" size="40" @click="toEdit(item.id)"></TnIcon>
        <TnIcon name="delete" size="40" type="danger" @click="deleteAddress(item.id)"></TnIcon>
      </view>
    </view>
    <TnButton width="623" height="100" bg-color="#D8CCB5" text-color="#FFFFFF" :custom-style="{ marginTop: '50rpx' }"
      shape="round" @click="toEdit(-1)">
      新增地址
    </TnButton>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { get_address_list, delete_address } from '@/api/address/address'
import { new_order } from '@/api/order/order'
import Header from '@/components/header.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'

const good = ref({})

const addressList = ref([])

const selectAddress = (item) => {
  // 创建订单
  new_order({
    com_id: good.value.id,
    com_cont: good.value.num,
    address_id: item.id,
    teamwork_com_id: good.value.teamwork_com_id
  }).then(res => {
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
          // 删除该商品
          del_cart(good.id).then(res => {
            if (res.code === 200) {
              getData()
            }
          })
        }
      },
      fail: function (err) {
        console.log('fail', err)
      },
      complete: function (res) {
        uni.navigateBack({
          delta: 1
        })
      }
    })

  })
}

const toEdit = (index) => {
  uni.navigateTo({
    url: `/pages/me/address/editPage?index=${index}`
  })
}

const deleteAddress = (id) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该地址吗？',
    success: res => {
      if (res.confirm) {
        delete_address(id).then(res => {
          console.log(res)
          uni.showToast({
            title: '删除成功',
            icon: 'none'
          })
          getData()
        })
      }
    }
  })
}

const getData = () => {
  get_address_list().then(res => {
    // console.log(res)
    addressList.value = res.data.data
    console.log('address', addressList.value)
  })
}

onShow(() => {
  getData()
})

onLoad((option) => {
  console.log(option)
  good.value = JSON.parse(decodeURIComponent(option.good))
  console.log('good', good.value)
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background-color: #F7F7F7;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 150rpx 0 20rpx;

  .card {
    width: 95%;
    margin-top: 20rpx;
    border-radius: 10rpx;
    padding: 30rpx 40rpx;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      height: 100rpx;
      display: flex;
      flex-direction: column;

      .address {
        font-family: Inter, Inter;
        font-weight: 400;
        font-size: 31rpx;
        color: #000000;
        line-height: 36rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        margin-bottom: 20rpx;
      }

      .info {
        font-family: Inter, Inter;
        font-weight: 400;
        font-size: 27rpx;
        color: #AFAFAF;
        line-height: 32rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}
</style>