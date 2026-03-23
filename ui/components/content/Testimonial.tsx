import React from 'react';
import { UniformText, registerUniformComponent } from '@uniformdev/canvas-react';
import type { ComponentProps } from '@uniformdev/canvas-react';

export type TestimonialProps = ComponentProps<{
  quote?: string;
  author?: string;
  role?: string;
  avatarUrl?: string;
  className?: string;
}>;

/**
 * Premium Testimonial Component
 * 
 * Luxury testimonial card with elegant styling and refined design.
 * Features sophisticated quote display and premium author presentation.
 */
export const Testimonial: React.FC<TestimonialProps> = ({
  avatarUrl,
  className = '',
}) => {
  return (
    <div className={`py-12 md:py-16 ${className}`}>
      <div className="max-w-5xl mx-auto">
        <div className="relative group">
          {/* Premium glow */}
          <div className="absolute -inset-2 bg-linear-to-r from-amber-500/20 to-amber-700/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Luxury Card */}
          <div className="relative bg-linear-to-br from-white to-slate-50 rounded-3xl p-12 md:p-16 shadow-2xl border border-slate-100">
            {/* Premium quote icon */}
            <div className="absolute -top-8 left-12 w-20 h-20 bg-linear-to-br from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            {/* Premium Quote */}
            <div className="mb-10 mt-8">
              <blockquote className="text-2xl md:text-3xl lg:text-4xl text-slate-800 leading-relaxed font-light italic">
                "<UniformText parameterId="quote" placeholder="Add testimonial quote" as="span" />"
              </blockquote>
            </div>
            
            {/* Refined divider */}
            <div className="w-16 h-1 bg-linear-to-r from-amber-600 to-amber-400 rounded-full mb-10" />
            
            {/* Premium Author Section */}
            <div className="flex items-center gap-6">
              {avatarUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-amber-600 rounded-full blur-lg opacity-40" />
                  <img
                    src={avatarUrl}
                    alt="Author"
                    className="relative w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-xl"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-amber-600 rounded-full blur-lg opacity-40" />
                  <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-amber-600 to-amber-800 flex items-center justify-center ring-4 ring-white shadow-xl">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
              
              <div>
                <UniformText 
                  parameterId="author" 
                  placeholder="Add author name" 
                  as="div"
                  className="font-semibold text-slate-900 text-2xl mb-1"
                />
                <UniformText 
                  parameterId="role" 
                  placeholder="Add author role/title" 
                  as="div"
                  className="text-lg text-slate-600 font-light"
                />
              </div>
            </div>
            
            {/* Star rating decoration */}
            <div className="flex gap-1 mt-8 justify-start opacity-60">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Register component with Uniform
registerUniformComponent({
  type: 'testimonial',
  component: Testimonial,
});

export default Testimonial;

