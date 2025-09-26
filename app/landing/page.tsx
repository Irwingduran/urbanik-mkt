import Header from "@/components/layout/header"
import Hero from "@/components/sections/hero"
import FeaturedCarousel from "@/components/sections/featured-carousel"
import ImpactSection from "@/components/sections/impact-section"
import SearchSection from "@/components/sections/search-section"
import BenefitsSection from "@/components/sections/benefits-section"
import CTASection from "@/components/sections/cta-section"
import Footer from "@/components/layout/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <SearchSection />
      <FeaturedCarousel />
      <ImpactSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  )
}