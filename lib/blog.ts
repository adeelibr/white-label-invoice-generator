import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

// Configure marked for better markdown processing
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
  pedantic: false,
  sanitize: false, // Allow HTML in markdown
  smartypants: true, // Use smart quotes and other typography
})

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  author: string
  keywords: string[]
  content: string
  excerpt: string
  image?: string
}

const blogDirectory = path.join(process.cwd(), 'content/blog')

export function getAllBlogPosts(): BlogPost[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(blogDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(blogDirectory)
  const posts = filenames
    .filter((name) => name.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace('.md', '')
      return getBlogPostBySlug(slug)
    })
    .filter(Boolean) as BlogPost[]

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(blogDirectory, `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    // Parse markdown content
    const htmlContent = marked(content)

    // Generate excerpt (first 150 characters of content, stripped of HTML)
    const plainText = content.replace(/[#*`\[\]]/g, '').trim()
    const excerpt = plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      readTime: data.readTime || '5 min read',
      author: data.author || 'Adeel Imran',
      keywords: data.keywords || [],
      content: htmlContent,
      excerpt,
      image: data.image
    }
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}

export function getBlogPostSlugs(): string[] {
  if (!fs.existsSync(blogDirectory)) {
    return []
  }
  
  return fs.readdirSync(blogDirectory)
    .filter((name) => name.endsWith('.md'))
    .map((filename) => filename.replace('.md', ''))
}