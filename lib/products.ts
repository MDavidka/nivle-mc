export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  colors: string[];
  storage: string[];
  description: string;
  specs: {
    screen: string;
    processor: string;
    ram: string;
    camera: string;
    battery: string;
    os: string;
    weight: string;
  };
  featured: boolean;
  stock: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.9,
    reviewsCount: 245,
    colors: ["Titanium Gray", "Titanium Black", "Titanium Blue", "Titanium White"],
    storage: ["256GB", "512GB", "1TB"],
    description: "The iPhone 15 Pro Max is forged in titanium and features the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    specs: {
      screen: "6.7-inch Super Retina XDR OLED, 120Hz",
      processor: "Apple A17 Pro (3nm)",
      ram: "8GB",
      camera: "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
      battery: "4441 mAh, 25W fast charging",
      os: "iOS 17 (Upgradable to iOS 18)",
      weight: "221g"
    },
    featured: true,
    stock: 15
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1299,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1707150199418-8f8319f6a5cf?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1707150199418-8f8319f6a5cf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.8,
    reviewsCount: 189,
    colors: ["Titanium Yellow", "Titanium Violet", "Titanium Black", "Titanium Gray"],
    storage: ["256GB", "512GB", "1TB"],
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.",
    specs: {
      screen: "6.8-inch Dynamic AMOLED 2X, 120Hz, HDR10+",
      processor: "Snapdragon 8 Gen 3 for Galaxy",
      ram: "12GB",
      camera: "200MP Main + 50MP Telephoto + 10MP Telephoto + 12MP Ultra Wide",
      battery: "5000 mAh, 45W fast charging",
      os: "Android 14, One UI 6.1",
      weight: "232g"
    },
    featured: true,
    stock: 12
  },
  {
    id: "pixel-8-pro",
    name: "Google Pixel 8 Pro",
    brand: "Google",
    price: 999,
    originalPrice: 1099,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.7,
    reviewsCount: 112,
    colors: ["Bay Blue", "Porcelain", "Obsidian"],
    storage: ["128GB", "256GB", "512GB"],
    description: "The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera ever, and can even help you get more done, faster.",
    specs: {
      screen: "6.7-inch Super Actua LTPO OLED, 120Hz",
      processor: "Google Tensor G3 (4nm)",
      ram: "12GB",
      camera: "50MP Main + 48MP Ultra Wide + 48MP 5x Telephoto",
      battery: "5050 mAh, 30W fast charging",
      os: "Android 14 (7 years updates)",
      weight: "213g"
    },
    featured: true,
    stock: 8
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 799,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.6,
    reviewsCount: 95,
    colors: ["Flowy Emerald", "Silky Black"],
    storage: ["256GB", "512GB"],
    description: "Redefined flagship specs. The OnePlus 12 combines standard-setting hardware with state-of-the-art software tuning to deliver the ultimate smooth experience.",
    specs: {
      screen: "6.82-inch LTPO AMOLED, 120Hz, 4500 nits peak",
      processor: "Snapdragon 8 Gen 3 (4nm)",
      ram: "16GB",
      camera: "50MP Main + 64MP 3x Periscope + 48MP Ultra Wide",
      battery: "5400 mAh, 100W SuperVOOC wired",
      os: "OxygenOS based on Android 14",
      weight: "220g"
    },
    featured: false,
    stock: 20
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    brand: "Apple",
    price: 799,
    originalPrice: 849,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.7,
    reviewsCount: 154,
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    storage: ["128GB", "256GB", "512GB"],
    description: "iPhone 15 features the Dynamic Island, a 48MP Main camera, and USB-C, all in a durable color-infused glass and aluminum design.",
    specs: {
      screen: "6.1-inch Super Retina XDR OLED",
      processor: "Apple A16 Bionic (4nm)",
      ram: "6GB",
      camera: "48MP Main + 12MP Ultra Wide",
      battery: "3349 mAh, 20W charging",
      os: "iOS 17",
      weight: "171g"
    },
    featured: false,
    stock: 25
  },
  {
    id: "galaxy-s24-plus",
    name: "Galaxy S24+",
    brand: "Samsung",
    price: 999,
    originalPrice: 1049,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.7,
    reviewsCount: 88,
    colors: ["Onyx Black", "Marble Gray", "Cobalt Violet", "Amber Yellow"],
    storage: ["256GB", "512GB"],
    description: "The perfect middle ground. Galaxy S24+ offers a massive QHD+ screen, superb battery life, and the same incredible Galaxy AI capabilities as the Ultra.",
    specs: {
      screen: "6.7-inch Dynamic AMOLED 2X, 120Hz, QHD+",
      processor: "Exynos 2400 / Snapdragon 8 Gen 3",
      ram: "12GB",
      camera: "50MP Main + 10MP Telephoto + 12MP Ultra Wide",
      battery: "4900 mAh, 45W fast charging",
      os: "Android 14, One UI 6.1",
      weight: "196g"
    },
    featured: false,
    stock: 14
  },
  {
    id: "nothing-phone-2",
    name: "Nothing Phone (2)",
    brand: "Nothing",
    price: 599,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.5,
    reviewsCount: 76,
    colors: ["Dark Gray", "White"],
    storage: ["128GB", "256GB"],
    description: "Meet Phone (2). A new way to interact. Featuring the unique Glyph Interface, premium materials, and custom Nothing OS 2.0.",
    specs: {
      screen: "6.7-inch LTPO OLED, 120Hz, HDR10+",
      processor: "Snapdragon 8+ Gen 1 (4nm)",
      ram: "12GB",
      camera: "50MP Main + 50MP Ultra Wide",
      battery: "4700 mAh, 45W fast charging",
      os: "Nothing OS 2.0 based on Android 13",
      weight: "201.2g"
    },
    featured: false,
    stock: 10
  },
  {
    id: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    price: 1099,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.8,
    reviewsCount: 64,
    colors: ["Black", "White"],
    storage: ["512GB"],
    description: "Co-engineered with Leica. Features a revolutionary 1-inch sensor, quad-camera system with stepless variable aperture, and a stunning liquid design.",
    specs: {
      screen: "6.73-inch LTPO AMOLED, 120Hz, 3000 nits",
      processor: "Snapdragon 8 Gen 3 (4nm)",
      ram: "16GB",
      camera: "50MP 1-inch Main + 50MP Telephoto + 50MP Periscope + 50MP Ultra Wide",
      battery: "5000 mAh, 90W HyperCharge",
      os: "Xiaomi HyperOS based on Android 14",
      weight: "220g"
    },
    featured: false,
    stock: 6
  }
];
