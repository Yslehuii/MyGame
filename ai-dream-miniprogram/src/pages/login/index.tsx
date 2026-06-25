import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { wechatLogin } from '../../services/auth'
import { setTokens } from '../../utils/token'
import { useAuth } from '../../store/useAuth'
import styles from './index.module.scss'

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const setUser = useAuth((s) => s.setUser)

  const handleLogin = async () => {
    if (loading) return
    setLoading(true)
    try {
      const { code } = await Taro.login()
      const res = await wechatLogin(code)
      setTokens(res.access_token, res.refresh_token)
      setUser(res.user)
      Taro.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 800)
    } catch (err: any) {
      console.error('[Login] failed:', err)
      Taro.showToast({ title: err?.detail || '登录失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className={styles.container}>
      <View className={styles.logo}>🌙</View>
      <Text className={styles.title}>AI梦境社区</Text>
      <Text className={styles.desc}>记录你的梦境，探索内心世界</Text>
      <Button
        className={styles.loginBtn}
        loading={loading}
        onClick={handleLogin}
      >
        微信一键登录
      </Button>
      <View className={styles.hintRow}>
        <Text className={styles.hint}>登录即表示同意</Text>
        <Text className={styles.hintLink} onClick={() => Taro.navigateTo({ url: '/pages/agreement/index' })}>用户协议</Text>
        <Text className={styles.hint}>和</Text>
        <Text className={styles.hintLink} onClick={() => Taro.navigateTo({ url: '/pages/privacy/index' })}>隐私政策</Text>
      </View>
    </View>
  )
}

export default LoginPage
