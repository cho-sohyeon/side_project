const TIER_LABELS = {
  NONE: '절약 없음',
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
}

function TierBadge({ tier, savingsRate }) {
  const ratePercent = (Number(savingsRate) * 100).toFixed(1)
  return (
    <div>
      <h3>현재 티어: {TIER_LABELS[tier] ?? tier}</h3>
      <p>절약률: {ratePercent}%</p>
    </div>
  )
}

export default TierBadge
