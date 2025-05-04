// ignore_for_file: deprecated_member_use

import 'package:economic_center_mobileapp/pages/DevilledCashewsProduct.dart';
import 'package:economic_center_mobileapp/pages/MangoProduct.dart';
import 'package:flutter/material.dart';
import 'package:economic_center_mobileapp/pages/AppelProduct.dart';
import 'package:economic_center_mobileapp/pages/TomatoProduct.dart';
import 'package:economic_center_mobileapp/pages/GreenChilli.dart';
import 'package:economic_center_mobileapp/pages/BlackPepper.dart';
import 'package:economic_center_mobileapp/pages/Beetroot.dart';
import 'package:economic_center_mobileapp/pages/PumpkinProduct.dart';
import 'package:economic_center_mobileapp/pages/BananaProduct.dart';
import 'package:economic_center_mobileapp/pages/GingerProduct.dart';
import 'package:flutter/services.dart';

void main() {
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const Category());
}

class Category extends StatelessWidget {
  const Category({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sri Lanka Economic Center',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0C4B33), // Sri Lankan green theme
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Poppins',
        appBarTheme: const AppBarTheme(
          elevation: 0,
          centerTitle: true,
          backgroundColor: Color(0xFF0C4B33),
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(
              bottom: Radius.circular(20),
            ),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF0C4B33),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
      home: const ProductScreen(),
    );
  }
}

class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String category;
  final bool isLocal;
  final double rating;
  final String seller;
  final int reviewCount;
  final String nutrientInfo;
  final List<String> tags;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.category,
    this.isLocal = true,
    this.rating = 4.0,
    this.seller = 'Local Seller',
    this.reviewCount = 0,
    this.nutrientInfo = '',
    this.tags = const [],
  });
}

class CartItem {
  final Product product;
  int quantity;

  CartItem({required this.product, this.quantity = 1});
}

