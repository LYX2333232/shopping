<template>
  <view class="card">
    <TnButton width="90" v-if="edit" type="danger" @click="del">
      <div style="white-space:pre-line">
        删除
        商品
      </div>
    </TnButton>
    <!-- <TnButton width="90" v-else bg-color="#C7BAA5" text-color="#fff" @click="buy">购买</TnButton> -->
    <TnCheckbox v-else v-model="data.order" @change="(e) => change(e, i)" active-color="#C7BAA5" checked-shape="circle"
      size="lg">
    </TnCheckbox>
    <image :src="data.path" style="width: 100rpx; height: 100rpx;margin-left: 30rpx;" mode="scaleToFill" />
    <view class="right">
      <view>
        <view class="title">{{ data.name }}</view>
        <view class="item-name">
          {{ data.item_name }}
        </view>
      </view>
      <view class="tn-flex-center-between">
        <view class="price">¥{{ data.price }} </view>
        <TnNumberBox v-model="data.cont" :min="1" @change="(e) => changeNum(e, i)" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import TnCheckbox from '@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue'
import TnNumberBox from '@/uni_modules/tuniaoui-vue3/components/number-box/src/number-box.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'

const { index, data, edit } = defineProps({
  index: {
    type: Number,
    default: 0
  },
  data: {
    type: Object,
    default: {}
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change', 'changeNum', 'del'])

const del = () => {
  emit('del', data.id)
}

// 改变选中状态
const change = (e, i) => {
  emit('change', e, i, index)
}

// 改变数量
const changeNum = (e, i) => {
  emit('changeNum', e, i, index)
}

</script>

<style lang="scss" scoped>
.card {
  width: 90%;
  margin: 20rpx auto;
  padding: 20rpx;
  background: #FFFFFF;
  border-radius: 13rpx;
  display: flex;
  align-items: center;
}

.right {
  width: 400rpx;
  height: 200rpx;
  margin-left: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-family: Inter, Inter;
  font-weight: 500;
  font-size: 30rpx;
  color: #000000;
  text-align: left;
  font-style: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 15rpx;
}

.bubble {
  background: #F3F3F3;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10rpx;

  .type {
    width: 80rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.item-name{
  width: 200rpx;
  text-align: center;
  background-color: #F3F3F3;
  color: #6C6C6C;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  font-family: Inter, Inter;
  font-weight: 500;
  font-size: 40rpx;
  color: #834820;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
</style>