import { getBlogPostBySlug, getBlogPostSlugs } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { Metadata } from 'next'

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
          <div className="container max-w-4xl mx-auto px-4 py-6">
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
        <article className="container max-w-4xl mx-auto px-4 py-12">
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
          <div 
            className="prose prose-gray dark:prose-invert max-w-none prose-xl
                       prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20
                       prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight
                       prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:border-b prose-h2:border-muted prose-h2:pb-3
                       prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-primary
                       prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:font-semibold
                       prose-p:leading-relaxed prose-p:mb-6 prose-p:text-muted-foreground prose-p:text-[17px]
                       prose-li:leading-relaxed prose-li:mb-2 prose-li:text-muted-foreground
                       prose-ul:mb-6 prose-ul:pl-6 prose-ol:mb-6 prose-ol:pl-6
                       prose-li:marker:text-primary prose-li:pl-2
                       prose-a:text-primary prose-a:font-medium prose-a:no-underline 
                       hover:prose-a:text-primary/80 hover:prose-a:underline
                       prose-strong:text-foreground prose-strong:font-semibold
                       prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                       prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:p-4
                       prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6 
                       prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
                       prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:my-8
                       prose-hr:border-muted prose-hr:my-12
                       first:prose-p:mt-0 last:prose-p:mb-0"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

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