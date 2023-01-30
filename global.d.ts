declare module "parse-address" {
  export function parseLocation(address: string): Address;
}

interface Address {
  number: string;
  prefix: string;
  street: string;
  type: string;
  city: string;
  state: string;
  zip: string;
}
