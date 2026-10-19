export interface ShuffleBag {
  draw: () => string
}

export function createShuffleBag(
  locations: readonly string[],
  random: () => number = Math.random,
): ShuffleBag {
  if (
    locations.length < 2 ||
    locations.some((location) => typeof location !== 'string' || !location.trim()) ||
    new Set(locations.map((location) => location.trim())).size !== locations.length
  ) {
    throw new Error('抽取至少需要两个互不重复的有效地点。')
  }

  // Own the source array so external changes cannot affect later cycles.
  const source = [...locations]
  let bag: string[] = []
  let position = 0
  let previous: string | undefined

  function refill(): void {
    bag = [...source]
    for (let index = bag.length - 1; index > 0; index -= 1) {
      const value = random()
      if (!Number.isFinite(value) || value < 0 || value >= 1) {
        throw new Error('随机数必须位于 [0, 1) 范围内。')
      }
      const other = Math.floor(value * (index + 1))
      ;[bag[index], bag[other]] = [bag[other], bag[index]]
    }

    if (bag[0] === previous) {
      ;[bag[0], bag[1]] = [bag[1], bag[0]]
    }
    position = 0
  }

  return {
    draw() {
      if (position === bag.length) refill()
      const result = bag[position]
      position += 1
      previous = result
      return result
    },
  }
}
