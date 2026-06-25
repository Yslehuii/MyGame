import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { getPendingDreams, reviewDream } from '@/services/dream'
import { useAuth } from '@/store/useAuth'
import { Dream } from '@/types/dream'
import EmptyState from '@/components/EmptyState'
import styles from './index.module.scss'

const AdminPage: React.FC = () => {
  const user = useAuth((s) => s.user)
  const [dreams, setDreams] = useState<Dream[]>([])
  const [loading, setLoading] = useState(true)

  const loadPending = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPendingDreams(0, 50)
      setDreams(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load pending dreams', err)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPending()
  }, [loadPending])

  useDidShow(() => {
    loadPending()
  })

  const handleReview = async (id: string, action: 'approve' | 'reject') => {
    const actionLabel = action === 'approve' ? '通过' : '拒绝'
    const { confirm } = await Taro.showModal({
      title: '审核确认',
      content: `确定要${actionLabel}这条梦境吗？`
    })
    if (!confirm) return

    try {
      await reviewDream(id, action)
      setDreams((prev) => prev.filter((d) => d.id !== id))
      Taro.showToast({ title: `已${actionLabel}`, icon: 'success' })
    } catch (err) {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const handleDreamClick = (dreamId: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${dreamId}` })
  }

  if (!user?.is_superuser) {
    return (
      <View className={styles.page}>
        <View className={styles.loadingWrap}>
          <Text className={styles.loadingText}>无管理员权限</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
        <View className={styles.header}>
          <Text className={styles.headerTitle}>内容审核</Text>
          <Text className={styles.headerDesc}>
            待审核 {loading ? '...' : dreams.length} 条
          </Text>
        </View>

        {loading ? (
          <View className={styles.loadingWrap}>
            <Text className={styles.loadingText}>加载中...</Text>
          </View>
        ) : dreams.length === 0 ? (
          <EmptyState icon="✅" title="全部审核完毕" desc="暂无待审核的梦境" />
        ) : (
          <View className={styles.list}>
            {dreams.map((dream) => (
              <View key={dream.id} className={styles.card}>
                {/* 用户信息 */}
                <View className={styles.cardHeader}>
                  <Image
                    className={styles.avatar}
                    src={dream.author_avatar || 'https://picsum.photos/id/64/200/200'}
                    mode="aspectFill"
                  />
                  <View className={styles.userInfo}>
                    <Text className={styles.nickname}>{dream.author_nickname || '匿名用户'}</Text>
                    <Text className={styles.time}>{dream.created_at?.slice(0, 16)}</Text>
                  </View>
                </View>

                {/* 内容预览 */}
                <View className={styles.cardBody} onClick={() => handleDreamClick(dream.id)}>
                  {dream.title && <Text className={styles.dreamTitle}>{dream.title}</Text>}
                  <Text className={styles.dreamContent}>{dream.content}</Text>
                  {dream.image_url && (
                    <Image className={styles.dreamImage} src={dream.image_url} mode="aspectFill" />
                  )}
                </View>

                {/* 操作按钮 */}
                <View className={styles.cardActions}>
                  <View
                    className={styles.rejectBtn}
                    onClick={() => handleReview(dream.id, 'reject')}
                  >
                    <Text className={styles.rejectText}>拒绝</Text>
                  </View>
                  <View
                    className={styles.approveBtn}
                    onClick={() => handleReview(dream.id, 'approve')}
                  >
                    <Text className={styles.approveText}>通过</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default AdminPage
