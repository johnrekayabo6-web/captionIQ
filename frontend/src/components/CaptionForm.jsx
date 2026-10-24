import { useEffect, useRef, useState } from 'react'
import { captions } from '../utils/captions'

export default function CaptionForm({
  photo,
  context,
  loading,
  error,
  onPhotoChange,
  onContextChange,
}) {
  const [imagePreview, setImagePreview] = useState(null)
  const previewUrlRef = useRef(null)

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  function handlePhotoChange(event) {
    const selectedPhoto = event.target.files?.[0] ?? null
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)

    previewUrlRef.current = selectedPhoto ? URL.createObjectURL(selectedPhoto) : null
    setImagePreview(previewUrlRef.current)
    onPhotoChange(selectedPhoto)
  }

  return (
    <section className="panel caption-form-panel">
      <label className="photo-upload">
        {imagePreview && <img className="photo-preview" src={imagePreview} alt="Selected photo preview" />}
        <strong>{photo ? photo.name : 'Drop a photo here or click to choose'}</strong>
        <span>JPG, PNG, or WebP up to 5 MB</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
        />
      </label>

      <label className="form-label" htmlFor="context">What&apos;s the story behind this photo?</label>
      <textarea
        id="context"
        value={context}
        onChange={(event) => onContextChange(event.target.value)}
        placeholder="e.g First day at my new job, or Sunday service with my family"
        rows="6"
      />
      <div className="context-hint">
        Optional, but captions get far more specific with it.
      </div>
      <div className="caption-examples" aria-label="Caption examples">
        {captions.map((captions) => <span key={captions}>{captions}</span>)}
      </div>

      <button type="submit" disabled={!photo || loading}>
        {loading ? 'Writing...' : 'Write my captions'}
      </button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  )
}
