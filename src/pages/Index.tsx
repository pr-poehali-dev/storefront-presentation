import { useState } from 'react';
import { ShoppingCart, Search, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  colors?: string[];
  sizes?: string[];
  description: string;
  features: string[];
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Беспроводные наушники Premium',
    price: 12990,
    oldPrice: 15990,
    image: 'https://cdn.poehali.dev/projects/5392c6cc-02c5-4c5f-99f1-1c440f538e84/files/d0aaedfe-d3ad-4426-bb9d-f60d48785e92.jpg',
    category: 'Аудио',
    rating: 4.8,
    reviews: 256,
    colors: ['Черный', 'Белый', 'Серебристый'],
    description: 'Премиальные беспроводные наушники с активным шумоподавлением и временем работы до 30 часов.',
    features: ['Активное шумоподавление', 'Bluetooth 5.0', 'Быстрая зарядка', '30 часов работы'],
    inStock: true
  },
  {
    id: 2,
    name: 'Умные часы Sport Edition',
    price: 8990,
    image: '/placeholder.svg',
    category: 'Гаджеты',
    rating: 4.6,
    reviews: 142,
    colors: ['Черный', 'Синий', 'Красный'],
    sizes: ['S', 'M', 'L'],
    description: 'Спортивные умные часы с GPS, мониторингом здоровья и влагозащитой IP68.',
    features: ['GPS навигация', 'Мониторинг пульса', 'Влагозащита IP68', 'До 7 дней работы'],
    inStock: true
  },
  {
    id: 3,
    name: 'Ноутбук UltraBook Pro',
    price: 89990,
    oldPrice: 99990,
    image: 'https://cdn.poehali.dev/projects/5392c6cc-02c5-4c5f-99f1-1c440f538e84/files/71d835ea-7448-4c6f-ab24-3c459af2864e.jpg',
    category: 'Компьютеры',
    rating: 4.9,
    reviews: 89,
    description: 'Мощный ультрабук с процессором Intel i7, 16GB RAM и SSD 512GB для профессиональной работы.',
    features: ['Intel Core i7', '16GB RAM', 'SSD 512GB', 'Экран 14" 2K'],
    inStock: true
  },
  {
    id: 4,
    name: 'Беспроводная клавиатура',
    price: 3490,
    image: '/placeholder.svg',
    category: 'Аксессуары',
    rating: 4.5,
    reviews: 312,
    colors: ['Белый', 'Черный'],
    description: 'Компактная беспроводная клавиатура с механическими переключателями и RGB подсветкой.',
    features: ['Механические переключатели', 'RGB подсветка', 'Bluetooth 5.0', 'Компактный дизайн'],
    inStock: true
  },
  {
    id: 5,
    name: 'Портативная колонка',
    price: 5990,
    image: '/placeholder.svg',
    category: 'Аудио',
    rating: 4.7,
    reviews: 198,
    colors: ['Черный', 'Синий', 'Красный', 'Зеленый'],
    description: 'Мощная портативная Bluetooth колонка с защитой от воды и 20 часами автономной работы.',
    features: ['Защита IPX7', 'Мощность 40W', '20 часов работы', 'TWS соединение'],
    inStock: true
  },
  {
    id: 6,
    name: 'Веб-камера Full HD',
    price: 4990,
    image: '/placeholder.svg',
    category: 'Аксессуары',
    rating: 4.4,
    reviews: 156,
    description: 'Веб-камера Full HD 1080p с автофокусом и встроенным микрофоном для видеоконференций.',
    features: ['Full HD 1080p', 'Автофокус', 'Встроенный микрофон', 'USB подключение'],
    inStock: true
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product, selectedColor?: string, selectedSize?: string) => {
    const existingItem = cart.find(
      item => item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedColor, selectedSize }]);
    }
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
    } else {
      setCart(cart.map((item, i) => i === index ? { ...item, quantity } : item));
    }
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <h1 className="text-2xl font-bold tracking-tight">STORE</h1>

            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hidden lg:flex relative">
                <Heart size={20} />
                {favorites.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className="hidden lg:flex">
                <User size={20} />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart size={20} />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                  </SheetHeader>
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <ShoppingCart size={64} className="text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Корзина пуста</p>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto py-6 space-y-4">
                        {cart.map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              {item.selectedColor && (
                                <p className="text-xs text-muted-foreground">Цвет: {item.selectedColor}</p>
                              )}
                              {item.selectedSize && (
                                <p className="text-xs text-muted-foreground">Размер: {item.selectedSize}</p>
                              )}
                              <p className="font-semibold mt-1">{item.price.toLocaleString()} ₽</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(index, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(index, item.quantity + 1)}
                                >
                                  +
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 ml-auto"
                                  onClick={() => removeFromCart(index)}
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span>{totalPrice.toLocaleString()} ₽</span>
                        </div>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button className="w-full" size="lg">
                              Оформить заказ
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Оформление заказа</SheetTitle>
                            </SheetHeader>
                            <CheckoutForm cart={cart} totalPrice={totalPrice} />
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="lg:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Зимняя распродажа</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Скидки до 40% на популярные товары
          </p>
          <Button size="lg" variant="secondary" className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            Смотреть акции
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedProduct(product)}
                />
                {product.oldPrice && (
                  <Badge className="absolute top-4 left-4 bg-destructive">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  <Heart
                    size={20}
                    className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''}
                  />
                </Button>
              </div>
              <div className="p-6" onClick={() => setSelectedProduct(product)}>
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{product.price.toLocaleString()} ₽</p>
                    {product.oldPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {product.oldPrice.toLocaleString()} ₽
                      </p>
                    )}
                  </div>
                  <Button
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <section className="bg-muted rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Популярные категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Аудио', 'Гаджеты', 'Компьютеры', 'Аксессуары'].map(cat => (
              <Button
                key={cat}
                variant="secondary"
                className="h-24 text-lg"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </section>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
        />
      )}

      <footer className="bg-muted border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 STORE. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, color?: string, size?: string) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{product.name}</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.oldPrice && (
              <Badge className="absolute top-4 left-4 bg-destructive">
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </Badge>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold">{product.price.toLocaleString()} ₽</p>
                {product.oldPrice && (
                  <p className="text-lg text-muted-foreground line-through">
                    {product.oldPrice.toLocaleString()} ₽
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">★</span>
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} отзывов)</span>
              </div>
            </div>

            <Badge variant={product.inStock ? 'default' : 'secondary'} className="mb-4">
              {product.inStock ? 'В наличии' : 'Нет в наличии'}
            </Badge>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="space-y-4 mb-6">
              <h4 className="font-semibold">Особенности:</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <Label className="mb-2 block">Цвет:</Label>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <Label className="mb-2 block">Размер:</Label>
                <div className="flex gap-2">
                  {product.sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={() => {
                  onAddToCart(product, selectedColor, selectedSize);
                  onClose();
                }}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2" size={20} />
                Добавить в корзину
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={onToggleFavorite}
              >
                <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CheckoutForm({ cart, totalPrice }: { cart: CartItem[]; totalPrice: number }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryMethod: 'courier',
    paymentMethod: 'card',
    comment: ''
  });

  const deliveryPrice = formData.deliveryMethod === 'courier' ? 350 : 0;
  const finalPrice = totalPrice + deliveryPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
  };

  return (
    <form onSubmit={handleSubmit} className="py-6 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Контактные данные</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Имя и фамилия *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-lg mb-4">Доставка</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="deliveryMethod">Способ доставки</Label>
            <Select
              value={formData.deliveryMethod}
              onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="courier">Курьерская доставка (350 ₽)</SelectItem>
                <SelectItem value="pickup">Самовывоз (бесплатно)</SelectItem>
                <SelectItem value="post">Почта России (по тарифам)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.deliveryMethod !== 'pickup' && (
            <>
              <div>
                <Label htmlFor="city">Город *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Адрес доставки *</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Почтовый индекс</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-lg mb-4">Оплата</h3>
        <div>
          <Label htmlFor="paymentMethod">Способ оплаты</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Банковской картой онлайн</SelectItem>
              <SelectItem value="cash">Наличными при получении</SelectItem>
              <SelectItem value="invoice">По счету для юр. лиц</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Комментарий к заказу</Label>
        <Textarea
          id="comment"
          placeholder="Укажите желаемое время доставки или другие пожелания..."
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Товары ({cart.length}):</span>
          <span>{totalPrice.toLocaleString()} ₽</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Доставка:</span>
          <span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString()} ₽`}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Итого:</span>
          <span>{finalPrice.toLocaleString()} ₽</span>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Подтвердить заказ
      </Button>
    </form>
  );
}
