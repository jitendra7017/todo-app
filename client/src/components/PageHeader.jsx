export default function PageHeader() {
  return (
    <header className="app-header">
      <h1>Dog breeds</h1>
      <p className="lede">
        Create, read, update, and delete breeds. Data is stored in <code>server/data/dogs.json</code> so
        changes survive restarts.
      </p>
    </header>
  )
}
