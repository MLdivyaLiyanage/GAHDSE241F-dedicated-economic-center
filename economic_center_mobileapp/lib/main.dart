import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'DEC Sri Lanka',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        fontFamily: 'Poppins',
        scaffoldBackgroundColor: Colors.grey[100],
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  int _currentBannerIndex = 0;
  final PageController _pageController = PageController();

  // Constants for styling
  static const primaryColor = Color(0xFF0D967C);
  static const bannerHeight = 120.0;
  static const productItemHeight = 100.0;
  static const categoryIconSize = 40.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: _buildBackgroundDecoration(),
        child: SafeArea(
          child: Column(
            children: [
              const _HeaderSection(),
              const _SearchBar(),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: [
                    _OfferBannerSection(
                      controller: _pageController,
                      currentIndex: _currentBannerIndex,
                      onPageChanged: (index) {
                        setState(() => _currentBannerIndex = index);
                      },
                    ),
                    const _CategorySection(),
                    const _PopularProductsSection(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _BottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemSelected: (index) {
          setState(() => _selectedIndex = index);
        },
      ),
    );
  }

  BoxDecoration _buildBackgroundDecoration() {
    return BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.topCenter,
        colors: [
          primaryColor,
          primaryColor,
          Colors.grey[100]!,
          Colors.grey[100]!,
        ],
        stops: const [0.0, 0.15, 0.15, 1.0],
      ),
    );
  }
}

// Header Section Widget
class _HeaderSection extends StatelessWidget {
  const _HeaderSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 20,
            backgroundColor: Colors.white,
            backgroundImage: AssetImage('assets/images/Farmer2.jpg'),
          ),
          const SizedBox(width: 12),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Welcome',
                  style: TextStyle(fontSize: 14, color: Colors.white)),
              Text('Dilmi Ravihsa',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white)),
            ],
          ),
          const Spacer(),
          Container(
            decoration: BoxDecoration(
              // ignore: deprecated_member_use
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            padding: const EdgeInsets.all(8),
            child: const Icon(Icons.notifications_outlined,
                color: Colors.white, size: 20),
          ),
        ],
      ),
    );
  }
}

// Search Bar Widget
class _SearchBar extends StatelessWidget {
  const _SearchBar();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            // ignore: deprecated_member_use
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        decoration: InputDecoration(
          hintText: 'Search',
          hintStyle: TextStyle(color: Colors.grey[400]),
          prefixIcon: Icon(Icons.search, color: Colors.grey[400]),
          suffixIcon: Icon(Icons.tune, color: Colors.grey[400]),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
        ),
      ),
    );
  }
}

// Offer Banner Section Widget
class _OfferBannerSection extends StatelessWidget {
  final PageController controller;
  final int currentIndex;
  final ValueChanged<int> onPageChanged;

  const _OfferBannerSection({
    required this.controller,
    required this.currentIndex,
    required this.onPageChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: _HomePageState.bannerHeight,
      child: Stack(
        children: [
          PageView(
            controller: controller,
            onPageChanged: onPageChanged,
            children: const [
              _BannerItem(
                title: 'Today\'s Offer',
                subtitle: 'Get discount for every order\nonly valid for today',
                gradient: LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [Color(0xFF26C6DA), Color(0xFFFFD54F)],
                ),
              ),
              _BannerItem(
                title: 'Special Deal',
                subtitle: 'Buy 2 get 1 free on all fruits\nvalid until weekend',
                gradient: LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [Color(0xFF42A5F5), Color(0xFF4CAF50)],
                ),
              ),
            ],
          ),
          Positioned(
            bottom: 8,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                2,
                (index) => Container(
                  width: 8,
                  height: 8,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: currentIndex == index
                        ? _HomePageState.primaryColor
                        : Colors.grey[300],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BannerItem extends StatelessWidget {
  final String title;
  final String subtitle;
  final Gradient gradient;

  const _BannerItem({
    required this.title,
    required this.subtitle,
    required this.gradient,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(title,
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue[900])),
                const SizedBox(height: 4),
                Text(subtitle,
                    style: TextStyle(fontSize: 12, color: Colors.blue[900])),
              ],
            ),
          ),
          Image.asset('assets/farmer.png', height: 100, fit: BoxFit.contain),
        ],
      ),
    );
  }
}

// Category Section Widget
class _CategorySection extends StatelessWidget {
  const _CategorySection();

