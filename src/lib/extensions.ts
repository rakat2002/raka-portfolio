export type ExtensionKind = 'theme'

export interface ExtensionDef {
  id: string
  name: string
  publisher: string
  kind: ExtensionKind
  description: string
  /** The value written to data-theme when this theme is active. */
  themeDataValue: string
}

export const EXTENSIONS: ExtensionDef[] = [
  {
    id: 'theme-blackout',
    name: 'Obsidian Blackout',
    publisher: 'raka',
    kind: 'theme',
    description: 'A near-black workspace theme. Tabs, caret and accents stay pink.',
    themeDataValue: 'blackout',
  },
  {
    id: 'theme-babypink',
    name: 'Baby Pink',
    publisher: 'raka',
    kind: 'theme',
    description: 'A soft pink workspace with dark ash text and deep pink tabs.',
    themeDataValue: 'babypink',
  },
]