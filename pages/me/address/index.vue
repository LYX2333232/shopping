<template>
  <Header title="收货地址" />
  <view class="all">
    <view class="header">所有收货地址</view>
    <view class="list">
      <view class="card" v-for="item in addressList" :key="item.id">
        <view class="left">
          <TnTag v-if="item.tag" bg-color="#fff2ef" text-color="tn-red">
            {{ item.tag }}
          </TnTag>
          <text class="address">{{
            item.address_name + " " + item.detail
          }}</text>
          <view class="info">
            <view class="name">
              {{ item.name }}
            </view>
            <view>{{ item.phone }}</view>
          </view>
          <TnTag v-if="item.default" bg-color="#fff2ef" text-color="tn-red">
            默认地址
          </TnTag>
        </view>
        <TnIcon name="edit-write" size="56" @click="toEdit(item.id)"></TnIcon>
      </view>
    </view>
    <view class="btns">
      <TnButton
        width="650"
        height="90"
        bg-color="#14BF20"
        text-color="#FFF"
        shape="round"
        @click="toEdit(-1)"
      >
        新增地址
      </TnButton>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"
import { onShow } from "@dcloudio/uni-app"
import { get_address_list, delete_address } from "@/api/address/address.js"
import Header from "@/components/header.vue"
import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import TnTag from "@tuniao/tnui-vue3-uniapp/components/tag/src/tag.vue"
import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"

const addressList = ref([])

const toEdit = (index) => {
  uni.navigateTo({
    url: `/pages/me/address/editPage?index=${index}`,
  })
}

const deleteAddress = (id) => {
  uni.showModal({
    title: "提示",
    content: "确定删除该地址吗？",
    success: (res) => {
      if (res.confirm) {
        delete_address(id).then((res) => {
          uni.showToast({
            title: "删除成功",
            icon: "none",
          })
          getData()
        })
      }
    },
  })
}

const getData = () => {
  get_address_list().then((res) => {
    console.log(res)
    addressList.value = res.data.data
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
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 180rpx 0 20rpx;

  .header {
    width: 90%;
    margin: 25rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #666666;
  }

  .list {
    width: 100%;
    background: #fff;
    padding: 0 30rpx;

    .card {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx 0;

      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .address {
          margin: 10rpx 0;
          font-family: PingFangSC, PingFang SC;
          font-weight: bold;
          font-size: 32rpx;
          color: #131313;
          line-height: 45rpx;
          text-align: left;
          font-style: normal;
          margin-bottom: 10rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 550rpx;
        }

        .info {
          margin: 10rpx 0;
          display: flex;
          align-items: center;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 28rpx;
          color: #666666;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;

          .name {
            margin-right: 20rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .card:nth-child(n + 2) {
      border-top: 1rpx solid #dedede;
    }
  }
}

.btns {
  position: fixed;
  bottom: 30rpx;
  display: flex;
  justify-content: center;
}
</style>
