<template>
  <Header title="收货地址" />
  <view class="all">
    <view class="card" v-for="item in addressList" :key="item.id">
      <TnButton width="100" height="100" bg-color="#D8CCB5" text-color="#FFFFFF" @click="selectAddress(item)">
        <div style="white-space:pre-line">
          选择
          地址
        </div>
      </TnButton>
      <view class="left">
        <text class="address">{{ item.address.join('-') + ' ' + item.detail }}</text>
        <view class="info">
          <view style="width: 100rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{
            item.name }} </view>
          <view style="margin-left: 30rpx">{{ item.phone }}</view>
        </view>
      </view>
      <view style="display: flex;flex-direction: column;align-items: center;">
        <TnIcon name="edit-write" size="60" @click="toEdit(item.id)"></TnIcon>
        <TnIcon name="delete" size="60" type="danger" @click="deleteAddress(item.id)"></TnIcon>
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
import { AddressStore } from '@/store'

const store = AddressStore()

const addressList = ref([])

const selectAddress = (item) => {
  store.setAddress(item.address.join('-') + '-' + item.detail, item.name, item.phone, item.id)
  uni.navigateBack({
    delta: 1
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
    addressList.value = res.data.data.map(item => {
      item.address = JSON.parse(item.address)
      return item
    })
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
  padding: 180rpx 0 20rpx;

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
      justify-content: space-between;

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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 400rpx;
      }

      .info {
        display: flex;
        font-family: Inter, Inter;
        font-weight: 400;
        font-size: 27rpx;
        color: #AFAFAF;
        line-height: 32rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;

        .name {
          width: 200rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>