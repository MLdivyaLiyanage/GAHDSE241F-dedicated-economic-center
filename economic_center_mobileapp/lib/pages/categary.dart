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

void main() {
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
  });
}

class ProductScreen extends StatefulWidget {
  const ProductScreen({super.key});

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  String selectedCategory = 'All';
  bool showLocalOnly = true;

  // Sri Lankan themed product data
  final List<Product> products = [
    Product(
      id: 1,
      name: 'Apple',
      description:
          'Finest high-grown Sri Lankan Appel leaves from Nuwara Eliya',
      price: 397.47,
      imageUrl:
          'https://img.freepik.com/free-photo/fresh-apples-supermarket_1303-16018.jpg?t=st=1745139002~exp=1745142602~hmac=86d1baad086523ba7d6ed7c244ac99c8e376c61ad0d1f6cc74090959628ccddf&w=996',
      category: 'Fruits',
      rating: 4.8,
      seller: 'Nuwara Eliya .',
      reviewCount: 128,
    ),
    Product(
      id: 2,
      name: 'Tomato',
      description: 'Traditional Sri Lankan ',
      price: 390.00,
      imageUrl:
          'https://img.freepik.com/premium-photo/close-up-tomatoes_1048944-1518277.jpg?w=996',
      category: 'Vegitables',
      rating: 4.5,
      seller: 'Handloom Crafts',
      reviewCount: 86,
    ),
    Product(
      id: 3,
      name: 'Devilled Cashews',
      description: 'Authentic Sri Lankan spices ',
      price: 350.00,
      imageUrl:
          'https://img.freepik.com/free-photo/tasty-cashew-nuts-as-background_1150-45355.jpg?t=st=1745158007~exp=1745161607~hmac=16154198aba0578978fa521975a3762f98b6f7ad9a237ce7d92728ebd4e7c7fd&w=996',
      category: 'Nuts',
      rating: 4.7,
      seller: 'Spice Island',
      reviewCount: 215,
    ),
    Product(
      id: 4,
      name: 'green chilli',
      description:
          'Eco-friendly wooden artifacts made from sustainable materials',
      price: 675.00,
      imageUrl:
          'https://img.freepik.com/premium-photo/full-frame-shot-green-chili-peppers_1048944-25440816.jpg?w=826',
      category: 'Chilli',
      rating: 4.6,
      seller: 'Wood Artisans',
      reviewCount: 42,
    ),
    Product(
      id: 5,
      name: 'Black pepper',
      description: 'Pure virgin coconut oil 500ml - cold pressed and organic',
      price: 340.00,
      imageUrl:
          'https://img.freepik.com/free-photo/black-milled-pepper-corns-as-background-high-quality-photo_114579-40514.jpg?t=st=1745158828~exp=1745162428~hmac=4b13a55451af83438329ec9bbe0b7f9778bc7c7c412521a401e2765186bb5cd7&w=996',
      category: 'Pepper',
      rating: 4.4,
      seller: 'Coconut Paradise',
      reviewCount: 178,
    ),
    Product(
      id: 6,
      name: 'Ginger',
      description: 'Traditional Sri Lankan batik design - 100% cotton',
      price: 1223.00,
      imageUrl:
          'https://img.freepik.com/free-photo/young-woman-buys-ginger-market-woman-choose-ginger-supermarket-woman-picking-fresh-produce-market_1391-643.jpg?t=st=1745159114~exp=1745162714~hmac=ffbcd5b11d6dc279221dbc9cc6cb3768e7912e065406c98689522b3fb5eb49a0&w=900',
      category: 'Ginger',
      rating: 4.3,
      seller: 'Batik House',
      reviewCount: 64,
    ),
    Product(
      id: 7,
      name: 'Banana',
      description: 'Blue sapphire with silver chain - ethically sourced gems',
      price: 212.00,
      imageUrl:
          'https://img.freepik.com/free-photo/bananas-hanging-rope_1122-1220.jpg?t=st=1745159206~exp=1745162806~hmac=906e44115c65904a876f2f619da4441c6c2c83ee87998fd956f981baf00d6229&w=900',
      category: 'Fruits',
      rating: 4.9,
      seller: 'Ratnapura',
      reviewCount: 53,
    ),
    Product(
      id: 8,
      name: 'Beetroot',
      description: 'Traditional medicine set for holistic wellness',
      price: 132.00,
      imageUrl:
          'https://img.freepik.com/premium-photo/close-up-plants_1048944-21388094.jpg?w=996',
      category: 'Vegetable',
      rating: 4.5,
      seller: 'Ayurveda Lanka',
      reviewCount: 97,
    ),
    Product(
      id: 9,
      name: 'Pumpkin',
      description: 'Traditional woven Dumbara mats - unique Sri Lankan craft',
      price: 334.00,
      imageUrl:
          'https://img.freepik.com/free-photo/various-striped-pumpkins-harvested-sunny-autumn-day-close-up-orange-green-pumpkins_7502-10551.jpg?t=st=1745159889~exp=1745163489~hmac=41b9f869261a485262b38d3ee74875019bcb711426f5cd5bf02b810a57622b3f&w=900',
      category: 'Vegetable',
      rating: 4.7,
      seller: 'Dumbara Weavers',
      reviewCount: 31,
    ),
    Product(
      id: 10,
      name: 'Mango',
      description: 'Pure Ceylon cinnamon sticks 100g - sweet and aromatic',
      price: 734.00,
      imageUrl:
          'https://img.freepik.com/premium-photo/selecting-ripe-mangoes-market_938295-3419.jpg?w=996',
      category: 'Fruits',
      rating: 4.8,
      seller: 'Cinnamon Valley',
      reviewCount: 203,
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

    if (selectedCategory != 'All') {
      filtered = filtered
          .where((product) => product.category == selectedCategory)
          .toList();
    }

    if (showLocalOnly) {
      filtered = filtered.where((product) => product.isLocal).toList();
    }

    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sri Lankan Marketplace'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(20),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
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
                    child: Container(
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
                          'Try changing your filters',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  )
                : GridView.builder(
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
                      return EnhancedProductCard(product: product);
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Theme.of(context).colorScheme.primary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Badge(
          label: Text('3'),
          child: Icon(Icons.shopping_cart, color: Colors.white),
        ),
      ),
    );
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'All':
        return Icons.category;
      case 'Beverages':
        return Icons.local_cafe;
      case 'Clothing':
        return Icons.checkroom;
      case 'Food':
        return Icons.restaurant;
      case 'Handicrafts':
        return Icons.handyman;
      case 'Jewelry':
        return Icons.diamond;
      case 'Wellness':
        return Icons.spa;
      default:
        return Icons.shopping_bag;
    }
  }
}

