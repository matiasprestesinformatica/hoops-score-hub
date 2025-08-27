import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DashboardStats } from "@/components/DashboardStats";
import { QuickActions } from "@/components/QuickActions";
import { BasketballCourt } from "@/components/BasketballCourt";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DashboardStats />
        <QuickActions />
        <BasketballCourt />
      </main>
    </div>
  );
};

export default Index;
