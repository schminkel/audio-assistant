import { create } from 'zustand'

type LoadingState = {
  isReloading: boolean
  startReloading: () => void
  stopReloading: () => void
}

export const loadingStateStore = create<LoadingState>((set) => ({
  isReloading: false,
  startReloading: () => set({ isReloading: true }),
  stopReloading: () => set({ isReloading: false }),
}))
