import type { DrawState } from '../hooks/usePromptDraw'

interface PromptCardProps {
  state: DrawState
  error: string | null
}

export function PromptCard({ state, error }: PromptCardProps) {
  const animating = state.status === 'animating'

  return (
    <section
      aria-label="地点提示卡片"
      aria-busy={animating}
      className="relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-3xl border border-white bg-white px-5 py-12 shadow-[0_12px_48px_-20px_#9b9fc060] sm:min-h-80 sm:px-8"
    >
      <span aria-hidden="true" className="absolute top-5 right-6 text-2xl text-spark-primary">✦</span>
      <span className="mb-6 rounded-full bg-spark-mint/40 px-4 py-1 text-sm font-medium tracking-widest">地点</span>
      <p
        aria-hidden={animating}
        className={`w-full text-center text-[clamp(2rem,7vw,2.5rem)] leading-relaxed font-semibold wrap-anywhere ${animating ? 'text-spark-text/60' : ''}`}
      >
        {error ? '暂时无法抽取' : state.prompt ?? '故事，从哪里开始？'}
      </p>
      <p className="mt-5 text-sm leading-relaxed text-spark-text/70">
        {error ? '请检查地点词库配置' : animating ? '灵感正在路上…' : state.status === 'idle' ? '一个地点，无限种可能' : '让这个地点，成为故事的起点'}
      </p>
    </section>
  )
}
