import type { RoleDoc } from '../models/Role'

export const roles: RoleDoc[] = [
  {
    roleName: 'super_admin',
    title: 'Super Admin',
    allows: [
      'login',
      'pos',
      'orders',
      'library',
      'category',
      'product',
      'stockOpname',
      'dashboard',
      'customers',
      'role',
    ],
  },
  {
    roleName: 'admin',
    title: 'Admin',
    allows: ['pos', 'orders', 'stockOpname', 'category', 'product', 'library'],
  },
  {
    roleName: 'user',
    title: 'User',
    allows: ['pos'],
  },
]

export interface SeedProduct {
  name: string
  category: string
  details: string
  buyPrice: number
  wholesalerPrice: number
  retailPrice: number
  stock: number
  image: string
}

const commons = (path: string) =>
  `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}/960px-${path.split('/').pop()}`

// A restaurant menu has a single selling price, so the wholesale price matches retail.
const menuItem = (item: Omit<SeedProduct, 'wholesalerPrice'>): SeedProduct => ({
  ...item,
  wholesalerPrice: item.retailPrice,
})

// Images are hotlinked from Wikimedia Commons; credits are in the comment above each item.
// `buyPrice` is the cost per portion and `stock` the portions prepared.
export const products: SeedProduct[] = [
  // "Nasi goreng indonesia.jpg" by Helito, CC BY-SA 4.0
  menuItem({
    name: 'Nasi Goreng Spesial',
    category: 'Nasi',
    details: 'Nasi goreng dengan telur mata sapi, ayam suwir dan kerupuk.',
    buyPrice: 13000,
    retailPrice: 25000,
    stock: 80,
    image: commons('3/3e/Nasi_goreng_indonesia.jpg'),
  }),
  // "Nasi campur, Ubud, Indonesia.jpg" by Vyacheslav Argenberg, CC BY 4.0
  menuItem({
    name: 'Nasi Campur Bali',
    category: 'Nasi',
    details: 'Nasi putih dengan sate lilit, ayam sisit, sayur urap dan sambal matah.',
    buyPrice: 15000,
    retailPrice: 28000,
    stock: 50,
    image: commons('1/13/Nasi_campur%2C_Ubud%2C_Indonesia.jpg'),
  }),
  // "Nasi uduk netherlands.jpg" by Takeaway, CC BY-SA 3.0
  menuItem({
    name: 'Nasi Uduk Komplit',
    category: 'Nasi',
    details: 'Nasi uduk dengan telur dadar, orek tempe dan sambal kacang.',
    buyPrice: 10000,
    retailPrice: 20000,
    stock: 60,
    image: commons('a/a6/Nasi_uduk_netherlands.jpg'),
  }),
  // "Beef Rendang..JPG" by Miansari66, CC0
  menuItem({
    name: 'Nasi Rendang Sapi',
    category: 'Nasi',
    details: 'Nasi putih dengan rendang daging sapi khas Padang.',
    buyPrice: 18000,
    retailPrice: 32000,
    stock: 40,
    image: commons('5/50/Beef_Rendang..JPG'),
  }),
  // "Mi Goreng GM.jpg" by Gunawan Kartapranata, CC BY-SA 3.0
  menuItem({
    name: 'Mie Goreng Jawa',
    category: 'Mie & Bakso',
    details: 'Mie telur goreng bumbu Jawa dengan sayur dan ayam.',
    buyPrice: 11000,
    retailPrice: 22000,
    stock: 60,
    image: commons('f/f0/Mi_Goreng_GM.jpg'),
  }),
  // "Mi ayam jamur.JPG" by Midori, CC BY-SA 3.0
  menuItem({
    name: 'Mie Ayam Jamur',
    category: 'Mie & Bakso',
    details: 'Mie ayam dengan topping jamur, sawi dan kuah kaldu.',
    buyPrice: 9000,
    retailPrice: 18000,
    stock: 70,
    image: commons('8/82/Mi_ayam_jamur.JPG'),
  }),
  // "Bakso Indonesian Meatball Soup from Solo.jpg" by Bajinra, CC0
  menuItem({
    name: 'Bakso Sapi Kuah',
    category: 'Mie & Bakso',
    details: 'Bakso sapi dengan bihun, tahu dan kuah kaldu sapi.',
    buyPrice: 10000,
    retailPrice: 20000,
    stock: 70,
    image: commons('6/6e/Bakso_Indonesian_Meatball_Soup_from_Solo.jpg'),
  }),
  // "Soto ayam.JPG" by Sakurai Midori, CC BY-SA 3.0
  menuItem({
    name: 'Soto Ayam',
    category: 'Mie & Bakso',
    details: 'Soto ayam kuah kuning dengan soun, telur dan koya.',
    buyPrice: 10000,
    retailPrice: 20000,
    stock: 60,
    image: commons('0/05/Soto_ayam.JPG'),
  }),
  // "Sate Ayam Panggang.jpg" by Meandkancil2020, CC BY-SA 4.0
  menuItem({
    name: 'Sate Ayam (10 tusuk)',
    category: 'Sate & Bakaran',
    details: 'Sate ayam bumbu kacang, disajikan dengan lontong.',
    buyPrice: 13000,
    retailPrice: 25000,
    stock: 60,
    image: commons('4/44/Sate_Ayam_Panggang.jpg'),
  }),
  // "Sate Kambing di Rumah-1.jpg" by Indonesiagood, CC BY 4.0
  menuItem({
    name: 'Sate Kambing (10 tusuk)',
    category: 'Sate & Bakaran',
    details: 'Sate kambing muda dengan kecap, bawang dan cabai rawit.',
    buyPrice: 24000,
    retailPrice: 40000,
    stock: 40,
    image: commons('1/13/Sate_Kambing_di_Rumah-1.jpg'),
  }),
  // "Ayam bakar.jpg" by Nisa usrifatul, CC BY-SA 4.0
  menuItem({
    name: 'Ayam Bakar',
    category: 'Sate & Bakaran',
    details: 'Ayam bakar bumbu kecap dengan nasi, lalapan dan sambal.',
    buyPrice: 14000,
    retailPrice: 26000,
    stock: 50,
    image: commons('7/78/Ayam_bakar.jpg'),
  }),
  // "Gurame bakar kecap 2.JPG" by Gunawan Kartapranata, CC BY-SA 4.0
  menuItem({
    name: 'Gurame Bakar Kecap',
    category: 'Sate & Bakaran',
    details: 'Ikan gurame bakar bumbu kecap, untuk 2-3 orang.',
    buyPrice: 32000,
    retailPrice: 55000,
    stock: 20,
    image: commons('e/ec/Gurame_bakar_kecap_2.JPG'),
  }),
  // "Ayam goreng kalasan.JPG" by Midori, CC BY-SA 3.0
  menuItem({
    name: 'Ayam Goreng Kalasan',
    category: 'Ayam & Ikan',
    details: 'Ayam goreng kalasan manis gurih dengan kremesan.',
    buyPrice: 13000,
    retailPrice: 24000,
    stock: 50,
    image: commons('9/9d/Ayam_goreng_kalasan.JPG'),
  }),
  // "Pecel Lele 1.JPG" by Gunawan Kartapranata, CC BY-SA 4.0
  menuItem({
    name: 'Pecel Lele',
    category: 'Ayam & Ikan',
    details: 'Lele goreng dengan sambal terasi, tempe dan lalapan.',
    buyPrice: 9000,
    retailPrice: 18000,
    stock: 50,
    image: commons('2/29/Pecel_Lele_1.JPG'),
  }),
  // "Gado-gado in Jakarta.JPG" by Sakurai Midori, CC BY 3.0
  menuItem({
    name: 'Gado-gado',
    category: 'Sayur',
    details: 'Sayuran rebus, lontong, tahu dan telur dengan saus kacang.',
    buyPrice: 8000,
    retailPrice: 18000,
    stock: 40,
    image: commons('3/30/Gado-gado_in_Jakarta.JPG'),
  }),
  // "Capcay Kuah.jpg" by Sabil Khoer Al Munawar, CC BY-SA 4.0
  menuItem({
    name: 'Capcay Kuah',
    category: 'Sayur',
    details: 'Tumis aneka sayur dengan bakso, ayam dan udang berkuah.',
    buyPrice: 11000,
    retailPrice: 22000,
    stock: 40,
    image: commons('0/09/Capcay_Kuah.jpg'),
  }),
  // "Pisang Goreng.jpg" by Supardisahabu, CC BY-SA 4.0
  menuItem({
    name: 'Pisang Goreng',
    category: 'Camilan',
    details: 'Pisang goreng tepung renyah, 5 potong.',
    buyPrice: 5000,
    retailPrice: 12000,
    stock: 50,
    image: commons('0/0f/Pisang_Goreng.jpg'),
  }),
  // "Tempe mendoan sambal kecap.jpg" by Irhanz, CC BY-SA 4.0
  menuItem({
    name: 'Tempe Mendoan',
    category: 'Camilan',
    details: 'Tempe mendoan setengah matang dengan sambal kecap, 5 potong.',
    buyPrice: 4000,
    retailPrice: 12000,
    stock: 50,
    image: commons('7/7e/Tempe_mendoan_sambal_kecap.jpg'),
  }),
  // "Martabak Terang Bulan.jpg" by Supardisahabu, CC BY-SA 4.0
  menuItem({
    name: 'Martabak Manis Coklat Keju',
    category: 'Camilan',
    details: 'Martabak manis (terang bulan) isi coklat dan keju.',
    buyPrice: 17000,
    retailPrice: 35000,
    stock: 25,
    image: commons('1/15/Martabak_Terang_Bulan.jpg'),
  }),
  // "Es teh manis.jpg" by Cendy00, CC BY 4.0
  menuItem({
    name: 'Es Teh Manis',
    category: 'Minuman',
    details: 'Teh manis dingin.',
    buyPrice: 1500,
    retailPrice: 5000,
    stock: 200,
    image: commons('6/64/Es_teh_manis.jpg'),
  }),
  // "Javanese Kopi Tubruk.jpg" by Gunawan Kartapranata, CC BY-SA 3.0
  menuItem({
    name: 'Kopi Hitam',
    category: 'Minuman',
    details: 'Kopi tubruk hitam panas.',
    buyPrice: 3000,
    retailPrice: 8000,
    stock: 100,
    image: commons('e/e8/Javanese_Kopi_Tubruk.jpg'),
  }),
  // "Es Cendol Susu.jpg" by Supardisahabu, CC BY-SA 4.0
  menuItem({
    name: 'Es Cendol',
    category: 'Minuman',
    details: 'Cendol dengan santan dan gula merah.',
    buyPrice: 5000,
    retailPrice: 12000,
    stock: 60,
    image: commons('8/81/Es_Cendol_Susu.jpg'),
  }),
  // "Es Campur 1.jpg" by Fitri Penyalai, CC BY-SA 4.0
  menuItem({
    name: 'Es Campur',
    category: 'Minuman',
    details: 'Es serut dengan buah, cincau, ketan hitam dan sirup.',
    buyPrice: 6000,
    retailPrice: 15000,
    stock: 50,
    image: commons('2/23/Es_Campur_1.jpg'),
  }),
  // "Jus Alpukat.jpg" by Indonesiagood, CC BY 4.0
  menuItem({
    name: 'Jus Alpukat',
    category: 'Minuman',
    details: 'Jus alpukat dengan susu coklat.',
    buyPrice: 7000,
    retailPrice: 15000,
    stock: 50,
    image: commons('4/41/Jus_Alpukat.jpg'),
  }),
]
