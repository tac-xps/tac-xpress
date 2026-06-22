import { create } from "zustand"

interface AppState {
  isSidebarMobileOpen: boolean
  setSidebarMobileOpen: (open: boolean) => void
  dashboardFilters: Record<string, string>
  setDashboardFilter: (key: string, value: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarMobileOpen: false,
  setSidebarMobileOpen: (open) => set({ isSidebarMobileOpen: open }),
  dashboardFilters: {},
  setDashboardFilter: (key, value) =>
    set((state) => ({
      dashboardFilters: { ...state.dashboardFilters, [key]: value },
    })),
}))
