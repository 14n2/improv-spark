import { describe, expect, it } from 'vitest'
import data from '../src/data/locations.json'
import { parseLocations } from '../src/utils/locations'

describe('parseLocations', () => {
  it('loads exactly 40 unique Chinese prompts without surrounding whitespace', () => {
    const locations = parseLocations(data)
    expect(locations).toHaveLength(40)
    expect(new Set(locations).size).toBe(40)
    expect(locations).toEqual(data.locations)
    expect(locations.every((value) => /\p{Script=Han}/u.test(value))).toBe(true)
  })

  it('normalizes surrounding whitespace without mutating the input', () => {
    const input = { locations: data.locations.map((value) => ` ${value} `) }
    expect(parseLocations(input)).toEqual(data.locations)
    expect(input.locations[0]).toBe(` ${data.locations[0]} `)
  })

  it.each([null, undefined, [], '地点', {}, { locations: null }, { locations: {} }].map((input) => ({ input })))(
    'rejects invalid structure: %j',
    ({ input }) => expect(() => parseLocations(input)).toThrow(),
  )

  it.each([0, 1, 39, 41])('rejects %i entries', (count) => {
    expect(() => parseLocations({ locations: Array.from({ length: count }, (_, i) => `地点${i}`) })).toThrow()
  })

  it.each(['', '  ', 'Airport', 42, null, {}, false])('rejects invalid prompt: %j', (value) => {
    const locations = [...data.locations] as unknown[]
    locations[0] = value
    expect(() => parseLocations({ locations })).toThrow()
  })

  it('rejects duplicates after whitespace normalization', () => {
    const locations = [...data.locations]
    locations[1] = ` ${locations[0]} `
    expect(() => parseLocations({ locations })).toThrow('重复')
  })
})
