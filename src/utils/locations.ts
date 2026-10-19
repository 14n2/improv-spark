export function parseLocations(data: unknown): readonly string[] {
  if (typeof data !== 'object' || data === null || !('locations' in data)) {
    throw new Error('地点词库格式错误。')
  }

  const { locations } = data
  if (!Array.isArray(locations) || locations.length !== 40) {
    throw new Error('地点词库必须恰好包含 40 条地点。')
  }

  const normalized = locations.map((location: unknown) => {
    if (typeof location !== 'string' || !/\p{Script=Han}/u.test(location.trim())) {
      throw new Error('每条地点必须是非空中文文本。')
    }
    return location.trim()
  })

  if (new Set(normalized).size !== normalized.length) {
    throw new Error('地点词库不能包含重复地点。')
  }

  return normalized
}
