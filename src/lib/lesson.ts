/** First-run product lesson — localStorage only, never hits API/DB. */

const LESSON_KEY = 'kairo:lessonCompleted'

export function getLessonCompleted(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false
  try {
    return window.localStorage.getItem(LESSON_KEY) === '1'
  } catch {
    return false
  }
}

export function setLessonCompleted(): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(LESSON_KEY, '1')
    window.dispatchEvent(new CustomEvent('kairo:changed', { detail: { key: 'lessonCompleted' } }))
  } catch {
    /* quota */
  }
}

export function clearLessonCompleted(): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.removeItem(LESSON_KEY)
  } catch {
    /* ignore */
  }
}
