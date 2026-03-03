export interface Court {
  id: number;
  name: string;
  location: string;
  capacity: number;
  price_per_hour: number;
  description: string;
  is_active: boolean;
}