import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import Taro, { useDidShow } from '@tarojs/taro'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getNotifications, markAllAsRead } from '@/services/notification'
import { Notification } from '@/types/notification'
import styles from './index.module.scss'

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'like' | 'comment' | 'follow'>('all')

  const loadNotifications = () => {
    setLoading(true)
    getNotifications(0, 50)
      .then(data => setNotifications(data))
      .catch(err => console.error('[Notification] fetch failed:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  useDidShow(() => {
    loadNotifications()
  })

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeTab)

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      Taro.showToast({ title: '已全部标记已读', icon: 'success' })
    } catch {
      Taro.showToast({ title: '操作失败', icon: 'none' })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'like': return '♥'
      case 'comment': return '💬'
      case 'follow': return '👤'
      case 'system': return '📢'
      default: return '🔔'
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}天前`
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        {(['all', 'like', 'comment', 'follow'] as const).map(tab => (
          <View
            key={tab}
            className={classnames(styles.tab, activeTab === tab && styles.activeTab)}
            onClick={() => setActiveTab(tab)}
          >
            <Text className={styles.tabText}>
              {tab === 'all' ? '全部' : tab === 'like' ? '点赞' : tab === 'comment' ? '评论' : '关注'}
            </Text>
          </View>
        ))}
      </View>

      {notifications.some(n => !n.is_read) && (
        <View className={styles.markAll} onClick={handleMarkAllRead}>
          <Text className={styles.markAllText}>全部已读</Text>
        </View>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🔔" title="暂无消息" desc="有人互动时会通知你" />
      ) : (
        <View className={styles.list}>
          {filtered.map(item => (
            <View
              key={item.id}
              className={classnames(styles.item, !item.is_read && styles.unread)}
            >
              {!item.is_read && <View className={styles.dot} />}
              <View className={styles.iconBox}>
                <Text className={styles.iconText}>{getTypeIcon(item.type)}</Text>
              </View>
              <View className={styles.body}>
                <Text className={styles.content}>{item.title}</Text>
                {item.content && <Text className={styles.detail}>{item.content}</Text>}
                <Text className={styles.time}>{formatTime(item.created_at)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default NotificationPage
