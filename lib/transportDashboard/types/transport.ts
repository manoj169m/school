export interface RouteStudent {
  id: number;
  name: string;
  gender: 'male' | 'female';
  class: string;
  section: string;
  rollNo: string;
  address: string;
  routeName: string;
  stopName: string;
  busFee: number;
  paid: number;
  balance: number;
}

export interface Route {
  id: string;
  name: string;
  students: RouteStudent[];
}

export interface TransportYear {
  id: string;
  name: string;
  routes: Route[];
}