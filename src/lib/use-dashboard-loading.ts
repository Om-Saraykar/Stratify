// lib/use-dashboard-loading.ts
import { create } from "zustand";

type DashboardLoadingState = {
  loading: boolean;
  setLoading: (value: boolean) => void;
};

export const useDashboardLoading = create<DashboardLoadingState>((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),
}));
