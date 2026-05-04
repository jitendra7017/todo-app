/**
 * @param {{
 *   page: number
 *   pageSize: number
 *   total: number
 *   loading: boolean
 *   onPrevious: () => void
 *   onNext: () => void
 * }} props
 */
export default function Pagination({ page, pageSize, total, loading, onPrevious, onNext }) {
  if (total <= 0) return null

  const start = page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, total)
  const canPrev = page > 0 && !loading
  const canNext = end < total && !loading

  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination-summary muted">
        Showing {start}–{end} of {total}
      </span>
      <div className="pagination-actions">
        <button type="button" className="btn small" onClick={onPrevious} disabled={!canPrev}>
          Previous
        </button>
        <button type="button" className="btn small" onClick={onNext} disabled={!canNext}>
          Next
        </button>
      </div>
    </nav>
  )
}