class ProductScreen extends StatefulWidget {
  const ProductScreen({super.key});

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen>
    with SingleTickerProviderStateMixin {
  String selectedCategory = 'All';
  bool showLocalOnly = true;
  List<CartItem> cartItems = [];
  String searchQuery = '';
  bool isSearching = false;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  final TextEditingController _searchController = TextEditingController();
  String sortBy = 'Default';

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeIn),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  // Sri Lankan themed product data
  final List<Product> products = [
    Product(
      id: 1,
      name: 'Apple',
      description: 'Finest high-grown Sri Lankan Apples, fresh and crisp',
      price: 397.47,
      imageUrl:
          'https://img.freepik.com/free-photo/fresh-apples-supermarket_1303-16018.jpg?t=st=1745139002~exp=1745142602~hmac=86d1baad086523ba7d6ed7c244ac99c8e376c61ad0d1f6cc74090959628ccddf&w=996',
      category: 'Fruits',
      rating: 4.8,
      seller: 'Nuwara Eliya Farms',
      reviewCount: 128,
      nutrientInfo: 'Rich in vitamin C and fiber',
      tags: ['Organic', 'Fresh', 'Seasonal'],
    ),
    Product(
      id: 2,
      name: 'Tomato',
      description:
          'Traditional Sri Lankan tomatoes, perfect for curries and salads',
      price: 390.00,
      imageUrl:
          'https://img.freepik.com/premium-photo/close-up-tomatoes_1048944-1518277.jpg?w=996',
      category: 'Vegetables',
      rating: 4.5,
      seller: 'Local Farms',
      reviewCount: 86,
      nutrientInfo: 'High in antioxidants and vitamins',
      tags: ['Fresh', 'Local'],
    ),
    Product(
      id: 3,
      name: 'Devilled Cashews',
      description:
          'Authentic Sri Lankan spiced cashews with a perfect blend of spices',
      price: 350.00,
      imageUrl:
          'https://img.freepik.com/free-photo/tasty-cashew-nuts-as-background_1150-45355.jpg?t=st=1745158007~exp=1745161607~hmac=16154198aba0578978fa521975a3762f98b6f7ad9a237ce7d92728ebd4e7c7fd&w=996',
      category: 'Nuts',
      rating: 4.7,
      seller: 'Spice Island',
      reviewCount: 215,
      nutrientInfo: 'High in protein and healthy fats',
      tags: ['Spicy', 'Snack', 'Premium'],
    ),
    Product(
      id: 4,
      name: 'Green Chilli',
      description:
          'Fresh green chillies, perfect for adding heat to your dishes',
      price: 675.00,
      imageUrl:
          'https://img.freepik.com/premium-photo/full-frame-shot-green-chili-peppers_1048944-25440816.jpg?w=826',
      category: 'Spices',
      rating: 4.6,
      seller: 'Spice Garden',
      reviewCount: 42,
      nutrientInfo: 'Contains capsaicin for metabolism boost',
      tags: ['Spicy', 'Fresh', 'Essential'],
    ),
    Product(
      id: 5,
      name: 'Black Pepper',
      description:
          'High-quality Sri Lankan black pepper, known for its strong aroma',
      price: 340.00,
      imageUrl:
          'https://img.freepik.com/free-photo/black-milled-pepper-corns-as-background-high-quality-photo_114579-40514.jpg?t=st=1745158828~exp=1745162428~hmac=4b13a55451af83438329ec9bbe0b7f9778bc7c7c412521a401e2765186bb5cd7&w=996',
      category: 'Spices',
      rating: 4.4,
      seller: 'Spice Island',
      reviewCount: 178,
      nutrientInfo: 'Aids digestion and has anti-inflammatory properties',
      tags: ['Premium', 'Organic', 'Essential'],
    ),
    Product(
      id: 6,
      name: 'Ginger',
      description: 'Fresh Sri Lankan ginger, perfect for tea and cooking',
      price: 1223.00,
      imageUrl:
          'https://img.freepik.com/free-photo/young-woman-buys-ginger-market-woman-choose-ginger-supermarket-woman-picking-fresh-produce-market_1391-643.jpg?t=st=1745159114~exp=1745162714~hmac=ffbcd5b11d6dc279221dbc9cc6cb3768e7912e065406c98689522b3fb5eb49a0&w=900',
      category: 'Spices',
      rating: 4.3,
      seller: 'Herb Gardens',
      reviewCount: 64,
      nutrientInfo: 'Natural anti-inflammatory and digestive aid',
      tags: ['Aromatic', 'Fresh', 'Medicinal'],
    ),
    Product(
      id: 7,
      name: 'Banana',
      description: 'Sweet and nutritious Sri Lankan bananas',
      price: 212.00,
      imageUrl:
          'https://img.freepik.com/free-photo/bananas-hanging-rope_1122-1220.jpg?t=st=1745159206~exp=1745162806~hmac=906e44115c65904a876f2f619da4441c6c2c83ee87998fd956f981baf00d6229&w=900',
      category: 'Fruits',
      rating: 4.9,
      seller: 'Tropical Farms',
      reviewCount: 53,
      nutrientInfo: 'Rich in potassium and fiber',
      tags: ['Sweet', 'Energy', 'Fresh'],
    ),
    Product(
      id: 8,
      name: 'Beetroot',
      description: 'Fresh, vibrant beetroot for salads and cooking',
      price: 132.00,
      imageUrl:
          'https://img.freepik.com/premium-photo/close-up-plants_1048944-21388094.jpg?w=996',
      category: 'Vegetables',
      rating: 4.5,
      seller: 'Organic Farms',
      reviewCount: 97,
      nutrientInfo: 'Rich in folate, manganese, and nitrates',
      tags: ['Organic', 'Fresh', 'Superfood'],
    ),
    Product(
      id: 9,
      name: 'Pumpkin',
      description: 'Locally grown pumpkins, perfect for soups and curries',
      price: 334.00,
      imageUrl:
          'https://img.freepik.com/free-photo/various-striped-pumpkins-harvested-sunny-autumn-day-close-up-orange-green-pumpkins_7502-10551.jpg?t=st=1745159889~exp=1745163489~hmac=41b9f869261a485262b38d3ee74875019bcb711426f5cd5bf02b810a57622b3f&w=900',
      category: 'Vegetables',
      rating: 4.7,
      seller: 'Local Farms',
      reviewCount: 31,
      nutrientInfo: 'High in vitamin A and antioxidants',
      tags: ['Seasonal', 'Organic', 'Versatile'],
    ),
    Product(
      id: 10,
      name: 'Mango',
      description: 'Sweet and juicy Sri Lankan mangoes',
      price: 734.00,
      imageUrl:
          'https://img.freepik.com/premium-photo/selecting-ripe-mangoes-market_938295-3419.jpg?w=996',
      category: 'Fruits',
      rating: 4.8,
      seller: 'Tropical Orchards',
      reviewCount: 203,
      nutrientInfo: 'Rich in vitamins A and C',
      tags: ['Sweet', 'Seasonal', 'Premium'],
    ),
  ];

  List<String> get categories {
    final categorySet =
        products.map((product) => product.category).toSet().toList();
    categorySet.sort();
    return ['All', ...categorySet];
  }

