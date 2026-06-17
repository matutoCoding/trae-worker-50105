import { create } from 'zustand';
import {
  Species, Batch, GraftingRecord, PestInfo, PestTreatment,
  ScheduleItem, Inventory, Customer, Order, Outbound,
  ProjectDelivery, TraceRecord, ContactLog
} from '@/types';
import {
  speciesList, batchList, graftingList, pestInfoList, pestTreatmentList,
  scheduleList, inventoryList, customerList, orderList, outboundList,
  projectDeliveryList, traceRecordList, contactLogList
} from '@/data/mockData';

interface NurseryStore {
  species: Species[];
  batches: Batch[];
  graftings: GraftingRecord[];
  pestInfos: PestInfo[];
  pestTreatments: PestTreatment[];
  schedules: ScheduleItem[];
  inventories: Inventory[];
  customers: Customer[];
  orders: Order[];
  outbounds: Outbound[];
  projectDeliveries: ProjectDelivery[];
  traceRecords: TraceRecord[];
  contactLogs: ContactLog[];
  sidebarCollapsed: boolean;
  currentPage: string;
  setSidebarCollapsed: (v: boolean) => void;
  setCurrentPage: (p: string) => void;
  getSpeciesById: (id: string) => Species | undefined;
  getCustomerById: (id: string) => Customer | undefined;
  getInventoryBySpecies: (speciesId: string) => Inventory[];
  getOrdersByCustomer: (customerId: string) => Order[];
  getTraceByNo: (no: string) => TraceRecord | undefined;
  addSchedule: (item: Omit<ScheduleItem, 'id'>) => void;
  updateSchedule: (id: string, updates: Partial<ScheduleItem>) => void;
  deleteSchedule: (id: string) => void;
  toggleScheduleStatus: (id: string) => void;
}

export const useStore = create<NurseryStore>((set, get) => ({
  species: speciesList,
  batches: batchList,
  graftings: graftingList,
  pestInfos: pestInfoList,
  pestTreatments: pestTreatmentList,
  schedules: scheduleList,
  inventories: inventoryList,
  customers: customerList,
  orders: orderList,
  outbounds: outboundList,
  projectDeliveries: projectDeliveryList,
  traceRecords: traceRecordList,
  contactLogs: contactLogList,
  sidebarCollapsed: false,
  currentPage: 'ledger',
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setCurrentPage: (p) => set({ currentPage: p }),
  getSpeciesById: (id) => get().species.find(s => s.id === id),
  getCustomerById: (id) => get().customers.find(c => c.id === id),
  getInventoryBySpecies: (speciesId) => get().inventories.filter(i => i.speciesId === speciesId),
  getOrdersByCustomer: (customerId) => get().orders.filter(o => o.customerId === customerId),
  getTraceByNo: (no) => get().traceRecords.find(t => t.traceNo.toLowerCase().includes(no.toLowerCase()) || t.traceNo === no),
  addSchedule: (item) => {
    const newId = 'sc' + (Date.now()).toString(36);
    set({ schedules: [...get().schedules, { ...item, id: newId }] });
  },
  updateSchedule: (id, updates) => {
    set({ schedules: get().schedules.map(s => s.id === id ? { ...s, ...updates } : s) });
  },
  deleteSchedule: (id) => {
    set({ schedules: get().schedules.filter(s => s.id !== id) });
  },
  toggleScheduleStatus: (id) => {
    set({
      schedules: get().schedules.map(s =>
        s.id === id ? { ...s, status: s.status === '待办' ? '已完成' : '待办' } : s
      )
    });
  },
}));
