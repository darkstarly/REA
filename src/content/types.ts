// The shape of the course. Course text lives in course.ts; nothing else in the app hard-codes lesson content.

/** One phrase: Hindi in Devanagari, romanised, and its English meaning */
export type Text = {
  hi: string
  rom: string
  en: string
  /** other ways of saying it that count as correct (Devanagari or English letters) */
  accept?: string[]
}

/**
 * A phrase that may depend on the learner. `fem` replaces it when the learner chose feminine forms (Hindi verbs and
 * adjectives agree with the speaker's gender, and people address women with different forms too).
 * `{name}` in any field is replaced with the learner's first name.
 */
export type Phrase = Text & { fem?: Partial<Text> }

export type Line =
  /** the character speaks */
  | ({ who: 'them' } & Phrase)
  /** the learner speaks */
  | ({ who: 'you' } & Phrase)

export type Character = {
  name: string
  /** who they are to the learner, e.g. "your neighbour" */
  role: string
  /** shown large in the scene */
  emoji: string
  /** used to pick a Hindi voice that suits them, where the device has a choice */
  voice: 'female' | 'male'
}

export type Lesson = {
  id: string
  title: string
  /** one line under the title */
  subtitle: string
  /** sets the scene before the lesson starts */
  scene: string
  /** two colours for the scene's background gradient */
  colors: [string, string]
  /** small props drawn in the scene */
  props: string[]
  character: Character
  /** phrases practised (listen and repeat) before the conversation */
  learn: Phrase[]
  conversation: Line[]
  /** a short note on usage or culture, shown when the lesson is finished */
  tip: string
  /**
   * Optional video of the character, one clip per conversation line the character says (in order), when you
   * have them. Without clips the character is shown as an illustration and the line is read aloud.
   */
  clips?: string[]
}

export type Unit = {
  id: string
  title: string
  /** the unit's title in Hindi */
  hi: string
  lessons: Lesson[]
}
