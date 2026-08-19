function ExpenseList({ expenses }) {
  return (
    <div className="card section">
      <h2>지출 기록 목록</h2>
      {expenses.length === 0 ? (
        <p className="muted">등록된 지출 기록이 없습니다.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="simple-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>내역</th>
                <th>금액</th>
                <th>카테고리</th>
                <th>트렌드 관련</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.expenseId}>
                  <td>{expense.expenseDate}</td>
                  <td>{expense.expenseDesc}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.category}</td>
                  <td>{expense.isTrendRelated ? 'Y' : 'N'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ExpenseList
