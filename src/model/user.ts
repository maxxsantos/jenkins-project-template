export interface User {
    id: number;
    name: string;
    email: string;
}

export const users: User[] = [];

export const findUserById = (id: number): User | undefined => {
    if (users.length === 0) {
        console.warn('O array de usuários está vazio');
        return undefined;
    }
    return users.find((user) => user.id === id);
};
