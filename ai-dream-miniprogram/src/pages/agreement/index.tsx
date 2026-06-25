import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import styles from './index.module.scss'

const AgreementPage: React.FC = () => {
  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
        <View className={styles.container}>
          <Text className={styles.title}>AI梦境社区用户协议</Text>
          <Text className={styles.updateDate}>更新日期：2026年6月25日</Text>
          <Text className={styles.effectiveDate}>生效日期：2026年6月25日</Text>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>一、总则</Text>
            <Text className={styles.paragraph}>
              1.1 本协议是您（以下简称"用户"）与AI梦境社区（以下简称"本平台"）之间关于使用本平台服务所订立的协议。
            </Text>
            <Text className={styles.paragraph}>
              1.2 本平台的所有权和运营权归本平台所有。用户在注册、使用本平台服务前，应当仔细阅读本协议。
            </Text>
            <Text className={styles.paragraph}>
              1.3 用户注册、登录、使用本平台服务即表示用户已充分阅读、理解并接受本协议的全部内容。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>二、服务内容</Text>
            <Text className={styles.paragraph}>
              2.1 本平台提供梦境记录、AI梦境解析、梦境社区分享等服务。
            </Text>
            <Text className={styles.paragraph}>
              2.2 用户可通过本平台记录梦境内容，平台AI系统将对梦境进行解析并生成相应的艺术图像。
            </Text>
            <Text className={styles.paragraph}>
              2.3 用户可选择将梦境分享至社区，与其他用户互动交流。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>三、用户行为规范</Text>
            <Text className={styles.paragraph}>
              3.1 用户应遵守中华人民共和国相关法律法规，不得利用本平台发布、传播违反法律法规的内容。
            </Text>
            <Text className={styles.paragraph}>
              3.2 用户不得发布包含色情、暴力、恐怖、歧视等不良信息的内容。
            </Text>
            <Text className={styles.paragraph}>
              3.3 用户不得侵犯他人知识产权、隐私权等合法权益。
            </Text>
            <Text className={styles.paragraph}>
              3.4 用户不得利用技术手段干扰本平台正常运行。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>四、知识产权</Text>
            <Text className={styles.paragraph}>
              4.1 本平台的Logo、界面设计、程序代码等知识产权归本平台所有。
            </Text>
            <Text className={styles.paragraph}>
              4.2 用户在本平台发布的梦境内容，其著作权归用户所有。用户授权本平台在提供服务范围内使用该内容。
            </Text>
            <Text className={styles.paragraph}>
              4.3 AI生成的解析内容和艺术图像，用户享有使用权，但不得用于商业用途。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>五、免责声明</Text>
            <Text className={styles.paragraph}>
              5.1 AI梦境解析结果仅供参考，不构成专业心理咨询或医学建议。
            </Text>
            <Text className={styles.paragraph}>
              5.2 如系统检测到用户梦境内容涉及心理危机，平台将提供相关帮助信息，但不承担专业干预责任。
            </Text>
            <Text className={styles.paragraph}>
              5.3 因网络故障、系统维护等原因导致的服务中断，本平台不承担责任。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>六、协议变更</Text>
            <Text className={styles.paragraph}>
              6.1 本平台有权根据需要修改本协议，修改后的协议将在平台上公布。
            </Text>
            <Text className={styles.paragraph}>
              6.2 如用户不同意修改后的协议，有权停止使用本平台服务。继续使用即视为接受修改后的协议。
            </Text>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>七、联系我们</Text>
            <Text className={styles.paragraph}>
              如对本协议有任何疑问，请通过小程序内的"关于我们"功能联系我们。
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AgreementPage