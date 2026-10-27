import { Showtime } from '../types/cinema';

// Helper to get formatted dates: 'YYYY-MM-DD'
export const getFormattedDate = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const getDisplayDateLabel = (dateStr: string): string => {
  const today = getFormattedDate(0);
  const tomorrow = getFormattedDate(1);
  if (dateStr === today) return 'Hôm nay';
  if (dateStr === tomorrow) return 'Ngày mai';

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
};

// Generate realistic showtimes for movies across cinemas
export const generateInitialShowtimes = (): Showtime[] => {
  const today = getFormattedDate(0);
  const tomorrow = getFormattedDate(1);
  const dayAfter = getFormattedDate(2);

  return [
    // Dune: Part Two (mov-01)
    {
      id: 'st-01',
      movieId: 'mov-01',
      cinemaId: 'cin-01',
      room: 'Phòng 01 - IMAX Laser',
      format: 'IMAX 2D',
      date: today,
      time: '14:15',
      priceStandard: 120000,
      priceVip: 160000,
      priceCouple: 320000,
      occupiedSeats: ['D05', 'D06', 'E05', 'E06', 'F07', 'F08']
    },
    {
      id: 'st-02',
      movieId: 'mov-01',
      cinemaId: 'cin-01',
      room: 'Phòng 01 - IMAX Laser',
      format: 'IMAX 2D',
      date: today,
      time: '18:30',
      priceStandard: 130000,
      priceVip: 175000,
      priceCouple: 350000,
      occupiedSeats: ['C04', 'C05', 'D04', 'D05', 'D06', 'D07', 'E06', 'E07', 'G05', 'G06']
    },
    {
      id: 'st-03',
      movieId: 'mov-01',
      cinemaId: 'cin-01',
      room: 'Phòng 02 - Dolby Atmos',
      format: '2D Phụ đề',
      date: today,
      time: '21:15',
      priceStandard: 90000,
      priceVip: 120000,
      priceCouple: 240000,
      occupiedSeats: ['B04', 'B05', 'F05']
    },
    {
      id: 'st-04',
      movieId: 'mov-01',
      cinemaId: 'cin-02',
      room: 'Phòng 03 - IMAX',
      format: 'IMAX 2D',
      date: today,
      time: '19:00',
      priceStandard: 125000,
      priceVip: 165000,
      priceCouple: 330000,
      occupiedSeats: ['D06', 'D07', 'E07']
    },
    {
      id: 'st-05',
      movieId: 'mov-01',
      cinemaId: 'cin-01',
      room: 'Phòng 01 - IMAX Laser',
      format: 'IMAX 2D',
      date: tomorrow,
      time: '15:00',
      priceStandard: 120000,
      priceVip: 160000,
      priceCouple: 320000,
      occupiedSeats: ['E05', 'E06']
    },
    {
      id: 'st-06',
      movieId: 'mov-01',
      cinemaId: 'cin-01',
      room: 'Phòng 01 - IMAX Laser',
      format: 'IMAX 2D',
      date: tomorrow,
      time: '19:45',
      priceStandard: 130000,
      priceVip: 175000,
      priceCouple: 350000,
      occupiedSeats: ['C05', 'D05', 'D06']
    },

    // Oppenheimer (mov-02)
    {
      id: 'st-07',
      movieId: 'mov-02',
      cinemaId: 'cin-01',
      room: 'Phòng 03 - VIP Hall',
      format: 'IMAX 2D',
      date: today,
      time: '16:00',
      priceStandard: 120000,
      priceVip: 160000,
      priceCouple: 320000,
      occupiedSeats: ['E04', 'E05', 'F06']
    },
    {
      id: 'st-08',
      movieId: 'mov-02',
      cinemaId: 'cin-01',
      room: 'Phòng 03 - VIP Hall',
      format: 'IMAX 2D',
      date: today,
      time: '20:00',
      priceStandard: 125000,
      priceVip: 165000,
      priceCouple: 330000,
      occupiedSeats: ['D05', 'D06', 'D07', 'E05', 'E06']
    },
    {
      id: 'st-09',
      movieId: 'mov-02',
      cinemaId: 'cin-03',
      room: 'Phòng 02 - Standard',
      format: '2D Phụ đề',
      date: today,
      time: '18:45',
      priceStandard: 85000,
      priceVip: 110000,
      priceCouple: 220000,
      occupiedSeats: ['C04', 'C05']
    },

    // Deadpool & Wolverine (mov-03)
    {
      id: 'st-10',
      movieId: 'mov-03',
      cinemaId: 'cin-01',
      room: 'Phòng 04 - 3D RealD',
      format: '3D Phụ đề',
      date: today,
      time: '13:30',
      priceStandard: 105000,
      priceVip: 135000,
      priceCouple: 270000,
      occupiedSeats: ['D03', 'D04', 'E05']
    },
    {
      id: 'st-11',
      movieId: 'mov-03',
      cinemaId: 'cin-01',
      room: 'Phòng 04 - 3D RealD',
      format: '3D Phụ đề',
      date: today,
      time: '17:15',
      priceStandard: 110000,
      priceVip: 140000,
      priceCouple: 280000,
      occupiedSeats: ['D05', 'D06', 'E06', 'E07', 'F04', 'F05']
    },
    {
      id: 'st-12',
      movieId: 'mov-03',
      cinemaId: 'cin-01',
      room: 'Phòng 04 - 3D RealD',
      format: '3D Phụ đề',
      date: today,
      time: '21:00',
      priceStandard: 110000,
      priceVip: 140000,
      priceCouple: 280000,
      occupiedSeats: ['B05', 'C06', 'D07', 'D08']
    },
    {
      id: 'st-13',
      movieId: 'mov-03',
      cinemaId: 'cin-02',
      room: 'Phòng 01 - Prime',
      format: '2D Phụ đề',
      date: today,
      time: '19:15',
      priceStandard: 90000,
      priceVip: 115000,
      priceCouple: 230000,
      occupiedSeats: ['E05', 'E06']
    },

    // Avatar: The Way of Water (mov-04)
    {
      id: 'st-14',
      movieId: 'mov-04',
      cinemaId: 'cin-01',
      room: 'Phòng 01 - IMAX Laser',
      format: '3D Phụ đề',
      date: today,
      time: '10:30',
      priceStandard: 125000,
      priceVip: 165000,
      priceCouple: 330000,
      occupiedSeats: ['D04', 'D05']
    },
    {
      id: 'st-15',
      movieId: 'mov-04',
      cinemaId: 'cin-03',
      room: 'Phòng 01 - 4DX Dynamic',
      format: '4DX',
      date: today,
      time: '15:45',
      priceStandard: 150000,
      priceVip: 190000,
      priceCouple: 380000,
      occupiedSeats: ['C04', 'C05', 'D04', 'D05']
    },

    // Spider-Man: Across the Spider-Verse (mov-05)
    {
      id: 'st-16',
      movieId: 'mov-05',
      cinemaId: 'cin-01',
      room: 'Phòng 05 - Cinema City',
      format: '2D Lồng tiếng',
      date: today,
      time: '11:00',
      priceStandard: 85000,
      priceVip: 110000,
      priceCouple: 220000,
      occupiedSeats: ['B02', 'B03']
    },
    {
      id: 'st-17',
      movieId: 'mov-05',
      cinemaId: 'cin-01',
      room: 'Phòng 05 - Cinema City',
      format: '2D Phụ đề',
      date: today,
      time: '16:30',
      priceStandard: 90000,
      priceVip: 115000,
      priceCouple: 230000,
      occupiedSeats: ['D05', 'D06', 'E06']
    },

    // Inside Out 2 (mov-06)
    {
      id: 'st-18',
      movieId: 'mov-06',
      cinemaId: 'cin-01',
      room: 'Phòng 02 - Kids & Family',
      format: '2D Lồng tiếng',
      date: today,
      time: '13:00',
      priceStandard: 85000,
      priceVip: 110000,
      priceCouple: 220000,
      occupiedSeats: ['C04', 'C05', 'C06', 'D05', 'D06']
    },
    {
      id: 'st-19',
      movieId: 'mov-06',
      cinemaId: 'cin-02',
      room: 'Phòng 02 - Standard',
      format: '2D Lồng tiếng',
      date: today,
      time: '17:30',
      priceStandard: 85000,
      priceVip: 110000,
      priceCouple: 220000,
      occupiedSeats: ['D03', 'D04']
    },

    // John Wick: Chapter 4 (mov-07)
    {
      id: 'st-20',
      movieId: 'mov-07',
      cinemaId: 'cin-01',
      room: 'Phòng 03 - Laser Black',
      format: '2D Phụ đề',
      date: today,
      time: '21:30',
      priceStandard: 95000,
      priceVip: 125000,
      priceCouple: 250000,
      occupiedSeats: ['D06', 'D07', 'E05', 'E06', 'F06']
    },

    // Mai (mov-08)
    {
      id: 'st-21',
      movieId: 'mov-08',
      cinemaId: 'cin-01',
      room: 'Phòng 04 - VIP Lounge',
      format: '2D Phụ đề',
      date: today,
      time: '19:30',
      priceStandard: 90000,
      priceVip: 120000,
      priceCouple: 240000,
      occupiedSeats: ['E04', 'E05', 'E06', 'G04', 'G05']
    },

    // Godzilla x Kong (mov-09)
    {
      id: 'st-22',
      movieId: 'mov-09',
      cinemaId: 'cin-01',
      room: 'Phòng 01 - IMAX Laser',
      format: 'IMAX 2D',
      date: today,
      time: '16:30',
      priceStandard: 120000,
      priceVip: 160000,
      priceCouple: 320000,
      occupiedSeats: ['C05', 'C06', 'D05', 'D06']
    },

    // Lật Mặt 7 (mov-10)
    {
      id: 'st-23',
      movieId: 'mov-10',
      cinemaId: 'cin-03',
      room: 'Phòng 03 - CineSound',
      format: '2D Phụ đề',
      date: today,
      time: '18:00',
      priceStandard: 85000,
      priceVip: 110000,
      priceCouple: 220000,
      occupiedSeats: ['D04', 'D05', 'E04', 'E05', 'F05']
    },

    // The Batman (mov-11)
    {
      id: 'st-24',
      movieId: 'mov-11',
      cinemaId: 'cin-01',
      room: 'Phòng 02 - Dark Room',
      format: '2D Phụ đề',
      date: tomorrow,
      time: '20:15',
      priceStandard: 90000,
      priceVip: 120000,
      priceCouple: 240000,
      occupiedSeats: ['D05', 'D06']
    },

    // Top Gun: Maverick (mov-12)
    {
      id: 'st-25',
      movieId: 'mov-12',
      cinemaId: 'cin-02',
      room: 'Phòng 01 - 4DX',
      format: '4DX',
      date: dayAfter,
      time: '19:15',
      priceStandard: 145000,
      priceVip: 185000,
      priceCouple: 370000,
      occupiedSeats: ['C05', 'D05']
    },

    // Furiosa (mov-13)
    {
      id: 'st-26',
      movieId: 'mov-13',
      cinemaId: 'cin-01',
      room: 'Phòng 03 - Thunder',
      format: 'IMAX 2D',
      date: tomorrow,
      time: '18:15',
      priceStandard: 120000,
      priceVip: 160000,
      priceCouple: 320000,
      occupiedSeats: ['D04', 'D05']
    },

    // Interstellar (mov-14)
    {
      id: 'st-27',
      movieId: 'mov-14',
      cinemaId: 'cin-01',
      room: 'Phòng 01 - IMAX Laser',
      format: 'IMAX 2D',
      date: today,
      time: '22:00',
      priceStandard: 130000,
      priceVip: 175000,
      priceCouple: 350000,
      occupiedSeats: ['D05', 'D06', 'D07', 'E05', 'E06', 'E07', 'F05', 'F06']
    },

    // Kung Fu Panda 4 (mov-15)
    {
      id: 'st-28',
      movieId: 'mov-15',
      cinemaId: 'cin-02',
      room: 'Phòng 02 - Junior',
      format: '2D Lồng tiếng',
      date: tomorrow,
      time: '10:00',
      priceStandard: 80000,
      priceVip: 105000,
      priceCouple: 210000,
      occupiedSeats: ['B04', 'B05']
    }
  ];
};
