import { useCallback, useEffect, useState } from 'react'
import { createDog, deleteDog, listDogs, updateDog } from '../services/dogsApi'
import { parseSubBreeds } from '../utils/parseSubBreeds'
import DogForm from '../components/DogForm'
import DogList from '../components/DogList'
import ErrorBanner from '../components/ErrorBanner'
import PageHeader from '../components/PageHeader'

const PAGE_SIZE = 20

export default function DogsPage() {
  const [dogs, setDogs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [breed, setBreed] = useState('')
  const [subBreedsText, setSubBreedsText] = useState('')
  const [editingBreed, setEditingBreed] = useState(null)
  const [saving, setSaving] = useState(false)

  const refetchList = useCallback(async () => {
    setReloadKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const offset = page * PAGE_SIZE
        const data = await listDogs({ limit: PAGE_SIZE, offset })
        if (cancelled) return
        const rows = data.dogs || []
        const newTotal = data.total ?? 0
        if (rows.length === 0 && page > 0) {
          setPage((p) => p - 1)
          return
        }
        setDogs(rows)
        setTotal(newTotal)
        setError(null)
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Failed to load dogs')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [page, reloadKey])

  function startEdit(d) {
    setEditingBreed(d.breed)
    setBreed(d.breed)
    setSubBreedsText((d.subBreeds || []).join('\n'))
  }

  function cancelEdit() {
    setEditingBreed(null)
    setBreed('')
    setSubBreedsText('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const subBreeds = parseSubBreeds(subBreedsText)
    try {
      if (editingBreed) {
        const payload = { subBreeds }
        if (breed.trim() && breed.trim() !== editingBreed) {
          payload.breed = breed.trim()
        }
        await updateDog(editingBreed, payload)
      } else {
        await createDog({ breed: breed.trim(), subBreeds })
      }
      cancelEdit()
      await refetchList()
    } catch (e) {
      setError(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(b) {
    if (!window.confirm(`Delete breed “${b}”? This cannot be undone.`)) return
    setError(null)
    try {
      await deleteDog(b)
      if (editingBreed === b) cancelEdit()
      await refetchList()
    } catch (e) {
      setError(e.message || 'Delete failed')
    }
  }

  return (
    <div className="app">
      <PageHeader />
      <ErrorBanner message={error} />
      <DogForm
        breed={breed}
        subBreedsText={subBreedsText}
        editingBreed={editingBreed}
        saving={saving}
        loading={loading}
        onBreedChange={setBreed}
        onSubBreedsChange={setSubBreedsText}
        onSubmit={handleSubmit}
        onCancel={cancelEdit}
        onRefresh={refetchList}
      />
      <DogList
        dogs={dogs}
        loading={loading}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        onEdit={startEdit}
        onDelete={handleDelete}
        onPreviousPage={() => setPage((p) => Math.max(0, p - 1))}
        onNextPage={() => setPage((p) => p + 1)}
      />
    </div>
  )
}
