<template>
  <view class="card">
    <TnCheckbox
      v-model="data.order"
      @change="(e) => change(e, i)"
      active-color="#14bf20"
      checked-shape="circle"
      size="lg"
    >
    </TnCheckbox>
    <image
      :src="data.path"
      class="image"
      mode="scaleToFill"
      @click="toDetail(data.c_id)"
    />
    <view class="right">
      <view @click="toDetail(data.c_id)">
        <view class="title">{{ data.name }}</view>
        <view class="item-name">
          {{ data.item_name }}
        </view>
      </view>
      <view class="tn-flex-center-between">
        <view class="tn-flex-center-center">
          <view class="price">￥{{ data.price }}</view>
          <view v-if="data.or_price" class="old">￥{{ data.or_price }}</view>
        </view>
        <TnNumberBox
          v-model="data.cont"
          :min="1"
          @change="(e) => changeNum(e, i)"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import TnCheckbox from "@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue"
import TnNumberBox from "@/uni_modules/tuniaoui-vue3/components/number-box/src/number-box.vue"
import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"

const { index, data } = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  data: {
    type: Object,
    default: {},
  },
  edit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["change", "changeNum"])

// 改变选中状态
const change = (e, i) => {
  emit("change", e, i, index)
}

const toDetail = (id) => {
  uni.navigateTo({
    url: "/pages/goods/goods_detail?id=" + id,
  })
}

// 改变数量
const changeNum = (e, i) => {
  emit("changeNum", e, i, index)
}
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
  flex-shrink: 0; //防止被挤压
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
</style>
