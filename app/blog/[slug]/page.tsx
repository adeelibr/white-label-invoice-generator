import { getBlogPostBySlug, getBlogPostSlugs } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = getBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: `${post.title} | Free Invoice Generator Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    }
  }
}

export default function BlogPost({ params }: Props) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://twitter.com/adeelibr'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Binary Code Barn',
      email: 'contact@binarycodebarn.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${post.slug}`
    },
    keywords: post.keywords.join(', '),
    wordCount: post.content.replace(/<[^>]*>/g, '').split(' ').length
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/blog">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Invoice Generator
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Article */}
        <article className="container max-w-5xl mx-auto px-4 py-12">
          {/* Article Header */}
          <header className="mb-16">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.keywords.slice(0, 5).map((keyword) => (
                <Badge key={keyword} variant="secondary" className="text-xs px-3 py-1">
                  {keyword}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed font-light max-w-3xl">
              {post.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground border-t border-muted pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="article-content max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Headers with proper spacing and typography
                h1: ({ children }) => (
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-16 mb-8 leading-tight text-foreground first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-20 mb-10 leading-tight text-foreground border-b border-muted pb-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-8 leading-tight text-primary">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-xl md:text-2xl font-semibold mt-12 mb-6 leading-tight text-foreground">
                    {children}
                  </h4>
                ),
                h5: ({ children }) => (
                  <h5 className="text-lg md:text-xl font-semibold mt-10 mb-5 leading-tight text-foreground">
                    {children}
                  </h5>
                ),
                h6: ({ children }) => (
                  <h6 className="text-base md:text-lg font-semibold mt-8 mb-4 leading-tight text-foreground">
                    {children}
                  </h6>
                ),
                
                // Paragraphs with generous spacing and improved readability
                p: ({ children }) => (
                  <p className="text-lg md:text-xl leading-loose mb-8 text-muted-foreground font-normal">
                    {children}
                  </p>
                ),
                
                // Lists with better spacing
                ul: ({ children }) => (
                  <ul className="mb-10 pl-8 space-y-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-10 pl-8 space-y-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-lg md:text-xl leading-loose text-muted-foreground marker:text-primary pl-2">
                    {children}
                  </li>
                ),
                
                // Links with proper styling
                a: ({ href, children }) => (
                  <Link 
                    href={href || '#'} 
                    className="text-primary font-medium underline decoration-primary underline-offset-4 hover:text-primary/80 transition-colors"
                  >
                    {children}
                  </Link>
                ),
                
                // Strong/Bold text
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
                
                // Emphasis/Italic text
                em: ({ children }) => (
                  <em className="italic text-muted-foreground">
                    {children}
                  </em>
                ),
                
                // Code blocks with improved styling
                code: ({ className, children }) => {
                  const isInline = !className
                  if (isInline) {
                    return (
                      <code className="bg-muted/80 px-3 py-1 rounded-md text-sm font-mono text-foreground border">
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code className={className}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-muted/50 border border-border rounded-xl p-8 my-12 overflow-x-auto shadow-sm text-sm font-mono leading-relaxed">
                    {children}
                  </pre>
                ),
                
                // Blockquotes with better styling
                blockquote: ({ children }) => (
                  <blockquote className="border-l-8 border-primary pl-12 py-6 my-12 italic text-xl text-muted-foreground bg-muted/30 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                
                // Horizontal rules
                hr: () => (
                  <hr className="border-muted my-16 border-t-2" />
                ),
                
                // Tables with better styling
                table: ({ children }) => (
                  <div className="overflow-x-auto my-12">
                    <table className="w-full border-collapse border border-muted rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-muted bg-muted/50 px-6 py-4 text-left font-semibold text-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-muted px-6 py-4 text-muted-foreground">
                    {children}
                  </td>
                ),
                
                // Images with better styling
                img: ({ src, alt }) => (
                  <img 
                    src={src} 
                    alt={alt} 
                    className="rounded-lg shadow-lg border my-12 w-full" 
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Call to Action */}
          <div className="mt-20 p-8 md:p-12 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20 text-center">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Ready to Create Professional Invoices?
            </h3>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Use our free invoice generator to create beautiful, professional invoices in minutes. 
              No registration required, completely free forever.
            </p>
            <Link href="/">
              <Button size="lg" className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Start Creating Invoices →
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </>
  )
}