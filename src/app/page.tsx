'use client';

import FeaturesSection from '@/components/home/FeaturesSection';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import { Container } from '@mui/material';


export default function Home() {
  return (
    <>
      <HeroSection />
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <FeaturesSection />
        <StatsSection />
      </Container>
    </>
  );
}