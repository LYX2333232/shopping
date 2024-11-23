<template>
  <view class="card">
    <TnIcon
      name="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhTcBKpUgwer5OCCic51cf2LcwCdPpIa3dwCRLadgOwB5sn9on8SuVsT7Pia2Zm9WRWpyoFNQ455icFQw/0?wx_fmt=png"
      size="40" />
    <view class="image" :style="{ background: `url(${data.path})`, backgroundSize: '100% 100%' }">
      <view class="mask">
        <view class="bottom">
          {{ index % 2 ? '已下架' : '已售罄' }}
        </view>
      </view>
    </view>
    <view class="right">
      <view>
        <view class="title">{{ data.name }}</view>
        <view class="item-name">
          {{ data.item_name }}
        </view>
      </view>
      <view class="tn-flex-center-end">
        <TnButton type="info" plain>删除</TnButton>
      </view>
    </view>
  </view>
</template>

<script setup>
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'

defineProps({
  index: {
    type: Number,
    default: 0
  },
  data: {
    type: Object,
    default: {}
  }
})
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 30rpx 0;
}

.image {
  width: 170rpx;
  height: 170rpx;
  margin: 0 15rpx;
  border-radius: 20rpx;
  flex-shrink: 0;

  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .bottom {
      width: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      color: #FFF;
    }
  }
}

.right {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 30rpx;
  color: #333333;
  line-height: 42rpx;
  text-align: left;
  font-style: normal;
  //最多两行
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 15rpx;
}

.item-name {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  line-height: 33rpx;
  text-align: left;
  font-style: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 25rpx;
}
</style>