<template>
  <view class="all">
    <view class="item" :style="{ color: textColor, background: background }">
      {{ time[0] }}
    </view>
    <view class="operation" :style="{ color: background }">:</view>
    <view class="item" :style="{ color: textColor, background: background }">{{ time[1] ?? 0 }}</view>
    <view class="operation" :style="{ color: background }">:</view>
    <view class="item" :style="{ color: textColor, background: background }">{{ time[2] ?? 0 }}
    </view>
    <view v-if="time[3]" class="operation" :style="{ color: background }">:</view>
    <view v-if="time[3]" class="item" :style="{ color: textColor, background: background }">{{ time[3] }}
    </view>
  </view>
</template>

<script setup>
import { ref, onDeactivated } from 'vue';
const props = defineProps({
  time: {
    type: Number,
    require
  },
  textColor: {
    type: String,
    default: '#000',
  },
  background: {
    type: String,
    default: '#fff',
  }
})

const emits = defineEmits(['finish'])
const time = ref()
const id = setInterval(() => {
  var left = props.time
  left = Math.floor(left / 1000)
  if (left <= 0) {
    emits('finish')
    return 0
  }
  const res = []
  if (left >= 60) {
    res.push(left % 60)
    left = Math.floor(left / 60)
    if (left >= 60) {
      res.push(left % 60)
      left = Math.floor(left / 60)
      if (left >= 24) {
        res.push(left % 24)
        left = Math.floor(left / 24)
      }
    }
  }
  res.push(left)
  time.value = res.reverse()
}, 1000);

onDeactivated(() => {
  clearInterval(id)
})
</script>

<style lang="scss" scoped>
.all {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}

.item {
  width: 44rpx;
  height: 44rpx;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 30rpx;
  line-height: 42rpx;
  text-align: right;
  font-style: normal;
}

.operation {
  margin: 0 10rpx;
}
</style>