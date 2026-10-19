import { describe, expect, it, vi } from 'vitest'
import data from '../src/data/locations.json'
import { createShuffleBag } from '../src/utils/shuffle'

function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

describe('createShuffleBag', () => {
  it.each([0, 1, 42, 123456])('covers 20 complete cycles with seed %i', (seed) => {
    const bag = createShuffleBag(data.locations, seededRandom(seed))
    let last: string | undefined
    for (let cycle = 0; cycle < 20; cycle += 1) {
      const results = Array.from({ length: 40 }, () => bag.draw())
      expect(results[0]).not.toBe(last)
      expect(new Set(results).size).toBe(40)
      expect([...results].sort()).toEqual([...data.locations].sort())
      last = results.at(-1)
    }
  })

  it('uses Fisher–Yates and only refills after exactly 40 draws', () => {
    const random = vi.fn(() => 0)
    const bag = createShuffleBag(data.locations, random)
    expect(random).not.toHaveBeenCalled()
    const firstCycle = Array.from({ length: 40 }, () => bag.draw())
    expect(firstCycle).toEqual([...data.locations.slice(1), data.locations[0]])
    expect(random).toHaveBeenCalledTimes(39)
    expect(bag.draw()).not.toBe(firstCycle[39])
    expect(random).toHaveBeenCalledTimes(78)
  })

  it('repairs a forced cycle-boundary repetition without losing any items', () => {
    const values = [0.999, 0.999, 0, 0.999]
    const bag = createShuffleBag(['甲', '乙', '丙'], () => values.shift() ?? 0)
    expect([bag.draw(), bag.draw(), bag.draw()]).toEqual(['甲', '乙', '丙'])
    // Second shuffle would start with 丙; swapping the first two repairs it.
    expect([bag.draw(), bag.draw(), bag.draw()]).toEqual(['乙', '丙', '甲'])
    const pairValues = [0.999, 0]
    const pair = createShuffleBag(['甲', '乙'], () => pairValues.shift() ?? 0)
    expect([pair.draw(), pair.draw(), pair.draw(), pair.draw()]).toEqual(['甲', '乙', '甲', '乙'])
  })

  it('handles the upper RNG bound and preserves the source across refills', () => {
    const input = [...data.locations]
    const bag = createShuffleBag(input, () => 1 - Number.EPSILON)
    expect(bag.draw()).toBe(data.locations[0])
    expect(input).toEqual(data.locations)
    input.fill('已修改')
    const rest = Array.from({ length: 79 }, () => bag.draw())
    expect(rest.every((value) => data.locations.includes(value))).toBe(true)
  })

  it('starts a fresh cycle for every new instance', () => {
    const first = createShuffleBag(data.locations, () => 0)
    first.draw()
    first.draw()
    const fresh = createShuffleBag(data.locations, () => 0)
    expect(fresh.draw()).toBe(data.locations[1])
  })

  it.each([[], ['甲'], ['甲', '甲'], ['甲', ' 甲 '], ['甲', ' ']].map((input) => ({ input })))('rejects invalid bags: %j', ({ input }) => {
    expect(() => createShuffleBag(input)).toThrow()
  })

  it.each([-0.01, 1, NaN, Infinity])('rejects invalid RNG output: %s', (value) => {
    expect(() => createShuffleBag(['甲', '乙'], () => value).draw()).toThrow('随机数')
  })
})
