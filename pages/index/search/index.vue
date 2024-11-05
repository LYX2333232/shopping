<template>
  <view style="width:95%;margin: 180rpx auto 0;">
    <view class="tn-flex-center-start">
      <TnIcon name="left" size="50" color="#C7BAA7" @click="back" :custom-style="{ marginRight: '20rpx' }">
      </TnIcon>
      <uni-easyinput prefixIcon="search" v-model="value" placeholder="请输入商品关键词" :styles="styles" @focus="inputFocus"
        @change="search">
        <template #right>
          <TnButton bg-color="#C7BAA7" text-color="#FFFFFF" width="90" height="50"
            :custom-style="{ marginRight: '10rpx' }" @click="search" shape="round">搜索</TnButton>
        </template>
      </uni-easyinput>
    </view>
    <view class="history">
      历史搜索
    </view>
    <view class="history_tag">
      <TnTag v-for="(item, index) in historyList" :key="index" shape="round" bg-color="#E7E3E1" text-color="#949494"
        :custom-style="{ marginRight: '20rpx', marginTop: '30rpx' }" @click="search(item)">
        {{ item }}</TnTag>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'

const back = () => uni.navigateBack()

// 历史搜索数据
const historyList = ref([])

const value = ref('');
const styles = ref({
  color: 'rgba(182, 176, 167, 1)',
  borderColor: 'rgba(182, 176, 167, 1)'
})
// 进行搜索
const search = (searching = undefined) => {
  if (searching) {
    value.value = searching
  }
  uni.setStorageSync('searchInfo', value.value)
  if (!Array.isArray(historyList.value)) {
    historyList.value = []
  }
  if (!value.value || value.value === '') {
    return
  }
  if (historyList.value.includes(value.value))
    historyList.value.splice(historyList.value.indexOf(value.value), 1)
  // 保存搜索历史并把value作为第一项
  historyList.value.unshift(value.value)
  // 只保留5条历史记录
  if (historyList.value.length > 5) {
    historyList.value.pop()
  }
  uni.setStorageSync('history', historyList.value)
  value.value = undefined
  uni.switchTab({
    url: '/pages/goods/goods'
  })
}
const getData = () => {
  if (!uni.getStorageSync('history')) {
    uni.setStorageSync('history', [])
  }
  historyList.value = uni.getStorageSync('history')
}
onLoad(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.history {
  margin-top: 30rpx;
  font-family: Inter, Inter;
  font-weight: 800;
  font-size: 30rpx;
  color: #000000;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.history_tag {
  width: 90%;
  display: gird;
  grid-template-columns: repeat(auto-fit, minmax(100rpx, 1fr));
  grid-gap: 20rpx;
}
</style>