export type KelmeLang = 'en' | 'ka';

export interface KelmeNavLink {
  label: string;
  href: string;
}

export interface KelmeMegaColumn {
  title: string;
  href: string;
  links: KelmeNavLink[];
}

export interface KelmeDropdownGroup {
  title: string;
  href: string;
  links: KelmeNavLink[];
}

export interface KelmeNavItem {
  title: string;
  href: string;
  type: 'link' | 'mega' | 'dropdown';
  columns?: KelmeMegaColumn[];
  groups?: KelmeDropdownGroup[];
}

export interface KelmeHeroSlide {
  id: string;
  desktopImg: string;
  mobileImg: string;
  gradient: string;
  title: string;
  titleKa: string;
  subtitle?: string;
  subtitleKa?: string;
  buttonText: string;
  buttonTextKa: string;
  buttonHref: string;
  buttonBg: string;
  buttonTextColor: string;
  align: 'center' | 'bottom-center' | 'center-end';
}

export interface KelmeProductItem {
  id: string;
  handle: string;
  title: string;
  titleKa: string;
  badge: string;
  salePrice: number;
  regularPrice: number;
  rating: string;
  reviewsCount: number;
  primaryImg: string;
  secondaryImg: string;
  category: string;
  sizes: string[];
}

export interface KelmeMediaGridItem {
  id: string;
  href: string;
  img: string;
  buttonText: string;
  buttonTextKa: string;
  buttonBg: string;
  buttonTextColor: string;
}

export interface KelmeCollectionCard {
  id: string;
  title: string;
  titleKa: string;
  href: string;
  img: string;
}

export interface KelmeBlogPost {
  id: string;
  category: string;
  categoryKa: string;
  title: string;
  titleKa: string;
  excerpt: string;
  excerptKa: string;
  href: string;
  img: string;
}

export const ANNOUNCEMENT_MESSAGES_BY_LANG: Record<KelmeLang, string[]> = {
  en: ['FREE SHIPPING ON ORDERS OVER €50', 'SECURE PAYMENT WITH PAYPAL'],
  ka: ['უფასო მიწოდება 50€-ზე მეტ შეკვეთაზე', 'უსაფრთხო გადახდა PAYPAL-ით'],
};

export const ANNOUNCEMENT_MESSAGES = ANNOUNCEMENT_MESSAGES_BY_LANG.en;

export const KELME_LOGO_URL =
  'https://kelme.com/cdn/shop/files/main-logo.svg?v=1743250713&width=229';

export const KELME_NAV_ITEMS_EN: KelmeNavItem[] = [
  {
    title: 'Back to Sport',
    href: '#featured-1',
    type: 'link',
  },
  {
    title: 'Man',
    href: '#collections',
    type: 'mega',
    columns: [
      {
        title: 'Sneakers',
        href: '#featured-1',
        links: [
          { label: 'Indoor soccer shoes', href: '#featured-2' },
          { label: 'Running shoes', href: '#featured-1' },
          { label: 'Casual sneakers', href: '#featured-1' },
          { label: 'Football boots', href: '#featured-2' },
          { label: 'Turf shoes', href: '#featured-2' },
          { label: 'Spectral', href: '#featured-1' },
          { label: 'All shoes', href: '#featured-1' },
        ],
      },
      {
        title: 'Futsal Bestsellers',
        href: '#featured-2',
        links: [
          { label: 'Elite Range', href: '#featured-2' },
          { label: 'Precision Range', href: '#featured-2' },
          { label: 'Indoor Cup Range', href: '#featured-2' },
          { label: 'Goleiro Range', href: '#featured-2' },
        ],
      },
      {
        title: "Men's clothing",
        href: '#collections',
        links: [
          { label: "Men's Hoodies and Jackets", href: '#collections' },
          { label: "Men's sports t-shirts", href: '#collections' },
          { label: "Men's athletic pants", href: '#collections' },
          { label: "Men's polo shirts", href: '#collections' },
        ],
      },
      {
        title: 'Casual',
        href: '#collections',
        links: [],
      },
      {
        title: "Men's accessories",
        href: '#collections',
        links: [
          { label: 'Balls', href: '#collections' },
          { label: 'Socks', href: '#collections' },
          { label: 'Caps and Hats', href: '#collections' },
          { label: 'Gloves', href: '#collections' },
          { label: 'Backpacks', href: '#collections' },
        ],
      },
    ],
  },
  {
    title: 'Women',
    href: '#collections',
    type: 'mega',
    columns: [
      {
        title: "Women's sneakers",
        href: '#featured-1',
        links: [
          { label: 'Indoor Soccer Shoes', href: '#featured-2' },
          { label: 'Running and Fitness Shoes', href: '#featured-1' },
          { label: 'Casual sneakers', href: '#featured-1' },
          { label: 'Football boots', href: '#featured-2' },
          { label: 'Turf shoes', href: '#featured-2' },
          { label: 'Tennis and padel shoes', href: '#featured-1' },
          { label: 'All sneakers', href: '#featured-1' },
        ],
      },
      {
        title: 'Top Selling Futsal',
        href: '#featured-2',
        links: [
          { label: 'Elite Range', href: '#featured-2' },
          { label: 'Precision Range', href: '#featured-2' },
          { label: 'Indoor Cup Range', href: '#featured-2' },
          { label: 'Goleiro Range', href: '#featured-2' },
        ],
      },
      {
        title: "Women's clothing",
        href: '#collections',
        links: [
          { label: "Women's Hoodies and Jackets", href: '#collections' },
          { label: "Women's sports shirts", href: '#collections' },
          { label: "Women's sports pants and shorts", href: '#collections' },
          { label: "Women's polo shirts", href: '#collections' },
        ],
      },
      {
        title: 'Casual',
        href: '#collections',
        links: [{ label: "Women's casual t-shirts", href: '#collections' }],
      },
      {
        title: "Women's accessories",
        href: '#collections',
        links: [
          { label: 'Balls', href: '#collections' },
          { label: 'Socks', href: '#collections' },
          { label: 'Caps and Beanies', href: '#collections' },
          { label: 'Gloves', href: '#collections' },
          { label: 'Backpacks', href: '#collections' },
        ],
      },
    ],
  },
  {
    title: 'Kids',
    href: '#collections',
    type: 'dropdown',
    groups: [
      {
        title: "Children's sneakers",
        href: '#featured-1',
        links: [
          { label: 'Indoor Soccer Shoes', href: '#featured-2' },
          { label: 'Football boots', href: '#featured-2' },
          { label: 'Casual and School', href: '#featured-1' },
        ],
      },
      {
        title: "Children's clothing",
        href: '#collections',
        links: [
          { label: "Children's T-shirts", href: '#collections' },
          { label: "Boy's pants", href: '#collections' },
          { label: "Children's polo shirts", href: '#collections' },
          { label: "Children's sweatshirts", href: '#collections' },
          { label: "Children's jackets", href: '#collections' },
        ],
      },
    ],
  },
  {
    title: 'Official Products',
    href: '#media-grid',
    type: 'dropdown',
    groups: [
      {
        title: 'Soccer',
        href: '#media-grid',
        links: [
          { label: 'Bosnia and Herzegovina national football team', href: '#media-grid' },
          { label: 'Jordan national football team', href: '#media-grid' },
          { label: 'RCD Espanyol', href: '#media-grid' },
          { label: 'Watford FC', href: '#media-grid' },
          { label: 'Macarthur FC', href: '#media-grid' },
          { label: 'Lebanon national football team', href: '#media-grid' },
          { label: 'Nepal national football team', href: '#media-grid' },
          { label: 'Albion FC', href: '#media-grid' },
          { label: 'Sporting Defender', href: '#media-grid' },
          { label: 'All shirts', href: '#media-grid' },
        ],
      },
      {
        title: 'Indoor Soccer',
        href: '#media-grid',
        links: [{ label: 'Catgas Energia', href: '#media-grid' }],
      },
    ],
  },
  {
    title: 'Outlet',
    href: '#featured-2',
    type: 'link',
  },
];

