const AGE_HOUSEHOLD_OPTIONS = [
  { value: 'YOUTH', label: '청년' },
  { value: 'NEWLYWED', label: '신혼부부' },
  { value: 'OTHER', label: '기타' },
]

const LIVING_TYPE_OPTIONS = [
  { value: 'INDEPENDENT', label: '독립함' },
  { value: 'WITH_PARENTS', label: '부모님과 거주' },
]

function BasicInfoForm({ value, onChange }) {
  return (
    <div>
      <h3>기본 정보</h3>
      <div>
        <label>연령대/가구 유형</label>
        {AGE_HOUSEHOLD_OPTIONS.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="ageHouseholdType"
              checked={value.ageHouseholdType === option.value}
              onChange={() => onChange({ ...value, ageHouseholdType: option.value })}
            />
            {option.label}
          </label>
        ))}
      </div>
      <div>
        <label>청약통장 보유 여부</label>
        <label>
          <input
            type="radio"
            name="hasSubscriptionAccount"
            checked={value.hasSubscriptionAccount === true}
            onChange={() => onChange({ ...value, hasSubscriptionAccount: true })}
          />
          있음
        </label>
        <label>
          <input
            type="radio"
            name="hasSubscriptionAccount"
            checked={value.hasSubscriptionAccount === false}
            onChange={() => onChange({ ...value, hasSubscriptionAccount: false })}
          />
          없음
        </label>
      </div>
      <div>
        <label>독립 여부</label>
        {LIVING_TYPE_OPTIONS.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="livingType"
              checked={value.livingType === option.value}
              onChange={() => onChange({ ...value, livingType: option.value })}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  )
}

export default BasicInfoForm
export { AGE_HOUSEHOLD_OPTIONS, LIVING_TYPE_OPTIONS }