  @override
  Widget build(BuildContext context) {
    final categories = [
      {'title': 'Vegetables', 'image': 'assets/vegetables.png'},
      {'title': 'Fruits', 'image': 'assets/fruits.png'},
      {'title': 'Nuts', 'image': 'assets/nuts.png'},
      {'title': 'Chili', 'image': 'assets/chili.png'},
      {'title': 'Pepper', 'image': 'assets/pepper.png'},
      {'title': 'Ginger', 'image': 'assets/ginger.png'},
      {'title': 'Honey', 'image': 'assets/honey.png'},
      {'title': 'Turmeric\nPowder', 'image': 'assets/turmeric.png'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(bottom: 12),
          child: Text('Categories',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4,
            childAspectRatio: 0.8,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
          ),
          itemCount: categories.length,
          itemBuilder: (context, index) {
            final category = categories[index];
            return Column(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.all(8),
                  child: Image.asset(
                    category['image'] as String,
                    height: _HomePageState.categoryIconSize,
                    width: _HomePageState.categoryIconSize,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  category['title'] as String,
                  style: const TextStyle(
                      fontSize: 10, fontWeight: FontWeight.w500),
                  textAlign: TextAlign.center,
                ),
              ],
            );
          },
        ),
      ],
    );
  }
}

// Popular Products Section Widget
class _PopularProductsSection extends StatelessWidget {
  const _PopularProductsSection();

  @override
  Widget build(BuildContext context) {
    final products = [
      {
        'name': 'Nethru',
        'subtitle': 'Tomato Seller',
        'rating': 4.9,
        'reviews': 57,
        'image': 'assets/tomato_seller.jpg',
      },
      {
        'name': 'Fresh Carrots',
        'subtitle': 'Organic Farm',
        'rating': 4.7,
        'reviews': 43,
        'image': 'assets/carrots.jpg',
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 16),
          child: Text('Popular Products',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: products.length,
          itemBuilder: (context, index) {
            final product = products[index];
            return _ProductItem(product: product);
          },
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}

class _ProductItem extends StatelessWidget {
  final Map<String, dynamic> product;

  const _ProductItem({required this.product});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: _HomePageState.productItemHeight,
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            // ignore: deprecated_member_use
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius:
                const BorderRadius.horizontal(left: Radius.circular(12)),
            child: Image.asset(
              product['image'] as String,
              width: _HomePageState.productItemHeight,
              height: _HomePageState.productItemHeight,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(product['name'] as String,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(product['subtitle'] as String,
                    style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.star, size: 16, color: Colors.amber),
                    const SizedBox(width: 4),
                    Text('${product['rating']} (${product['reviews']} Reviews)',
                        style: const TextStyle(
                            fontSize: 12, fontWeight: FontWeight.w500)),
                  ],
                ),
              ],
            ),
          ),
          IconButton(
            icon: Icon(Icons.favorite_border, color: Colors.grey[400]),
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}

// Bottom Navigation Bar Widget
class _BottomNavigationBar extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onItemSelected;

  const _BottomNavigationBar({
    required this.selectedIndex,
    required this.onItemSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 65,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(20), topRight: Radius.circular(20)),
        boxShadow: [
          BoxShadow(
              // ignore: deprecated_member_use
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5)),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _NavItem(
            index: 0,
            icon: Icons.home_filled,
            label: 'Home',
            isSelected: selectedIndex == 0,
            onTap: onItemSelected,
          ),
          _NavItem(
            index: 1,
            icon: Icons.message_outlined,
            label: 'Message',
            isSelected: selectedIndex == 1,
            onTap: onItemSelected,
          ),
          _NavItem(
            index: 2,
            icon: Icons.shopping_cart_outlined,
            label: 'Cart',
            isSelected: selectedIndex == 2,
            onTap: onItemSelected,
          ),
          _NavItem(
            index: 3,
            icon: Icons.menu,
            label: 'More',
            isSelected: selectedIndex == 3,
            onTap: onItemSelected,
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final int index;
  final IconData icon;
  final String label;
  final bool isSelected;
  final ValueChanged<int> onTap;

  const _NavItem({
    required this.index,
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => onTap(index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFE0F7F5) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon,
                color: isSelected ? _HomePageState.primaryColor : Colors.grey,
                size: 22),
            const SizedBox(height: 4),
            Text(label,
                style: TextStyle(
                    color:
                        isSelected ? _HomePageState.primaryColor : Colors.grey,
                    fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