export const KELME_NAV_ITEMS_KA: KelmeNavItem[] = [
  {
    title: 'სპორტში დაბრუნება',
    href: '#featured-1',
    type: 'link',
  },
  {
    title: 'კაცი',
    href: '#collections',
    type: 'mega',
    columns: [
      {
        title: 'სპორტული ფეხსაცმელი',
        href: '#featured-1',
        links: [
          { label: 'ფუტსალის ფეხსაცმელი', href: '#featured-2' },
          { label: 'სარბენი ფეხსაცმელი', href: '#featured-1' },
          { label: 'ყოველდღიური სნიკერები', href: '#featured-1' },
          { label: 'ფეხბურთის ბუცები', href: '#featured-2' },
          { label: 'ხელოვნური საფარის ბუცები (Turf)', href: '#featured-2' },
          { label: 'Spectral სერია', href: '#featured-1' },
          { label: 'ყველა ფეხსაცმელი', href: '#featured-1' },
        ],
      },
      {
        title: 'ფუტსალის ბესტსელერები',
        href: '#featured-2',
        links: [
          { label: 'Elite ხაზი', href: '#featured-2' },
          { label: 'Precision ხაზი', href: '#featured-2' },
          { label: 'Indoor Cup ხაზი', href: '#featured-2' },
          { label: 'Goleiro ხაზი', href: '#featured-2' },
        ],
      },
      {
        title: 'კაცის ტანსაცმელი',
        href: '#collections',
        links: [
          { label: 'კაცის ჰუდები და ქურთუკები', href: '#collections' },
          { label: 'კაცის სპორტული მაისურები', href: '#collections' },
          { label: 'კაცის სპორტული შარვლები', href: '#collections' },
          { label: 'კაცის პოლო მაისურები', href: '#collections' },
        ],
      },
      {
        title: 'ყოველდღიური',
        href: '#collections',
        links: [],
      },
      {
        title: 'კაცის აქსესუარები',
        href: '#collections',
        links: [
          { label: 'ბურთები', href: '#collections' },
          { label: 'წინდები', href: '#collections' },
          { label: 'კეპები და ქუდები', href: '#collections' },
          { label: 'ხელთათმანები', href: '#collections' },
          { label: 'ზურგჩანთები', href: '#collections' },
        ],
      },
    ],
  },
  {
    title: 'ქალი',
    href: '#collections',
    type: 'mega',
    columns: [
      {
        title: 'ქალის სპორტული ფეხსაცმელი',
        href: '#featured-1',
        links: [
          { label: 'ფუტსალის ფეხსაცმელი', href: '#featured-2' },
          { label: 'სარბენი და ფიტნეს ფეხსაცმელი', href: '#featured-1' },
          { label: 'ყოველდღიური სნიკერები', href: '#featured-1' },
          { label: 'ფეხბურთის ბუცები', href: '#featured-2' },
          { label: 'ხელოვნური საფარის ბუცები (Turf)', href: '#featured-2' },
          { label: 'ჩოგბურთის და პადელის ფეხსაცმელი', href: '#featured-1' },
          { label: 'ყველა სნიკერი', href: '#featured-1' },
        ],
      },
      {
        title: 'ფუტსალის ტოპ გაყიდვები',
        href: '#featured-2',
        links: [
          { label: 'Elite ხაზი', href: '#featured-2' },
          { label: 'Precision ხაზი', href: '#featured-2' },
          { label: 'Indoor Cup ხაზი', href: '#featured-2' },
          { label: 'Goleiro ხაზი', href: '#featured-2' },
        ],
      },
      {
        title: 'ქალის ტანსაცმელი',
        href: '#collections',
        links: [
          { label: 'ქალის ჰუდები და ქურთუკები', href: '#collections' },
          { label: 'ქალის სპორტული მაისურები', href: '#collections' },
          { label: 'ქალის სპორტული შარვლები და შორტები', href: '#collections' },
          { label: 'ქალის პოლო მაისურები', href: '#collections' },
        ],
      },
      {
        title: 'ყოველდღიური',
        href: '#collections',
        links: [{ label: 'ქალის ყოველდღიური მაისურები', href: '#collections' }],
      },
      {
        title: 'ქალის აქსესუარები',
        href: '#collections',
        links: [
          { label: 'ბურთები', href: '#collections' },
          { label: 'წინდები', href: '#collections' },
          { label: 'კეპები და ქუდები', href: '#collections' },
          { label: 'ხელთათმანები', href: '#collections' },
          { label: 'ზურგჩანთები', href: '#collections' },
        ],
      },
    ],
  },
  {
    title: 'ბავშვი',
    href: '#collections',
    type: 'dropdown',
    groups: [
      {
        title: 'ბავშვის სპორტული ფეხსაცმელი',
        href: '#featured-1',
        links: [
          { label: 'ფუტსალის ფეხსაცმელი', href: '#featured-2' },
          { label: 'ფეხბურთის ბუცები', href: '#featured-2' },
          { label: 'ყოველდღიური და სასკოლო', href: '#featured-1' },
        ],
      },
      {
        title: 'ბავშვის ტანსაცმელი',
        href: '#collections',
        links: [
          { label: 'ბავშვის მაისურები', href: '#collections' },
          { label: 'ბავშვის შარვლები', href: '#collections' },
          { label: 'ბავშვის პოლო მაისურები', href: '#collections' },
          { label: 'ბავშვის სვიტერები', href: '#collections' },
          { label: 'ბავშვის ქურთუკები', href: '#collections' },
        ],
      },
    ],
  },
  {
    title: 'ოფიციალური პროდუქცია',
    href: '#media-grid',
    type: 'dropdown',
    groups: [
      {
        title: 'ფეხბურთი',
        href: '#media-grid',
        links: [
          { label: 'ბოსნია და ჰერცეგოვინის ეროვნული ნაკრები', href: '#media-grid' },
          { label: 'იორდანიის ეროვნული ნაკრები', href: '#media-grid' },
          { label: 'ესპანიოლი (RCD Espanyol)', href: '#media-grid' },
          { label: 'უოტფორდი (Watford FC)', href: '#media-grid' },
          { label: 'მაკარტური (Macarthur FC)', href: '#media-grid' },
          { label: 'ლიბანის ეროვნული ნაკრები', href: '#media-grid' },
          { label: 'ნეპალის ეროვნული ნაკრები', href: '#media-grid' },
          { label: 'ალბიონი (Albion FC)', href: '#media-grid' },
          { label: 'სპორტინგ დეფენსორი (Sporting Defender)', href: '#media-grid' },
          { label: 'ყველა ფორმა', href: '#media-grid' },
        ],
      },
      {
        title: 'ფუტსალი',
        href: '#media-grid',
        links: [{ label: 'კატგას ენერგია (Catgas Energia)', href: '#media-grid' }],
      },
    ],
  },
  {
    title: 'აუთლეტი',
    href: '#featured-2',
    type: 'link',
  },
];

