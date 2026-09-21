import { bareUrl, projectEntries } from '../../lib/cvData'
import { Bullets } from './EntrySection'
import Section from './Section'

interface ProjectLinkProps {
  href: string
  label: string
}

function ProjectLink({ href, label }: ProjectLinkProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="text-fuchsia-800 underline-offset-2 hover:underline"
    >
      <span className="print:hidden">{label}</span>
      <span className="hidden print:inline">{bareUrl(href)}</span>
    </a>
  )
}

export default function ProjectsSection() {
  const projects = projectEntries()
  if (projects.length === 0) return null

  return (
    <Section title="Projects">
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.key} className="break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold text-zinc-900">{project.name}</h3>
              <div className="flex gap-3 text-xs">
                {project.github && <ProjectLink href={project.github} label="GitHub" />}
                {project.liveDemo && <ProjectLink href={project.liveDemo} label="Live demo" />}
              </div>
            </div>
            {project.description && <p className="text-zinc-700">{project.description}</p>}
            {project.technologies.length > 0 && (
              <p className="mt-0.5 text-xs text-zinc-500">{project.technologies.join(' · ')}</p>
            )}
            <Bullets items={project.features} />
          </div>
        ))}
      </div>
    </Section>
  )
}