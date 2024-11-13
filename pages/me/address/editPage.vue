<template>
  <Header :title="title" />
  <view class="all">
    <view class="card">
      <TnListItem width="100%">
        <view class="tn-flex-center-start" @click="onRegionChange">
          <view class="label">选择地区</view>
          <view class="tn-flex-center-start" style="flex:auto">
            {{ form.address }}
          </view>
          <TnIcon name="down" />
        </view>
      </TnListItem>
      <TnListItem width="100%">
        <view class="tn-flex-start-start">
          <view class="label">详细地址</view>
          <view style="width:100%">
            <TnInput :border="false" type="textarea" placeholder="街道、楼牌号等" v-model="form.detail">
            </TnInput>
          </view>
        </view>
      </TnListItem>
      <TnListItem width="100%">
        <view class="tn-flex-center-start">
          <view class="label">联系人</view>
          <TnInput :maxlength="10" :border="false" type="text" placeholder="请输入姓名" v-model="form.name"></TnInput>
        </view>
      </TnListItem>
      <TnListItem width="100%">
        <view class="tn-flex-center-start">
          <view class="label">手机号</view>
          <TnInput :border="false" type="number" :maxlength="11" placeholder="请输入手机号" v-model="form.phone"></TnInput>
        </view>
      </TnListItem>
      <TnListItem width="100%">
        <view class="tn-flex-start-start">
          <view class="label">地址标签</view>
          <view class="tags">
            <TnTag shape="round" :bg-color="form.tag === tag ? '#14BF20' : '#F7F7F7'"
              :text-color="form.tag === tag ? '#FFF' : '#333'" font-size="28" v-for="(tag, index) in tags" :key="index"
              :custom-style="{ marginRight: '20rpx', padding: '10rpx' }" @click="form.tag = tag">
              {{ tag }}
            </TnTag>
          </view>
        </view>
      </TnListItem>
      <TnListItem width="100%">
        <view class="tn-flex-center-between">
          <view class="default">设为默认收货地址</view>
          <TnSwitch v-model="form.default" width="80" active-color="#14BF20"></TnSwitch>
        </view>
      </TnListItem>
    </view>
    <TnButton width="623" height="100" :bg-color="can_save ? 'rgba(20, 191, 32, 1)' : 'rgba(20, 191, 32, 0.3)'"
      text-color="#fff" font-size="32" shape="round" @click="save">
      保存使用
    </TnButton>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnListItem from '@/uni_modules/tuniaoui-vue3/components/list/src/list-item.vue'
import TnInput from '@/uni_modules/tuniaoui-vue3/components/input/src/input.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnTag from '@tuniao/tnui-vue3-uniapp/components/tag/src/tag.vue'
import TnSwitch from '@/uni_modules/tuniaoui-vue3/components/switch/src/switch.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import { add_address, get_address_detail } from '@/api/address/address'

const title = ref('')

let id = undefined

const form = ref({})

const tags = ['家', '公司', '学校', '父母家', '朋友家']

const onRegionChange = (e) => {
  uni.chooseLocation({
    success: (res) => {
      console.log(res);
      form.value = {
        ...form.value,
        address: res.address,
        detail: res.name,
        lat: res.latitude,
        lng: res.longitude
      }
    },
  })
}

const can_save = computed(() => {
  return form.value.name && form.value.phone && form.value.address && form.value.detail
})

const save = () => {
  console.log(form.value);
  add_address({ ...form.value, default: form.default ? 1 : 0 }).then((res) => {
    console.log(res);
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
  if (options.index === '-1') {
    title.value = '新增地址'
  } else {
    title.value = '编辑地址'
    id = parseInt(options.index)
    get_address_detail(id).then(res => {
      form.value = { ...res.data, default: !!res.data.default }
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
  padding: 200rpx 20rpx 0;
}

.card {
  width: 100%;
  background: #FFFFFF;
  margin: 20rpx;

  .label {
    width: 150rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: bold;
    font-size: 30rpx;
    color: #111111;
    line-height: 42rpx;
    text-align: left;
    font-style: normal;
    margin-right: 30rpx;
  }

  .tags {
    width: 80%;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>