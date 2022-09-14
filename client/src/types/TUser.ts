export type TUser = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    diskSpace: number;
    usedSpace: number;
    isActivated: boolean;
    avatar: string;
    createdAt: string;
}

export interface IUserDTO {
    email: string,
    password: string
}