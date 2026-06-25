import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { Dream } from '../../types/dream'
import styles from './index.module.scss'

interface DreamCardProps {
  dream: Dream
  onLike?: (id: string) => void
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, onLike }) => {
  const handleCardClick = () => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${dream.id}` })
  }

  const handleLikeClick = (e: any) => {
    e.stopPropagation()
    onLike?.(dream.id)
  }

  const handleUserClick = (e: any) => {
    e.stopPropagation()
    Taro.navigateTo({ url: `/pages/user/index?id=${dream.user_id}` })
  }

  return (
    <View className={styles.card} onClick={handleCardClick}>
      <View className={styles.header}>
        <Image
          className={styles.avatar}
          src={dream.author_avatar || 'https://picsum.photos/id/64/200/200'}
          mode="aspectFill"
          onClick={handleUserClick}
        />
        <View className={styles.userInfo} onClick={handleUserClick}>
          <Text className={styles.nickname}>{dream.author_nickname || '匿名用户'}</Text>
          <Text className={styles.time}>{formatTime(dream.created_at)}</Text>
        </View>
        {dream.tags && dream.tags.length > 0 && (
          <View className={styles.moodTag}>
            <Text className={styles.moodText}>{dream.tags[0]}</Text>
          </View>
        )}
      </View>

      <View className={styles.content}>
        {dream.title && <Text className={styles.title}>{dream.title}</Text>}
        <Text className={styles.desc}>{dream.content}</Text>
      </View>

      {dream.image_url && (
        <Image
          className={styles.image}
          src={dream.image_url}
          mode="aspectFill"
        />
      )}

      <View className={styles.footer}>
        <View className={styles.action} onClick={handleLikeClick}>
          <Text className={classnames(styles.likeIcon, dream.is_liked && styles.liked)}>
            {dream.is_liked ? '♥' : '♡'}
          </Text>
          <Text className={styles.count}>{dream.like_count}</Text>
        </View>
        <View className={styles.action}>
          <Text className={styles.commentIcon}>💬</Text>
          <Text className={styles.count}>{dream.comment_count}</Text>
        </View>
      </View>
    </View>
  )
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export default DreamCard
