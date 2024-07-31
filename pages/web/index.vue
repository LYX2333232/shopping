<template>
  <image style="width:750rpx;height:100vh" mode="aspectFit" :src="src"></image>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app"
import { ref } from "vue";

let src = ref()
onLoad((e) => {
  src.value = e.src
})
</script>

<style></style>