<template>
  <Header title="今日开团" />
  <view class="all">
    <TnWaterFall :data="dataList">
      <template #left="{ item }">
        <view class="item">
          <image :src="item.path" mode="scaleToFill" style="width: 340rpx;height:300rpx" />
          <view class="title">{{ item.name }}</view>
          <view class="tn-flex-center-between">
            <view style="display: flex;flex-direction: column;align-items: center;">
              <view class="price">￥ {{ item.flash_price }}
              </view>
              <view style="font-size: 24rpx; color: gray; text-decoration: line-through;">￥ {{ item.price }}</view>
              <TnTag shape="round" bg-color="#FAEBD9" text-color="#A19B8B">{{ item.count }}人成团 </TnTag>
            </view>
            <view class="right">
              <TnButton shape="round" bg-color="#C8B697" text-color="#FFFFFF" width="140" height="50"
                @click="toDetail(item.id)">立即购买</TnButton>
              <view class="have">
                已有<text style="color: #C8B697">{{ item.seng_count }}</text>人参团
              </view>
            </view>
          </view>
        </view>
      </template>
      <template #right="{ item }">
        <view class="item">
          <image :src="item.path" mode="scaleToFill" style="width: 340rpx;height:300rpx" />
          <view class="title">{{ item.name }}</view>
          <view class="tn-flex-center-between">
            <view style="display: flex;flex-direction: column;align-items: center;">
              <view class="price">￥ {{ item.flash_price }}
              </view>
              <view style="font-size: 24rpx; color: gray; text-decoration: line-through;">￥ {{ item.price }}</view>
              <TnTag shape="round" bg-color="#FAEBD9" text-color="#A19B8B">{{ item.count }}人成团 </TnTag>
            </view>
            <view class="right">
              <TnButton shape="round" bg-color="#C8B697" text-color="#FFFFFF" width="140" height="50"
                @click="toDetail(item.id)">立即购买</TnButton>
              <view class="have">
                已有<text style="color: #C8B697">{{ item.seng_count }}</text>人参团
              </view>
            </view>
          </view>
        </view>
      </template>
    </TnWaterFall>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { get_today_list } from '@/api/index/today/today'
import Header from '@/components/header.vue'
import TnWaterFall from '@/uni_modules/tuniaoui-vue3/components/water-fall/src/water-fall.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'

const dataList = ref([])

const toDetail = (id) => {
  console.log('toDetail');
  uni.navigateTo({
    url: '/pages/index/today/detail/index?id=' + id
  })
}

const getData = () => {
  get_today_list().then(res => {
    console.log(res)
    dataList.value = res.data.data
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
  background: #F7F7F7;
  margin-left: 20rpx;
  padding-top: 120rpx;
}

.item {
  margin-top: 30rpx;
  padding-bottom: 15rpx;
  width: 340rpx;
  background: #FFFFFF;

  .title {
    font-family: Inter, Inter;
    font-weight: 400;
    font-size: 27rpx;
    color: #000000;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 12rpx;
  }

  .price {
    font-family: Inter, Inter;
    font-weight: 500;
    font-size: 40rpx;
    color: #C8B697;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin: 5rpx;
  }

  .right {
    margin-right: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .have {
    font-family: Inter, Inter;
    font-weight: 400;
    font-size: 19rpx;
    color: #767676;
    line-height: 29rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}
</style>