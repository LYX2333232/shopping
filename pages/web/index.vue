<template>
  <web-view :src="src"></web-view>
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