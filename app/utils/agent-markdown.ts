import { utils } from "@/app/source"
import { absoluteUrl } from "@/app/utils/site"
import { readFileSync } from "fs"

function stripFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n*/u, "")
}

function stripImports(content: string): string {
  return content.replace(/^import\s.+$/gmu, "")
}

function stripJsxComments(content: string): string {
  return content.replace(/\{\/\*[\s\S]*?\*\/\}/gu, "")
}

function convertImageSections(content: string): string {
  return content.replace(/<ImageSection([\s\S]*?)\/>/gu, (_, attributes: string) => {
    const src = attributes.match(/\bsrc="([^"]+)"/u)?.[1]
    const alt = attributes.match(/\balt="([^"]+)"/u)?.[1]
    const subtitle = attributes.match(/\bsubtitle="([^"]+)"/u)?.[1]
    const label = alt ?? subtitle ?? "Image"

    if (!src) {
      return `> ${label}`
    }

    const normalizedSrc =
      src.startsWith("http://") || src.startsWith("https://") ? src : absoluteUrl(`/img/docs${src}`)

    return `![${label}](${normalizedSrc})`
  })
}

function convertTabs(content: string): string {
  return content.replace(/<Tabs[^>]*>([\s\S]*?)<\/Tabs>/gu, (_, tabContent: string) => {
    const tabs = [...tabContent.matchAll(/<Tab[^>]*value="([^"]+)"[^>]*>([\s\S]*?)<\/Tab>/gu)]

    if (tabs.length === 0) {
      return tabContent
    }

    return tabs.map(([, value, inner]) => `### ${value}\n\n${inner.trim()}`).join("\n\n")
  })
}

function stripGenericJsx(content: string): string {
  return content
    .replace(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*)?>/gu, "")
    .replace(/<\/?[a-z][a-z0-9-]*(?:\s[^>]*)?>/gu, "")
}

function normalizeWhitespace(content: string): string {
  return content
    .replace(/\n{3,}/gu, "\n\n")
    .replace(/[ \t]+\n/gu, "\n")
    .trim()
}

function toAgentMarkdown(rawContent: string): string {
  return normalizeWhitespace(
    stripGenericJsx(
      convertTabs(
        convertImageSections(stripJsxComments(stripImports(stripFrontmatter(rawContent))))
      )
    )
  )
}

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/"
  }

  const cleanedPath = pathname.startsWith("/") ? pathname : `/${pathname}`
  return cleanedPath.replace(/\/+$/u, "")
}

export function getDocsPageByPath(pathname: string) {
  const normalizedPath = normalizePath(pathname)
  return utils.getPages().find((page) => page.url === normalizedPath)
}

export function getPageMarkdown(pathname: string) {
  const page = getDocsPageByPath(pathname)

  if (!page?.file?.path) {
    return null
  }

  const rawContent = readFileSync(`content/docs/${page.file.path}`, "utf-8")
  const markdownBody = toAgentMarkdown(rawContent)
  const title = page.data.title.replace(/`/gu, "")
  const canonicalUrl = absoluteUrl(page.url)
  const descriptionBlock = page.data.description ? `${page.data.description}\n\n` : ""

  return {
    page,
    title,
    canonicalUrl,
    markdown: `# ${title}

Source: ${canonicalUrl}

${descriptionBlock}${markdownBody}`.trim()
  }
}
