/**
 * @param {{ message: string | null }} props
 */
export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="banner error" role="alert">
      {message}
    </div>
  )
}