export const KELME_NAV_ITEMS_BY_LANG: Record<KelmeLang, KelmeNavItem[]> = {
  en: KELME_NAV_ITEMS_EN,
  ka: KELME_NAV_ITEMS_KA,
};

export const KELME_NAV_ITEMS = KELME_NAV_ITEMS_EN;

export const HERO_SLIDES: KelmeHeroSlide[] = [
  {
    id: 'slide-1',
    desktopImg:
      'https://kelme.com/cdn/shop/files/Banner_Vuelta_al_Deporte.png?v=1790064671&width=3200',
    mobileImg:
      'https://kelme.com/cdn/shop/files/Banner_Movil_Vuelta_al_deporte.png?v=1790064685&width=1000',
    gradient:
      'linear-gradient(180deg, rgba(129, 10, 10, 0), rgba(4, 4, 4, 0.65) 100%)',
    title: 'RETURN TO SPORT',
    titleKa: 'დაბრუნება სპორტში',
    subtitle: '-10% EXTRA WHEN BUYING 2 OR MORE UNITS',
    subtitleKa: '-10% დამატებითი ფასდაკლება 2 ან მეტი ერთეულის შეძენისას',
    buttonText: 'SEE MORE',
    buttonTextKa: 'ვრცლად',
    buttonHref: '#featured-1',
    buttonBg: '#ffffff',
    buttonTextColor: '#000000',
    align: 'center',
  },
  {
    id: 'slide-2',
    desktopImg:
      'https://kelme.com/cdn/shop/files/Banner_Catgas_Energia.png?v=1789559810&width=3200',
    mobileImg:
      'https://kelme.com/cdn/shop/files/Banner_Movil_Catgas_Energia.png?v=1789559814&width=1000',
    gradient:
      'linear-gradient(180deg, rgba(54, 54, 54, 0.2), rgba(4, 4, 4, 0.65) 100%)',
    title: 'KITS NOW AVAILABLE',
    titleKa: 'ფორმები უკვე ხელმისაწვდომია',
    subtitle: 'CATGAS ENERGIA',
    subtitleKa: 'CATGAS ENERGIA',
    buttonText: 'TO BUY',
    buttonTextKa: 'შეძენა',
    buttonHref: '#media-grid',
    buttonBg: '#ffffff',
    buttonTextColor: '#000000',
    align: 'bottom-center',
  },
  {
    id: 'slide-3',
    desktopImg:
      'https://kelme.com/cdn/shop/files/Banner_Espanyol.png?v=1787915785&width=3200',
    mobileImg:
      'https://kelme.com/cdn/shop/files/HOME_KIT_1.jpg?v=1787913904&width=1000',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.35) 100%)',
    title: 'SELECCIÓN NACIONAL DE JORDANIA',
    titleKa: 'იორდანიის ეროვნული ნაკრები',
    buttonText: 'RESERVE AHORA',
    buttonTextKa: 'დაჯავშნეთ ახლავე',
    buttonHref: '#media-grid',
    buttonBg: '#ffffff',
    buttonTextColor: '#000000',
    align: 'center',
  },
  {
    id: 'slide-4',
    desktopImg:
      'https://kelme.com/cdn/shop/files/Banner_Camisetas_Internacional_d9c72a0e-1caa-434d-bfce-cf76d4e90fe2.png?v=1778084154&width=3200',
    mobileImg:
      'https://kelme.com/cdn/shop/files/Banner_Movil_4f54876d-fb0a-48b0-95aa-45fbd7365185.png?v=1778084150&width=1000',
    gradient: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.35) 100%)',
    title: 'WORLD KITS',
    titleKa: 'მსოფლიო ნაკრებების ფორმები',
    buttonText: 'SEE COLLECTION',
    buttonTextKa: 'კოლექციის ნახვა',
    buttonHref: '#media-grid',
    buttonBg: '#ffffff',
    buttonTextColor: '#000000',
    align: 'center',
  },
  {
    id: 'slide-5',
    desktopImg:
      'https://kelme.com/cdn/shop/files/Ignite_Banner_Blanca.png?v=1777550682&width=3200',
    mobileImg:
      'https://kelme.com/cdn/shop/files/Ignite_Post_Blanca.png?v=1777550783&width=1000',
    gradient:
      'linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(54, 54, 54, 0.2) 100%)',
    title: 'IGNITE',
    titleKa: 'IGNITE',
    subtitle: 'SPEED HAS A NEW NAME',
    subtitleKa: 'სისწრაფეს ახალი სახელი აქვს',
    buttonText: 'View collection',
    buttonTextKa: 'კოლექციის ნახვა',
    buttonHref: '#media-grid',
    buttonBg: '#ffffff',
    buttonTextColor: '#16424b',
    align: 'center-end',
  },
];

