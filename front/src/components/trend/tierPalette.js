export function tierColors() {
  return { background: '#FFF0C2', text: '#5C3D00' }
}

export function extractDomain(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