// Enhanced Product Card with improved visuals and navigation
class EnhancedProductCard extends StatelessWidget {
  final Product product;

  const EnhancedProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: () {
        // Navigate to the corresponding product page based on product.id
        switch (product.id) {
          case 1:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Apple()),
            );
            break;
          case 2:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Tomato()),
            );
            break;
          case 3:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Cashews()),
            );
            break;
          case 4:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Chilli()),
            );
            break;
          case 5:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Pepper()),
            );
            break;
          case 6:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Ginger()),
            );
            break;
          case 7:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Banana()),
            );
            break;
          case 8:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Beet()),
            );
            break;
          case 9:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Pumpkin()),
            );
            break;
          case 10:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const Mango()),
            );
            break;
          // Add cases for other products...
          default:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const DefaultProduct()),
            );
        }
      },
      child: Card(
        elevation: 3,
        shadowColor: Colors.black26,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 140,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(16)),
                color: Colors.grey[200],
              ),
              child: ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(16)),
                child: Image.network(
                  product.imageUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Center(
                      child: Icon(Icons.image_not_supported,
                          size: 40, color: Colors.grey[400]),
                    );
                  },
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return Center(
                      child: CircularProgressIndicator(
                        value: loadingProgress.expectedTotalBytes != null
                            ? loadingProgress.cumulativeBytesLoaded /
                                loadingProgress.expectedTotalBytes!
                            : null,
                        strokeWidth: 2,
                        color: theme.colorScheme.primary,
                      ),
                    );
                  },
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    product.category,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        'Rs. ${product.price.toStringAsFixed(0)}',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                      const Spacer(),
                      Row(
                        children: [
                          Icon(
                            Icons.star,
                            size: 16,
                            color: Colors.amber[700],
                          ),
                          const SizedBox(width: 2),
                          Text(
                            product.rating.toString(),
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[700],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
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

// Default product page for unknown products
class DefaultProduct extends StatelessWidget {
  const DefaultProduct({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Details'),
      ),
      body: const Center(
        child: Text('Product details not available'),
      ),
    );
  }
}
