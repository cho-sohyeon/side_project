function FilterPresetList({ presets, onSelect }) {
  if (presets.length === 0) {
    return <p>저장된 프리셋이 없습니다.</p>
  }

  return (
    <div>
      <h4>저장된 프리셋</h4>
      <ul>
        {presets.map((preset) => (
          <li key={preset.presetId}>
            <button
              type="button"
              onClick={() =>
                onSelect({
                  startYearMonth: preset.startYearMonth || '',
                  endYearMonth: preset.endYearMonth || '',
                  categories: preset.categories ? preset.categories.split(',') : [],
                })
              }
            >
              {preset.presetName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FilterPresetList
