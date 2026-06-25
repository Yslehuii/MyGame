import { Notification } from '../types/notification'

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'like',
    title: '点赞了你的梦境',
    content: '星辰旅人 点赞了你的梦境「飞越彩虹桥」',
    is_read: false,
    created_at: '2026-06-24T12:00:00Z',
    sender_id: 1,
    sender_nickname: '星辰旅人',
    sender_avatar: 'https://picsum.photos/id/64/200/200',
    target_id: 1,
    target_title: '飞越彩虹桥'
  },
  {
    id: 2,
    type: 'comment',
    title: '评论了你的梦境',
    content: '深海之梦 评论了你的梦境「深海漫步」：太美了，我也梦到过类似的场景！',
    is_read: false,
    created_at: '2026-06-24T11:30:00Z',
    sender_id: 2,
    sender_nickname: '深海之梦',
    sender_avatar: 'https://picsum.photos/id/91/200/200',
    target_id: 2,
    target_title: '深海漫步'
  },
  {
    id: 3,
    type: 'follow',
    title: '关注了你',
    content: '夜空守望者 关注了你',
    is_read: true,
    created_at: '2026-06-24T10:00:00Z',
    sender_id: 3,
    sender_nickname: '夜空守望者',
    sender_avatar: 'https://picsum.photos/id/177/200/200'
  },
  {
    id: 4,
    type: 'like',
    title: '点赞了你的梦境',
    content: '时光旅者 点赞了你的梦境「回到童年的小院」',
    is_read: true,
    created_at: '2026-06-23T20:00:00Z',
    sender_id: 4,
    sender_nickname: '时光旅者',
    sender_avatar: 'https://picsum.photos/id/338/200/200',
    target_id: 4,
    target_title: '回到童年的小院'
  },
  {
    id: 5,
    type: 'system',
    title: '梦境审核通过',
    content: '你的梦境「飞越彩虹桥」已通过审核，现已公开发布到社区。',
    is_read: true,
    created_at: '2026-06-23T16:00:00Z'
  },
  {
    id: 6,
    type: 'comment',
    title: '评论了你的梦境',
    content: '书虫小梦 评论了你的梦境「无尽的图书馆」：这个描述太有画面感了！',
    is_read: true,
    created_at: '2026-06-23T14:20:00Z',
    sender_id: 5,
    sender_nickname: '书虫小梦',
    sender_avatar: 'https://picsum.photos/id/1027/200/200',
    target_id: 5,
    target_title: '无尽的图书馆'
  },
  {
    id: 7,
    type: 'follow',
    title: '关注了你',
    content: '迷途小鹿 关注了你',
    is_read: true,
    created_at: '2026-06-22T18:00:00Z',
    sender_id: 6,
    sender_nickname: '迷途小鹿',
    sender_avatar: 'https://picsum.photos/id/237/200/200'
  },
  {
    id: 8,
    type: 'system',
    title: '梦境解析完成',
    content: '你的梦境「坠入星空」的AI解析已完成，快去看看吧！',
    is_read: true,
    created_at: '2026-06-22T15:30:00Z'
  },
  {
    id: 9,
    type: 'like',
    title: '点赞了你的梦境',
    content: '云端追风 点赞了你的梦境「暴雨中的花朵」',
    is_read: true,
    created_at: '2026-06-22T10:00:00Z',
    sender_id: 7,
    sender_nickname: '云端追风',
    sender_avatar: 'https://picsum.photos/id/659/200/200',
    target_id: 9,
    target_title: '暴雨中的花朵'
  },
  {
    id: 10,
    type: 'comment',
    title: '评论了你的梦境',
    content: '双面镜 评论了你的梦境「镜中的另一个我」：镜像世界的设定好有趣！',
    is_read: true,
    created_at: '2026-06-21T20:15:00Z',
    sender_id: 8,
    sender_nickname: '双面镜',
    sender_avatar: 'https://picsum.photos/id/1025/200/200',
    target_id: 8,
    target_title: '镜中的另一个我'
  }
]
