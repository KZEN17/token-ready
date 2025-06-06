'use client';

import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TeamSection from '@/components/home/TeamSection';
import PartnersSection from '@/components/home/PartnersSection';
import { Container } from '@mui/material';
import StakingInfoSection from '@/components/home/StakingInfoSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <StakingInfoSection />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Project Cards Section - using existing explore page projects */}
        <div id="top-projects">
          {/* This section will show the project cards from the explore page */}
        </div>
      </Container>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <StatsSection />
      </Container>
      <TeamSection />
      <PartnersSection />
    </>
  );
}