export const FEATURED_COLLECTION_1: KelmeProductItem[] = [
  {
    id: 'fc1-1',
    handle: 'final-indoor-negro-55031-1126',
    title: 'FINAL INDOOR BLACK SOCCER SHOES',
    titleKa: 'FINAL INDOOR შავი ფუტსალის ფეხსაცმელი',
    badge: '- 30%',
    salePrice: 40.53,
    regularPrice: 57.9,
    rating: '(5.0)',
    reviewsCount: 1,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55031-1126_1.jpg?v=1774861427&width=1024',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55031-1126_5.jpg?v=1763142751&width=1248',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
  },
  {
    id: 'fc1-2',
    handle: 'madrid-azul-46976-4021',
    title: 'MADRID BLUE RUNNING SHOES',
    titleKa: 'MADRID ლურჯი სარბენი ფეხსაცმელი',
    badge: '- 30%',
    salePrice: 49.63,
    regularPrice: 70.9,
    rating: '(4.9)',
    reviewsCount: 18,
    primaryImg:
      'https://kelme.com/cdn/shop/files/46976-4021_1.jpg?v=1774857907&width=1024',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/46976-4021_5.jpg?v=1763141370&width=1248',
    category: 'Running',
    sizes: ['39', '40', '41', '42', '43', '44'],
  },
  {
    id: 'fc1-3',
    handle: 'precision-azul-55211-289',
    title: 'PRECISION INDOOR FOOTBALL BOOTS BLUE-GOLD',
    titleKa: 'PRECISION ფუტსალის ბუცი ლურჯი-ოქროსფერი',
    badge: '- 30%',
    salePrice: 41.93,
    regularPrice: 59.9,
    rating: '(4.7)',
    reviewsCount: 94,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55211-289_1.jpg?v=1774860940&width=1024',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55211-289_4.jpg?v=1775561612&width=1248',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
  },
  {
    id: 'fc1-4',
    handle: 'indoor-copa-blanco-55257-1600',
    title: 'COPA SPECIAL PLAYER INDOOR FOOTBALL SHOES WHITE-GOLD-BLACK',
    titleKa: 'COPA SPECIAL PLAYER ფუტსალის ფეხსაცმელი თეთრი-ოქროსფერი-შავი',
    badge: '- 20%',
    salePrice: 42.32,
    regularPrice: 52.9,
    rating: '(4.7)',
    reviewsCount: 143,
    primaryImg:
      'https://kelme.com/cdn/shop/files/552571600p.jpg?v=1763123863&width=1200',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/552571600e.jpg?v=1763123863&width=1200',
    category: 'Futsal',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
  },
  {
    id: 'fc1-5',
    handle: 'goleiro-azul-55932-492',
    title: 'GOLEIRO BLUE GREEN INDOOR SOCCER SHOES',
    titleKa: 'GOLEIRO ლურჯი-მწვანე ფუტსალის ფეხსაცმელი',
    badge: '- 30%',
    salePrice: 37.73,
    regularPrice: 53.9,
    rating: '(4.8)',
    reviewsCount: 36,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55932492P.jpg?v=1762447573&width=1200',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55932492E.jpg?v=1762447941&width=1200',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
  },
  {
    id: 'fc1-6',
    handle: 'barcelona-146949-9310',
    title: 'YELLOW RUNNING SHOES BARCELONA',
    titleKa: 'BARCELONA ყვითელი სარბენი ფეხსაცმელი',
    badge: '- 20%',
    salePrice: 55.12,
    regularPrice: 68.9,
    rating: '(4.7)',
    reviewsCount: 12,
    primaryImg:
      'https://kelme.com/cdn/shop/files/146949-9310_2.png?v=1771584730&width=1200',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/146949-9310_3.png?v=1771584730&width=1200',
    category: 'Running',
    sizes: ['40', '41', '42', '43', '44'],
  },
  {
    id: 'fc1-7',
    handle: 'valencia-46952-402',
    title: 'RUNNING SHOES VALENCIA YELLOW',
    titleKa: 'VALENCIA ყვითელი სარბენი ფეხსაცმელი',
    badge: '- 20%',
    salePrice: 56.72,
    regularPrice: 70.9,
    rating: '(4.7)',
    reviewsCount: 19,
    primaryImg:
      'https://kelme.com/cdn/shop/files/46952810P.jpg?v=1771320897&width=1200',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/46952810E.jpg?v=1771320897&width=1200',
    category: 'Running',
    sizes: ['39', '40', '41', '42', '43', '44'],
  },
  {
    id: 'fc1-8',
    handle: 'indoor-copa-55257-136',
    title: 'COPA WHITE INDOOR SOCCER SHOES',
    titleKa: 'COPA თეთრი ფუტსალის ფეხსაცმელი',
    badge: '- 20%',
    salePrice: 42.32,
    regularPrice: 52.9,
    rating: '(4.7)',
    reviewsCount: 143,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55257-136_2.png?v=1771512545&width=1200',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55257-136_1.png?v=1771512545&width=1200',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
  },
];

