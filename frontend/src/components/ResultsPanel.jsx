import { useEffect, useState } from 'react'
import { platforms } from '../utils/platforms'

export default function ResultsPanel({ results, loading }) {
  const [copiedKey, setCopiedKey] = useState(null)
  const [copyErrorKey, setCopyErrorKey] = useState(null)

  useEffect(() => {
    if (!copiedKey) return

    const timer = window.setTimeout(() => {
      setCopiedKey(null)
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [copiedKey])

  async function handleCopy(key, text) {
    setCopiedKey(null)
    setCopyErrorKey(null)

    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
    } catch {
      setCopyErrorKey(key)
    }
  }

  return (
    <section className="panel results-panel" aria-live="polite">
      <p className="results-heading">Your captions</p>

      <div className="results-scroll-area">
        {!results && !loading && (
          <div className="results-empty-state">
            <strong>Nothing yet</strong>
            <span>Add a photo to get started.</span>

            <div className="platform-badges" aria-label="Caption platforms">
              {platforms.map(([, label]) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="caption-loading-list">
            {platforms.map(([, label]) => (
              <div className="caption-loading-card" key={label}>
                <strong>{label}</strong>
                <span />
              </div>
            ))}
          </div>
        )}

        {results && (
          <div className="caption-result-list">
            {platforms.map(([key, label]) => (
              <article className="caption-result-card" key={key}>
                <div className="caption-card-header">
                  <strong>{label}</strong>

                  <button
                    className="copy-caption-button"
                    type="button"
                    aria-label={`Copy ${label} caption`}
                    title={`Copy ${label} caption`}
                    onClick={() => handleCopy(key, results[key].text)}
                  >
                    {copiedKey === key ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <p>{results[key].text}</p>

                <small>{results[key].character_count} characters</small>

                {copiedKey === key && (
                  <span className="copy-feedback" role="status">
                    Caption copied to clipboard.
                  </span>
                )}

                {copyErrorKey === key && (
                  <span className="copy-error" role="alert">
                    Couldn't copy automatically. Please select and copy the
                    caption text manually.
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}