  List<Product> get filteredProducts {
    List<Product> filtered = products;

    // Filter by category
    if (selectedCategory != 'All') {
      filtered = filtered
          .where((product) => product.category == selectedCategory)
          .toList();
    }

    // Filter by local only
    if (showLocalOnly) {
      filtered = filtered.where((product) => product.isLocal).toList();
    }

    // Filter by search query
    if (searchQuery.isNotEmpty) {
      filtered = filtered
          .where((product) =>
              product.name.toLowerCase().contains(searchQuery.toLowerCase()) ||
              product.description
                  .toLowerCase()
                  .contains(searchQuery.toLowerCase()) ||
              product.category
                  .toLowerCase()
                  .contains(searchQuery.toLowerCase()) ||
              product.tags.any((tag) =>
                  tag.toLowerCase().contains(searchQuery.toLowerCase())))
          .toList();
    }

    // Sort products
    switch (sortBy) {
      case 'Price - Low to High':
        filtered.sort((a, b) => a.price.compareTo(b.price));
        break;
      case 'Price - High to Low':
        filtered.sort((a, b) => b.price.compareTo(a.price));
        break;
      case 'Rating':
        filtered.sort((a, b) => b.rating.compareTo(a.rating));
        break;
      case 'Popularity':
        filtered.sort((a, b) => b.reviewCount.compareTo(a.reviewCount));
        break;
      default:
        // Keep default order
        break;
    }

    return filtered;
  }

  void addToCart(Product product) {
    setState(() {
      final existingItemIndex =
          cartItems.indexWhere((item) => item.product.id == product.id);
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity++;
      } else {
        cartItems.add(CartItem(product: product));
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white),
            const SizedBox(width: 8),
            Text('${product.name} added to cart'),
          ],
        ),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        backgroundColor: Theme.of(context).colorScheme.primary,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void removeFromCart(int productId) {
    setState(() {
      final existingItemIndex =
          cartItems.indexWhere((item) => item.product.id == productId);
      if (existingItemIndex >= 0) {
        if (cartItems[existingItemIndex].quantity > 1) {
          cartItems[existingItemIndex].quantity--;
        } else {
          cartItems.removeAt(existingItemIndex);
        }
      }
    });
  }

