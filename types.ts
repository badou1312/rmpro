
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'Directeur',
  EXPLOITANT = 'Exploitant',
  COMPTABLE = 'Comptable'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export enum FleetStatus {
  ACTIVE = 'Actif',
  MAINTENANCE = 'Maintenance',
  AVAILABLE = 'Disponible',
  OUT_OF_SERVICE = 'Hors Service',
  GARAGE = 'Au Garage',
  BREAKDOWN = 'En Panne'
}

export enum EquipmentEngagementStatus {
  WAITING = 'En attente',
  ON_ROUTE = 'En route',
  LOADING = 'Chargement',
  UNLOADING = 'Déchargement',
  BREAK = 'Pause',
  FREE = 'Libre'
}

export enum OrderStatus {
  REQUEST = 'Demande',
  FEASIBILITY = 'Faisabilité',
  QUOTE = 'Devis',
  VALIDATED = 'Validé',
  PLANNED = 'Planifié',
  EXECUTING = 'En cours d\'exécution',
  ARRIVED = 'Arrivé chez client',
  START_OPS = 'Début opérations',
  END_OPS = 'Fin opérations',
  DELIVERED = 'Livré / Terminé',
  CANCELED = 'Annulé',
  SHIPPED = 'En transit',
  PENDING = 'En attente'
}

export enum DriverTCOStatus {
  DRIVING = 'En conduite',
  WORK = 'Travail (hors conduite)',
  REST = 'Repos / Coupure',
  AVAILABLE = 'Disponibilité',
  OFF_DUTY = 'Fin de service',
  SICK = 'Maladie',
  VACATION = 'Congés',
  ABSENT = 'Absent'
}

export interface Supplier {
  id: string;
  name: string;
  type: 'Sous-traitant' | 'Location' | 'Pièces' | 'Garage' | 'Dépannage' | 'Carburant';
  contact: string;
  phone: string;
  email: string;
}

export interface FuelEntry {
  id: string;
  date: string;
  truckId: string;
  otId?: string;
  liters: number;
  amount: number;
  location: string;
  provider: 'AS24' | 'Interne' | 'Autre';
  anomaly?: boolean;
}

export interface Order {
  id: string;
  client: string;
  origin: string;
  destination: string;
  status: OrderStatus;
  date: string;
  revenue: number;
  goodsType?: string;
  weight?: number;
  palettesInitial: number;
  palettesReal?: number;
  paletteStatus: 'Equilibré' | 'Dette' | 'Anomalie';
  quoteGenerated: boolean;
  invoiceGenerated: boolean;
}

export interface Truck {
  id: string;
  model: string;
  status: FleetStatus;
  engagement: EquipmentEngagementStatus;
  mileage: string | number;
  capacity?: number;
  nextCT: string;
  assignedDriverId?: string;
  palettesOnBoard: number;
  location?: { lat: number; lng: number; address: string; };
  currentClient?: string;
  hasTrailer?: boolean;
  trailerId?: string;
  currentGoods?: string;
  speed?: number;
}

export interface Trailer {
  id: string;
  type: string;
  status: FleetStatus;
  lastMaintenance: string;
}

export interface Driver {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  age?: number;
  idCard?: string;
  tcoStatus: DriverTCOStatus;
  isAvailable: boolean;
  license: string;
  phone: string;
  lastMission?: string;
}

export interface Transaction {
  id: string;
  date: string;
  label: string;
  amount: number;
  type: 'Encaissement' | 'Décaissement';
  category: string;
  paymentMethod: 'Virement' | 'Carte' | 'Prélèvement' | 'Espèces';
}

export interface BillingDocument {
  id: string;
  type: 'Facture' | 'Devis' | 'Bon de Livraison';
  date: string;
  dueDate?: string;
  clientName: string;
  clientAddress?: string;
  status: string;
  totalHT: number;
  totalTTC: number;
  items: any[];
}
