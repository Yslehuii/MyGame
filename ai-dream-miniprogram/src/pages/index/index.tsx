import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { usePullDownRefresh, useReachBottom, useDidShow } from '@tarojs/taro'
import DreamCard from '@/components/DreamCard'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getCommunityFeed, toggleLike } from '@/services/community'
import { Dream } from '@/types/dream'
import { PAGE_SIZE } from '@/utils/constants'
import styles from './index.module.scss'

const IndexPage: React.FC = () => {
  const [dreams, setDreams] = useState<Dream[]>([])
  const [activeTab, setActiveTab] = useState<'recommend' | 'latest'>('recommend')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchFeed = useCallback(async (refresh = false) => {
    if (loading) return
    setLoading(true)
    try {
      const sort = activeTab === 'recommend' ? 'recommended' : 'latest'
      const skip = refresh ? 0 : dreams.length
      const data = await getCommunityFeed(skip, PAGE_SIZE, sort)
      if (refresh) {
        setDreams(data)
      } else {
        setDreams(prev => [...prev, ...data])
      }
      setHasMore(data.length >= PAGE_SIZE)
    } catch (err) {
      console.error('[Index] fetch feed failed:', err)
    } finally {
      setLoading(false)
    }
  }, [activeTab, dreams.length, loading])

  useEffect(() => {
    fetchFeed(true)
  }, [activeTab])

  // 每次页面显示时刷新社区数据（从详情页删除后返回时）
  useDidShow(() => {
    fetchFeed(true)
  })

  usePullDownRefresh(() => {
    fetchFeed(true).then(() => Taro.stopPullDownRefresh())
  })

  useReachBottom(() => {
    if (hasMore && !loading) fetchFeed()
  })

  const handleLike = useCallback(async (id: string) => {
    // Optimistic update
    setDreams(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, is_liked: !d.is_liked, like_count: d.is_liked ? d.like_count - 1 : d.like_count + 1 }
          : d
      )
    )
    try {
      await toggleLike(id)
    } catch {
      // Revert on error
      setDreams(prev =>
        prev.map(d =>
          d.id === id
            ? { ...d, is_liked: !d.is_liked, like_count: d.is_liked ? d.like_count - 1 : d.like_count + 1 }
            : d
        )
      )
    }
  }, [])

  const handleTabChange = (tab: 'recommend' | 'latest') => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setDreams([])
    setHasMore(true)
  }

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        <View
          className={`${styles.tab} ${activeTab === 'recommend' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('recommend')}
        >
          <Text className={styles.tabText}>推荐</Text>
        </View>
        <View
          className={`${styles.tab} ${activeTab === 'latest' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('latest')}
        >
          <Text className={styles.tabText}>最新</Text>
        </View>
      </View>

      <ScrollView scrollY className={styles.scrollArea}>
        <View className={styles.list}>
          {dreams.length === 0 && !loading ? (
            <EmptyState icon="🌙" title="还没有梦境" desc="成为第一个分享梦境的人吧" />
          ) : (
            dreams.map(dream => (
              <DreamCard key={dream.id} dream={dream} onLike={handleLike} />
            ))
          )}
          {loading && <LoadingSpinner />}
        </View>
      </ScrollView>
    </View>
  )
}

export default IndexPage