export const KELME_PROMO_VIDEO_MP4 =
  'https://kelme.com/cdn/shop/videos/c/vp/310ffe345c3342a8952b5cc2df0d3382/310ffe345c3342a8952b5cc2df0d3382.HD-1080p-7.2Mbps-92865354.mp4?v=0';

export const MEDIA_GRID_ITEMS: KelmeMediaGridItem[] = [
  {
    id: 'mg-1',
    href: '#featured-2',
    img: 'https://kelme.com/cdn/shop/files/HOME_KIT_1.jpg?v=1787913904&width=1080',
    buttonText: 'WIND',
    buttonTextKa: 'ქარი (WIND)',
    buttonBg: '#ffffff',
    buttonTextColor: '#0019ff',
  },
  {
    id: 'mg-2',
    href: '#featured-2',
    img: 'https://kelme.com/cdn/shop/files/MAPOESPANYOL0656.jpg?v=1787913944&width=1600',
    buttonText: 'View collection',
    buttonTextKa: 'კოლექციის ნახვა',
    buttonBg: '#ff0000',
    buttonTextColor: '#fafafa',
  },
  {
    id: 'mg-3',
    href: '#featured-2',
    img: 'https://kelme.com/cdn/shop/files/MAPOESPANYOL0525-Editar_LOW.jpg?v=1787914077&width=1600',
    buttonText: 'ICE',
    buttonTextKa: 'ყინული (ICE)',
    buttonBg: '#dbff57',
    buttonTextColor: '#000000',
  },
  {
    id: 'mg-4',
    href: '#featured-2',
    img: 'https://kelme.com/cdn/shop/files/prepartido-camiseta-botones-26-27-adulto.jpg?v=1787914386&width=1100',
    buttonText: 'View collection',
    buttonTextKa: 'კოლექციის ნახვა',
    buttonBg: '#ffffff',
    buttonTextColor: '#0019ff',
  },
];

export const FEATURED_COLLECTION_2: KelmeProductItem[] = [
  {
    id: 'fc2-1',
    handle: 'final-indoor-negro-55031-1126',
    title: 'FINAL INDOOR BLACK SOCCER SHOES',
    titleKa: 'FINAL INDOOR შავი ფუტსალის ფეხსაცმელი',
    badge: '- 30%',
    salePrice: 40.53,
    regularPrice: 57.9,
    rating: '(5.0)',
    reviewsCount: 1,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55031-1126_1.jpg?v=1774861427&width=1024',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55031-1126_5.jpg?v=1763142751&width=1248',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
  },
  {
    id: 'fc2-2',
    handle: 'ritmo-in',
    title: 'WHITE RITMO INDOOR SOCCER SHOES',
    titleKa: 'RITMO თეთრი ფუტსალის ფეხსაცმელი',
    badge: '- 40%',
    salePrice: 49.14,
    regularPrice: 81.9,
    rating: '(4.0)',
    reviewsCount: 9,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55172_6_p.jpg?v=1749628397&width=1200',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55172_6_e.jpg?v=1762272038&width=1200',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44'],
  },
  {
    id: 'fc2-3',
    handle: 'precision-38',
    title: 'PRECISION Red Indoor Football Boot',
    titleKa: 'PRECISION წითელი ფუტსალის ბუცი',
    badge: '- 30%',
    salePrice: 41.93,
    regularPrice: 59.9,
    rating: '(4.7)',
    reviewsCount: 94,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55211-9656_1.jpg?v=1763368721&width=1024',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55211-9656_3.jpg?v=1763369318&width=1024',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
  },
  {
    id: 'fc2-4',
    handle: 'final-indoor-azul-55031-4021',
    title: 'FINAL INDOOR BLUE SOCCER SHOES',
    titleKa: 'FINAL INDOOR ლურჯი ფუტსალის ფეხსაცმელი',
    badge: '- 30%',
    salePrice: 40.53,
    regularPrice: 57.9,
    rating: '(5.0)',
    reviewsCount: 4,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55031-4021_1.jpg?v=1763717643&width=1024',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55031-4021_5.jpg?v=1763717758&width=1088',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44'],
  },
  {
    id: 'fc2-5',
    handle: 'goleiro-negro-55932-586',
    title: 'GOLEIRO BLACK YELLOW FUTSAL SHOES',
    titleKa: 'GOLEIRO შავი-ყვითელი ფუტსალის ფეხსაცმელი',
    badge: '- 30%',
    salePrice: 37.73,
    regularPrice: 53.9,
    rating: '(4.8)',
    reviewsCount: 36,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55932586P.jpg?v=1763122820&width=1200',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55932586E.jpg?v=1763122820&width=1200',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
  },
  {
    id: 'fc2-6',
    handle: 'precision-azul-55211-289',
    title: 'PRECISION INDOOR FOOTBALL BOOTS BLUE-GOLD',
    titleKa: 'PRECISION ფუტსალის ბუცი ლურჯი-ოქროსფერი',
    badge: '- 30%',
    salePrice: 41.93,
    regularPrice: 59.9,
    rating: '(4.7)',
    reviewsCount: 94,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55211-289_1.jpg?v=1774860940&width=1024',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55211-289_4.jpg?v=1775561612&width=1248',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
  },
  {
    id: 'fc2-7',
    handle: 'indoor-copa-blanco-55257-1600',
    title: 'COPA SPECIAL PLAYER INDOOR FOOTBALL SHOES WHITE-GOLD-BLACK',
    titleKa: 'COPA SPECIAL PLAYER ფუტსალის ფეხსაცმელი თეთრი-ოქროსფერი-შავი',
    badge: '- 20%',
    salePrice: 42.32,
    regularPrice: 52.9,
    rating: '(4.7)',
    reviewsCount: 143,
    primaryImg:
      'https://kelme.com/cdn/shop/files/552571600p.jpg?v=1763123863&width=1200',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/552571600e.jpg?v=1763123863&width=1200',
    category: 'Futsal',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
  },
  {
    id: 'fc2-8',
    handle: 'stiletto-azul-55967-3',
    title: 'BLUE STILETTO INDOOR SOCCER SHOES',
    titleKa: 'STILETTO ლურჯი ფუტსალის ფეხსაცმელი',
    badge: '- 30%',
    salePrice: 48.93,
    regularPrice: 69.9,
    rating: '(5.0)',
    reviewsCount: 5,
    primaryImg:
      'https://kelme.com/cdn/shop/files/55967-3_8.jpg?v=1774858849&width=1024',
    secondaryImg:
      'https://kelme.com/cdn/shop/files/55967-3_5.jpg?v=1774858849&width=1200',
    category: 'Futsal',
    sizes: ['39', '40', '41', '42', '43', '44'],
  },
];

