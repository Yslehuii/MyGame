import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAuth } from '@/store/useAuth'
import { getMyDreams, getLikedDreams, deleteDream } from '@/services/dream'
import { getUserById } from '@/services/user'
import { deleteAccount } from '@/services/auth'
import { Dream } from '@/types/dream'
import EmptyState from '@/components/EmptyState'
import styles from './index.module.scss'

const MinePage: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'dreams' | 'liked'>('dreams')
  const [myDreams, setMyDreams] = useState<Dream[]>([])
  const [likedDreams, setLikedDreams] = useState<Dream[]>([])
  const [loading, setLoading] = useState(false)
  const [likedLoading, setLikedLoading] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  const loadDreams = useCallback(async () => {
    if (!isLoggedIn) return
    setLoading(true)
    try {
      const data = await getMyDreams(0, 50)
      setMyDreams(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load my dreams', err)
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  const loadLiked = useCallback(async () => {
    if (!isLoggedIn) return
    setLikedLoading(true)
    try {
      const data = await getLikedDreams(0, 50)
      setLikedDreams(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load liked dreams', err)
    } finally {
      setLikedLoading(false)
    }
  }, [isLoggedIn])

  const loadStats = useCallback(async () => {
    if (!isLoggedIn || !user?.id) return
    try {
      const data = await getUserById(user.id)
      setFollowerCount(data.stats?.follower_count ?? 0)
      setFollowingCount(data.stats?.following_count ?? 0)
    } catch (err) {
      console.error('Failed to load stats', err)
    }
  }, [isLoggedIn, user?.id])

  useEffect(() => {
    loadDreams()
  }, [loadDreams])

  useEffect(() => {
    loadLiked()
  }, [loadLiked])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  // 每次页面显示时刷新数据（从详情页删除后返回时）
  useDidShow(() => {
    loadDreams()
    loadLiked()
    loadStats()
  })

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
          Taro.showToast({ title: '已退出', icon: 'success' })
        }
      }
    })
  }

  const handleDeleteAccount = () => {
    Taro.showModal({
      title: '注销账号',
      content: '注销后，您的所有数据将被永久删除且无法恢复。确定要注销吗？',
      confirmColor: '#EF4444',
      success: async (res) => {
        if (!res.confirm) return
        try {
          await deleteAccount()
          logout()
          Taro.showToast({ title: '账号已注销', icon: 'success' })
        } catch {
          Taro.showToast({ title: '注销失败', icon: 'none' })
        }
      }
    })
  }

  const handleDeleteDream = (dreamId: string, e: any) => {
    e.stopPropagation()
    Taro.showModal({
      title: '删除梦境',
      content: '删除后将无法恢复，确定要删除吗？',
      confirmColor: '#EF4444',
      success: async (res) => {
        if (!res.confirm) return
        try {
          await deleteDream(dreamId)
          setMyDreams(prev => prev.filter(d => d.id !== dreamId))
          Taro.showToast({ title: '已删除', icon: 'success' })
        } catch {
          Taro.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    })
  }

  const menuItems = [
    { label: '编辑资料', path: '/pages/profile/index' },
    { label: '管理后台', path: '/pages/admin/index', admin: true },
    { label: '用户协议', path: '/pages/agreement/index' },
    { label: '隐私政策', path: '/pages/privacy/index' },
    { label: '关于我们', action: 'about' },
  ]

  return (
    <View className={styles.page}>
    <ScrollView scrollY className={styles.scrollContent}>
      <View className={styles.header}>
        <View className={styles.avatarWrap}>
          <Image
            className={styles.avatar}
            src={user?.avatar || 'https://picsum.photos/id/64/200/200'}
            mode="aspectFill"
          />
        </View>
        {isLoggedIn ? (
          <>
            <Text className={styles.nickname}>{user?.nickname || '梦境探索者'}</Text>
            <Text className={styles.bio}>{user?.bio || '记录每一个奇妙的梦'}</Text>
            <View className={styles.stats}>
              <View className={styles.statItem}>
                <Text className={styles.statNum}>{myDreams.length}</Text>
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
          </>
        ) : (
          <View className={styles.loginSection} onClick={handleLogin}>
            <Text className={styles.loginText}>点击登录</Text>
            <Text className={styles.loginDesc}>登录后可同步数据</Text>
          </View>
        )}
      </View>

      <View className={styles.tabs}>
        <View
          className={`${styles.tab} ${activeTab === 'dreams' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('dreams')}
        >
          <Text className={styles.tabText}>我的梦境</Text>
        </View>
        <View
          className={`${styles.tab} ${activeTab === 'liked' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('liked')}
        >
          <Text className={styles.tabText}>我的点赞</Text>
        </View>
      </View>

      <View className={styles.dreamList}>
        {activeTab === 'dreams' ? (
          loading ? (
            <View className={styles.loadingWrap}>
              <Text className={styles.loadingText}>加载中...</Text>
            </View>
          ) : myDreams.length === 0 ? (
            <EmptyState icon="📝" title="还没有梦境" desc="去记录你的第一个梦吧" />
          ) : (
            myDreams.map(dream => (
              <View
                key={dream.id}
                className={styles.dreamItem}
                onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${dream.id}` })}
                onLongPress={(e) => handleDeleteDream(dream.id, e)}
              >
                {dream.image_url && (
                  <Image className={styles.dreamImage} src={dream.image_url} mode="aspectFill" />
                )}
                <View className={styles.dreamInfo}>
                  <Text className={styles.dreamTitle}>{dream.title || '无题'}</Text>
                  <Text className={styles.dreamContent}>{dream.content}</Text>
                  <Text className={styles.dreamTime}>{dream.created_at.slice(0, 10)}</Text>
                </View>
              </View>
            ))
          )
        ) : (
          likedLoading ? (
            <View className={styles.loadingWrap}>
              <Text className={styles.loadingText}>加载中...</Text>
            </View>
          ) : likedDreams.length === 0 ? (
            <EmptyState icon="♡" title="暂无点赞" desc="去社区看看吧" />
          ) : (
            likedDreams.map(dream => (
              <View
                key={dream.id}
                className={styles.dreamItem}
                onClick={() => Taro.navigateTo({ url: `/pages/detail/index?id=${dream.id}` })}
              >
                {dream.image_url && (
                  <Image className={styles.dreamImage} src={dream.image_url} mode="aspectFill" />
                )}
                <View className={styles.dreamInfo}>
                  <Text className={styles.dreamTitle}>{dream.title || '无题'}</Text>
                  <Text className={styles.dreamContent}>{dream.content}</Text>
                  <Text className={styles.dreamTime}>{dream.created_at.slice(0, 10)}</Text>
                </View>
              </View>
            ))
          )
        )}
      </View>

      <View className={styles.menuList}>
        {menuItems.map((item, idx) => (
          <View
            key={idx}
            className={styles.menuItem}
            onClick={() => {
              if (item.action === 'about') {
                Taro.showModal({ title: '关于', content: 'AI梦境社区 v1.0.0', showCancel: false })
              } else if (item.path) {
                Taro.navigateTo({ url: item.path })
              }
            }}
          >
            <Text className={styles.menuLabel}>{item.label}</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>

      {isLoggedIn && (
        <>
          <View className={styles.logoutBtn} onClick={handleLogout}>
            <Text className={styles.logoutText}>退出登录</Text>
          </View>
          <View className={styles.deleteBtn} onClick={handleDeleteAccount}>
            <Text className={styles.deleteText}>注销账号</Text>
          </View>
        </>
      )}
    </ScrollView>
    </View>
  )
}

export default MinePage