  void clearCart() {
    setState(() {
      cartItems.clear();
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.delete_forever, color: Colors.white),
            SizedBox(width: 8),
            Text('Cart cleared'),
          ],
        ),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        backgroundColor: Colors.red.shade700,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  double get totalCartValue {
    return cartItems.fold(
        0, (total, item) => total + (item.product.price * item.quantity));
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'Fruits':
        return Icons.apple;
      case 'Vegetables':
        return Icons.eco;
      case 'Spices':
        return Icons.spa;
      case 'Nuts':
        return Icons.casino;
      default:
        return Icons.shopping_basket;
    }
  }

  void _showClearCartConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Cart'),
        content: const Text(
            'Are you sure you want to remove all items from your cart?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              clearCart();
              Navigator.pop(context);
            },
            child: const Text('Clear', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showCheckoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Checkout'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Your order has been placed successfully!'),
            const SizedBox(height: 16),
            Text(
              'Total: Rs. ${totalCartValue.toStringAsFixed(2)}',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              clearCart();
              Navigator.pop(context);
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: isSearching
            ? TextField(
                controller: _searchController,
                autofocus: true,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  hintText: 'Search products...',
                  hintStyle: TextStyle(color: Colors.white70),
                  border: InputBorder.none,
                ),
                onChanged: (value) {
                  setState(() {
                    searchQuery = value;
                  });
                },
              )
            : const Text('Sri Lankan Marketplace'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        leading: isSearching
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () {
                  setState(() {
                    isSearching = false;
                    searchQuery = '';
                    _searchController.clear();
                  });
                },
              )
            : null,
        actions: [
          IconButton(
            icon: Icon(isSearching ? Icons.close : Icons.search),
            onPressed: () {
              setState(() {
                isSearching = !isSearching;
                if (!isSearching) {
                  searchQuery = '';
                  _searchController.clear();
                }
              });
            },
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.filter_list),
            onSelected: (value) {
              setState(() {
                sortBy = value;
              });
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'Default',
                child: Text('Default'),
              ),
              const PopupMenuItem(
                value: 'Price - Low to High',
                child: Text('Price - Low to High'),
              ),
              const PopupMenuItem(
                value: 'Price - High to Low',
                child: Text('Price - High to Low'),
              ),
              const PopupMenuItem(
                value: 'Rating',
                child: Text('Best Rating'),
              ),
              const PopupMenuItem(
                value: 'Popularity',
                child: Text('Most Popular'),
              ),
            ],
          ),
        ],
      ),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: Column(
          children: [
            // Header with local products toggle
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Theme.of(context).colorScheme.primary,
                    Theme.of(context).colorScheme.primary.withOpacity(0.8),
                  ],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    spreadRadius: 1,
                    blurRadius: 3,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.flag, size: 18, color: Colors.white),
                  const SizedBox(width: 8),
                  const Text(
                    'Support Local Businesses',
                    style: TextStyle(fontSize: 14, color: Colors.white),
                  ),
                  const Spacer(),
                  Transform.scale(
                    scale: 0.8,
                    child: Switch(
                      value: showLocalOnly,
                      onChanged: (value) {
                        setState(() {
                          showLocalOnly = value;
                        });
                      },
                      activeColor: Colors.white,
                      activeTrackColor: Colors.white.withOpacity(0.5),
                    ),
                  ),
                ],
              ),
            ),

            // Category selector
            Container(
              height: 90,
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    spreadRadius: 1,
                    blurRadius: 3,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: categories.length,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemBuilder: (context, index) {
                  final category = categories[index];
                  final isSelected = category == selectedCategory;

                  return Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          selectedCategory = category;
                        });
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: 80,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? Theme.of(context)
                                  .colorScheme
                                  .primary
                                  .withOpacity(0.1)
                              : Colors.grey.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected
                                ? Theme.of(context).colorScheme.primary
                                : Colors.grey.withOpacity(0.2),
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              _getCategoryIcon(category),
                              size: 24,
                              color: isSelected
                                  ? Theme.of(context).colorScheme.primary
                                  : Colors.grey[600],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              category,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: isSelected
                                    ? Theme.of(context).colorScheme.primary
                                    : Colors.grey[700],
                              ),
                              textAlign: TextAlign.center,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            // Product grid
            Expanded(
              child: filteredProducts.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.search_off,
                              size: 50, color: Colors.grey[400]),
                          const SizedBox(height: 16),
                          Text(
                            'No products found',
                            style: TextStyle(
                              fontSize: 18,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Try changing your filters or search term',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[500],
                            ),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      color: Theme.of(context).colorScheme.primary,
                      onRefresh: () async {
                        // Simulate refresh
                        await Future.delayed(const Duration(seconds: 1));
                        setState(() {});
                      },
                      child: GridView.builder(
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.75,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 16,
                        ),
                        padding: const EdgeInsets.all(16),
                        itemCount: filteredProducts.length,
                        itemBuilder: (context, index) {
                          final product = filteredProducts[index];
                          return _ProductCard(
                            product: product,
                            onAddToCart: () => addToCart(product),
                          );
                        },
                      ),
                    ),
            ),
          ],
        ),
      ),
      floatingActionButton: Stack(
        alignment: Alignment.bottomRight,
        children: [
          FloatingActionButton(
            onPressed: () {
              _showCartDialog(context);
            },
            backgroundColor: Theme.of(context).colorScheme.primary,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.shopping_cart, color: Colors.white),
          ),
          if (cartItems.isNotEmpty)
            Positioned(
              right: 0,
              top: 0,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
                child: Text(
                  cartItems.length.toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  void _showCartDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Container(
              width: double.maxFinite,
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.7,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    color: Theme.of(context).colorScheme.primary,
                    child: Row(
                      children: [
                        const Icon(Icons.shopping_cart, color: Colors.white),
                        const SizedBox(width: 8),
                        const Text(
                          'Your Cart',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        if (cartItems.isNotEmpty)
                          IconButton(
                            icon: const Icon(Icons.delete_outline,
                                color: Colors.white),
                            onPressed: () {
                              Navigator.pop(context);
                              _showClearCartConfirmation(context);
                            },
                          ),
                      ],
                    ),
                  ),
                  if (cartItems.isEmpty)
                    Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.shopping_cart_outlined,
                            size: 60,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'Your cart is empty',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Add some products to get started',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 24),
                          ElevatedButton(
                            onPressed: () => Navigator.pop(context),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 24, vertical: 12),
                            ),
                            child: const Text('Continue Shopping'),
                          ),
                        ],
                      ),
                    )
                  else
                    Flexible(
                      child: ListView.separated(
                        itemCount: cartItems.length,
                        separatorBuilder: (context, index) =>
                            const Divider(height: 1),
                        itemBuilder: (context, index) {
                          final item = cartItems[index];
                          return ListTile(
                            contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 4),
                            leading: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: SizedBox(
                                width: 50,
                                height: 50,
                                child: Image.network(
                                  item.product.imageUrl,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Container(
                                      color: Colors.grey[200],
                                      child: Icon(Icons.image_not_supported,
                                          color: Colors.grey[400]),
                                    );
                                  },
                                ),
                              ),
                            ),
                            title: Text(
                              item.product.name,
                              style:
                                  const TextStyle(fontWeight: FontWeight.w500),
                            ),
                            subtitle: Text(
                              'Rs. ${item.product.price.toStringAsFixed(2)}',
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.remove_circle_outline),
                                  onPressed: () =>
                                      removeFromCart(item.product.id),
                                  color: Colors.red,
                                  iconSize: 20,
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[100],
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(item.quantity.toString()),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.add_circle_outline),
                                  onPressed: () => addToCart(item.product),
                                  color: Theme.of(context).colorScheme.primary,
                                  iconSize: 20,
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                  if (cartItems.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey[50],
                        border: Border(
                          top: BorderSide(
                            color: Colors.grey[200]!,
                            width: 1,
                          ),
                        ),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Total:',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                'Rs. ${totalCartValue.toStringAsFixed(2)}',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.pop(context);
                                _showCheckoutDialog(context);
                              },
                              style: ElevatedButton.styleFrom(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: const Text('Checkout'),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onAddToCart;

  const _ProductCard({
    required this.product,
    required this.onAddToCart,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Navigate to product detail page based on product name
        switch (product.name) {
          case 'Apple':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const AppelProduct()),
            );
            break;
          case 'Tomato':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const TomatoProduct()),
            );
            break;
          case 'Devilled Cashews':
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => const DevilledCashewsProduct()),
            );
            break;
          case 'Green Chilli':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const GreenChilli()),
            );
            break;
          case 'Black Pepper':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const BlackPepper()),
            );
            break;
          case 'Ginger':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const GingerProduct()),
            );
            break;
          case 'Banana':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const BananaProduct()),
            );
            break;
          case 'Beetroot':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Beetroot()),
            );
            break;
          case 'Pumpkin':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const PumpkinProduct()),
            );
            break;
          case 'Mango':
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const MangoProduct()),
            );
            break;
          default:
            // Default product detail page
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const AppelProduct()),
            );
        }
      },
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(12),
                ),
                child: Image.network(
                  product.imageUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      color: Colors.grey[200],
                      child: const Center(
                        child:
                            Icon(Icons.image_not_supported, color: Colors.grey),
                      ),
                    );
                  },
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Rs. ${product.price.toStringAsFixed(2)}',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.primary,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.star, color: Colors.amber, size: 16),
                      Text(
                        product.rating.toString(),
                        style: const TextStyle(fontSize: 12),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.add_shopping_cart, size: 18),
                        onPressed: onAddToCart,
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class TomatoProduct extends StatelessWidget {
  const TomatoProduct({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tomato Product'),
      ),
      body: const Center(
        child: Text('Details about Tomato Product'),
      ),
    );
  }
}

