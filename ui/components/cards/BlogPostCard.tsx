import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps, } from '@uniformdev/canvas-react';
import { getTransformedImageUrl } from '@/utilities/imageTransform';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import type { AssetParamValue } from '@uniformdev/assets';

export type BlogPostCardProps = ComponentProps<{
  image?: AssetParamValue;
  title?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  category?: string;
  url?: string;
  className?: string;
}>;

/**
 * Premium Blog Post Card Component
 * 
 * Luxury blog/article card for travel stories, tips, and guides.
 * Features elegant design with image, metadata, and hover effects.
 * 
 * Features:
 * - Hero image with subtle zoom on hover
 * - Category badge
 * - Date and read time metadata
 * - Excerpt preview
 * - Premium hover effects
 * - Call-to-action arrow
 * 
 * Use Cases:
 * - Travel blog listings
 * - Destination guides
 * - Travel tips and articles
 * - Content marketing
 */
export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  image,
  className = '',
}) => {
  const imageAssets = image ?? [];
  const [firstAsset] = imageAssets;
  const focalPoint = firstAsset?.fields?.focalPoint?.value;
  
  const imageUrl = getTransformedImageUrl(firstAsset, {
    width: 600,
    height: 400,
    fit: 'cover',
    focal: focalPoint || 'center',
    quality: 85,
  });

  const imageAlt = firstAsset?.fields?.description?.value || 
                   firstAsset?.fields?.title?.value || 
                   'Blog post image';

  return (
    <article className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-3/2 overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <p className="text-slate-400 text-sm font-light">Add blog image</p>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
            <UniformText 
              parameterId="category" 
              placeholder="Category"
              as="span"
            />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Metadata */}
        <div className="flex items-center gap-6 mb-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <UniformText 
              parameterId="date" 
              placeholder="Jan 15, 2024"
              as="span"
            />
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            <UniformText 
              parameterId="readTime" 
              placeholder="5 min read"
              as="span"
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-slate-900 mb-4 group-hover:text-amber-700 transition-colors line-clamp-2">
          <UniformText 
            parameterId="title" 
            placeholder="Add blog post title"
            as="span"
          />
        </h3>

        {/* Excerpt */}
        <p className="text-base text-slate-600 font-light leading-relaxed mb-6 line-clamp-3">
          <UniformText 
            parameterId="excerpt" 
            placeholder="Add blog post excerpt"
            as="span"
          />
        </p>

        {/* Read More Link */}
        <div className="flex items-center gap-2 text-amber-700 font-semibold group-hover:gap-4 transition-all duration-300">
          <span>Read More</span>
          <ArrowRightIcon className="w-5 h-5" />
        </div>
      </div>
    </article>
  );
};

registerUniformComponent({
  type: 'blogPostCard',
  component: BlogPostCard,
});

export default BlogPostCard;
