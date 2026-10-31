import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';
import { DashboardView } from './components/views/DashboardView';
import { DroneCapturesView } from './components/views/DroneCapturesView';
import { WasteMapView } from './components/views/WasteMapView';
import { ReceivedOrdersView } from './components/views/ReceivedOrdersView';
import { CollectionView } from './components/views/CollectionView';
import { InspectionView } from './components/views/InspectionView';
import { RecoveryView } from './components/views/RecoveryView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { CitizenPortalView } from './components/views/CitizenPortalView';
import { FieldCollectorView } from './components/views/FieldCollectorView';
import { LandingPageView } from './components/views/LandingPageView';

const AppContent: React.FC = () => {
  const { currentView, role, isLandingPage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // 1. Landing Page View
  if (isLandingPage) {
    return <LandingPageView />;
  }

  // 2. Citizen Contributor Role View
  if (role === 'citizen') {
    return (
      <div className="min-h-screen bg-[#f0f6f2] p-4 sm:p-8">
        <CitizenPortalView />
      </div>
    );
  }

  // 3. Field Collection Worker Mobile Role View
  if (role === 'collector') {
    return (
      <div className="min-h-screen bg-[#f0f6f2] p-4">
        <FieldCollectorView />
      </div>
    );
  }

  // 4. Administrator / Manager Unified Dashboard
  // STRICT RULE: Exactly ONE consistent sidebar navigation. Zero redundant sidebars!
  return (
    <div className="min-h-screen bg-[#f0f6f2] flex flex-col font-sans">
      {/* The Single Admin Sidebar */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area beside the single sidebar */}
      <div className="lg:pl-64 flex flex-col min-h-screen flex-1 min-w-0 transition-all duration-300">
        {/* Top Header */}
        <AdminHeader
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          searchValue={globalSearch}
          onSearchChange={setGlobalSearch}
          searchPlaceholder={
            currentView === 'map'
              ? 'Search locations, sectors...'
              : currentView === 'received_orders'
              ? 'Search received orders...'
              : currentView === 'collection'
              ? 'Search collected items...'
              : currentView === 'inspection'
              ? 'Search inspections...'
              : currentView === 'recovery'
              ? 'Search recovery orders...'
              : currentView === 'settings'
              ? 'Search settings...'
              : 'Search locations, items, orders...'
          }
        />

        {/* View Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'drone_captures' && <DroneCapturesView />}
          {currentView === 'map' && <WasteMapView />}
          {currentView === 'received_orders' && <ReceivedOrdersView />}
          {currentView === 'collection' && <CollectionView />}
          {currentView === 'inspection' && <InspectionView />}
          {currentView === 'recovery' && <RecoveryView />}
          {currentView === 'reports' && <ReportsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
