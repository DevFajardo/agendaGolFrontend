export interface Booking {
  id: string;
  courtId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'cancelled'; 
  totalPrice: number;
}