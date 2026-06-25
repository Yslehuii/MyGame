import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { getDreamDetail, toggleShare } from '@/services/dream'
import { useAuth } from '@/store/useAuth'
import { Dream } from '@/types/dream'
import styles from './index.module.scss'

const ResultPage: React.FC = () => {
  const router = useRouter()
  const dreamId = router.params.id
  const { user } = useAuth()
  const [dream, setDream] = useState<Dream | null>(null)
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    if (!dreamId) {
      setLoading(false)
      return
    }
    getDreamDetail(dreamId)
      .then(setDream)
      .catch((err) => {
        console.error('[Result] fetch dream failed:', err)
      })
      .finally(() => setLoading(false))
  }, [dreamId])

  const handleViewCommunity = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  const handleViewDetail = () => {
    if (dreamId) {
      Taro.redirectTo({ url: `/pages/detail/index?id=${dreamId}` })
    } else {
      Taro.switchTab({ url: '/pages/mine/index' })
    }
  }

  const handleShareToCommunity = async () => {
    if (!dreamId || sharing) return
    setSharing(true)
    try {
      await toggleShare(dreamId, true)
      setDream(prev => prev ? { ...prev, is_shared: true } : prev)
      Taro.showToast({ title: '已分享到社区', icon: 'success' })
    } catch (err: any) {
      const detail = err?.detail || err?.message || '分享失败'
      Taro.showToast({ title: detail, icon: 'none' })
    } finally {
      setSharing(false)
    }
  }

  const isOwnDream = dream && user && dream.user_id === user.id

  if (loading) {
    return (
      <View className={styles.page}>
        <View className={styles.card}>
          <Text className={styles.icon}>🔮</Text>
          <Text className={styles.title}>AI 解析中...</Text>
          <Text className={styles.desc}>正在生成你的梦境解析</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.card}>
        <Text className={styles.icon}>✨</Text>
        <Text className={styles.title}>梦境解析完成</Text>
        <Text className={styles.desc}>AI已完成对你梦境的深度解析</Text>

        {dream?.image_url && (
          <Image
            className={styles.image}
            src={dream.image_url}
            mode="aspectFill"
          />
        )}

        <View className={styles.analysisBox}>
          <Text className={styles.analysisLabel}>梦境解析</Text>
          <Text className={styles.analysisText}>
            {dream?.interpretation || 'AI 正在分析你的梦境，稍后可在详情页查看结果。'}
          </Text>
        </View>

        {isOwnDream && !dream?.is_shared && (
          <View className={styles.shareBtn} onClick={handleShareToCommunity}>
            <Text className={styles.shareText}>{sharing ? '分享中...' : '分享到社区'}</Text>
          </View>
        )}
        {isOwnDream && dream?.is_shared && (
          <View className={styles.sharedTag}>
            <Text className={styles.sharedText}>已分享到社区</Text>
          </View>
        )}

        <View className={styles.actions}>
          <View className={styles.primaryBtn} onClick={handleViewCommunity}>
            <Text className={styles.primaryText}>查看社区</Text>
          </View>
          <View className={styles.secondaryBtn} onClick={handleViewDetail}>
            <Text className={styles.secondaryText}>查看详情</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ResultPage
