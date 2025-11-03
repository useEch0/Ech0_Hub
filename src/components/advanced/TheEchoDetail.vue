<template>
  <div class="w-full max-w-sm bg-white h-auto p-5 shadow rounded-lg mx-auto">
    <!-- 顶部Logo 和 用户名 -->
    <div class="flex flex-row items-center gap-2 mt-2 mb-4">
      <!-- <div class="text-xl">👾</div> -->
      <div>
        <img
          :src="echo.logo"
          alt="logo"
          class="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-1 ring-gray-200 shadow-sm object-cover"
        />
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-1">
          <h2 class="text-gray-700 font-bold overflow-hidden whitespace-nowrap text-center">
            <a :href="echo.server_url" target="_blank">{{ echo.server_name }}</a>
          </h2>

          <div>
            <Verified class="text-sky-500 w-5 h-5" />
          </div>
        </div>
        <span class="text-[#5b7083] font-serif">@ {{ echo.username }} </span>
      </div>
    </div>

    <!-- 图片 && 内容 -->
    <div>
      <div class="py-4">
        <TheImageGallery :images="props.echo.images" :baseUrl="echo.server_url" />

        <!-- 内容 -->
        <div>
          <MdPreview
            :id="previewOptions.proviewId"
            :modelValue="props.echo.content"
            :theme="previewOptions.theme"
            :show-code-row-number="previewOptions.showCodeRowNumber"
            :preview-theme="previewOptions.previewTheme"
            :code-theme="previewOptions.codeTheme"
            :code-style-reverse="previewOptions.codeStyleReverse"
            :no-img-zoom-in="previewOptions.noImgZoomIn"
            :code-foldable="previewOptions.codeFoldable"
            :auto-fold-threshold="previewOptions.autoFoldThreshold"
          />
        </div>

        <!-- 扩展内容 -->
        <div v-if="props.echo.extension" class="my-4">
          <div v-if="props.echo.extension_type === ExtensionType.MUSIC">
            <TheAPlayerCard :echo="props.echo" />
          </div>
          <div v-if="props.echo.extension_type === ExtensionType.VIDEO">
            <TheVideoCard :videoId="props.echo.extension" class="px-2 mx-auto hover:shadow-md" />
          </div>
          <TheGithubCard
            v-if="props.echo.extension_type === ExtensionType.GITHUBPROJ"
            :GithubURL="props.echo.extension"
            class="px-2 mx-auto hover:shadow-md"
          />
          <TheWebsiteCard
            v-if="props.echo.extension_type === ExtensionType.WEBSITE"
            :website="props.echo.extension"
            class="px-2 mx-auto hover:shadow-md"
          />
        </div>
      </div>
    </div>

    <!-- 日期时间 && 操作按钮 -->
    <div class="flex justify-between items-center">
      <!-- 日期时间 -->
      <div class="flex justify-start items-center h-auto">
        <div class="flex justify-start text-sm text-slate-500 mr-1">
          {{ formatDate(props.echo.created_at) }}
        </div>
        <!-- 标签 -->
        <div class="text-sm text-gray-300 w-18 truncate text-nowrap">
          <span>{{ props.echo.tags ? `#${props.echo.tags[0]?.name}` : '' }}</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div ref="menuRef" class="relative flex items-center justify-center gap-2 h-auto">
        <!-- 点赞 -->
        <div class="flex items-center justify-end" title="点赞">
          <div class="flex items-center gap-1">
            <!-- 点赞按钮   -->
            <button
              title="点赞"
              disabled="true"
              :class="[
                'transform transition-transform duration-150',
                isLikeAnimating ? 'scale-160' : 'scale-100',
              ]"
            >
              <GrayLike class="w-4 h-4" />
            </button>

            <!-- 点赞数量   -->
            <span class="text-sm text-gray-400">
              <!-- 如果点赞数不超过99，则显示数字，否则显示99+ -->
              {{ props.echo.fav_count > 99 ? '99+' : props.echo.fav_count }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheGithubCard from './TheGithubCard.vue'
import TheVideoCard from './TheVideoCard.vue'
import Verified from '../icons/verified.vue'
import GrayLike from '../icons/graylike.vue'
import TheAPlayerCard from './TheAPlayerCard.vue'
import TheWebsiteCard from './TheWebsiteCard.vue'
import TheImageGallery from './TheImageGallery.vue'
import 'md-editor-v3/lib/preview.css'
import { MdPreview } from 'md-editor-v3'
import { onMounted, ref } from 'vue'
import { ExtensionType } from '@/enums/enums'
import { formatDate } from '@/utils/other'

type Echo = App.Api.Ech0.Echo

const props = defineProps<{
  echo: Echo
}>()
const previewOptions = {
  proviewId: 'preview-only',
  theme: 'light' as 'light' | 'dark',
  showCodeRowNumber: false,
  previewTheme: 'github',
  codeTheme: 'atom',
  codeStyleReverse: true,
  noImgZoomIn: false,
  codeFoldable: true,
  autoFoldThreshold: 15,
}

const isLikeAnimating = ref(false)
// const isShareAnimating = ref(false)

// const LIKE_LIST_KEY = 'likedEchoIds'
// const likedEchoIds: number[] = localStg.getItem(LIKE_LIST_KEY) || []
// const hasLikedEcho = (echoId: number): boolean => {
//   return likedEchoIds.includes(echoId)
// }
// const handleLikeEcho = (echoId: number) => {
//   isLikeAnimating.value = true
//   setTimeout(() => {
//     isLikeAnimating.value = false
//   }, 250) // 对应 duration-250

//   // 检查LocalStorage中是否已经点赞过
//   if (hasLikedEcho(echoId)) {
//     theToast.info('你已经点赞过了,感谢你的喜欢！')
//     return
//   }

//   fetchLikeEcho(echoId).then((res) => {
//     if (res.code === 1) {
//       likedEchoIds.push(echoId)
//       localStg.setItem(LIKE_LIST_KEY, likedEchoIds)
//       // 发送更新事件
//       emit('updateLikeCount', echoId)
//       theToast.info('点赞成功！')
//     }
//   })
// }

// const handleShareEcho = (echoId: number) => {
//   isShareAnimating.value = true
//   setTimeout(() => {
//     isShareAnimating.value = false
//   }, 250) // 对应 duration-250

//   const shareUrl = `${window.location.origin}/echo/${echoId}\n ———— 来自 Ech0 分享`
//   navigator.clipboard.writeText(shareUrl).then(() => {
//     theToast.info('已复制到剪贴板！')
//   })
// }

onMounted(() => {})
</script>

<style scoped lang="css">
#preview-only {
  background-color: inherit;
}

.md-editor {
  /* font-family: var(--font-sans); */
  font-family: 'LXGW WenKai Screen';
}

:deep(ul li) {
  list-style-type: disc;
}

:deep(ul li li) {
  list-style-type: circle;
}

:deep(ul li li li) {
  list-style-type: square;
}

:deep(ol li) {
  list-style-type: decimal;
}
</style>
