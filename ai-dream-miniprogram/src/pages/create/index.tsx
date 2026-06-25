import React, { useState } from 'react'
import { View, Text, Input, Textarea, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { createDream } from '@/services/dream'
import { MOOD_TAGS } from '@/utils/constants'
import styles from './index.module.scss'

const CreatePage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [shareToCommunity, setShareToCommunity] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请描述你的梦境', icon: 'none' })
      return
    }

    setSubmitting(true)
    try {
      const dream = await createDream({
        content: content.trim(),
        title: title.trim() || undefined,
        generate_image: true,
        is_shared: shareToCommunity,
      })
      Taro.showToast({ title: '梦境已记录', icon: 'success' })
      setTimeout(() => {
        Taro.redirectTo({ url: `/pages/result/index?id=${dream.id}` })
        setTitle('')
        setContent('')
        setSelectedMood('')
      }, 1000)
    } catch (err: any) {
      console.error('[Create] submit failed:', err)
      Taro.showToast({ title: err?.detail || '提交失败，请重试', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollArea}>
        <View className={styles.form}>
          <View className={styles.section}>
            <Text className={styles.label}>梦境标题</Text>
            <Input
              className={styles.input}
              placeholder="给你的梦取个名字"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              maxlength={30}
            />
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>梦境描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder="描述一下你的梦境吧...越详细，AI解析越准确"
              value={content}
              onInput={(e) => setContent(e.detail.value)}
              maxlength={5000}
            />
            <Text className={styles.charCount}>{content.length}/5000</Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>当时的心情</Text>
            <View className={styles.moodList}>
              {MOOD_TAGS.map(mood => (
                <View
                  key={mood}
                  className={classnames(styles.moodItem, selectedMood === mood && styles.moodActive)}
                  onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                >
                  <Text className={styles.moodText}>{mood}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.section}>
            <View className={styles.switchRow} onClick={() => setShareToCommunity(!shareToCommunity)}>
              <View className={styles.switchInfo}>
                <Text className={styles.switchLabel}>分享到社区</Text>
                <Text className={styles.switchDesc}>发布后其他用户可在社区看到你的梦境</Text>
              </View>
              <View className={classnames(styles.switch, shareToCommunity && styles.switchOn)}>
                <View className={classnames(styles.switchThumb, shareToCommunity && styles.switchThumbOn)} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.submitBtn, submitting && styles.disabled)}
          onClick={handleSubmit}
        >
          <Text className={styles.submitText}>{submitting ? '解析中...' : '开始AI解析'}</Text>
        </View>
      </View>
    </View>
  )
}

export default CreatePage
