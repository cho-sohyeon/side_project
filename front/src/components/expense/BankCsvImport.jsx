import { useState } from 'react'
import { parseCsv } from '../../utils/csv'
import { saveExpensesBulk } from '../../api/expenseApi'
import { toDigits, formatWon } from '../../utils/format'

const DATE_HEADERS = ['날짜', '거래일시', '거래일', '일자']
const DESC_HEADERS = ['적요', '내용', '거래내용', '내역', '상대방']
const WITHDRAW_HEADERS = ['출금액', '출금', '지출금액']
const DEPOSIT_HEADERS = ['입금액', '입금', '수입금액']
const AMOUNT_HEADERS = ['거래금액', '금액']

function findColumnIndex(headers, candidates) {
  return headers.findIndex((header) => candidates.some((c) => header.replace(/\s/g, '').includes(c)))
}

function normalizeDate(raw) {
  const digits = (raw ?? '').replace(/[^0-9]/g, '')
  if (digits.length >= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
  }
  return new Date().toISOString().slice(0, 10)
}

// 은행/카드사마다 컬럼명이 조금씩 다르므로 흔한 컬럼명 패턴으로 자동 인식한다.
// 정확히 맞지 않는 CSV는 인식 결과가 0건일 수 있어 사용자가 직접 미리보기에서 확인/수정한다.
function parseBankCsv(text) {
  const rows = parseCsv(text)
  if (rows.length === 0) return []

  const headers = rows[0].map((h) => h.trim())
  const dateIdx = findColumnIndex(headers, DATE_HEADERS)
  const descIdx = findColumnIndex(headers, DESC_HEADERS)
  const withdrawIdx = findColumnIndex(headers, WITHDRAW_HEADERS)
  const depositIdx = findColumnIndex(headers, DEPOSIT_HEADERS)
  const amountIdx = findColumnIndex(headers, AMOUNT_HEADERS)

  const parsed = []
  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i]
    if (cols.length < 2) continue

    let amount = 0
    let transactionType = 'EXPENSE'

    if (withdrawIdx >= 0 || depositIdx >= 0) {
      const withdraw = Number(toDigits(cols[withdrawIdx] ?? '0'))
      const deposit = Number(toDigits(cols[depositIdx] ?? '0'))
      if (deposit > 0) {
        amount = deposit
        transactionType = 'INCOME'
      } else {
        amount = withdraw
        transactionType = 'EXPENSE'
      }
    } else if (amountIdx >= 0) {
      const raw = cols[amountIdx] ?? ''
      const negative = raw.trim().startsWith('-')
      amount = Math.abs(Number(toDigits(raw)))
      transactionType = negative ? 'EXPENSE' : 'INCOME'
    }

    if (!amount) continue

    parsed.push({
      expenseDesc: descIdx >= 0 ? (cols[descIdx] ?? '거래').trim() || '거래' : '거래',
      amount,
      expenseDate: dateIdx >= 0 ? normalizeDate(cols[dateIdx]) : normalizeDate(''),
      category: transactionType === 'EXPENSE' ? '기타' : null,
      isTrendRelated: false,
      transactionType,
      isSettlement: false,
    })
  }
  return parsed
}

function BankCsvImport({ onImported }) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [doneCount, setDoneCount] = useState(null)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setError(null)
    setDoneCount(null)
    const reader = new FileReader()
    reader.onload = () => {
      const parsed = parseBankCsv(String(reader.result))
      if (parsed.length === 0) {
        setError('CSV에서 거래 내역을 찾지 못했어요. 날짜/적요/출금액·입금액(또는 거래금액) 컬럼이 있는 파일인지 확인해주세요.')
      }
      setRows(parsed)
    }
    reader.onerror = () => setError('CSV 파일을 읽는 중 오류가 발생했어요.')
    reader.readAsText(file, 'utf-8')
    e.target.value = ''
  }

  function updateRowType(index, transactionType) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, transactionType, category: transactionType === 'EXPENSE' ? '기타' : null } : r)))
  }

  function removeRow(index) {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleImport() {
    setSaving(true)
    setError(null)
    try {
      await saveExpensesBulk(rows)
      setDoneCount(rows.length)
      setRows([])
      onImported && onImported()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card section">
      <h3 style={{ margin: 0 }}>은행 거래내역 CSV로 가져오기</h3>
      <p className="muted" style={{ margin: 0, fontSize: '12px' }}>
        인터넷뱅킹/은행 앱에서 내보낸 거래내역 CSV를 올리면 지출·수입을 자동 인식해요. 카테고리는 등록 후 거래입력 목록에서 수정할 수 있어요.
      </p>
      <input type="file" accept=".csv" onChange={handleFile} />
      {doneCount !== null && (
        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-strong)', margin: 0 }}>
          ✅ {doneCount}건 가져왔어요.
        </p>
      )}
      {error && <p className="error-text">{error}</p>}
      {rows.length > 0 && (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>내역</th>
                  <th>금액</th>
                  <th>구분</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.expenseDate}-${row.expenseDesc}-${index}`}>
                    <td>{row.expenseDate}</td>
                    <td>{row.expenseDesc}</td>
                    <td>{formatWon(row.amount)}</td>
                    <td>
                      <select value={row.transactionType} onChange={(e) => updateRowType(index, e.target.value)}>
                        <option value="EXPENSE">지출</option>
                        <option value="INCOME">수입</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => removeRow(index)}
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleImport} disabled={saving}>
            {saving ? '가져오는 중...' : `${rows.length}건 가져오기`}
          </button>
        </>
      )}
    </div>
  )
}

export default BankCsvImport
