import React, { useState, useEffect } from 'react'
import { View, Text, Image, Input, Button } from '@tarojs/components'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import classnames from 'classnames'
import CommentItem from '@/components/CommentItem'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getDreamDetail, toggleShare, deleteDream } from '@/services/dream'
import { toggleLike, getComments, postComment, reportDream } from '@/services/community'
import { useAuth } from '@/store/useAuth'
import { Dream, Comment } from '@/types/dream'
import styles from './index.module.scss'

const DetailPage: React.FC = () => {
  const router = useRouter()
  const dreamId = router.params.id || ''
  const { user } = useAuth()

  const [dream, setDream] = useState<Dream | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [sharing, setSharing] = useState(false)

  useShareAppMessage(() => ({
    title: dream?.title || '分享一个奇妙的梦境',
    path: `/pages/detail/index?id=${dreamId}`,
  }))

  useEffect(() => {
    if (!dreamId) return
    getDreamDetail(dreamId).then(d => {
      setDream(d)
      setIsLiked(d.is_liked || false)
      setLikeCount(d.like_count || 0)
    }).catch(err => {
      console.error('[Detail] fetch dream failed:', err)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    }).finally(() => setLoading(false))

    getComments(dreamId).then(c => {
      setComments(c)
    }).catch(err => {
      console.error('[Detail] fetch comments failed:', err)
    })
  }, [dreamId])

  const handleLike = async () => {
    const prevLiked = isLiked
    const prevCount = likeCount
    setIsLiked(!prevLiked)
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1)
    try {
      await toggleLike(dreamId)
    } catch {
      setIsLiked(prevLiked)
      setLikeCount(prevCount)
    }
  }

  const handleComment = async () => {
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    try {
      const newComment = await postComment(dreamId, commentText)
      setComments(prev => [newComment, ...prev])
      setCommentText('')
      Taro.showToast({ title: '评论成功', icon: 'success' })
    } catch {
      Taro.showToast({ title: '评论失败', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReport = () => {
    const reasons = ['举报内容不当', '举报抄袭', '其他问题']
    Taro.showActionSheet({
      itemList: reasons,
      success: async (res) => {
        try {
          await reportDream(dreamId, reasons[res.tapIndex])
          Taro.showToast({ title: '举报已提交', icon: 'success' })
        } catch {
          Taro.showToast({ title: '举报失败', icon: 'none' })
        }
      }
    })
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

  const handleDelete = () => {
    if (!dreamId) return
    Taro.showModal({
      title: '删除梦境',
      content: '删除后将无法恢复，确定要删除吗？',
      confirmColor: '#EF4444',
      success: async (res) => {
        if (!res.confirm) return
        try {
          await deleteDream(dreamId)
          Taro.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => Taro.navigateBack(), 1500)
        } catch {
          Taro.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    })
  }

  const isOwnDream = dream && user && dream.user_id === user.id

  if (loading) {
    return <View className={styles.page}><LoadingSpinner /></View>
  }

  if (!dream) {
    return <View className={styles.page}><Text>梦境不存在</Text></View>
  }

  return (
    <View className={styles.page}>
      <View className={styles.contentArea}>
        <View className={styles.header}>
          <View className={styles.authorRow}>
            <Image
              className={styles.avatar}
              src={dream.author_avatar || 'https://picsum.photos/id/64/200/200'}
              mode="aspectFill"
            />
            <View className={styles.authorInfo}>
              <Text className={styles.nickname}>{dream.author_nickname || '匿名用户'}</Text>
              <Text className={styles.time}>{dream.created_at.slice(0, 10)}</Text>
            </View>
            {dream.tags && dream.tags.length > 0 && (
              <View className={styles.moodTag}>
                <Text className={styles.moodText}>{dream.tags[0]}</Text>
              </View>
            )}
          </View>

          {dream.title && <Text className={styles.title}>{dream.title}</Text>}
          <Text className={styles.content}>{dream.content}</Text>
        </View>

        {dream.image_url && (
          <Image className={styles.dreamImage} src={dream.image_url} mode="aspectFill" />
        )}

        {dream.interpretation && (
          <View className={styles.analysisCard}>
            <View className={styles.analysisHeader}>
              <Text className={styles.analysisIcon}>✨</Text>
              <Text className={styles.analysisTitle}>AI梦境解析</Text>
            </View>
            <Text className={styles.analysisContent}>{dream.interpretation}</Text>
          </View>
        )}

        <View className={styles.commentSection}>
          <Text className={styles.sectionTitle}>评论 ({comments.length})</Text>
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.commentInput}>
          <Input
            className={styles.input}
            placeholder="说说你的感想..."
            value={commentText}
            onInput={(e) => setCommentText(e.detail.value)}
            confirmType="send"
            onConfirm={handleComment}
          />
          <View className={styles.sendBtn} onClick={handleComment}>
            <Text className={styles.sendText}>{submitting ? '...' : '发送'}</Text>
          </View>
        </View>
        <View className={styles.actions}>
          <View className={styles.actionBtn} onClick={handleLike}>
            <Text className={classnames(styles.actionIcon, isLiked && styles.liked)}>
              {isLiked ? '♥' : '♡'}
            </Text>
            <Text className={styles.actionCount}>{likeCount}</Text>
          </View>
          <View className={styles.actionBtn}>
            <Text className={styles.actionIcon}>💬</Text>
            <Text className={styles.actionCount}>{comments.length}</Text>
          </View>
          <View className={styles.actionBtn} onClick={handleReport}>
            <Text className={styles.actionIcon}>⚑</Text>
            <Text className={styles.actionLabel}>举报</Text>
          </View>
          {isOwnDream && !dream.is_shared && (
            <View className={styles.actionBtn} onClick={handleShareToCommunity}>
              <Text className={styles.actionIcon}>{sharing ? '...' : '↗'}</Text>
              <Text className={styles.actionLabel}>分享到社区</Text>
            </View>
          )}
          {isOwnDream && dream.is_shared && (
            <View className={styles.actionBtn}>
              <Text className={classnames(styles.actionIcon, styles.sharedIcon)}>✓</Text>
              <Text className={styles.actionLabel}>已分享</Text>
            </View>
          )}
          {isOwnDream && (
            <View className={styles.actionBtn} onClick={handleDelete}>
              <Text className={styles.actionIcon}>🗑</Text>
              <Text className={styles.actionLabel}>删除</Text>
            </View>
          )}
          <Button className={styles.shareBtn} open-type="share">
            <Text className={styles.shareIcon}>↗</Text>
            <Text className={styles.shareLabel}>分享</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default DetailPage
