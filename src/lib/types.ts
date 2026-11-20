/** Kairo — tipos centrales (chat-first) */

// ---------------------------------------------------------------------------
// Onboarding mínimo
// ---------------------------------------------------------------------------
/** Respuestas del paso ICP (captación de clientes) */
export interface IcpAnswers {
  buyerWho: string
  pain: string
  offer: string
  price: string
  antiIcp: string
  objections: string
  proof: string
  channels: string
}

export interface OnboardingData {
  handle: string
  xPreview?: unknown
  startedAt?: string
  version: number
  intakeCompletedAt?: string
  icpCompletedAt?: string
  icp?: IcpAnswers
  voiceProfile?: VoiceProfile
  favoriteCreators?: string[]
  niche?: string
  interests?: string[]
  timezone?: string
  hasArchive?: boolean
}

// ---------------------------------------------------------------------------
// Queue
// ---------------------------------------------------------------------------
export type QueueItemStatus = 'draft' | 'scheduled' | 'posted'

export type FunnelStage = 'TOF' | 'MOF' | 'BOF'

export interface QueueItem {
  id: string
  hook: string
  body: string
  format: string
  status: QueueItemStatus
  sourceUrl?: string
  createdAt: string
  scheduledAt?: string
  postedAt?: string
  funnelStage?: FunnelStage
  why?: string
  /** Feedback explícito del cliente sobre este tweet (persiste en UI). */
  verdict?: 'like' | 'dislike'
}

/** Perfil de voz ligero (sin Cerebro) — exemplars desde posts X */
export interface VoiceProfile {
  handle: string
  tone: string
  exemplars: string[]
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Intake — bloques Notion + negocio P0 → Cerebro
// ---------------------------------------------------------------------------
export type IntakeQuestionId =
  | 'q1' | 'q2' | 'q3' | 'q4' | 'q5'
  | 'q6' | 'q7' | 'q8' | 'q9' | 'q10'
  | 'q11' | 'q12' | 'q13' | 'q14' | 'q15' | 'q16'

export type IntakeBlockId = 'A' | 'B' | 'C' | 'D' | 'E'
export type IntakeBlockStatus = 'empty' | 'draft' | 'done'

export interface IntakeAnswers {
  version: 1
  handle: string
  updatedAt: string
  completedAt?: string
  answers: Record<IntakeQuestionId, string>
  blockStatus: Record<IntakeBlockId, IntakeBlockStatus>
}

// ---------------------------------------------------------------------------
// Cerebro — 8 documentos planos (root)
// ---------------------------------------------------------------------------
export type CerebroDocId =
  | 'proposito'
  | 'posicionamiento'
  | 'comunidad'
  | 'roadmap'
  | 'negocio'
  | 'icp'
  | 'branding'
  | 'formatos'

export type CerebroFolder = 'root'

export type CerebroStatus = 'vacio' | 'borrador' | 'generando' | 'completo'

export const CEREBRO_COMPLETE_MIN_LINES = 500

/** @deprecated solo compat lectura */
export interface CerebroBloque {
  id: string
  label: string
  text: string
  audience?: 'user' | 'kairo'
}

export interface CerebroDoc {
  id: CerebroDocId
  folder: CerebroFolder
  title: string
  desc: string
  status: CerebroStatus
  content: {
    markdown: string
    raw?: string
    bloques?: CerebroBloque[]
  }
  updatedAt: string
  seedPath?: string
}

export interface CerebroContextSource {
  docId: CerebroDocId
  title: string
  folder: CerebroFolder
  lines: number
  chars: number
  truncated?: boolean
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
export interface EstrategaMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
  contextSources?: CerebroContextSource[]
}

export type CerebroUpdateEvent = {
  type: 'cerebro_update'
  docId: CerebroDocId
  markdown: string
}

export type ContextReadEvent = {
  type: 'context_read'
  docId: CerebroDocId
  title: string
  folder: CerebroFolder
  lines: number
  chars: number
}

export type ContextReadyEvent = {
  type: 'context_ready'
  sources: CerebroContextSource[]
  totalDocs: number
  totalChars: number
}

export type CerebroGeneratingEvent = {
  type: 'cerebro_generating'
  docId: CerebroDocId
}

// ---------------------------------------------------------------------------
// Ideas + Outliers
// ---------------------------------------------------------------------------
export interface IdeaSource {
  handle: string
  url: string
  engagement: number
  excerpt: string
  viralityScore?: number
  zScore?: number
}

export interface ViralityBreakdown {
  score: number
  source: 'jev' | 'heuristic'
  icpFit: number
  novelty: number
  viralPotential: number
  labels?: {
    novelty?: string
    viral?: string
  }
}

export interface IdeaCandidate {
  id: string
  title: string
  hook: string
  angle: string
  formato: string
  pilar: string
  why: string
  /** Qué se tomó del outlier (transparencia). */
  inspiredNote?: string
  /** Id del outlier de origen (Inspirarme). */
  inspiredFrom?: string
  jugada: 'reempaquetar' | 'original'
  sources: IdeaSource[]
  crossFrom?: [string, string]
  /** 0–100 viralidad estimada (JEV) */
  viralityScore?: number
  virality?: ViralityBreakdown
}

export interface OutlierTweet {
  id: string
  author: string
  handle: string
  text: string
  hook: string
  likes: number
  retweets: number
  engagement: number
  url: string
  isOutlier?: boolean
  zScore?: number
  source?: 'rival' | 'own'
  viralityScore?: number
}

export interface CrossPattern {
  id: string
  handleA: string
  handleB: string
  hookA: string
  hookB: string
  suggestedAngle: string
}

export interface RefinarMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

export type DraftUpdateEvent = {
  type: 'draft_update'
  refinedHook: string
  draftPost: string
}