export const COLLECTION_CARDS: KelmeCollectionCard[] = [
  {
    id: 'col-men',
    title: "Men's clothing",
    titleKa: 'კაცის ტანსაცმელი',
    href: '#featured-1',
    img: 'https://kelme.com/cdn/shop/files/Banner_Hombre.jpg?v=1747748950&width=1500',
  },
  {
    id: 'col-women',
    title: "Women's clothing",
    titleKa: 'ქალის ტანსაცმელი',
    href: '#featured-1',
    img: 'https://kelme.com/cdn/shop/files/Banner_Cloud.jpg?v=1747748966&width=1500',
  },
  {
    id: 'col-kids',
    title: "Children's clothing",
    titleKa: 'ბავშვის ტანსაცმელი',
    href: '#featured-1',
    img: 'https://kelme.com/cdn/shop/files/Banner_kids.jpg?v=1747748995&width=1500',
  },
  {
    id: 'col-sponsorships',
    title: 'Sponsorships',
    titleKa: 'სპონსორობა',
    href: '#media-grid',
    img: 'https://kelme.com/cdn/shop/files/55235023563_a049171d99_o.jpg?v=1779266035&width=1600',
  },
  {
    id: 'col-outlet',
    title: 'Outlet',
    titleKa: 'აუთლეტი',
    href: '#featured-2',
    img: 'https://kelme.com/cdn/shop/files/Banner_outlet.jpg?v=1747748980&width=1500',
  },
];

export const JUDGEME_SUMMARY = {
  averageRating: '4.75',
  numberOfReviews: 3585,
  verifiedCount: 1321,
  monthlyRecord: 278,
  aiSummaryText:
    'Store offers quality sportswear and footwear with competitive pricing. Fast shipping and efficient delivery are frequently praised. Customers appreciate comfort, fit, and durability of products. Some issues reported with sizing accuracy, return costs, and occasional delivery delays. Overall positive feedback on customer service responsiveness.',
  aiSummaryTextKa:
    'მაღაზია გთავაზობთ მაღალი ხარისხის სპორტულ ტანსაცმელსა და ფეხსაცმელს კონკურენტულ ფასად. მომხმარებლები ხშირად აღნიშნავენ სწრაფ და ეფექტურ მიწოდებას, პროდუქციის კომფორტს, მორგებასა და გამძლეობას. მთლიანობაში, მომხმარებელთა მომსახურების სისწრაფესა და ხარისხზე შეფასებები უაღრესად დადებითია.',
  keywords: ['Comfort', 'Quality', 'Service', 'Price', 'Delivery'],
  keywordsKa: ['კომფორტი', 'ხარისხი', 'სერვისი', 'ფასი', 'მიწოდება'],
  histogram: [
    { rating: 5, frequency: 3118, percentage: 87 },
    { rating: 4, frequency: 231, percentage: 6 },
    { rating: 3, frequency: 98, percentage: 3 },
    { rating: 2, frequency: 57, percentage: 2 },
    { rating: 1, frequency: 81, percentage: 2 },
  ],
};

