import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { getUserById, getUserDreams, followUser, unfollowUser } from '@/services/user'
import { User } from '@/types/user'
import { Dream } from '@/types/dream'
import { useAuth } from '@/store/useAuth'
import EmptyState from '@/components/EmptyState'
import styles from './index.module.scss'

const UserPage: React.FC = () => {
  const router = useRouter()
  const userId = router.params.id
  const currentUser = useAuth((s) => s.user)

  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [dreams, setDreams] = useState<Dream[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dreamCount, setDreamCount] = useState(0)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  const isSelf = currentUser?.id === userId

  const loadUser = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await getUserById(userId)
      setUserInfo(data)
      setIsFollowing(data.is_followed ?? false)
      setDreamCount(data.stats?.dream_count ?? 0)
      setFollowerCount(data.stats?.follower_count ?? 0)
      setFollowingCount(data.stats?.following_count ?? 0)
    } catch (err) {
      console.error('Failed to load user', err)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }, [userId])

  const loadDreams = useCallback(async () => {
    if (!userId) return
    try {
      const data = await getUserDreams(userId, 0, 50)
      setDreams(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load dreams', err)
    }
  }, [userId])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    loadDreams()
  }, [loadDreams])

  useDidShow(() => {
    loadUser()
    loadDreams()
  })

  const handleFollow = async () => {
    if (!userId) return
    try {
      if (isFollowing) {
        await unfollowUser(userId)
        setIsFollowing(false)
        setFollowerCount((c) => Math.max(0, c - 1))
        Taro.showToast({ title: '已取消关注', icon: 'none' })
      } else {
        await followUser(userId)
        setIsFollowing(true)
        setFollowerCount((c) => c + 1)
        Taro.showToast({ title: '已关注', icon: 'success' })
      }
    } catch (err) {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const handleDreamClick = (dreamId: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${dreamId}` })
  }

  if (loading) {
    return (
      <View className={styles.page}>
        <View className={styles.loadingWrap}>
          <Text className={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    )
  }

  if (!userInfo) {
    return (
      <View className={styles.page}>
        <View className={styles.loadingWrap}>
          <Text className={styles.loadingText}>用户不存在</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
        {/* 顶部资料卡 */}
        <View className={styles.header}>
          <View className={styles.avatarWrap}>
            <Image
              className={styles.avatar}
              src={userInfo.avatar || 'https://picsum.photos/id/64/200/200'}
              mode="aspectFill"
            />
          </View>
          <Text className={styles.nickname}>{userInfo.nickname || '梦境探索者'}</Text>
          <Text className={styles.bio}>{userInfo.bio || '记录每一个奇妙的梦'}</Text>

          {/* 关注按钮 */}
          {!isSelf && (
            <View
              className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
              onClick={handleFollow}
            >
              <Text className={styles.followText}>{isFollowing ? '已关注' : '+ 关注'}</Text>
            </View>
          )}

          {isSelf && (
            <View
              className={styles.editBtn}
              onClick={() => Taro.navigateTo({ url: '/pages/profile/index' })}
            >
              <Text className={styles.editText}>编辑资料</Text>
            </View>
          )}

          {/* 统计 */}
          <View className={styles.stats}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{dreamCount}</Text>
              <Text className={styles.statLabel}>梦境</Text>
            </View>
            <View className={styles.statDivider} />
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{followerCount}</Text>
              <Text className={styles.statLabel}>粉丝</Text>
            </View>
            <View className={styles.statDivider} />
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{followingCount}</Text>
              <Text className={styles.statLabel}>关注</Text>
            </View>
          </View>
        </View>

        {/* 梦境列表 */}
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionText}>TA 的梦境</Text>
        </View>

        <View className={styles.dreamList}>
          {dreams.length === 0 ? (
            <EmptyState icon="🌙" title="暂无梦境" desc={isSelf ? '去记录你的第一个梦吧' : '该用户还没有发布梦境'} />
          ) : (
            dreams.map((dream) => (
              <View
                key={dream.id}
                className={styles.dreamItem}
                onClick={() => handleDreamClick(dream.id)}
              >
                {dream.image_url && (
                  <Image className={styles.dreamImage} src={dream.image_url} mode="aspectFill" />
                )}
                <View className={styles.dreamInfo}>
                  <Text className={styles.dreamTitle}>{dream.title || '无题'}</Text>
                  <Text className={styles.dreamContent}>{dream.content}</Text>
                  <View className={styles.dreamMeta}>
                    <Text className={styles.dreamTime}>{dream.created_at.slice(0, 10)}</Text>
                    <View className={styles.dreamStats}>
                      <Text className={styles.dreamStat}>♡ {dream.like_count}</Text>
                      <Text className={styles.dreamStat}>💬 {dream.comment_count}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default UserPage
