import { getAllBlogPosts } from '@/lib/blog'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Blog - Invoice Generator Tips & Best Practices',
  description: 'Learn about invoice best practices, business invoicing tips, and how to create professional invoices that get paid faster.',
  keywords: [
    'invoice blog',
    'invoicing tips',
    'business invoicing',
    'invoice best practices',
    'professional invoicing',
    'invoice templates',
    'freelancer invoicing',
    'small business tips'
  ],
  openGraph: {
    title: 'Blog - Invoice Generator Tips & Best Practices',
    description: 'Learn about invoice best practices, business invoicing tips, and how to create professional invoices that get paid faster.',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Invoice Generator Blog',
    description: 'Tips and best practices for creating professional invoices',
    url: '/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Binary Code Barn',
      email: 'contact@binarycodebarn.com'
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author
      },
      url: `/blog/${post.slug}`
    }))
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
          <div className="container max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Generator
                </Button>
              </Link>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Invoice Generator Blog</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Learn the best practices for creating professional invoices, managing payments, and growing your business.
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <main className="container max-w-6xl mx-auto px-4 py-12">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
              <p className="text-muted-foreground">
                We&apos;re working on creating valuable content about invoicing best practices. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.slug} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-md bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">{post.readTime}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="group-hover:text-primary transition-colors leading-tight text-xl">
                      <Link href={`/blog/${post.slug}`} className="line-clamp-3">
                        {post.title}
                      </Link>
                    </CardTitle>
                    
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.keywords.slice(0, 3).map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-0">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                        Read Article →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}