export const BLOG_POSTS: KelmeBlogPost[] = [
  {
    id: 'blog-1',
    category: 'Football',
    categoryKa: 'ფეხბურთი',
    title: 'NEW INDONESIA NATIONAL TEAM 26/27 THIRD KIT',
    titleKa: 'ინდონეზიის ეროვნული ნაკრების 26/27 სეზონის მესამე ფორმა',
    excerpt:
      'KELME and the Football Association of Indonesia (PSSI) reinforce their joint commitment with the presentation of the third kit for the Indonesian national football and futsal teams for the 2026/27 ...',
    excerptKa:
      'KELME და ინდონეზიის ფეხბურთის ასოციაცია (PSSI) განამტკიცებენ ერთობლივ თანამშრომლობას და წარადგენენ ინდონეზიის საფეხბურთო და ფუტსალის ეროვნული ნაკრებების 2026/27 სეზონის მესამე ფორმას...',
    href: '#blog',
    img: 'https://kelme.com/cdn/shop/articles/Untitled-2_7c3afdcb-b3f7-48a1-92f1-bdd6bb4dc10c.jpg?v=1789983621&width=1200',
  },
  {
    id: 'blog-2',
    category: 'Catgas Energia',
    categoryKa: 'Catgas Energia',
    title: 'CATGAS ENERGIA 26/27 KITS NOW AVAILABLE',
    titleKa: 'CATGAS ENERGIA-ს 26/27 სეზონის ფორმები უკვე გაყიდვაშია',
    excerpt:
      'The Catgas Energia kits are now available at kelme.com, get yours!',
    excerptKa:
      'Catgas Energia-ს ახალი ეკიპირება უკვე ხელმისაწვდომია kelme.com-ზე, შეიძინეთ თქვენი ფორმა!',
    href: '#blog',
    img: 'https://kelme.com/cdn/shop/articles/CUADRADO_76101ce0-b822-473d-b611-4dc2f8ec861a.png?v=1790246285&width=1080',
  },
  {
    id: 'blog-3',
    category: 'Kelme',
    categoryKa: 'Kelme',
    title: 'LEGACY INGRAINED: THE NEW WATFORD FC 26/27 THIRD KIT',
    titleKa: 'ტრადიცია და მემკვიდრეობა: WATFORD FC-ის ახალი 26/27 მესამე ფორმა',
    excerpt:
      "KELME and Watford FC present the new third kit for the 2026/27 season: a light grey design that brings back the iconic Happy Hornet, featured on some of the club's most emblematic shirts during the...",
    excerptKa:
      'KELME და Watford FC წარმოგიდგენთ 2026/27 სეზონის ახალ მესამე ფორმას: ღია ნაცრისფერი დიზაინი, რომელიც აბრუნებს კლუბის ლეგენდარულ სიმბოლოს Happy Hornet-ს...',
    href: '#blog',
    img: 'https://kelme.com/cdn/shop/articles/1x1_f0446a79-ec01-487b-8f76-3d99e6683d39.jpg?v=1786708700&width=1200',
  },
];

export const FOOTER_INFO_LINKS_BY_LANG: Record<KelmeLang, KelmeNavLink[]> = {
  en: [
    { label: 'Legal notice', href: '#footer' },
    { label: 'Terms of Service', href: '#footer' },
    { label: 'Privacy Policy', href: '#footer' },
    { label: 'Return policy', href: '#footer' },
    { label: 'Shipping Policy', href: '#footer' },
    { label: 'Contact', href: '#footer' },
  ],
  ka: [
    { label: 'სამართლებრივი ცნობა', href: '#footer' },
    { label: 'მომსახურების პირობები', href: '#footer' },
    { label: 'კონფიდენციალურობის პოლიტიკა', href: '#footer' },
    { label: 'დაბრუნების პოლიტიკა', href: '#footer' },
    { label: 'მიწოდების პოლიტიკა', href: '#footer' },
    { label: 'კონტაქტი', href: '#footer' },
  ],
};

export const FOOTER_INFO_LINKS = FOOTER_INFO_LINKS_BY_LANG.en;

export const COUNTRIES_LIST = [
  {
    code: 'ES',
    name: 'Spain',
    nameKa: 'ესპანეთი',
    currency: 'EUR €',
    symbol: '€',
    rate: 1,
    flag: 'https://cdn.shopify.com/static/images/flags/es.svg?format=jpg&width=60',
  },
  {
    code: 'GE',
    name: 'Georgia',
    nameKa: 'საქართველო',
    currency: 'EUR €',
    symbol: '€',
    rate: 1,
    flag: 'https://cdn.shopify.com/static/images/flags/ge.svg?format=jpg&width=60',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    nameKa: 'დიდი ბრიტანეთი',
    currency: 'GBP £',
    symbol: '£',
    rate: 0.85,
    flag: 'https://cdn.shopify.com/static/images/flags/gb.svg?format=jpg&width=60',
  },
  {
    code: 'US',
    name: 'United States',
    nameKa: 'აშშ',
    currency: 'USD $',
    symbol: '$',
    rate: 1.08,
    flag: 'https://cdn.shopify.com/static/images/flags/us.svg?format=jpg&width=60',
  },
  {
    code: 'DE',
    name: 'Germany',
    nameKa: 'გერმანია',
    currency: 'EUR €',
    symbol: '€',
    rate: 1,
    flag: 'https://cdn.shopify.com/static/images/flags/de.svg?format=jpg&width=60',
  },
  {
    code: 'FR',
    name: 'France',
    nameKa: 'საფრანგეთი',
    currency: 'EUR €',
    symbol: '€',
    rate: 1,
    flag: 'https://cdn.shopify.com/static/images/flags/fr.svg?format=jpg&width=60',
  },
  {
    code: 'IT',
    name: 'Italy',
    nameKa: 'იტალია',
    currency: 'EUR €',
    symbol: '€',
    rate: 1,
    flag: 'https://cdn.shopify.com/static/images/flags/it.svg?format=jpg&width=60',
  },
];

export const LANGUAGES_OPTIONS: {
  code: KelmeLang;
  label: string;
  shortLabel: string;
}[] = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'ka', label: 'ქართული', shortLabel: 'KA' },
];

export const LANGUAGES_LIST = ['English', 'ქართული'];

