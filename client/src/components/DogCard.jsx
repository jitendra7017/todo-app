/**
 * @param {{
 *   breed: string
 *   subBreeds: string[]
 *   onEdit: () => void
 *   onDelete: () => void
 * }} props
 */
export default function DogCard({ breed, subBreeds, onEdit, onDelete }) {
  return (
    <li className="dog-card">
      <div className="dog-card-body">
        <h3 className="dog-name">{breed}</h3>
        {subBreeds?.length > 0 ? (
          <ul className="sub-list">
            {subBreeds.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        ) : (
          <p className="muted no-subs">No sub-breeds</p>
        )}
      </div>
      <div className="dog-card-actions">
        <button type="button" className="btn small" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="btn small danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </li>
  )
}
