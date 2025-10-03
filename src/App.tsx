import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from '@/hooks/use-auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SmartRedirect from '@/components/auth/SmartRedirect';
import RootRedirect from '@/components/auth/RootRedirect';
import { PreloaderProvider } from '@/components/preloader/PreloaderProvider';

// Import landing page components
const HavenArkCompanyLandingPage = lazy(() => import('@/pages/HavenArkCompanyLandingPage'));
const MasterclassPage = lazy(() => import('@/pages/MasterclassPage'));
const WigglyLandingPage = lazy(() => import('@/pages/WigglyLandingPage'));
const OfflineProgramPage = lazy(() => import('@/pages/OfflineProgramPage'));
const OnlineProgramPage = lazy(() => import('@/pages/OnlineProgramPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/IndexPage'));
const SubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
const AccountSettingsPage = lazy(() => import('@/pages/ProfilePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const EmailVerificationPage = lazy(() => import('@/pages/EmailVerificationPage'));
const GalleryAdminPage = lazy(() => import('@/pages/GalleryAdminPage'));

// Main platform pages
const TradesPage = lazy(() => import('@/pages/TradesPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const CalendarViewPage = lazy(() => import('@/pages/CalendarViewPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const PlaybooksPage = lazy(() => import('@/pages/PlaybooksPage'));
const PlaybookEditorPage = lazy(() => import('@/pages/PlaybookEditorPage'));
const PositionSizingPage = lazy(() => import('@/pages/PositionSizingPage'));
const WigglyAIPage = lazy(() => import('@/pages/WigglyAIPage'));
const NotebookPage = lazy(() => import('@/pages/NotebookPage'));

const FundsPage = lazy(() => import('@/pages/FundsPage'));
const TradeFormPage = lazy(() => import('@/pages/TradeFormPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));

// Lazy load academy pages
const AcademyPage = lazy(() => import('@/pages/AcademyPage'));
const AssignedCoursesPage = lazy(() => import('@/pages/AssignedCoursesPage'));
const AcademySignupPage = lazy(() => import('@/pages/AcademySignupPage'));
const HavenArkSignupPage = lazy(() => import('@/pages/HavenArkSignupPage'));
const HavenArkLoginPage = lazy(() => import('@/pages/HavenArkLoginPage'));
const CourseDetailPage = lazy(() => import('@/pages/CourseDetailPage'));
const CoursePreviewPage = lazy(() => import('@/pages/CoursePreviewPage'));
const CourseViewerPage = lazy(() => import('@/pages/CourseViewerPage'));
const AcademyProfilePage = lazy(() => import('@/pages/AcademyProfilePage'));

// Lazy load feature showcase pages
const AIAssistantPage = lazy(() => import('@/pages/features/AIAssistantPage'));
const CalculatorPage = lazy(() => import('@/pages/features/CalculatorPage'));
const EmotionsPage = lazy(() => import('@/pages/features/EmotionsPage'));
const TimePage = lazy(() => import('@/pages/features/TimePage'));
const TradeEntryPage = lazy(() => import('@/pages/features/TradeEntryPage'));
const FeaturePlaybooksPage = lazy(() => import('@/pages/features/PlaybooksPage'));
const SmartTradeImportPage = lazy(() => import('@/pages/features/SmartTradeImportPage'));

function App() {
  const queryClient = new QueryClient();
  
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="wiggly-theme">
        <Toaster />
        <SonnerToaster richColors position="top-right" />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PreloaderProvider>
              <Suspense fallback={null}>
                <Routes>
                {/* Root route - Haven ARK Company Landing Page (accessible to all) */}
                <Route path="/" element={<HavenArkCompanyLandingPage />} />
                
                {/* Masterclass Page - Shows all masterclass programs */}
                <Route path="/masterclass" element={<MasterclassPage />} />
                
                {/* Program Pages */}
                <Route path="/offline-program" element={<OfflineProgramPage />} />
                <Route path="/online-program" element={<OnlineProgramPage />} />
                
                {/* Gallery Admin - Temporary admin interface */}
                <Route path="/gallery-admin" element={<GalleryAdminPage />} />
                
                {/* Wiggly Landing Page - Separate page for Wiggly features */}
                <Route path="/wiggly" element={<WigglyLandingPage />} />
                
                {/* Smart redirect route for authenticated user dashboard routing */}
                <Route path="/dashboard-redirect" element={<SmartRedirect />} />
                
                <Route path="/not-found" element={<NotFoundPage />} />

                {/* Authentication routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/email-verification" element={<EmailVerificationPage />} />

                {/* Feature showcase pages - accessible to all users */}
                <Route path="/features/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/features/calculator" element={<CalculatorPage />} />
                <Route path="/features/emotions" element={<EmotionsPage />} />
                <Route path="/features/time" element={<TimePage />} />
                <Route path="/features/trade-entry" element={<TradeEntryPage />} />
                <Route path="/features/playbooks" element={<FeaturePlaybooksPage />} />
                <Route path="/features/smart-trade-import" element={<SmartTradeImportPage />} />

                {/* Academy routes */}
                <Route path="/academy" element={
                  <ProtectedRoute allowAcademyOnlyUsers={true} requireSubscription={false}>
                    <AcademyPage />
                  </ProtectedRoute>
                } />
                <Route path="/academy/my-courses" element={
                  <ProtectedRoute allowAcademyOnlyUsers={true} requireSubscription={false}>
                    <AssignedCoursesPage />
                  </ProtectedRoute>
                } />
                
                {/* Academy Profile Page - Separate from Wiggly profile */}
                <Route path="/academy/profile" element={
                  <ProtectedRoute allowAcademyOnlyUsers={true} requireSubscription={false}>
                    <AcademyProfilePage />
                  </ProtectedRoute>
                } />
                
                {/* REDIRECT old academy admin to unified admin */}
                <Route path="/academy/admin" element={<Navigate to="/admin?tab=academy" replace />} />
                
                <Route path="/academy/signup" element={<AcademySignupPage />} />
                <Route path="/haven-ark/signup" element={<HavenArkSignupPage />} />
                <Route path="/haven-ark/login" element={<HavenArkLoginPage />} />

                {/* STUDENT COURSE VIEWER - This is what students should see */}
                <Route path="/academy/course/:id" element={
                  <ProtectedRoute allowAcademyOnlyUsers={true} requireSubscription={false}>
                    <CourseViewerPage />
                  </ProtectedRoute>
                } />
                
                {/* ADMIN COURSE MANAGEMENT - Separate route for admins */}
                <Route path="/academy/admin/course/:id" element={
                  <ProtectedRoute allowAcademyOnlyUsers={false} requireSubscription={false}>
                    <CourseDetailPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/academy/course/:id/preview" element={
                  <ProtectedRoute allowAcademyOnlyUsers={true} requireSubscription={false}>
                    <CoursePreviewPage />
                  </ProtectedRoute>
                } />

                {/* Protected main platform routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute requireSubscription={true}>
                    <DashboardPage />
                  </ProtectedRoute>
                } />

                <Route path="/trades" element={
                  <ProtectedRoute requireSubscription={true}>
                    <TradesPage />
                  </ProtectedRoute>
                } />

                <Route path="/calendar" element={
                  <ProtectedRoute requireSubscription={true}>
                    <CalendarViewPage />
                  </ProtectedRoute>
                } />

                <Route path="/gallery" element={
                  <ProtectedRoute requireSubscription={true}>
                    <GalleryPage />
                  </ProtectedRoute>
                } />

                <Route path="/wiggly-AI" element={
                  <ProtectedRoute requireSubscription={true}>
                    <WigglyAIPage />
                  </ProtectedRoute>
                } />

                <Route path="/notebook" element={
                  <ProtectedRoute requireSubscription={true}>
                    <NotebookPage />
                  </ProtectedRoute>
                } />

                <Route path="/playbooks" element={
                  <ProtectedRoute requireSubscription={true}>
                    <PlaybooksPage />
                  </ProtectedRoute>
                } />

                <Route path="/playbook/create" element={
                  <ProtectedRoute requireSubscription={true}>
                    <PlaybookEditorPage />
                  </ProtectedRoute>
                } />

                <Route path="/playbook/edit/:id" element={
                  <ProtectedRoute requireSubscription={true}>
                    <PlaybookEditorPage />
                  </ProtectedRoute>
                } />

                <Route path="/funds" element={
                  <ProtectedRoute requireSubscription={true}>
                    <FundsPage />
                  </ProtectedRoute>
                } />

                <Route path="/analytics" element={
                  <ProtectedRoute requireSubscription={true}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } />

                <Route path="/position-sizing" element={
                  <ProtectedRoute requireSubscription={true}>
                    <PositionSizingPage />
                  </ProtectedRoute>
                } />

                {/* Trade form routes - both create and edit */}
                <Route path="/trade-form" element={
                  <ProtectedRoute requireSubscription={true}>
                    <TradeFormPage />
                  </ProtectedRoute>
                } />

                <Route path="/trade-form/:id" element={
                  <ProtectedRoute requireSubscription={true}>
                    <TradeFormPage />
                  </ProtectedRoute>
                } />

                {/* UNIFIED Admin routes - now handles both Wiggly and Academy */}
                <Route path="/admin" element={
                  <ProtectedRoute requireSubscription={false}>
                    <AdminPage />
                  </ProtectedRoute>
                } />
                
                {/* Settings and subscription routes - accessible to all authenticated users */}
                <Route path="/subscription" element={
                  <ProtectedRoute requireSubscription={false}>
                    <SubscriptionPage />
                  </ProtectedRoute>
                } />
                <Route path="/account-settings" element={
                  <ProtectedRoute requireSubscription={false}>
                    <AccountSettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute requireSubscription={false}>
                    <AccountSettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/onboarding" element={
                  <ProtectedRoute requireSubscription={false}>
                    <OnboardingPage />
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Routes>
              </Suspense>
            </PreloaderProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
