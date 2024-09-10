export interface ProductType {
  title: string;
  price: number;
  discount: number;
  related: boolean;
  salesPrice: number;
  category: string[];
  gender: string;
  rating: number;
  stock: boolean;
  qty: number;
  colors: string[];
  photo: string;
  id: number | string;
  created: Date;
  description: string;
}

export interface RegisterType {
  name: string;
  email: number;
  model: boolean;
  id: number | string;
  created: Date;
}

export interface VesselType {
  model: string;
  shipyard: string;
  year: string;
  isNew: boolean;
  length: string;
}

export interface EngineType {
  model: string;
  power: string;
  year: string;
  typeFuel: string;
  date: Date;
}

export interface ProductFiterType {
  id: number;
  filterbyTitle?: string;
  name?: string;
  sort?: string;
  icon?: any;
  devider?: boolean;
}

export interface ProductCardProps {
  id?: string | number;
  color?: string;
  like: string;
  star: number;
  value?: string;
}
