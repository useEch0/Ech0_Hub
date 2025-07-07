<template>
  <div v-if="musicInfo && metingAPI.length > 0">
    <meting-js
      :api="metingAPI"
      :server="musicInfo.server"
      :type="musicInfo.type"
      :id="musicInfo.id"
      :auto="props.echo.extension"
    >
    </meting-js>
  </div>
  <div
    v-else
    class="max-w-sm flex justify-center items-center bg-white rounded-lg shadow-sm ring-1 ring-inset ring-gray-100 p-2 gap-2 text-gray-400"
  >
    <Music />非常抱歉，该音乐播放源已失效😭
  </div>
</template>

<script setup lang="ts">
import Music from '@/components/icons/music.vue'
import { computed } from 'vue'
import { parseMusicURL } from '@/utils/other'
type Echo = App.Api.Ech0.Echo
import { ExtensionType } from '@/enums/enums'

const props = defineProps<{
  echo: Echo
}>()

const musicInfo = computed(() => {
  if (props.echo.extension_type !== ExtensionType.MUSIC || !props.echo.extension) return null
  return parseMusicURL(props.echo.extension)
})
const metingAPI = 'https://meting.soopy.cn/api?server=:server&type=:type&id=:id&auth=:auth&r=:r'
</script>

<style scoped></style>