export const UI_STRINGS: Record<
  KelmeLang,
  {
    allOurFutsal: string;
    seeMore: string;
    igniteHeading: string;
    basedOnReviews: (count: string) => string;
    aiSummaryBtn: string;
    readMore: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
    emailPlaceholder: string;
    subscribeBtn: string;
    subscribeSuccess: string;
    moreInfoTitle: string;
    aboutKelmeTitle: string;
    aboutKelmeBody: string;
    followOnShop: string;
    copyrightText: string;
    cartTitle: string;
    cartEmpty: string;
    continueShopping: string;
    sizeLabel: string;
    totalLabel: string;
    shippingNote: string;
    freeShippingQualify: string;
    checkoutBtn: string;
    orderPlacedAlert: (amount: string) => string;
    searchPlaceholder: string;
    sizeEuLabel: string;
    addToCartBtn: string;
    loginTitle: string;
    loginPrompt: string;
    passwordPlaceholder: string;
    loginBtn: string;
    chooseOptionsAria: string;
  }
> = {
  en: {
    allOurFutsal: 'ALL OUR FUTSAL',
    seeMore: 'See more',
    igniteHeading: 'Ignite - nuevo lanzamiento',
    basedOnReviews: (count) => `Based on ${count} reviews`,
    aiSummaryBtn: 'Ver resumen de reseñas de IA',
    readMore: 'Read more',
    newsletterTitle: 'Newsletter',
    newsletterSubtitle:
      'Sign up to receive our best offers and see the latest releases',
    emailPlaceholder: 'E-mail',
    subscribeBtn: 'Subscribe',
    subscribeSuccess: 'Thank you for subscribing to Kelme newsletter!',
    moreInfoTitle: 'More information',
    aboutKelmeTitle: 'ABOUT KELME',
    aboutKelmeBody:
      'KELME is a Spanish sports equipment brand with over 60 years of history. A leader in the world of indoor soccer and football, we use the latest and greatest technologies dedicated to each sport to offer durable, lightweight, and flexible footwear that guarantees the best performance for all players.',
    followOnShop: 'Follow on Shop',
    copyrightText: '© 2026 - Kelme España',
    cartTitle: 'Cart',
    cartEmpty: 'Your cart is empty',
    continueShopping: 'Continue shopping',
    sizeLabel: 'Size: EU',
    totalLabel: 'Total',
    shippingNote: 'Shipping & taxes calculated at checkout.',
    freeShippingQualify: '✓ You qualify for FREE SHIPPING!',
    checkoutBtn: 'Checkout',
    orderPlacedAlert: (amount) => `Order placed! Total: ${amount}`,
    searchPlaceholder: 'Search for products, futsal shoes, running...',
    sizeEuLabel: 'Size (EU):',
    addToCartBtn: 'Add to cart',
    loginTitle: 'Login',
    loginPrompt: 'Enter your email and password to login:',
    passwordPlaceholder: 'Password',
    loginBtn: 'Login',
    chooseOptionsAria: 'Choose options',
  },
  ka: {
    allOurFutsal: 'ჩვენი ფუტსალის კოლექცია',
    seeMore: 'ნახეთ მეტი',
    igniteHeading: 'Ignite - ახალი კოლექცია',
    basedOnReviews: (count) => `დაფუძნებულია ${count} შეფასებაზე`,
    aiSummaryBtn: 'AI შეფასებების შეჯამების ნახვა',
    readMore: 'სრულად წაკითხვა',
    newsletterTitle: 'სიახლეების გამოწერა',
    newsletterSubtitle:
      'გამოიწერეთ ჩვენი საუკეთესო შეთავაზებები და უახლესი კოლექციები',
    emailPlaceholder: 'ელ. ფოსტა',
    subscribeBtn: 'გამოწერა',
    subscribeSuccess: 'მადლობა Kelme-ს სიახლეების გამოწერისთვის!',
    moreInfoTitle: 'დამატებითი ინფორმაცია',
    aboutKelmeTitle: 'KELME-ს შესახებ',
    aboutKelmeBody:
      'KELME არის ესპანური სპორტული ეკიპირების ბრენდი 60 წელზე მეტი ისტორიით. მსოფლიო ლიდერი ფუტსალისა და ფეხბურთის სამყაროში — ჩვენ ვიყენებთ თითოეული სპორტისთვის შექმნილ უახლეს ტექნოლოგიებს, რათა შემოგთავაზოთ გამძლე, მსუბუქი და მოქნილი ფეხსაცმელი, რომელიც ყველა მოთამაშეს საუკეთესო შედეგს უზრუნველყოფს.',
    followOnShop: 'გამოგვყევით Shop-ზე',
    copyrightText: '© 2026 - Kelme საქართველო',
    cartTitle: 'კალათა',
    cartEmpty: 'თქვენი კალათა ცარიელია',
    continueShopping: 'შოპინგის გაგრძელება',
    sizeLabel: 'ზომა: EU',
    totalLabel: 'ჯამი',
    shippingNote: 'მიწოდება და გადასახადები იანგარიშება გადახდისას.',
    freeShippingQualify: '✓ თქვენ გეკუთვნით უფასო მიწოდება!',
    checkoutBtn: 'შეკვეთის გაფორმება',
    orderPlacedAlert: (amount) => `შეკვეთა მიღებულია! ჯამი: ${amount}`,
    searchPlaceholder: 'მოძებნეთ პროდუქცია, ფუტსალის ფეხსაცმელი, სარბენი...',
    sizeEuLabel: 'ზომა (EU):',
    addToCartBtn: 'კალათაში დამატება',
    loginTitle: 'შესვლა',
    loginPrompt: 'შეიყვანეთ თქვენი ელ. ფოსტა და პაროლი შესასვლელად:',
    passwordPlaceholder: 'პაროლი',
    loginBtn: 'შესვლა',
    chooseOptionsAria: 'აირჩიეთ ზომა',
  },
};
