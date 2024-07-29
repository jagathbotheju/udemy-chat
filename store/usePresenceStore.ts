import { create } from "zustand";
import { devtools } from "zustand/middleware";

type PresenceStore = {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
};

export const usePresenceStore = create<PresenceStore>()(
  devtools(
    (set) => ({
      members: [] as string[],

      add: (id: string) =>
        set((state) => ({ members: [...state.members, id] })),
      remove: (id: string) =>
        set((state) => ({
          members: state.members.filter((member) => member !== id),
        })),
      set: (ids: string[]) => set({ members: ids }),
    }),
    { name: "PresenceStore" }
  )
);
