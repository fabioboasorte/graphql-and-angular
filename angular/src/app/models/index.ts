export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  age: number;
  nationality: string;
  phone?: string | null;
  address?: Address | null;
}

export interface GetUsersResponse {
  users: User[];
}