class DevilledCashewsProduct extends StatelessWidget {
  const DevilledCashewsProduct({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Devilled Cashews Product'),
      ),
      body: const Center(
        child: Text('Details about Devilled Cashews Product'),
      ),
    );
  }
}

class GreenChilli extends StatelessWidget {
  const GreenChilli({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Green Chilli Product'),
      ),
      body: const Center(
        child: Text('Details about Green Chilli Product'),
      ),
    );
  }
}

class BlackPepper extends StatelessWidget {
  const BlackPepper({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Black Pepper Product'),
      ),
      body: const Center(
        child: Text('Details about Black Pepper Product'),
      ),
    );
  }
}

class GingerProduct extends StatelessWidget {
  const GingerProduct({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ginger Product'),
      ),
      body: const Center(
        child: Text('Details about Ginger Product'),
      ),
    );
  }
}

class BananaProduct extends StatelessWidget {
  const BananaProduct({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Banana Product'),
      ),
      body: const Center(
        child: Text('Details about Banana Product'),
      ),
    );
  }
}

class Beetroot extends StatelessWidget {
  const Beetroot({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Beetroot Product'),
      ),
      body: const Center(
        child: Text('Details about Beetroot Product'),
      ),
    );
  }
}

class PumpkinProduct extends StatelessWidget {
  const PumpkinProduct({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pumpkin Product'),
      ),
      body: const Center(
        child: Text('Details about Pumpkin Product'),
      ),
    );
  }
}

class MangoProduct extends StatelessWidget {
  const MangoProduct({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mango Product'),
      ),
      body: const Center(
        child: Text('Details about Mango Product'),
      ),
    );
  }
}

class AppelProduct extends StatelessWidget {
  const AppelProduct({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Apple Product'),
      ),
      body: const Center(
        child: Text('Details about Apple Product'),
      ),
    );
  }
}
