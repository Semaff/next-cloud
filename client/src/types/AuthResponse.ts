import { TUser } from "./TUser"

export type AuthResponse = {
    token: string,
    user: TUser
}