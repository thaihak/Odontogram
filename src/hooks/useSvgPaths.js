import { useState, useEffect } from 'react'

const cache = new Map()

async function fetchSvg(url) {
  if (cache.has(url)) return cache.get(url)
  const stored = localStorage.getItem(`svg_cache_${url}`)
  if (stored) {
    const parsed = parseSvg(stored)
    cache.set(url, parsed)
    return parsed
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch SVG: ${url}`)
  const text = await res.text()
  try { localStorage.setItem(`svg_cache_${url}`, text) } catch (_) {}
  const parsed = parseSvg(text)
  cache.set(url, parsed)
  return parsed
}

function parseSvg(text) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'image/svg+xml')
  const svgEl = doc.querySelector('svg')
  const viewBox = svgEl?.getAttribute('viewBox') ?? '0 0 180 320'
  const width = svgEl?.getAttribute('width') ?? '180'
  const height = svgEl?.getAttribute('height') ?? '320'
  const paths = Array.from(doc.querySelectorAll('path')).map(p => ({
    d: p.getAttribute('d') ?? '',
    fill: p.getAttribute('fill') ?? 'none',
    id: p.getAttribute('id') ?? '',
    name: p.getAttribute('name') ?? '',
  }))
  return { viewBox, width, height, paths }
}

export function useSvgPaths(url) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    fetchSvg(url)
      .then(d => { if (!cancelled) setData(d) })
      .catch(e => { if (!cancelled) setError(e) })
    return () => { cancelled = true }
  }, [url])

  return { data, error }
}
