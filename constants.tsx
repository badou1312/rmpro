
import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Truck, 
  Users, 
  Factory,
  Navigation,
  FileSpreadsheet,
  Wallet,
  Archive,
  BrainCircuit,
  Fuel,
  Contact2,
  Wrench,
  ShieldCheck,
  PackageSearch,
  Target,
  PlayCircle,
  Settings
} from 'lucide-react';
import { UserRole } from './types';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const ALL_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.EXPLOITANT, UserRole.COMPTABLE];
const OPS_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.EXPLOITANT];
const FIN_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.COMPTABLE];

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={20} />, roles: ALL_ROLES },
  { id: 'reports', label: 'IA & Rapports', icon: <BrainCircuit size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.COMPTABLE] },
  { id: 'tracking', label: 'Tracking Live', icon: <Navigation size={20} />, roles: OPS_ROLES },
  { id: 'expeditions', label: 'Suivi Expéditions', icon: <PackageSearch size={20} />, roles: OPS_ROLES },
  { id: 'orders', label: 'Missions (OT)', icon: <ClipboardList size={20} />, roles: OPS_ROLES },
  { id: 'palettes', label: 'Gestion Palettes', icon: <Archive size={20} />, roles: OPS_ROLES },
  { id: 'fuel', label: 'Carburant (AS24)', icon: <Fuel size={20} />, roles: OPS_ROLES },
  { id: 'billing', label: 'Facturation', icon: <FileSpreadsheet size={20} />, roles: FIN_ROLES },
  { id: 'treasury', label: 'Trésorerie', icon: <Wallet size={20} />, roles: FIN_ROLES },
  { id: 'clients', label: 'Clients & CRM', icon: <Factory size={20} />, roles: ALL_ROLES },
  { id: 'suppliers', label: 'Fournisseurs', icon: <Contact2 size={20} />, roles: ALL_ROLES },
  { id: 'drivers', label: 'Chauffeurs / TCO', icon: <Users size={20} />, roles: OPS_ROLES },
  { id: 'trucks', label: 'Parc Camions', icon: <Truck size={20} />, roles: OPS_ROLES },
  { id: 'maintenance', label: 'Maintenance PL', icon: <Wrench size={20} />, roles: OPS_ROLES },
  { id: 'insurance', label: 'Assurances', icon: <ShieldCheck size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
  { id: 'toolkit', label: 'Toolkit Business', icon: <Target size={20} />, roles: [UserRole.ADMIN] },
  { id: 'demo', label: 'Parcours Démo', icon: <PlayCircle size={20} />, roles: [UserRole.ADMIN] },
  { id: 'configuration', label: 'Configuration', icon: <Settings size={20} />, roles: [UserRole.ADMIN] },
];
