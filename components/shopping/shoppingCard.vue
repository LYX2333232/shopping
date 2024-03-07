<template>
  <view class="card">
    <view class="header">
      <TnCheckbox v-model="isAllchecked" :indeterminate="isSomeChecked" @change="toggleAll" active-color="#C7BAA5" checked-shape="circle" size="lg"></TnCheckbox>
      <view class="business">{{ data.business }} </view>
    </view>
		<view class="main" v-for="(item,i) in data.items" :key="item.business + i">
			<TnCheckbox v-model="item.order" @change="(e)=>change(e,i)" active-color="#C7BAA5" checked-shape="circle" size="lg"></TnCheckbox>
      <image
        :src="item.img"
        style="width: 100px; height: 100px;margin-left: 30rpx;"
        mode="scaleToFill"
      />
      <view class="right">
        <view>
          <view class="title">{{item.name}}</view>
          <view style="width:120rpx">
            <TnBubbleBox bg-color="#F3F3F3" text-color="#6C6C6C" :options="toOptions(item.selections)" @click="(index)=>changeSelect(index,i)" position="bottom" >
              <view class="bubble">
                <view class="type">
                  {{ item.selections[item.select].type }} 
                </view>
                <TnIcon name="down" size="30" color="#000000" />
              </view>
            </TnBubbleBox>
          </view>
        </view>
        <view class="tn-flex-center-between">
          <view class="price">¥{{ item.selections[item.select].price }} </view>
          <TnNumberBox v-model="item.num" :min="1" @change="(e)=>changeNum(e,i)" />
        </view>
      </view>
		</view>
	</view>
</template>

<script setup>
import { computed,defineProps, defineEmits } from 'vue'
import TnCheckbox from '@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue'
import TnBubbleBox from '@/uni_modules/tuniaoui-vue3/components/bubble-box/src/bubble-box.vue'
import TnNumberBox from '@/uni_modules/tuniaoui-vue3/components/number-box/src/number-box.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'

const { index,data } = defineProps({
  index: {
    type: Number,
    default: 0
  },
  data: {
    type: Object,
    default: {}
  }
})

const emit = defineEmits(['change','changeNum','changeSelect'])


// 改变选中状态
const change = (e,i) => {
  emit('change', e, i, index)
}

const toOptions = (arr) => {
  return arr.map(item => {
    return { text: item.type }
  })
}

// 改变数量
const changeNum = (e,i) => {
  emit('changeNum', e, i, index)
}

// 修改选择
const changeSelect = (e,i) => {
  emit('changeSelect', e, i, index)
}

// 选中一部分
const isSomeChecked = computed(() => {
  return data.items.some(item => item.order)
})

// 选中全部
const isAllchecked = computed({
  get: () => {
    return data.items.every(item => item.order)
  },
  set: (val) => {
    data.items.forEach((item, i) => {
      emit('change', val, i, index)
    })
  }
})

const toggleAll = (e) => {
  isAllchecked.value = e
}

</script>

<style lang="scss" scoped>
.card{
	width: 90%;
	margin: 20rpx auto;
  padding: 20rpx;
	background: #FFFFFF;
  border-radius: 13rpx;
}

.header{
  height: 75rpx;
  display: flex;
  align-items: center;
}

.business{
  font-family: Inter, Inter;
  font-weight: 500;
  font-size: 35rpx;
  color: #000000;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.main{
  display: flex;
  align-items: center;
}

.right{
  height: 200rpx;
  margin-left: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title{
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

.bubble{
  background: #F3F3F3;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10rpx;
  .type{
    width: 80rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.price{
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