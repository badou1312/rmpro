
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import Layout from './components/Layout';
import EntityModal from './components/EntityModal';
import { PersistenceService } from './services/persistence';
import { OrderStatus, FleetStatus, DriverTCOStatus } from './types';
import { Plus } from 'lucide-react';

// Components
import KPISection from './components/KPISection';
import ChartsSection from './components/ChartsSection';
import DashboardMap from './components/DashboardMap';
import DataTables from './components/DataTables';
import TrackingModule from './components/TrackingModule';
import BillingModule from './components/BillingModule';
import TreasuryModule from './components/TreasuryModule';
import TruckModule from './components/TruckModule';
import DriverModule from './components/DriverModule';
import PaletteModule from './components/PaletteModule';
import AIInsights from './components/AIInsights';
import MaintenanceModule from './components/MaintenanceModule';
import InsuranceModule from './components/InsuranceModule';
import CRMModule from './components/CRMModule';
import ExpeditionModule from './components/ExpeditionModule';
import FuelModule from './components/FuelModule';
import SuppliersModule from './components/SuppliersModule';
import DemoClient from './components/DemoClient';
import BusinessToolkit from './components/BusinessToolkit';
import ConfigurationModule from './components/ConfigurationModule';
import LandingPage from './components/LandingPage';
import { MOCK_MAINTENANCE, MOCK_INSURANCES } from './services/mockData';

