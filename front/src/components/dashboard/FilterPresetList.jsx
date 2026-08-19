function FilterPresetList({ presets, onSelect }) {
  if (presets.length === 0) {
    return <p className="muted">저장된 프리셋이 없습니다.</p>
  }

  return (
    <div className="section">
      <h4>저장된 프리셋</h4>
      <div className="chip-list">
        {presets.map((preset) => (
          <button
            key={preset.presetId}
            type="button"
            className="chip"
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
        ))}
      </div>
    </div>
  )
}

export default FilterPresetList
