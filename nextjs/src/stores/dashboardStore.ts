import { create } from 'zustand'

type LoadingState = {
  userRequests: string
  allUserRequests: string
  globalRequests: string
  userLimit: string
  globalLimit: string
  userId: string
  setUserRequests: (userRequests: string) => void
  setAllUserRequests: (allUserRequests: string) => void
  setGlobalRequests: (globalRequests: string) => void
  setUserLimit: (userLimit: string) => void
  setGlobalLimit: (globalLimit: string) => void
  setUserId: (userId: string) => void
}

export const dashboardStore = create<LoadingState>((set) => ({
  userRequests: '',
  allUserRequests: '',
  globalRequests: '',
  userLimit: '',
  globalLimit: '',
  userId: '',
  setUserRequests: (userRequests) => set({ userRequests }),
  setAllUserRequests: (allUserRequests) => set({ allUserRequests }),
  setGlobalRequests: (globalRequests) => set({ globalRequests }),
  setUserLimit: (userLimit) => set({ userLimit }),
  setGlobalLimit: (globalLimit) => set({ globalLimit }),
  setUserId: (userId) => set({ userId }),
}))
