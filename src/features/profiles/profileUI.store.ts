import { create } from 'zustand';

interface ProfileUIState {
  modalOpen: boolean;
  /** null = create new profile, non-null = editing the profile with this id */
  editingId: string | null;

  openCreate: () => void;
  openEdit: (id: string) => void;
  close: () => void;
}

export const useProfileUIStore = create<ProfileUIState>((set) => ({
  modalOpen: false,
  editingId: null,
  openCreate: () => set({ modalOpen: true, editingId: null }),
  openEdit: (id) => set({ modalOpen: true, editingId: id }),
  close: () => set({ modalOpen: false, editingId: null }),
}));