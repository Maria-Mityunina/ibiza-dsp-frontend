import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@stores/authStore'
import AuthLayout from '@components/layout/AuthLayout'
import DashboardLayout from '@components/layout/DashboardLayout'
import LoginPage from '@pages/auth/LoginPage'
import AdvertisersPage from '@pages/advertisers/AdvertisersPage'
import CreateAdvertiserPage from '@pages/advertisers/CreateAdvertiserPage'
import EditAdvertiserPage from '@pages/advertisers/EditAdvertiserPage'
import CampaignsPage from '@pages/campaigns/CampaignsPage'
import CampaignsListPage from '@pages/campaigns/CampaignsListPage'
import CreateCampaignPage from '@pages/campaigns/CreateCampaignPage'
import EditCampaignPage from '@pages/campaigns/EditCampaignPage'
import AdGroupsPage from '@pages/adgroups/AdGroupsPage'
import AdGroupsListPage from '@pages/adgroups/AdGroupsListPage'
import CreateAdGroupPage from '@pages/adgroups/CreateAdGroupPage'
import EditAdGroupPage from '@pages/adgroups/EditAdGroupPage'
import CreativesPage from '@pages/creatives/CreativesPage'
import CreativesListPage from '@pages/creatives/CreativesListPage'
import CreateCreativePage from '@pages/creatives/CreateCreativePage'
import EditCreativePage from '@pages/creatives/EditCreativePage'
import SegmentsPage from '@pages/segments/SegmentsPage'
import AnalyticsPage from '@pages/analytics/AnalyticsPage'
import FraudDetectionPage from '@pages/fraud-detection/FraudDetectionPage'
import AudienceInsightsPage from '@pages/audience/AudienceInsightsPage'
import CreativePerformancePage from '@pages/creative/CreativePerformancePage'

import ProtectedRoute from '@components/auth/ProtectedRoute'
import RegisterPage from '@pages/auth/RegisterPage'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthLayout>
    )
  }

  return (
    <DashboardLayout>
      <Routes>
        {/* Advertisers */}
        <Route path="/" element={<Navigate to="/advertisers" replace />} />
        <Route
          path="/advertisers"
          element={
            <ProtectedRoute requiredPermissions={['view_advertisers']}>
              <AdvertisersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisers/create"
          element={
            <ProtectedRoute requiredPermissions={['create_advertiser']}>
              <CreateAdvertiserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisers/:id/edit"
          element={
            <ProtectedRoute requiredPermissions={['edit_advertiser']}>
              <EditAdvertiserPage />
            </ProtectedRoute>
          }
        />

        {/* Campaigns */}
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute requiredPermissions={['view_campaigns']}>
              <CampaignsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisers/:advertiserId/campaigns"
          element={
            <ProtectedRoute requiredPermissions={['view_campaigns']}>
              <CampaignsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisers/:advertiserId/campaigns/create"
          element={
            <ProtectedRoute requiredPermissions={['create_campaign']}>
              <CreateCampaignPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisers/:advertiserId/campaigns/:id/edit"
          element={
            <ProtectedRoute requiredPermissions={['edit_campaign']}>
              <EditCampaignPage />
            </ProtectedRoute>
          }
        />

        {/* Ad Groups */}
        <Route
          path="/advertisers/:advertiserId/campaigns/:campaignId/adgroups"
          element={
            <ProtectedRoute requiredPermissions={['view_adgroups']}>
              <AdGroupsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisers/:advertiserId/campaigns/:campaignId/adgroups/create"
          element={
            <ProtectedRoute requiredPermissions={['create_adgroup']}>
              <CreateAdGroupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisers/:advertiserId/campaigns/:campaignId/adgroups/:id/edit"
          element={
            <ProtectedRoute requiredPermissions={['edit_adgroup']}>
              <EditAdGroupPage />
            </ProtectedRoute>
          }
        />

        {/* Creatives */}
        <Route
          path="/advertisers/:advertiserId/campaigns/:campaignId/adgroups/:adGroupId/creatives"
          element={
            <ProtectedRoute requiredPermissions={['view_creatives']}>
              <CreativesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisers/:advertiserId/campaigns/:campaignId/adgroups/:adGroupId/creatives/create"
          element={
            <ProtectedRoute requiredPermissions={['create_creative']}>
              <CreateCreativePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advertisers/:advertiserId/campaigns/:campaignId/adgroups/:adGroupId/creatives/:id/edit"
          element={
            <ProtectedRoute requiredPermissions={['edit_creative']}>
              <EditCreativePage />
            </ProtectedRoute>
          }
        />

        {/* AdGroups */}
        <Route
          path="/adgroups"
          element={
            <ProtectedRoute requiredPermissions={['view_adgroups']}>
              <AdGroupsListPage />
            </ProtectedRoute>
          }
        />

        {/* Creatives */}
        <Route
          path="/creatives"
          element={
            <ProtectedRoute requiredPermissions={['view_creatives']}>
              <CreativesListPage />
            </ProtectedRoute>
          }
        />

        {/* Segments */}
        <Route
          path="/segments"
          element={
            <ProtectedRoute requiredPermissions={['view_segments']}>
              <SegmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredPermissions={['view_analytics']}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* New DSP Analytics Pages */}
        <Route
          path="/fraud-detection"
          element={
            <ProtectedRoute requiredPermissions={['view_analytics']}>
              <FraudDetectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audience-insights"
          element={
            <ProtectedRoute requiredPermissions={['view_analytics']}>
              <AudienceInsightsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creative-performance"
          element={
            <ProtectedRoute requiredPermissions={['view_analytics']}>
              <CreativePerformancePage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/advertisers" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App
