import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface IsUserLoggedInStore {
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: (isUserLoggedIn: boolean) => void;
}

export const useIsUserLoggedInStore = create<IsUserLoggedInStore>()(
  persist(
    (set) => ({
      isUserLoggedIn: false,
      setIsUserLoggedIn: (isUserLoggedIn: boolean) => set({ isUserLoggedIn }),
    }),
    {
      name: "isUserLoggedIn-storage",
      storage: createJSONStorage(() => localStorage), // Ensure localStorage is used
    }
  )
);

// interface IsUserLoggedInCheckStore {
//   isUserLoggedIn: boolean;
//   setIsUserLoggedInCheck: (isUserLoggedIn: boolean) => void;
//   hasHydrated: boolean;
//   setHasHydrated: (state: boolean) => void;
// }

// export const useIsUserLoggedInCheckStore = create<IsUserLoggedInCheckStore>()(
//   persist(
//     (set) => ({
//       isUserLoggedIn: false,
//       setIsUserLoggedInCheck: (isUserLoggedIn: boolean) =>
//         set({ isUserLoggedIn }),
//       hasHydrated: false,
//       setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
//     }),
//     {
//       name: "isUserLoggedIn-storage",
//       storage: createJSONStorage(() => localStorage),
//       onRehydrateStorage: () => (state) => {
//         state?.setHasHydrated(true);
//       },
//     }
//   )
// );

interface IEmailStore {
  email: string | null;
  setEmail: (email: string) => void;
}

export const useEmailStore = create<IEmailStore>()(
  persist(
    (set) => ({
      email: null,
      setEmail: (email: string) => set({ email }),
    }),
    {
      name: "email-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface IUserIdStore {
  userId: string | null;
  setUserId: (userId: string) => void;
  clearUserId: () => void;
}

export const useUserIdStore = create<IUserIdStore>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (userId: string) => set({ userId }),
      clearUserId: () => set({ userId: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// interface AvatarImageState {
//   avatarImage: string | null;
//   setAvatarImage: (data: string | null) => void;
// }

// export const useAvatarImageStore = create<AvatarImageState>()(
//   persist(
//     (set) => ({
//       avatarImage: null,
//       setAvatarImage: (avatarImage: string | null) =>
//         set({ avatarImage: avatarImage }),
//     }),
//     {
//       name: "avatar-storage",
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

interface PortraitImageState {
  portraitImage: string | null;
  setPortraitImage: (data: string | null) => void;
}

export const usePortraitImageStore = create<PortraitImageState>()(
  persist(
    (set) => ({
      portraitImage: null,
      setPortraitImage: (portraitImage) => set({ portraitImage }),
    }),
    {
      name: "portrait-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface IFullnameStore {
  fullname: string | null;
  setFullname: (fullname: string) => void;
}

export const useFullnameStore = create<IFullnameStore>()(
  persist(
    (set) => ({
      fullname: null,
      setFullname: (fullname: string) => set({ fullname }),
    }),
    {
      name: "fullname-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface IAccessTokenStore {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  getAccessToken: () => string | null;
}

export const useAccessTokenStore = create<IAccessTokenStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      setAccessToken: (token: string) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null }),
      getAccessToken: () => get().accessToken,
    }),
    {
      name: "access-token-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
