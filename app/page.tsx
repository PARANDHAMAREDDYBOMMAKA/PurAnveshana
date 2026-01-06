"use client";
import { useState, useEffect } from 'react';
import { HomeNavigation } from '@/components/HomeNavigation';
import { HeroSection } from '@/components/HeroSection';
import { RewardsSection } from '@/components/RewardsSection';
import { YatraSection } from '@/components/YatraSection';
import { AppDemoSection } from '@/components/AppDemoSection';
import WhyJoinSection from '@/components/WhyJoinSection';
import VerificationSection from '@/components/VerificationSection';
import FAQSection from '@/components/FAQSection';
import FinalCTASection from '@/components/FinalCTASection';
import HomeFooter from '@/components/HomeFooter';
import PrivacyPolicyModal from '@/components/modals/PrivacyPolicyModal';
import TermsOfServiceModal from '@/components/modals/TermsOfServiceModal';
import ContactUsModal from '@/components/modals/ContactUsModal';
import GuidelinesModal from '@/components/modals/GuidelinesModal';
import HelpCenterModal from '@/components/modals/HelpCenterModal';
import SitemapModal from '@/components/modals/SitemapModal';
import AccessibilityModal from '@/components/modals/AccessibilityModal';
import CookiePolicyModal from '@/components/modals/CookiePolicyModal';
import HeritageMapModal from '@/components/modals/HeritageMapModal';
import ContributorsModal from '@/components/modals/ContributorsModal';
import SuccessStoriesModal from '@/components/modals/SuccessStoriesModal';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showContributors, setShowContributors] = useState(false);
  const [showStories, setShowStories] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isAnyModalOpen = showPrivacy || showTerms || showContact || showGuidelines ||
                           showHelp || showSitemap || showAccessibility || showCookies ||
                           showMap || showContributors || showStories;

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPrivacy, showTerms, showContact, showGuidelines, showHelp, showSitemap, showAccessibility, showCookies, showMap, showContributors, showStories]);

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-white">
      <HomeNavigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrolled={scrolled}
      />

      <HeroSection />
      <RewardsSection />
      <YatraSection />
      <AppDemoSection />
      <WhyJoinSection />
      <VerificationSection />
      <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <FinalCTASection />

      <HomeFooter
        setShowPrivacy={setShowPrivacy}
        setShowTerms={setShowTerms}
        setShowContact={setShowContact}
        setShowGuidelines={setShowGuidelines}
        setShowHelp={setShowHelp}
        setShowSitemap={setShowSitemap}
        setShowAccessibility={setShowAccessibility}
        setShowCookies={setShowCookies}
        setShowMap={setShowMap}
        setShowContributors={setShowContributors}
        setShowStories={setShowStories}
      />

      <PrivacyPolicyModal show={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsOfServiceModal show={showTerms} onClose={() => setShowTerms(false)} />
      <ContactUsModal show={showContact} onClose={() => setShowContact(false)} />
      <GuidelinesModal show={showGuidelines} onClose={() => setShowGuidelines(false)} />
      <HelpCenterModal show={showHelp} onClose={() => setShowHelp(false)} />
      <SitemapModal show={showSitemap} onClose={() => setShowSitemap(false)} />
      <AccessibilityModal show={showAccessibility} onClose={() => setShowAccessibility(false)} />
      <CookiePolicyModal show={showCookies} onClose={() => setShowCookies(false)} />
      <HeritageMapModal show={showMap} onClose={() => setShowMap(false)} />
      <ContributorsModal show={showContributors} onClose={() => setShowContributors(false)} />
      <SuccessStoriesModal show={showStories} onClose={() => setShowStories(false)} />
    </div>
  );
}
