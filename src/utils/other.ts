import { ImageSource } from '@/enums/enums'
// 获取图片链接
export const getImageUrl = (image: App.Api.Ech0.Image, baseurl: string) => {
  if (image.image_source === ImageSource.LOCAL) {
    return baseurl + '/api' + String(image.image_url)
  } else if (image.image_source === ImageSource.URL) {
    return String(image.image_url)
  } else {
    // 未知的图片来源，按照本地图片处理
    return baseurl + '/api' + String(image.image_url)
  }
}

// 解析音乐链接（网易云、QQ音乐）
export const parseMusicURL = (url: string) => {
  url = url.trim()

  const neteaseMatch = url.match(/music\.163\.com\/(#\/)?(song|playlist|album)(\?id=|\/)(\d+)/)
  if (neteaseMatch) {
    return {
      server: 'netease',
      type: neteaseMatch[1], // song, playlist, album
      id: neteaseMatch[2],
    }
  }

  // QQ音乐 新格式支持，songDetail 路径，id一般是字母数字混合
  const qqNewSongMatch = url.match(/y\.qq\.com\/n\/ryqq\/songDetail\/([a-zA-Z0-9]+)/)
  if (qqNewSongMatch) {
    return {
      server: 'tencent',
      type: 'song',
      id: qqNewSongMatch[1],
    }
  }

  // 解析失败
  return null
}