// Constants
const FRENCH_CITIES = ['Paris', 'Lyon', 'Marseille', 'Lille', 'Bordeaux', 'Nantes', 'Strasbourg', 'Toulouse', 'Nice', 'Montpellier', 'Arras', 'Angers', 'Rouen', 'Rennes', 'Le Havre', 'Reims', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon'];

// Helper to get fields (can be moved to utils)
const getFieldsForEntity = (key: string, data: any) => {
  switch (key) {
    case 'orders':
      return [
        { name: 'client', label: 'Client', type: 'autocomplete', suggestions: data.clients?.map((c: any) => c.name) || [] },
        { name: 'origin', label: 'Lieu Chargement', type: 'autocomplete', suggestions: FRENCH_CITIES },
        { name: 'destination', label: 'Lieu Livraison', type: 'autocomplete', suggestions: FRENCH_CITIES },
        { name: 'palettesInitial', label: 'Nombre de palettes', type: 'number' },
        { name: 'goodsType', label: 'Type de marchandise', type: 'text' },
        { name: 'weight', label: 'Poids (kg)', type: 'number' },
        { name: 'revenue', label: 'Budget (€)', type: 'number' },
        { name: 'date', label: 'Date', type: 'date' }
      ];
    case 'trucks':
      return [
        { name: 'id', label: 'Immatriculation', type: 'text' },
        { name: 'model', label: 'Marque / Modèle', type: 'text' },
        { name: 'mileage', label: 'Kilométrage (km)', type: 'number' },
        { name: 'capacity', label: 'Capacité (palettes)', type: 'number' },
        { name: 'status', label: 'État', type: 'select', options: Object.values(FleetStatus) },
        { name: 'nextCT', label: 'Prochain CT', type: 'date' }
      ];
    case 'drivers':
      return [
        { name: 'firstName', label: 'Prénom', type: 'text' },
        { name: 'lastName', label: 'Nom', type: 'text' },
        { name: 'age', label: 'Âge', type: 'number' },
        { name: 'phone', label: 'Téléphone', type: 'text' },
        { name: 'license', label: 'Permis', type: 'text' },
        { name: 'tcoStatus', label: 'Statut TCO', type: 'select', options: Object.values(DriverTCOStatus) }
      ];
    case 'billing':
      return [
        { name: 'clientName', label: 'Client', type: 'autocomplete', suggestions: data.clients?.map((c: any) => c.name) || [] },
        { name: 'type', label: 'Type', type: 'select', options: ['Facture', 'Devis', 'Bon de Livraison'] },
        { name: 'totalHT', label: 'Montant HT (€)', type: 'number' },
        { name: 'status', label: 'Statut', type: 'select', options: ['Brouillon', 'En attente', 'Payé'] },
        { name: 'date', label: 'Date', type: 'date' }
      ];
    case 'fuel': return [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'truckId', label: 'Véhicule', type: 'text' },
      { name: 'liters', label: 'Litres', type: 'number' },
      { name: 'amount', label: 'Montant (€)', type: 'number' },
      { name: 'location', label: 'Station', type: 'text' }
    ];
    case 'suppliers': return [
      { name: 'name', label: 'Nom', type: 'text' },
      { name: 'type', label: 'Type', type: 'select', options: ['Sous-traitant', 'Location', 'Pièces', 'Garage', 'Dépannage', 'Carburant'] },
      { name: 'contact', label: 'Contact', type: 'text' },
      { name: 'phone', label: 'Téléphone', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' }
    ];
    case 'clients': return [
      { name: 'name', label: 'Nom Entreprise', type: 'text' },
      { name: 'contact', label: 'Contact', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'phone', label: 'Téléphone', type: 'text' },
      { name: 'address', label: 'Adresse', type: 'text' }
    ];
    default: return [];
  }
};

const AppRoutes = () => {
  const { data, refreshData, showToast, isModalOpen, modalConfig, editingItem, closeModal, openModal } = useData();
  const navigate = useNavigate();

  // Helper Wrappers
  const handleSaveEntity = (fd: any) => {
    const key = modalConfig.key;
    let finalData = { ...fd };

    if (key === 'billing') {
      const ht = parseFloat(finalData.totalHT || 0);
      finalData.totalHT = ht;
      finalData.totalTTC = ht * 1.2;
      finalData.items = [{ description: 'Transport', quantity: 1, unitPrice: ht, tva: 20 }];
    }

    if (key === 'orders') {
      if (!finalData.status) finalData.status = OrderStatus.REQUEST;
      finalData.paletteStatus = 'Equilibré';
      finalData.quoteGenerated = false;
      finalData.invoiceGenerated = false;
    }

    if (key === 'drivers') {
      finalData.name = `${finalData.firstName || ''} ${finalData.lastName || ''}`.trim();
      finalData.isAvailable = true;
    }

    if (!editingItem && key !== 'trucks') {
      const prefix = key === 'billing' ? 'FAC' : (key === 'orders' ? 'OT' : (key === 'drivers' ? 'DRV' : 'ITM'));
      finalData.id = `${prefix}-${Date.now().toString().slice(-6)}`;
    }

    const updated = editingItem
      ? PersistenceService.updateItem(key, editingItem.id, finalData)
      : PersistenceService.addItem(key, finalData);

    refreshData();
    showToast("Enregistré");
    closeModal();
  };

  const handleDeleteEntity = (key: string, id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
      PersistenceService.deleteItem(key, id);
      refreshData();
      showToast("Supprimé");
    }
  };

  const openAppModal = (key: string, item?: any) => {
    const fields = getFieldsForEntity(key, data);
    const title = item ? `Modifier : ${item.name || item.id}` : `Nouveau : ${key}`;
    openModal(key, { key, title, fields }, item);
  }

  // Dashboard Page Wrapper
  const Dashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-6 w-full min-w-0">
      <DashboardMap trucks={data?.trucks || []} drivers={data?.drivers || []} onNavigate={(path) => navigate(path === 'dashboard' ? '/' : `/${path}`)} />
      <KPISection />
      <ChartsSection />
      <div className="w-full">
        <DataTables
          orders={data?.orders || []}
          onShowToast={showToast}
          onDownload={() => { }}
          onUpdateStatus={(id, status) => {
            PersistenceService.updateItem('orders', id, { status });
            refreshData();
            showToast(`Statut mis à jour`);
          }}
          onDelete={(id) => handleDeleteEntity('orders', id)}
        />
      </div>
    </div>
  );

  return (
    <>
      {isModalOpen && <EntityModal title={modalConfig.title} fields={modalConfig.fields} initialData={editingItem} onClose={closeModal} onSave={handleSaveEntity} />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tracking" element={<TrackingModule
            trucks={data?.trucks || []}
            drivers={data?.drivers || []}
            onAssignDriver={(tid, did) => {
              PersistenceService.updateItem('trucks', tid, { assignedDriverId: did });
              refreshData();
            }}
            onShowToast={showToast}
          />}
          />
          <Route path="expeditions" element={<ExpeditionModule expeditions={data?.trucks || []} drivers={data?.drivers || []} onNavigate={navigate} />} />
          <Route path="fuel" element={<FuelModule fuelEntries={data?.fuel || []} onAdd={() => openAppModal('fuel')} />} />
          <Route path="suppliers" element={<SuppliersModule suppliers={data?.suppliers || []} onAdd={() => openAppModal('suppliers')} onEdit={(s) => openAppModal('suppliers', s)} onDelete={(id) => handleDeleteEntity('suppliers', id)} />} />
          <Route path="demo" element={<DemoClient onShowToast={showToast} />} />
          <Route path="toolkit" element={<BusinessToolkit />} />
          <Route path="orders" element={
            <div className="space-y-6 w-full min-w-0">
              <div className="flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Missions (OT)</h1>
                <button onClick={() => openAppModal('orders')} className="bg-[#43A047] text-white px-3 py-2 rounded-xl text-[10px] md:text-xs font-black flex items-center gap-2 shadow-lg">
                  <Plus size={14} /> Créer
                </button>
              </div>
              <DataTables
                orders={data?.orders || []}
                onShowToast={showToast}
                onDownload={() => { }}
                onUpdateStatus={(id, status) => {
                  PersistenceService.updateItem('orders', id, { status });
                  refreshData();
                  showToast(`Statut mis à jour`);
                }}
                onDelete={(id) => handleDeleteEntity('orders', id)}
              />
            </div>
          } />
          <Route path="billing" element={<BillingModule documents={data?.billing || []} onAdd={() => openAppModal('billing')} onEdit={(doc) => openAppModal('billing', doc)} onDelete={(id) => handleDeleteEntity('billing', id)} />} />
          <Route path="treasury" element={<TreasuryModule transactions={data?.treasury || []} onAdd={() => openAppModal('treasury')} />} />
          <Route path="clients" element={<CRMModule clients={data?.clients || []} onAdd={() => openAppModal('clients')} onEdit={(c) => openAppModal('clients', c)} onDelete={(id) => handleDeleteEntity('clients', id)} />} />
          <Route path="drivers" element={<DriverModule drivers={data?.drivers || []} onAdd={() => openAppModal('drivers')} onEdit={(d) => openAppModal('drivers', d)} onDelete={(id) => handleDeleteEntity('drivers', id)} />} />
          <Route path="trucks" element={<TruckModule trucks={data?.trucks || []} onAdd={() => openAppModal('trucks')} onDelete={(id) => handleDeleteEntity('trucks', id)} onNavigate={navigate} />} />
          <Route path="maintenance" element={<MaintenanceModule maintenance={MOCK_MAINTENANCE} />} />
          <Route path="insurance" element={<InsuranceModule insurances={MOCK_INSURANCES} onShowToast={showToast} />} />
          <Route path="palettes" element={<PaletteModule />} />
          <Route path="reports" element={<AIInsights data={data} />} />
          <Route path="configuration" element={<ConfigurationModule sidebarConfig={data?.sidebarConfig || {}} onUpdateConfig={(cfg) => { PersistenceService.saveData('sidebarConfig', cfg); refreshData(); }} onShowToast={showToast} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
};

// useNavigate must be used inside BrowserRouter, so wrapper is needed
function useNavigate() {
  return React.useMemo(() => {
    return (path: any) => window.location.hash = path; // Mock for now? No, use real hook import
  }, []);
}

// Correct useNavigate usage
import { useNavigate as useRealNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const [isLanding, setIsLanding] = useState(true);

  if (isLanding) {
    return <LandingPage onStart={() => setIsLanding(false)} />;
  }

  return (
    <DataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
