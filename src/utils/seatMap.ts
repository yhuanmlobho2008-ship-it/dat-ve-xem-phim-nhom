import { Seat, SeatType, Showtime } from '../types/cinema';

export interface SeatRowData {
  row: string;
  seats: Seat[];
}

export const generateSeatsForShowtime = (showtime: Showtime): SeatRowData[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const columnsCount = 10;

  return rows.map((row) => {
    let type: SeatType = 'standard';
    let basePrice = showtime.priceStandard;

    if (row === 'C' || row === 'D' || row === 'E' || row === 'F') {
      type = 'vip';
      basePrice = showtime.priceVip;
    } else if (row === 'G' || row === 'H') {
      type = 'couple';
      basePrice = showtime.priceCouple;
    }

    const seats: Seat[] = [];
    for (let col = 1; col <= columnsCount; col++) {
      const colStr = col < 10 ? `0${col}` : `${col}`;
      const seatId = `${row}${colStr}`;

      seats.push({
        id: seatId,
        row,
        number: col,
        type,
        price: basePrice
      });
    }

    return {
      row,
      seats
    };
  });
};
