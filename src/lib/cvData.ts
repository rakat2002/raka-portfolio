import { profile } from '../data/profile'
import { clean, isPlaceholder, visible } from './placeholders'

// This file turns your raw data into exactly what the CV shows:
// placeholders are removed, and empty things disappear.

export const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export interface EntryData {
  key: string
  title: string
  subtitle?: string
  period?: string
  bullets: string[]
}

export const educationEntries = (): EntryData[] =>
  profile.education
    .filter((item) => !isPlaceholder(item.institution))
    .map((item) => ({
      key: `${item.institution}-${item.period}`,
      title: item.institution,
      subtitle: visible(item.degree),
      period: visible(item.period),
      bullets: clean(item.details),
    }))

export const experienceEntries = (): EntryData[] =>
  profile.experience
    .filter((item) => !isPlaceholder(item.role))
    .map((item) => ({
      key: `${item.role}-${item.organization}-${item.period}`,
      title: item.role,
      subtitle: visible(item.organization),
      period: visible(item.period),
      bullets: clean(item.highlights),
    }))

export const activityEntries = (): EntryData[] =>
  profile.activities
    .filter((item) => !isPlaceholder(item.title))
    .map((item) => ({
      key: `${item.title}-${item.organization}-${item.period}`,
      title: item.title,
      subtitle: visible(item.organization),
      period: visible(item.period),
      bullets: [],
    }))

export const publicationEntries = (): EntryData[] =>
  profile.publications
    .filter((item) => !isPlaceholder(item.title))
    .map((item) => ({
      key: `${item.title}-${item.year}`,
      title: item.title,
      subtitle: visible(item.venue),
      period: visible(item.year),
      bullets: [],
    }))

export const skillRows = () =>
  [
    { label: 'Technical', items: clean(profile.skills.technical) },
    { label: 'Tools', items: clean(profile.skills.tools) },
  ].filter((row) => row.items.length > 0)

export interface ProjectData {
  key: string
  name: string
  description?: string
  technologies: string[]
  features: string[]
  github?: string
  liveDemo?: string
}

export const projectEntries = (): ProjectData[] =>
  profile.projects
    .filter((project) => !isPlaceholder(project.name))
    .map((project) => ({
      key: project.name,
      name: project.name,
      description: visible(project.description),
      technologies: clean(project.technologies),
      features: clean(project.features),
      github: visible(project.github),
      liveDemo: visible(project.liveDemo),
    }))

export const achievementItems = (): string[] => clean(profile.achievements)

export const languageItems = (): string[] =>
  profile.languages
    .filter((item) => !isPlaceholder(item.name))
    .map((item) => {
      const level = visible(item.level)
      return level ? `${item.name} (${level})` : item.name
    })

export const interestItems = (): string[] => clean(profile.interests)

export const artLink = (): string | undefined => visible(profile.artLink)

export interface ContactRow {
  label: string
  text: string
  href?: string
}

export function contactRows(): ContactRow[] {
  const rows: ContactRow[] = []
  const email = visible(profile.email)
  const github = visible(profile.github)
  const linkedin = visible(profile.linkedin)
  const location = visible(profile.location)

  if (email) rows.push({ label: 'Email', text: email, href: `mailto:${email}` })
  if (github) rows.push({ label: 'GitHub', text: bareUrl(github), href: github })
  if (linkedin) rows.push({ label: 'LinkedIn', text: bareUrl(linkedin), href: linkedin })
  if (location) rows.push({ label: 'Location', text: location })
  return rows
}