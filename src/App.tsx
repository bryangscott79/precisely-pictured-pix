import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ParentalControlsProvider } from "@/hooks/useParentalControls";
import { UserTierProvider } from "@/contexts/UserTierContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { LanguageProvider } from "@/hooks/useLanguagePreference";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserTierProvider>
        <ProfileProvider>
          <ParentalControlsProvider>
            <LanguageProvider>
              <OnboardingProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </OnboardingProvider>
            </LanguageProvider>
          </ParentalControlsProvider>
        </ProfileProvider>
      </UserTierProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
