import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Comment } from '../../types/dream'
import styles from './index.module.scss'

interface CommentItemProps {
  comment: Comment
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <View className={styles.item}>
      <Image
        className={styles.avatar}
        src={comment.author_avatar || 'https://picsum.photos/id/64/200/200'}
        mode="aspectFill"
      />
      <View className={styles.body}>
        <Text className={styles.nickname}>{comment.author_nickname || '匿名用户'}</Text>
        <Text className={styles.content}>{comment.content}</Text>
        <View className={styles.meta}>
          <Text className={styles.time}>{formatCommentTime(comment.created_at)}</Text>
        </View>
      </View>
    </View>
  )
}

function formatCommentTime(dateStr: string): string {
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

export default CommentItem
