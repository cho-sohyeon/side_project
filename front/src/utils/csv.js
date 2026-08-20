// 따옴표로 감싼 필드(쉼표/줄바꿈 포함) 를 지원하는 최소 CSV 파서.
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.some((cell) => cell.trim() !== '')) {
        rows.push(row)
      }
      row = []
    } else {
      field += char
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    if (row.some((cell) => cell.trim() !== '')) {
      rows.push(row)
    }
  }
  return rows
}
