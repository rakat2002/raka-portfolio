import { profile, type Profile, type Project } from './profile'

export type Language = 'markdown' | 'typescript' | 'tsx'

export interface FileNode {
  kind: 'file'
  path: string
  name: string
  language: Language
  content: string
}

export interface FolderNode {
  kind: 'folder'
  path: string
  name: string
  children: TreeNode[]
}

export type TreeNode = FileNode | FolderNode

export const LANGUAGE_LABELS: Record<Language, string> = {
  markdown: 'Markdown',
  typescript: 'TypeScript',
  tsx: 'TypeScript JSX',
}

export const README_PATH = 'README.md'

// ---------- small helpers ----------

const quote = (value: string) => JSON.stringify(value)

function arrayLiteral(items: string[], indent: number): string {
  if (items.length === 0) return '[]'
  const pad = ' '.repeat(indent)
  const inner = items.map((item) => `${pad}  ${quote(item)},`).join('\n')
  return `[\n${inner}\n${pad}]`
}

function languageOf(name: string): Language {
  if (name.endsWith('.tsx')) return 'tsx'
  if (name.endsWith('.ts')) return 'typescript'
  return 'markdown'
}

const file = (path: string, content: string): FileNode => {
  const name = path.split('/').pop() ?? path
  return { kind: 'file', path, name, language: languageOf(name), content }
}

const folder = (path: string, children: TreeNode[]): FolderNode => ({
  kind: 'folder',
  path,
  name: path.split('/').pop() ?? path,
  children,
})

// ---------- file contents, built from profile.ts ----------

function readme(p: Profile): string {
  const firstName = p.name.split(' ')[0]
  return [
    `# Hello, I'm ${firstName}.`,
    '',
    p.role,
    p.interests.join(' · '),
    '',
    '────────────────────────────',
    '',
    'Welcome to my developer workspace.',
    '',
    "This isn't a traditional portfolio.",
    "You're currently inside my codebase.",
    '',
    'Explore the files on the left,',
    'or open the terminal below.',
    '',
    '$ help',
  ].join('\n')
}

function aboutMe(p: Profile): string {
  return [
    'const developer = {',
    `  name: ${quote(p.name)},`,
    `  role: ${quote(p.role)},`,
    `  location: ${quote(p.location)},`,
    `  interests: ${arrayLiteral(p.interests, 2)},`,
    `  currentlyLearning: ${arrayLiteral(p.currentlyLearning, 2)},`,
    '};',
    '',
    'export default developer;',
  ].join('\n')
}

function interestsMarkdown(p: Profile): string {
  return [
    '# Interests',
    '',
    ...p.interests.map((item) => `- ${item}`),
    '',
    '## Currently learning',
    '',
    ...p.currentlyLearning.map((item) => `- ${item}`),
  ].join('\n')
}

function projectSource(project: Project): string {
  return [
    'export const project = {',
    `  name: ${quote(project.name)},`,
    `  description: ${quote(project.description)},`,
    `  technologies: ${arrayLiteral(project.technologies, 2)},`,
    `  features: ${arrayLiteral(project.features, 2)},`,
    `  github: ${quote(project.github)},`,
    `  liveDemo: ${quote(project.liveDemo)},`,
    '};',
  ].join('\n')
}

function skillList(name: string, items: string[]): string {
  const lines = [`export const ${name}: string[] = ${arrayLiteral(items, 0)};`]
  if (items.length === 0) lines.push('', '// TODO: add these in src/data/profile.ts')
  return lines.join('\n')
}

function experienceMarkdown(p: Profile): string {
  if (p.experience.length === 0) {
    return ['# Experience', '', '_TODO: add your experience in src/data/profile.ts_'].join('\n')
  }
  return [
    '# Experience',
    ...p.experience.flatMap((item) => [
      '',
      `## ${item.role} — ${item.organization}`,
      item.period,
      '',
      ...item.highlights.map((highlight) => `- ${highlight}`),
    ]),
  ].join('\n')
}

function educationMarkdown(p: Profile): string {
  return [
    '# Education',
    ...p.education.flatMap((item) => [
      '',
      `## ${item.institution}`,
      item.degree,
      item.period,
      ...(item.details.length > 0 ? ['', ...item.details.map((detail) => `- ${detail}`)] : []),
    ]),
  ].join('\n')
}

function contactSource(p: Profile): string {
  return [
    'export const contact = {',
    `  email: ${quote(p.email)},`,
    `  github: ${quote(p.github)},`,
    `  linkedin: ${quote(p.linkedin)},`,
    '};',
  ].join('\n')
}

// ---------- the tree ----------

function buildTree(p: Profile): TreeNode[] {
  return [
    file('README.md', readme(p)),
    folder('about', [
      file('about/me.ts', aboutMe(p)),
      file('about/interests.md', interestsMarkdown(p)),
    ]),
    folder(
      'projects',
      p.projects.map((project, index) =>
        file(`projects/project-${String(index + 1).padStart(2, '0')}.tsx`, projectSource(project)),
      ),
    ),
    folder('skills', [
      file('skills/technical.ts', skillList('technical', p.skills.technical)),
      file('skills/tools.ts', skillList('tools', p.skills.tools)),
    ]),
    folder('experience', [file('experience/experience.md', experienceMarkdown(p))]),
    folder('education', [file('education/education.md', educationMarkdown(p))]),
    folder('contact', [file('contact/contact.ts', contactSource(p))]),
  ]
}

function flattenFiles(nodes: TreeNode[]): FileNode[] {
  return nodes.flatMap((node) => (node.kind === 'file' ? [node] : flattenFiles(node.children)))
}

function collectFolderPaths(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) =>
    node.kind === 'folder' ? [node.path, ...collectFolderPaths(node.children)] : [],
  )
}

export const fileTree = buildTree(profile)
export const filesByPath = new Map(
  flattenFiles(fileTree).map((item): [string, FileNode] => [item.path, item]),
)
export const folderPaths = collectFolderPaths(fileTree)