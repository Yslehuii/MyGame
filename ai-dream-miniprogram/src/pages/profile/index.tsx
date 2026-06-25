import React, { useState, useEffect } from 'react'
import { View, Text, Input, Textarea, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { useAuth } from '@/store/useAuth'
import { updateProfile } from '@/services/user'
import styles from './index.module.scss'

const ART_STYLES = [
  { value: 'watercolor', label: '水彩' },
  { value: 'oil', label: '油画' },
  { value: 'surreal', label: '超现实' },
  { value: 'cyberpunk', label: '赛博朋克' },
]

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth()
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [artStyle, setArtStyle] = useState('watercolor')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '')
      setBio(user.bio || '')
      setArtStyle(user.preferred_art_style || 'watercolor')
    }
  }, [user])

  const handleSave = async () => {
    if (!nickname.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }
    setSaving(true)
    try {
      const updated = await updateProfile({
        nickname: nickname.trim(),
        bio: bio.trim() || undefined,
        preferred_art_style: artStyle,
      })
      setUser(updated)
      Taro.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 800)
    } catch (err: any) {
      Taro.showToast({ title: err?.detail || '保存失败', icon: 'none' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollArea}>
        <View className={styles.form}>
          <View className={styles.section}>
            <Text className={styles.label}>昵称</Text>
            <Input
              className={styles.input}
              placeholder="输入你的昵称"
              value={nickname}
              onInput={(e) => setNickname(e.detail.value)}
              maxlength={20}
            />
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>简介</Text>
            <Textarea
              className={styles.textarea}
              placeholder="介绍一下自己吧"
              value={bio}
              onInput={(e) => setBio(e.detail.value)}
              maxlength={200}
            />
            <Text className={styles.charCount}>{bio.length}/200</Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.label}>画风偏好</Text>
            <View className={styles.styleList}>
              {ART_STYLES.map(s => (
                <View
                  key={s.value}
                  className={classnames(styles.styleItem, artStyle === s.value && styles.styleActive)}
                  onClick={() => setArtStyle(s.value)}
                >
                  <Text className={styles.styleText}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.saveBtn, saving && styles.disabled)}
          onClick={handleSave}
        >
          <Text className={styles.saveText}>{saving ? '保存中...' : '保存'}</Text>
        </View>
      </View>
    </View>
  )
}

export default ProfilePage
