declare namespace App {
  /**
   * Namespace Api
   */
  namespace Api {
    type Response<T> = {
      code: number
      msg: string
      data: T
    }

    namespace Hub {
      type HubItem = string | { id: number; connect_url: string }
      type HubList = HubItem[]
      type HubItemInfo = Connect.Connect
      type HubInfoList = HubItemInfo[]
    }

    namespace Ech0 {
      type ParamsByPagination = {
        page: number
        pageSize: number
        search?: string
      }

      type Echo = {
        id: number
        content: string
        username: string
        image_url: string
        image_source: string
        images: Image[]
        tags?: Tag[]
        private: boolean
        user_id: number
        extension: string
        extension_type: string
        fav_count: number
        created_at: string
        createdTs: number
        server_name: string
        server_url: string
        logo: string
      }

      type Image = {
        id: number
        message_id: number
        image_url: string
        image_source: string
        object_key?: string // 对象存储的Key (如果是本地存储则为空)
        width?: number // 图片宽度
        height?: number // 图片高度
      }

      type Tag = {
        id: number
        name: string
        usage_count: number
        created_at: string
      }

      type PaginationResult = {
        items: Echo[]
        total: number
      }

      type GithubCardData = {
        name: string
        stargazers_count: number
        forks_count: number
        description: string
        owner: {
          avatar_url: string
        }
      }

      type HelloEch0 = {
        hello: string
        version: string
        github: string
      }
    }

    namespace Connect {
      type Connect = {
        server_name: string
        server_url: string
        logo: string
        total_echos: number
        today_echos: number
        sys_username: string
      }

      type Connected = {
        id: number
        connect_url: string
      }
    }
  }
}
