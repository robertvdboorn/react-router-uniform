/**
 * Component Registry
 * 
 * This file imports all Uniform components to ensure they are registered
 * with the Uniform component system. Components are registered using
 * registerUniformComponent() in their respective files.
 * 
 * Import this file in root.tsx to activate all component registrations.
 */

// Import all components to trigger their registration

// Layout Components
import './layout/Page';
import './layout/Navigation';
import './layout/NavigationLink';
import './layout/Footer';
import './layout/FooterLink';

// Content Components
import './content/Hero';
import './content/SearchHero';
import './content/VideoHero';
import './content/ContentSection';
import './content/TextBlock';
import './content/CallToAction';
import './content/Newsletter';
import './content/StatsSection';
import './content/StatItem';
import './content/Testimonial';
import './content/DealBanner';
import './content/FAQSection';
import './content/FAQItem';
import './content/TrustBadges';
import './content/TrustBadge';
import './content/SocialProofBanner';

// Card Components
import './cards/FeatureCard';
import './cards/FeatureGrid';
import './cards/DestinationCard';
import './cards/TravelPackageCard';
import './cards/PackageFeature';
import './cards/PricingCard';
import './cards/PricingFeature';
import './cards/PricingComparison';
import './cards/PricingPlan';
import './cards/BlogPostCard';

// Media Components
import './media/ImageSection';
import './media/ImageGallery';
import './media/GalleryImage';

// Interactive Components
import './interactive/ButtonLink';
import './interactive/Carousel';
import './interactive/CarouselSlide';

