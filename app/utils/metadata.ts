import { utils } from "@/app/source"
import type { Page } from "@/app/source"
import { readFileSync } from "fs"

/**
 * Extracts the first paragraph from MDX content
 */
function extractFirstParagraph(mdxContent: string): string | undefined {
  // Remove frontmatter
  const contentWithoutFrontmatter = mdxContent.replace(/^---\n[\s\S]*?\n---\n/, '')
  
  // Remove import statements
  const contentWithoutImports = contentWithoutFrontmatter.replace(/^import .+$/gm, '').trim()
  
  // Split by double newlines to get paragraphs
  const paragraphs = contentWithoutImports.split(/\n\s*\n/)
  
  for (const paragraph of paragraphs) {
    const cleaned = paragraph.trim()
    // Skip empty paragraphs, headings, and JSX components
    if (cleaned && !cleaned.startsWith('#') && !cleaned.startsWith('<') && !cleaned.startsWith('```')) {
      // Remove any remaining markdown syntax
      return cleaned
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
        .replace(/`([^`]+)`/g, '$1') // Remove inline code
        .trim()
    }
  }
  
  return undefined
}

/**
 * Extracts the first image from MDX content
 */
function extractFirstImage(mdxContent: string): string | undefined {
  // Look for ImageSection components first
  const imageSectionMatch = mdxContent.match(/<ImageSection[^>]*src="([^"]+)"/)
  if (imageSectionMatch) {
    return imageSectionMatch[1]
  }
  
  // Look for regular img tags
  const imgMatch = mdxContent.match(/<img[^>]*src="([^"]+)"/)
  if (imgMatch) {
    return imgMatch[1]
  }
  
  // Look for markdown images
  const mdImageMatch = mdxContent.match(/!\[[^\]]*\]\(([^)]+)\)/)
  if (mdImageMatch) {
    return mdImageMatch[1]
  }
  
  return undefined
}

/**
 * Generates dynamic metadata for a page
 */
export async function generatePageMetadata(page: Page) {
  // Read the raw content from the file system if not available on the page object
  let content: string | undefined
  try {
    if (page.file?.path) {
      content = readFileSync(`content/docs/${page.file.path}`, 'utf-8')
    }
  } catch (error) {
    console.warn('Failed to read file for metadata extraction:', error)
  }
  
  // Extract description from frontmatter or first paragraph
  let description = page.data.description
  if (!description && content) {
    description = extractFirstParagraph(content)
  }
  
  // Extract image from frontmatter or first image in content
  let image = (page.data as any)['share-image']
  if (!image && content) {
    image = extractFirstImage(content)
  }
  
  // Fallback to default cover image
  if (!image) {
    image = '/cover.png'
  }
  
  // Build the metadata
  const title = page.data.title.replace(/`/g, '')
  const metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'article' as const,
      url: `https://docs.gitbutler.com${page.url}`,
      siteName: 'GitButler Docs'
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [image],
      creator: '@gitbutler'
    }
  }
  
  return metadata
}