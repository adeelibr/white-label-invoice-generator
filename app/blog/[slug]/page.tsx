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
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.keywords.slice(0, 5).map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-gray dark:prose-invert max-w-none prose-lg
                       prose-headings:font-bold prose-headings:tracking-tight
                       prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                       prose-p:leading-relaxed prose-li:leading-relaxed
                       prose-a:text-primary hover:prose-a:text-primary/80
                       prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                       prose-pre:bg-muted prose-pre:border
                       prose-blockquote:border-l-primary prose-blockquote:border-l-4
                       prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Call to Action */}
          <div className="mt-16 p-8 bg-muted rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Create Professional Invoices?</h3>
            <p className="text-muted-foreground mb-6">
              Use our free invoice generator to create beautiful, professional invoices in minutes.
            </p>
            <Link href="/">
              <Button size="lg">
                Start Creating Invoices
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </>
  )
}