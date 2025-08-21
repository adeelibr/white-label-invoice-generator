import { MetadataRoute } from 'next'
import { getBlogPostSlugs } from '@/lib/blog'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://white-label-invoice-generator.vercel.app'
  
  // Get all blog post slugs
  const blogSlugs = getBlogPostSlugs()
  
  // Generate blog post entries
  const blogEntries = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogEntries,
  ]
}