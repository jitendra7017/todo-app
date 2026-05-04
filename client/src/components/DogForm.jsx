/**
 * @param {{
 *   breed: string
 *   subBreedsText: string
 *   editingBreed: string | null
 *   saving: boolean
 *   loading: boolean
 *   onBreedChange: (v: string) => void
 *   onSubBreedsChange: (v: string) => void
 *   onSubmit: (e: import('react').FormEvent) => void
 *   onCancel: () => void
 *   onRefresh: () => void
 * }} props
 */
export default function DogForm({
  breed,
  subBreedsText,
  editingBreed,
  saving,
  loading,
  onBreedChange,
  onSubBreedsChange,
  onSubmit,
  onCancel,
  onRefresh,
}) {
  return (
    <section className="panel form-panel" aria-labelledby="form-title">
      <h2 id="form-title">{editingBreed ? 'Edit breed' : 'Add breed'}</h2>
      <form onSubmit={onSubmit} className="dog-form">
        <div className="field">
          <label htmlFor="breed">Breed key</label>
          <input
            id="breed"
            name="breed"
            value={breed}
            onChange={(e) => onBreedChange(e.target.value)}
            placeholder="e.g. pug, labrador"
            required
            autoComplete="off"
          />
          <span className="hint">Lowercase letters and numbers only; spaces are removed.</span>
        </div>
        <div className="field">
          <label htmlFor="subs">Sub-breeds (optional)</label>
          <textarea
            id="subs"
            name="subs"
            value={subBreedsText}
            onChange={(e) => onSubBreedsChange(e.target.value)}
            placeholder={'One per line, or comma-separated\ne.g. miniature\ntoy'}
            rows={4}
          />
        </div>
        <div className="actions">
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving…' : editingBreed ? 'Save changes' : 'Add breed'}
          </button>
          {editingBreed && (
            <button type="button" className="btn" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => onRefresh()}
            disabled={loading || saving}
          >
            Refresh list
          </button>
        </div>
      </form>
    </section>
  )
}
