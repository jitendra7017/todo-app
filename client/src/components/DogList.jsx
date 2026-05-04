import DogCard from './DogCard'
import Pagination from './Pagination'

/**
 * @param {{
 *   dogs: { breed: string; subBreeds: string[] }[]
 *   loading: boolean
 *   total: number
 *   page: number
 *   pageSize: number
 *   onEdit: (dog: { breed: string; subBreeds: string[] }) => void
 *   onDelete: (breed: string) => void
 *   onPreviousPage: () => void
 *   onNextPage: () => void
 * }} props
 */
export default function DogList({
  dogs,
  loading,
  total,
  page,
  pageSize,
  onEdit,
  onDelete,
  onPreviousPage,
  onNextPage,
}) {
  return (
    <section className="panel list-panel" aria-labelledby="list-title">
      <h2 id="list-title">All breeds</h2>
      {loading && <p className="muted">Loading…</p>}
      {!loading && total === 0 && <p className="muted">No breeds yet. Add one above.</p>}
      {!loading && total > 0 && dogs.length === 0 && (
        <p className="muted">No breeds on this page.</p>
      )}
      {!loading && dogs.length > 0 && (
        <ul className="dog-list">
          {dogs.map((d) => (
            <DogCard
              key={d.breed}
              breed={d.breed}
              subBreeds={d.subBreeds}
              onEdit={() => onEdit(d)}
              onDelete={() => onDelete(d.breed)}
            />
          ))}
        </ul>
      )}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        loading={loading}
        onPrevious={onPreviousPage}
        onNext={onNextPage}
      />
    </section>
  )
}
