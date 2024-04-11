<template>
  <Header :title="title" />
  <view class="all">
    <TnListItem width="750">
      <view class="tn-flex-center-start">
        <view class="label">姓名</view>
        <TnInput :border="false" type="text" placeholder="请输入姓名" v-model="name"></TnInput>
      </view>
    </TnListItem>
    <TnListItem width="750">
      <view class="tn-flex-center-start">
        <view class="label">手机号</view>
        <TnInput :border="false" type="number" :maxlength="11" placeholder="请输入手机号" v-model="phone"></TnInput>
      </view>
    </TnListItem>
    <TnListItem width="750">
      <view class="tn-flex-center-start">
        <view class="label">选择地区</view>
        <picker mode="region" :value="region" @change="onRegionChange">
          <view class="tn-flex-center-start">
            {{ region.join('-') }}
          </view>
        </picker>
      </view>
    </TnListItem>
    <TnListItem width="750">
      <view class="tn-flex-center-start">
        <view class="label">详细地址</view>
        <TnInput :border="false" type="text" placeholder="街道、楼牌号等" v-model="detail"></TnInput>
      </view>
    </TnListItem>
    <TnListItem width="750">
      <view class="tn-flex-center-between">
        <view class="default">设为默认地址</view>
        <TnSwitch v-model="isDefault" width="80" active-color="#D8CCB5"></TnSwitch>
      </view>
    </TnListItem>
    <TnButton width="623" height="100" bg-color="#D8CCB5" text-color="#FFFFFF"
      :custom-style="{ position: 'fixed', bottom: '20px' }" shape="round" @click="save()">
      保存使用
    </TnButton>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnListItem from '@/uni_modules/tuniaoui-vue3/components/list/src/list-item.vue'
import TnInput from '@/uni_modules/tuniaoui-vue3/components/input/src/input.vue'
import TnSwitch from '@/uni_modules/tuniaoui-vue3/components/switch/src/switch.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import { add_address, get_address_detail } from '@/api/address/address'

const title = ref('')

let id = undefined

const name = ref('')

const phone = ref('')

const region = ref(['北京市', '市辖区', '东城区'])

const code = ref(["110000", "110100", "110101"])

const onRegionChange = (e) => {
  console.log(e)
  region.value = e.detail.value
  code.value = e.detail.code
}

const detail = ref('')

const isDefault = ref(false)

const save = () => {
  console.log('保存')
  add_address({
    id,
    name: name.value,
    phone: phone.value,
    address: region.value,
    detail: detail.value,
    default: isDefault.value ? 1 : 0,
    code: JSON.stringify(code.value)
  }).then((res) => {
    console.log(res)
    if (res.code === 200) {
      uni.showToast({
        title: '保存成功',
        icon: 'none'
      })
      setTimeout(() => {
        uni.navigateBack({
          delta: 1
        })
      }, 500);
    }
  })
}

onLoad((options) => {
  console.log(options)
  if (options.index === '-1') {
    title.value = '新增地址'
  } else {
    title.value = '编辑地址'
    id = parseInt(options.index)
    get_address_detail(id).then(res => {
      console.log(res)
      name.value = res.data.name
      phone.value = res.data.phone
      region.value = JSON.parse(res.data.address)
      detail.value = res.data.detail
      isDefault.value = res.data.default === 1
    })
  }
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: #F7F7F7;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .label {
    width: 150rpx;
    font-family: Inter, Inter;
    font-weight: 600;
    font-size: 35rpx;
    color: #292929;
    line-height: 32rpx;
    text-align: right;
    font-style: normal;
    text-transform: none;
    margin-right: 30rpx;
  }
}
</style>