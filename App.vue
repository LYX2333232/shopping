<script setup>
import { UserStore } from "@/store";
import { onLaunch } from "@dcloudio/uni-app"
onLaunch((e) => {
	// if (e.query.group_id) {
	// 	uni.setStorageSync('group_id', e.query.group_id)
	// }

	// 判断token是否即将过期
	const timestamp = Math.floor(new Date().getTime() / 1000);
	if (!UserStore().auth || UserStore().auth?.time - 50000 < timestamp) {
		console.log('token即将过期,重新登录');
		UserStore().login()
	}
})
</script>

<style>
@import '@/uni_modules/tuniaoui-vue3/index.css';
</style>
