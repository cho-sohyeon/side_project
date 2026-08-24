import { useState } from 'react'
import { changePassword, deleteAccount } from '../../api/accountApi'

function AccountSettings({ onAccountDeleted }) {
  const [open, setOpen] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState(null)
  const [pwDone, setPwDone] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  async function handleChangePassword() {
    setPwError(null)
    setPwDone(false)
    if (newPassword.length < 8) {
      setPwError('새 비밀번호는 8자 이상이어야 합니다.')
      return
    }
    setPwSaving(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setPwDone(true)
    } catch (e) {
      setPwError(e.message)
    } finally {
      setPwSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteError(null)
    setDeleting(true)
    try {
      await deleteAccount(deletePassword)
      onAccountDeleted && onAccountDeleted()
    } catch (e) {
      setDeleteError(e.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          border: 'none',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          padding: 0,
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--color-text)',
        }}
      >
        🔒 계정 설정
        <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{open ? '접기 ▲' : '펼치기 ▼'}</span>
      </button>

      {open && (
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 8px' }}>비밀번호 변경</p>
            <div className="field">
              <label>현재 비밀번호</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="field">
              <label>새 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8자 이상"
                autoComplete="new-password"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleChangePassword}
              disabled={pwSaving || !currentPassword || !newPassword}
            >
              {pwSaving ? '변경 중...' : '비밀번호 변경'}
            </button>
            {pwDone && (
              <p style={{ fontSize: '12px', color: 'var(--accent-strong)', fontWeight: 700, margin: '8px 0 0' }}>
                ✅ 비밀번호가 변경됐어요.
              </p>
            )}
            {pwError && <p className="error-text" style={{ margin: '8px 0 0' }}>{pwError}</p>}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 8px', color: 'var(--color-danger)' }}>
              회원 탈퇴
            </p>
            {!deleteOpen ? (
              <button
                type="button"
                className="btn"
                onClick={() => setDeleteOpen(true)}
                style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
              >
                계정 삭제하기
              </button>
            ) : (
              <>
                <p className="muted" style={{ fontSize: '11px', margin: '0 0 8px' }}>
                  계정과 모든 지출/프로필 데이터가 영구적으로 삭제되며 되돌릴 수 없어요. 비밀번호를 입력해 확인해주세요.
                </p>
                <div className="field">
                  <label>비밀번호</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleDeleteAccount}
                    disabled={deleting || !deletePassword}
                    style={{ background: 'var(--color-danger)', borderColor: 'var(--color-danger)', color: '#fff' }}
                  >
                    {deleting ? '삭제 중...' : '정말 삭제할게요'}
                  </button>
                  <button type="button" className="btn" onClick={() => setDeleteOpen(false)}>
                    취소
                  </button>
                </div>
                {deleteError && <p className="error-text" style={{ margin: '8px 0 0' }}>{deleteError}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountSettings
