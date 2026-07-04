import type { L, Lang } from '../game/constants'

export const STR: Record<string, L> = {
  title: { en: 'NEXT STEP', vi: 'NEXT STEP' },
  subtitle: {
    en: 'The AI Mastery Ascent — an interactive 3D climb from chatting with AI to full automation. Eleven islands, eleven lessons, one summit.',
    vi: 'Hành trình chinh phục AI — cuộc leo núi 3D tương tác, từ trò chuyện với AI đến tự động hoá hoàn toàn. Mười một hòn đảo, mười một bài học, một đỉnh núi.',
  },
  begin: { en: 'Begin the ascent', vi: 'Bắt đầu hành trình' },
  continue: { en: 'Continue the ascent', vi: 'Tiếp tục hành trình' },
  restart: { en: 'Start over', vi: 'Chơi lại từ đầu' },
  introHintMove: { en: 'move', vi: 'di chuyển' },
  introHintLook: { en: 'drag to look', vi: 'kéo để xoay góc nhìn' },
  introHintJump: { en: 'jump', vi: 'nhảy' },
  introHintInteract: { en: 'learn at stations', vi: 'học tại các trạm' },
  inspiredBy: {
    en: 'Learning path inspired by “Your Next Step in AI” · charliehills.substack.com',
    vi: 'Lộ trình học lấy cảm hứng từ “Your Next Step in AI” · charliehills.substack.com',
  },
  step: { en: 'STEP', vi: 'BƯỚC' },
  stepOf: { en: 'of 11', vi: 'trên 11' },
  summitChip: { en: 'SUMMIT REACHED', vi: 'ĐÃ LÊN ĐỈNH' },
  learn: { en: 'Learn', vi: 'Học' },
  review: { en: 'Review', vi: 'Ôn lại' },
  challenge: { en: 'Your turn', vi: 'Đến lượt bạn' },
  tryToday: { en: 'Try it today', vi: 'Thử ngay hôm nay' },
  completeStep: { en: 'Complete this step', vi: 'Hoàn thành bước này' },
  completed: { en: 'Completed', vi: 'Đã hoàn thành' },
  close: { en: 'Close', vi: 'Đóng' },
  checkAnswer: { en: 'Check answer', vi: 'Kiểm tra đáp án' },
  tryAgain: { en: 'Try again', vi: 'Thử lại' },
  hint: { en: 'Hint', vi: 'Gợi ý' },
  run: { en: 'Run', vi: 'Chạy' },
  orderHint: { en: 'Tap the items in the right order', vi: 'Chạm các mục theo đúng thứ tự' },
  matchHint: { en: 'Tap an item on the left, then its match on the right', vi: 'Chạm một mục bên trái, rồi chạm mục khớp bên phải' },
  multiHint: { en: 'Select all that apply, then check', vi: 'Chọn tất cả đáp án đúng, rồi kiểm tra' },
  perfect: { en: 'Perfect!', vi: 'Tuyệt vời!' },
  notQuite: { en: 'Not quite — look at the feedback and try again.', vi: 'Chưa đúng — xem phản hồi rồi thử lại nhé.' },
  stepDone: { en: 'Step complete! The path ahead has opened.', vi: 'Hoàn thành! Con đường phía trước đã mở ra.' },
  bridgeOpen: { en: 'A new bridge materialized', vi: 'Một cây cầu mới vừa hiện ra' },
  interact: { en: 'Learn', vi: 'Học' },
  interactKey: { en: 'E', vi: 'E' },
  lockedStation: { en: 'Complete the previous steps first', vi: 'Hãy hoàn thành các bước trước đã' },
  journal: { en: 'Field notes', vi: 'Sổ tay hành trình' },
  journalEmpty: {
    en: 'Lessons you complete will be collected here — with their “try it today” actions.',
    vi: 'Các bài học bạn hoàn thành sẽ được lưu tại đây — kèm hành động “thử ngay hôm nay”.',
  },
  settings: { en: 'Settings', vi: 'Cài đặt' },
  sound: { en: 'Sound', vi: 'Âm thanh' },
  soundOn: { en: 'On', vi: 'Bật' },
  soundOff: { en: 'Off', vi: 'Tắt' },
  quality: { en: 'Graphics', vi: 'Đồ hoạ' },
  qualityHigh: { en: 'High', vi: 'Cao' },
  qualityLow: { en: 'Light', vi: 'Nhẹ' },
  language: { en: 'Language', vi: 'Ngôn ngữ' },
  resetProgress: { en: 'Reset progress', vi: 'Xoá tiến trình' },
  resetConfirm: {
    en: 'Erase all progress and start from the first island?',
    vi: 'Xoá toàn bộ tiến trình và bắt đầu lại từ hòn đảo đầu tiên?',
  },
  sparks: { en: 'sparks', vi: 'tia sáng' },
  summitTitle: { en: 'Summit reached', vi: 'Bạn đã lên tới đỉnh' },
  summitSub: {
    en: 'You climbed the whole ladder — from chatting with AI to systems that work while you sleep. Here is everything you now know how to do:',
    vi: 'Bạn đã leo trọn chiếc thang — từ trò chuyện với AI đến những hệ thống tự làm việc khi bạn ngủ. Đây là tất cả những gì giờ bạn đã biết cách làm:',
  },
  keepExploring: { en: 'Keep exploring', vi: 'Tiếp tục khám phá' },
  reviewJournal: { en: 'Open field notes', vi: 'Mở sổ tay hành trình' },
  nextObjective: { en: 'Next station', vi: 'Trạm kế tiếp' },
  toSummit: { en: 'To the summit beacon!', vi: 'Tiến về ngọn hải đăng trên đỉnh!' },
  welcomeBack: { en: 'Welcome back, climber', vi: 'Chào mừng trở lại, nhà leo núi' },
  fell: { en: 'Caught by the wind — back you go', vi: 'Cơn gió đã đỡ bạn — quay lại nào' },
  loading: { en: 'Shaping the islands…', vi: 'Đang kiến tạo những hòn đảo…' },
  levelLabel: { en: 'LEVEL', vi: 'CẤP' },
}

export function makeT(getLang: () => Lang) {
  return (key: keyof typeof STR | string): string => {
    const entry = STR[key as string]
    if (!entry) return String(key)
    return entry[getLang()]
  }
}
