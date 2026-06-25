import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface LoadingSpinnerProps {
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = '加载中...' }) => {
  return (
    <View className={styles.container}>
      <View className={styles.spinner}>
        <View className={styles.dot1} />
        <View className={styles.dot2} />
        <View className={styles.dot3} />
      </View>
      <Text className={styles.text}>{text}</Text>
    </View>
  )
}

export default LoadingSpinner
