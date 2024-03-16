<template>
  <Header title="收货地址" />
  <view class="all">
    <view class="card" v-for="item in addressList" :key="item.id">
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
import { onShow } from '@dcloudio/uni-app'
import { get_address_list, delete_address } from '@/api/address/address.js'
import Header from '@/components/header.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'

const addressList = ref([])

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
  // const list = [
  //   {
  //     address: '广东省广州市天河区天河路',
  //     name: '张三',
  //     phone: '13888888888'
  //   },
  //   {
  //     address: '广东省广州市天河区天河路',
  //     name: '李四',
  //     phone: '13888888888'
  //   },
  //   {
  //     address: '广东省广州市天河区天河路',
  //     name: '王五',
  //     phone: '13888888888'
  //   },
  //   {
  //     address: '广东省广州市天河区天河路',
  //     name: '赵六',
  //     phone: '13888888888'
  //   },
  //   {
  //     address: '广东省广州市天河区天河路',
  //     name: '孙七',
  //     phone: '13888888888'
  //   },
  //   {
  //     address: '广东省广州市天河区天河路',
  //     name: '周八',
  //     phone: '13888888888'
  //   }
  // ]
  get_address_list().then(res => {
    console.log(res)
    addressList.value = res.data.data
    console.log(addressList.value)
  })
}

onShow(() => {
  getData()
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