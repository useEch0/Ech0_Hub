<template>
  <div class="w-full px-2 pb-4 py-2 mt-4 sm:mt-6 mb-10 mx-auto flex justify-center items-center">
    <!-- Ech0s Hub -->
    <div class="w-full mx-auto px-2">
      <h1 class="mb-4 text-center text-6xl text-gray-400 font-bold italic">Ech0s Hub</h1>

      <div v-if="echoList.length > 0" class="space-y-6">
        <div v-for="echo in echoList" :key="echo.id" class="flex justify-center items-center">
          <TheEchoDetail :echo="echo" class="max-w-full" />
        </div>
      </div>

      <div v-if="isLoading || isPreparing">
        <p class="text-gray-500 text-center">Loading...</p>
      </div>

      <div v-if="!hasMore">
        <p class="text-gray-500 text-center">没有更多数据了🙃</p>
      </div>
    </div>

    <div
      v-show="showBackTop"
      :style="backTopStyle"
      class="hidden xl:block fixed bottom-6 z-50 transition-all duration-500 animate-fade-in"
    >
      <TheBackTop class="w-8 h-8 p-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TheBackTop from '@/components/advanced/TheBackTop.vue'
import TheEchoDetail from '@/components/advanced/TheEchoDetail.vue'
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { useHubStore } from '@/stores/hub'
import { storeToRefs } from 'pinia'

const hubStore = useHubStore()
const { echoList, isLoading, isPreparing, hasMore } = storeToRefs(hubStore)

const mainColumn = ref<HTMLElement | null>(null)
const backTopStyle = ref({ right: '100px' }) // 默认 fallback
const showBackTop = ref(true) // 自定义条件

// 监听窗口滚动事件，判断是否显示回到顶部按钮
const updateShowBackTop = () => {
  showBackTop.value = window.scrollY > 300
}
const updatePosition = () => {
  if (mainColumn.value) {
    const rect = mainColumn.value.getBoundingClientRect()
    const rightOffset = window.innerWidth - rect.right
    backTopStyle.value = {
      right: `${rightOffset - 160}px`,
    }
  }
}

// 判断是否滚动到底部附近，触发加载下一页
const onScroll = () => {
  updateShowBackTop()

  if (isLoading.value) return // 正在加载时不触发

  const scrollPosition = window.scrollY + window.innerHeight
  const threshold = 300 // 距底部300px触发加载

  const fullHeight = document.documentElement.scrollHeight

  if (scrollPosition + threshold >= fullHeight) {
    hubStore.loadEchoListPage()
  }
}

onMounted(async () => {
  // 监听窗口大小变化
  updateShowBackTop()
  updatePosition()
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', updatePosition)

  // 获取 Hub 数据
  await hubStore.getHubList()
  await hubStore.getHubInfoList()
  hubStore.loadEchoListPage()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updatePosition)
})
</script>
