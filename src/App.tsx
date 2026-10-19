import { PromptCard } from './components/PromptCard'
import locationData from './data/locations.json'
import { usePromptDraw } from './hooks/usePromptDraw'
import { parseLocations } from './utils/locations'

function loadLocations(): { locations: readonly string[] | null; error: string | null } {
  try {
    return { locations: parseLocations(locationData), error: null }
  } catch (error) {
    return { locations: null, error: error instanceof Error ? error.message : '地点词库配置错误。' }
  }
}

const { locations, error } = loadLocations()

function App() {
  const { state, draw } = usePromptDraw(locations)
  const animating = state.status === 'animating'

  return (
    <main className="flex min-h-screen min-h-svh items-center justify-center px-5 py-10 sm:py-16">
      <div className="w-full max-w-[30rem] text-center">
        <header className="mb-9 sm:mb-11">
          <span aria-hidden="true" className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-spark-pink/60 text-2xl">✳</span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Improv Spark</h1>
          <p className="mt-3 text-sm leading-relaxed text-spark-text/70 sm:text-base">给即兴一点灵感，让故事自然发生。</p>
        </header>

        <PromptCard state={state} error={error} />

        <button
          type="button"
          disabled={animating || Boolean(error)}
          onClick={draw}
          className="mt-7 flex min-h-13 w-full items-center justify-center gap-3 rounded-2xl bg-spark-primary px-6 py-4 text-base font-semibold text-spark-text transition-colors hover:bg-spark-primary/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-spark-text disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
        >
          {animating ? '正在抽取…' : '抽取地点'}
          <span aria-hidden="true">{animating ? '· · ·' : '↗'}</span>
        </button>

        <p role="status" aria-atomic="true" className="sr-only">
          {error ?? (animating ? '正在抽取地点' : state.status === 'revealed' ? `抽取结果：${state.prompt}` : '点击抽取地点，开始即兴')}
        </p>
        {error && <p role="alert" className="mt-4 text-sm">{error}</p>}
        <p className="mt-5 text-xs leading-relaxed text-spark-text/70">不必想好故事，先从一个地点出发。</p>
      </div>
    </main>
  )
}

export default App
