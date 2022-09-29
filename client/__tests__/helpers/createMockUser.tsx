import { TUser } from "../../src/types/TUser";

export function createMockUser(): TUser {
  return {
    avatar: "",
    createdAt: "",
    diskSpace: 231283812321,
    email: "example@mail.com",
    firstname: "First",
    id: 1232131,
    isActivated: true,
    lastname: "Last",
    usedSpace: 2323
  }
}