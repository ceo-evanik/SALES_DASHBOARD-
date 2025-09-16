type User = {
    name: string;
    email: string;
    userType: UserType;
    status: string;
    createdAt: string;
};

type UserType = 'admin' | 'sales' | 'support' | undefined

type UserContextType = {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
};