import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import styles from './index.module.scss'

const PrivacyPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
        <View className={styles.container}>
          <Text className={styles.title}>隐私政策</Text>
          <Text className={styles.updateDate}>更新日期：2026年6月25日</Text>
          <Text className={styles.effectiveDate}>生效日期：2026年6月25日</Text>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>一、信息收集</Text>
            <Text className={styles.paragraph}>
              1.1 我们收集您的微信昵称、头像等基本信息，用于账号创建和社区展示。
            </Text>
            <Text className={styles.paragraph}>
              1.2 我们收集您主动记录的梦境内容，用于提供AI解析服务。
            </Text>
            <Text className={styles.paragraph}>
              1.3 我们可能收集设备信息、网络状态等，用于保障服务稳定运行。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>二、信息使用</Text>
            <Text className={styles.paragraph}>
              2.1 您的梦境内容仅用于AI解析和您授权的社区分享。
            </Text>
            <Text className={styles.paragraph}>
              2.2 我们使用您的信息提供个性化服务、改进产品体验。
            </Text>
            <Text className={styles.paragraph}>
              2.3 我们不会将您的个人信息用于未经您同意的商业目的。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>三、信息存储与保护</Text>
            <Text className={styles.paragraph}>
              3.1 您的数据存储在安全的服务器环境中，采用加密技术保护。
            </Text>
            <Text className={styles.paragraph}>
              3.2 我们采取合理的安全措施保护您的个人信息不被未经授权的访问、使用或泄露。
            </Text>
            <Text className={styles.paragraph}>
              3.3 您的梦境数据将保留至您主动删除或注销账号。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>四、信息共享</Text>
            <Text className={styles.paragraph}>
              4.1 未经您同意，我们不会向第三方共享您的个人信息。
            </Text>
            <Text className={styles.paragraph}>
              4.2 您在社区公开分享的内容，其他用户可查看和互动。
            </Text>
            <Text className={styles.paragraph}>
              4.3 法律法规规定的特殊情况除外。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>五、用户权利</Text>
            <Text className={styles.paragraph}>
              5.1 您有权查看、修改您的个人信息。
            </Text>
            <Text className={styles.paragraph}>
              5.2 您有权删除您的梦境记录。
            </Text>
            <Text className={styles.paragraph}>
              5.3 您有权注销账号，注销后我们将删除您的所有数据。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>六、未成年人保护</Text>
            <Text className={styles.paragraph}>
              6.1 我们高度重视未成年人个人信息的保护。
            </Text>
            <Text className={styles.paragraph}>
              6.2 如您为未成年人，请在监护人指导下使用本平台。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>七、政策更新</Text>
            <Text className={styles.paragraph}>
              7.1 我们可能适时更新本隐私政策，更新后将在平台上公布。
            </Text>
            <Text className={styles.paragraph}>
              7.2 重大变更时，我们将通过应用内通知等方式告知您。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>八、联系我们</Text>
            <Text className={styles.paragraph}>
              如对本隐私政策有任何疑问，请通过小程序内的"关于我们"功能联系我们。
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default PrivacyPage