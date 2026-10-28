# KELME საქართველო — Fullstack ონლაინ მაღაზია (Next.js 16 + Firebase)

**KELME საქართველოს** ოფიციალური ონლაინ მაღაზიისა და მარაგის მართვის Fullstack პლატფორმა (`Sport Avenue · ისთ ფოინთი`), რომელიც ერთიან ეკოსისტემაშია **საფეხბურთო აკადემია ტფილისის** (`tbilisi-football-academy`) პროექტთან.

## ტექნოლოგიური სტეკი (Tech Stack)
- **Framework:** Next.js 16 (App Router, Turbopack, Route Handlers)
- **UI & Styling:** React 19, TypeScript 5, Tailwind CSS v4, Lucide Icons
- **Database & Backend:** Firebase v13 (Firestore & Auth) + Next.js Server API (`/api/order`, `/api/order-status`, `/api/payment-callback`)
- **გადახდები და შეტყობინებები:** საქართველოს ბანკი (BoG Payments API), TBC Checkout, Telegram Bot, Google Sheets Webhook

## პროექტის სტრუქტურა
```text
KELME/
├── public/
│   ├── img/                 # 30-ვე მოდელის ორიგინალი ფოტოები (.jpg)
│   ├── cut/                 # გამჭვირვალე ფონზე ამოჭრილი ფოტოები ბანერებისთვის (.webp)
│   ├── fonts/               # ქართული და ლათინური ფონტები (Noto Sans Georgian, Cabin)
│   └── products.json        # პროდუქციის საწყისი კატალოგი და მარაგი
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── order/            # POST/GET/PATCH შეკვეთები, B2B მოთხოვნები, მარაგის ჯავშანი
│   │   │   ├── order-status/     # GET შეკვეთის და გადახდის სტატუსის შემოწმება
│   │   │   └── payment-callback/ # POST ბანკის (BoG / TBC) callback
│   │   ├── admin/page.tsx   # მენეჯერის და მარაგის მართვის პანელი (/admin)
│   │   ├── page.tsx         # მთავარი მაღაზია, კატალოგი, პროდუქტის გვერდი, Checkout, B2B
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/          # Navbar, ProductCard, QuickViewDialog, CartDrawer, SearchOverlay, SizeGuideDialog, Footer
│   ├── context/             # StoreContext (კალათა, ფილტრები, Firebase სინქრონიზაცია)
│   ├── data/                # storeConfig.ts, initialProducts.ts
│   ├── lib/
│   │   ├── firebase/        # config.ts, service.ts (Firestore CRUD)
│   │   └── server/          # core.ts, payments.ts, notify.ts, store.ts
│   └── types/               # store.ts
├── data/მარაგი.xlsx         # Excel-ის მარაგის შაბლონი
└── tools/                   # Python სკრიპტები Excel-იდან მარაგის განახლებისთვის
```

## გაშვება ლოკალურად
```bash
npm run dev
```
საიტი გაიხსნება მისამართზე: `http://localhost:3001` (რათა პარალელურად `http://localhost:3000`-ზე `tbilisi-football-academy`-სთან ერთად იმუშაოს).
ადმინ პანელი: `http://localhost:3001/admin`
