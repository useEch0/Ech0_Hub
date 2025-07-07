<template>
  <div class="w-full max-w-sm bg-white h-auto p-5 shadow-sm hover:shadow-md rounded-lg">
    <!-- 顶部Logo 和 用户名 -->
    <div class="flex flex-row items-center gap-2 mt-2 mb-4">
      <div>
        <img
          :src="echo.logo"
          alt="logo"
          loading="lazy"
          class="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-1 ring-gray-200 shadow-sm object-cover"
        />
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-1">
          <h1 class="text-black font-semibold overflow-hidden whitespace-nowrap text-center">
            <a :href="echo.server_url" target="_blank">{{ echo.server_name }}</a>
          </h1>

          <div>
            <Verified class="text-sky-500 w-5 h-5" />
          </div>
        </div>
        <span class="text-[#5b7083]">@ {{ echo.username }} </span>
      </div>
    </div>

    <!-- 图片 && 内容 -->
    <div>
      <div>
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

        <!-- 图片 -->
        <div v-if="props.echo.images && props.echo.images.length > 0" class="mx-auto w-11/12 my-4">
          <div class="rounded-lg overflow-hidden mb-2">
            <a :href="getImageUrl(props.echo.images[imageIndex], echo.server_url)" data-fancybox>
              <img
                :src="getImageUrl(props.echo.images[imageIndex], echo.server_url)"
                alt="Image"
                class="max-w-full object-cover"
                loading="lazy"
              />
            </a>
          </div>
          <!-- 图片切换 -->
          <div v-if="props.echo.images.length > 1" class="flex items-center justify-center">
            <button @click="imageIndex = Math.max(imageIndex - 1, 0)">
              <Prev class="w-6 h-6" />
            </button>
            <span class="text-gray-500 text-sm mx-2">
              {{ imageIndex + 1 }} / {{ props.echo.images.length }}
            </span>
            <button @click="imageIndex = Math.min(imageIndex + 1, props.echo.images.length - 1)">
              <Next class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 日期时间 && 操作按钮 -->
    <div class="flex justify-between items-center">
      <!-- 日期时间 -->
      <div class="flex justify-start items-center h-auto">
        <div class="flex justify-start text-sm text-slate-500">
          {{ formatDate(props.echo.created_at) }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div ref="menuRef" class="relative flex items-center justify-center gap-1 h-auto">
        <!-- 点赞 -->
        <div class="flex items-center justify-end" title="点赞">
          <div class="flex items-center gap-1">
            <!-- 点赞按钮   -->
            <!--
            <button
              @click="handleLikeEcho(props.echo.id)"
              title="点赞"
              class="transform transition-transform duration-200 hover:scale-160"
            >
              <GrayLike class="w-4 h-4" />
            </button>
            -->
            <GrayLike class="w-4 h-4" />

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
import Prev from '../icons/prev.vue'
import Next from '../icons/next.vue'
import Verified from '../icons/verified.vue'
import GrayLike from '../icons/graylike.vue'
import TheAPlayerCard from './TheAPlayerCard.vue'
import TheWebsiteCard from './TheWebsiteCard.vue'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import 'md-editor-v3/lib/preview.css'
import { Fancybox } from '@fancyapps/ui'
import { MdPreview } from 'md-editor-v3'
import { getImageUrl } from '@/utils/other'
import { onMounted, ref } from 'vue'
// import { theToast } from '@/utils/toast'
// import { localStg } from '@/utils/storage'

type Echo = App.Api.Ech0.Echo
const enum ExtensionType {
  MUSIC = 'MUSIC',
  VIDEO = 'VIDEO',
  GITHUBPROJ = 'GITHUBPROJ',
  WEBSITE = 'WEBSITE',
}

const props = defineProps<{
  echo: Echo
}>()
const imageIndex = ref<number>(0)
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

const formatDate = (dateString: string) => {
  // 当天则显示（时：分）
  // 非当天但是三内天则显示几天前
  // 超过三天则显示（时：分 年月日）
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diff / (1000 * 60 * 60))
  const diffInMinutes = Math.floor(diff / (1000 * 60))

  const diffInSeconds = Math.floor(diff / 1000)
  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  } else if (diffInDays < 3) {
    return `${diffInDays}天前`
  } else {
    return date.toLocaleString() // 返回完整的日期和时间
  }
}

// const LIKE_LIST_KEY = 'likedEchoIds'
// const likedEchoIds: number[] = localStg.getItem(LIKE_LIST_KEY) || []
// const hasLikedEcho = (echoId: number): boolean => {
//   return likedEchoIds.includes(echoId)
// }
// const handleLikeEcho = (echoId: number) => {
//   // 检查LocalStorage中是否已经点赞过
//   if (hasLikedEcho(echoId)) {
//     theToast.success('你已经点赞过了,感谢你的喜欢！')
//     return
//   }

//   // fetchLikeEcho(echoId).then((res) => {
//   //   if (res.code === 1) {
//   //     likedEchoIds.push(echoId)
//   //     localStg.setItem(LIKE_LIST_KEY, likedEchoIds)
//   //     theToast.success('点赞成功！')
//   //   }
//   // })
// }

onMounted(() => {
  Fancybox.bind('[data-fancybox]', {
    // Your custom options
  })
})
</script>

<style scoped lang="css">
#preview-only {
  background-color: inherit;
}

.md-editor {
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
