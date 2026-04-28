import { Product, ProductCategory } from '@domain/entities/Product';
import { IProductRepository } from '@domain/repositories/IProductRepository';

/** Seed data — rich enough to demo every stock status and category */
const SEED_PRODUCTS: Parameters<typeof Product.create>[0][] = [
  { id: '1',  sku: 'ELEC-001', name: 'Wireless Headphones',      brand: 'SoundWave',  price: 89.99,  stock: 32,  category: 'electronics' },
  { id: '2',  sku: 'ELEC-002', name: 'Mechanical Keyboard',       brand: 'TypeForce',  price: 129.00, stock: 3,   category: 'electronics' },
  { id: '3',  sku: 'ELEC-003', name: '27" 4K Monitor',            brand: 'VisionPro',  price: 499.99, stock: 0,   category: 'electronics' },
  { id: '4',  sku: 'ELEC-004', name: 'USB-C Hub 7-in-1',          brand: 'ConnectX',   price: 39.99,  stock: 18,  category: 'electronics' },
  { id: '5',  sku: 'ELEC-005', name: 'Noise Cancelling Earbuds',  brand: 'SoundWave',  price: 59.99,  stock: 2,   category: 'electronics' },
  { id: '6',  sku: 'CLTH-001', name: 'Merino Wool Hoodie',        brand: 'NorthWear',  price: 75.00,  stock: 14,  category: 'clothing'    },
  { id: '7',  sku: 'CLTH-002', name: 'Running Shorts',            brand: 'PacePro',    price: 35.00,  stock: 0,   category: 'clothing'    },
  { id: '8',  sku: 'CLTH-003', name: 'Waterproof Jacket',         brand: 'NorthWear',  price: 149.00, stock: 4,   category: 'clothing'    },
  { id: '9',  sku: 'FOOD-001', name: 'Cold Brew Coffee 500ml',    brand: 'BeanCraft',  price: 7.50,   stock: 55,  category: 'food'        },
  { id: '10', sku: 'FOOD-002', name: 'Organic Granola Bar (12pk)',brand: 'NutriBlend', price: 12.99,  stock: 3,   category: 'food'        },
  { id: '11', sku: 'FOOD-003', name: 'Matcha Powder 100g',        brand: 'Kyoto\'s',   price: 18.00,  stock: 0,   category: 'food'        },
  { id: '12', sku: 'BOOK-001', name: 'Clean Code',                brand: "O'Reilly",   price: 44.99,  stock: 9,   category: 'books'       },
  { id: '13', sku: 'BOOK-002', name: 'Designing Data-Intensive Applications', brand: "O'Reilly", price: 59.99, stock: 1, category: 'books' },
  { id: '14', sku: 'BOOK-003', name: 'The Pragmatic Programmer',  brand: 'Addison',    price: 49.99,  stock: 7,   category: 'books'       },
  { id: '15', sku: 'SPRT-001', name: 'Adjustable Dumbbell Set',   brand: 'IronFlex',   price: 199.00, stock: 0,   category: 'sports'      },
  { id: '16', sku: 'SPRT-002', name: 'Yoga Mat Pro',              brand: 'ZenCore',    price: 45.00,  stock: 22,  category: 'sports'      },
  { id: '17', sku: 'SPRT-003', name: 'Jump Rope Speed',           brand: 'IronFlex',   price: 14.99,  stock: 2,   category: 'sports'      },
  { id: '18', sku: 'HOME-001', name: 'Bamboo Desk Organizer',     brand: 'ClearSpace', price: 29.99,  stock: 11,  category: 'home'        },
  { id: '19', sku: 'HOME-002', name: 'LED Desk Lamp',             brand: 'LumiCraft',  price: 54.99,  stock: 4,   category: 'home'        },
  { id: '20', sku: 'HOME-003', name: 'Ceramic Pour-Over Set',     brand: 'BrewStudio', price: 38.00,  stock: 0,   category: 'home'        },
  { id: '21', sku: 'BEAU-001', name: 'Vitamin C Serum 30ml',      brand: 'GlowLab',    price: 32.00,  stock: 8,   category: 'beauty'      },
  { id: '22', sku: 'BEAU-002', name: 'SPF 50 Sunscreen 100ml',    brand: 'SunShield',  price: 19.99,  stock: 3,   category: 'beauty'      },
  { id: '23', sku: 'TOYS-001', name: 'LEGO Architecture Set',     brand: 'LEGO',       price: 79.99,  stock: 6,   category: 'toys'        },
  { id: '24', sku: 'TOYS-002', name: 'Wooden Puzzle 500pc',       brand: 'CraftPlay',  price: 24.99,  stock: 1,   category: 'toys'        },
];

export class InMemoryProductRepository implements IProductRepository {
  private readonly store: Map<string, Product>;

  constructor() {
    this.store = new Map();
    for (const props of SEED_PRODUCTS) {
      const product = Product.create(props);
      this.store.set(product.id, product);
    }
  }

  async findAll(options?: { category?: ProductCategory }): Promise<Product[]> {
    const all = Array.from(this.store.values());
    if (!options?.category) return all;
    return all.filter((p) => p.category === options.category);
  }

  async findById(id: string): Promise<Product | null> {
    return this.store.get(id) ?? null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    for (const product of this.store.values()) {
      if (product.sku === sku) return product;
    }
    return null;
  }

  async save(product: Product): Promise<void> {
    this.store.set(product.id, product);
  }
}
