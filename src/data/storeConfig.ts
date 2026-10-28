import { CategoryKey } from '../types/store';

export const SHOP_CONFIG = {
  name: 'KELME საქართველო',
  subtitle: 'ოფიციალური წარმომადგენლობა · Sport Avenue',
  messenger: 'https://m.me/kelmegeorgia',
  instagram: 'https://instagram.com/kelmegeorgia',
  facebook: 'https://facebook.com/kelmegeorgia',
  tiktok: 'https://tiktok.com/@kelmegeorgia',
  globalReferenceUrl: 'https://kelmeshop.ru/',
  academySisterUrl: 'https://tfilisi-football-academy.vercel.app/',
  phone: '+995 599 00 00 00',
  address: 'თბილისი, კახეთის გზატკეცილი 2, ს/ც ისთ ფოინთი (Sport Avenue)',
  hours: 'ყოველდღე 10:00 – 22:00',
  delivery: {
    enabled: true,
    tbilisi: 7,
    regions: 12,
    freeFrom: 200,
  },
  payment: null as 'bog' | 'tbc' | null, // როდესაც ბანკის გასაღებები ჩაირთვება: 'bog' ან 'tbc'
  announcements: [
    'SEASON SALE −70%-მდე · მარაგი შეზღუდულია',
    'დაჯავშნე ონლაინ — აიღე ისთ ფოინთიდან უფასოდ',
    'გუნდური ფორმები კლუბებსა და აკადემიებს · საფეხბურთო აკადემია ტფილისის პარტნიორი',
    '30+ ორიგინალი მოდელი მარაგში · თბილისი & რეგიონები',
  ],
};

export const CATEGORIES: Record<
  CategoryKey,
  {
    title: string;
    shortTitle: string;
    desc: string;
    color: string;
    heroProductId: string;
  }
> = {
  football: {
    title: 'ფეხბურთი · ფუტსალი',
    shortTitle: 'ფეხბურთი',
    desc: 'ბუცები Turf და დარბაზის (Indoor)',
    color: '#2B59C3',
    heroProductId: '55147-3',
  },
  sport: {
    title: 'სპორტი',
    shortTitle: 'სპორტი',
    desc: 'სავარჯიშო და სირბილი',
    color: '#E2582B',
    heroProductId: '46976-1604',
  },
  casual: {
    title: 'ყოველდღიური',
    shortTitle: 'ყოველდღიური',
    desc: 'ქალაქის სნიკერსები',
    color: '#1F7A4D',
    heroProductId: '17500-73',
  },
  kids: {
    title: 'ბავშვები',
    shortTitle: 'ბავშვები',
    desc: 'ადვილად ჩასაცმელი (ზომები 27–35)',
    color: '#F2B33D',
    heroProductId: '55168-706',
  },
};

export const COLOR_HEX_MAP: Record<string, string> = {
  'შავი': '#111214',
  'თეთრი': '#f4f4f4',
  'ლურჯი': '#2457d6',
  'მუქი ლურჯი': '#1b2a52',
  'ნაცრისფერი': '#9a9a9a',
  'წითელი': '#d7141e',
  'მწვანე': '#1e7449',
  'ლაიმისფერი': '#c6e33b',
  'ნარინჯისფერი': '#f07a1f',
  'ბეჟი': '#e6d8bf',
  'ოქროსფერი': '#c9a24a',
  'ვერცხლისფერი': '#c0c0c0',
  'ბორდოსფერი': '#7a1f2b',
  'იისფერი': '#b07ca8',
  'ხაკისფერი': '#7d7a52',
};

export function getSwatchBackground(colorName: string): string {
  const parts = colorName
    .replace(/\(.*?\)/g, '')
    .split('/')
    .map((s) => s.trim());
  const colors = parts.map((p) => COLOR_HEX_MAP[p] || '#cccccc');
  return colors.length > 1
    ? `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)`
    : colors[0];
}

export const ORDER_STATUS_KA: Record<string, string> = {
  new: 'ახალი (გადახდა მაღაზიაში)',
  awaiting_payment: 'ელოდება ბანკის დადასტურებას',
  paid: 'გადახდილია ✓',
  failed: 'გადახდა ვერ შესრულდა',
  expired: 'გადახდის ვადა გავიდა',
  ready: 'მზადაა აღებისთვის (East Point)',
  done: 'გაცემულია / დასრულებულია',
  cancelled: 'გაუქმებულია',
  refunded: 'თანხა დაბრუნდა',
  check_amount: '⚠️ თანხა გადასამოწმებელია',
};

export const SIZE_GUIDE_DATA = [
  { eu: '27', cm: '17.0' },
  { eu: '28', cm: '17.5' },
  { eu: '29', cm: '18.5' },
  { eu: '30', cm: '19.0' },
  { eu: '31', cm: '19.5' },
  { eu: '32', cm: '20.5' },
  { eu: '33', cm: '21.0' },
  { eu: '35', cm: '22.5' },
  { eu: '36', cm: '23.0' },
  { eu: '37', cm: '23.5' },
  { eu: '38', cm: '24.5' },
  { eu: '39', cm: '25.0' },
  { eu: '40', cm: '25.5' },
  { eu: '40.5', cm: '26.0' },
  { eu: '41', cm: '26.5' },
  { eu: '42', cm: '27.0' },
  { eu: '42.5', cm: '27.5' },
  { eu: '43', cm: '28.0' },
  { eu: '44', cm: '28.5' },
  { eu: '45', cm: '29.5' },
];
