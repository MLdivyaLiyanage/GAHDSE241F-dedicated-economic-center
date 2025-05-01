import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fresh Grocery',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0C4B33), // Sri Lankan green theme
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Poppins',
      ),
      home: const LoginPage(),
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
      name: 'Appel',
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
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const UploadProductPage()),
          );
        },
        backgroundColor: Colors.green.shade600,
        child: const Icon(Icons.add),
        tooltip: 'Add Product',
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.white, Colors.white],
          ),
        ),
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 130,
              pinned: true,
              backgroundColor: Colors.green.shade600,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Color.fromARGB(255, 81, 202, 209),
                        Color.fromARGB(255, 121, 232, 52)
                      ],
                    ),
                  ),
                ),
              ),
              title: const Text('Welcome'),
              actions: const [
                Padding(
                  padding: EdgeInsets.only(right: 16.0),
                  child: CircleAvatar(
                    backgroundImage: NetworkImage(
                        'https://randomuser.me/api/portraits/women/42.jpg'),
                    radius: 18,
                  ),
                ),
              ],
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(60),
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Search',
                      hintStyle: TextStyle(color: Colors.grey.shade400),
                      prefixIcon: const Icon(Icons.search, color: Colors.green),
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0),
                    ),
                  ),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Offer Banner
                  _buildOfferBanner(),

                  // Categories Section
                  _buildCategoriesSection(),

                  // Popular Products Section
                  _buildProductsSection(),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildCustomBottomNavigationBar(context),
    );
  }

  Widget _buildOfferBanner() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [
              Color(0xFFFFA726),
              Color(0xFFF57C00),
              Color(0xFFE65100),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.deepOrange.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Today's offer",
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Get discount for every order\nonly valid for today',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Text(
                  'Shop Now',
                  style: TextStyle(
                    color: Colors.deepOrange,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoriesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Categories',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'See All',
                  style: TextStyle(
                    color: Colors.green.shade700,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 120,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            children: [
              _buildCategoryItem('Vegetables',
                  'https://img.freepik.com/free-photo/harvest-fresh-vegetable-baskets-presented-outdoor-market-sale_346278-729.jpg'),
              _buildCategoryItem('Fruits',
                  'https://img.freepik.com/free-photo/beautiful-street-market-sunset_23-2151530009.jpg'),
              _buildCategoryItem('Nuts',
                  'https://img.freepik.com/free-photo/set-pecan-pistachios-almond-peanut-cashew-pine-nuts-assorted-nuts-dried-fruits-mini-different-bowls-black-pan-top-view_176474-2049.jpg'),
              _buildCategoryItem('Chilli',
                  'https://img.freepik.com/premium-photo/vegetables-sale-market_1048944-22010058.jpg'),
              _buildCategoryItem('Pepper',
                  'https://img.freepik.com/free-photo/closeup-shot-colorful-asian-spices-market-with-blurry_181624-16223.jpg'),
              _buildCategoryItem('Ginger',
                  'https://img.freepik.com/free-photo/assortment-ginger-wooden-board_23-2148799547.jpg'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryItem(String name, String imageUrl) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        children: [
          Container(
            width: 75,
            height: 75,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 5,
                  offset: const Offset(0, 3),
                ),
              ],
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Colors.white, Colors.green.shade50],
              ),
              border: Border.all(color: Colors.white, width: 2),
            ),
            child: Container(
              margin: const EdgeInsets.all(5),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                image: DecorationImage(
                  image: NetworkImage(imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            name,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade800,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Popular Products',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'See All',
                  style: TextStyle(
                    color: Colors.green.shade700,
                  ),
                ),
              ),
            ],
          ),
        ),
        GridView.count(
          padding: const EdgeInsets.all(16),
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: 0.7,
          children: [
            _buildProductCard('Tomato', '4.9 (27 Reviews)',
                'https://img.freepik.com/free-photo/fresh-tomato-vegetable-growth-healthy-eating-organic-food-generated-by-ai_188544-151682.jpg'),
            _buildProductCard('Potato', '4.7 (15 Reviews)',
                'https://img.freepik.com/premium-photo/fresh-organic-potato-plant-field_86639-848.jpg'),
            _buildProductCard('Apple', '4.8 (22 Reviews)',
                'https://img.freepik.com/free-photo/orchard-full-fruit-trees-agricultural-landscape_1268-30591.jpg'),
            _buildProductCard('Banana', '4.5 (18 Reviews)',
                'https://img.freepik.com/premium-photo/two-bunches-bananas-growing-tree-plontage-island-mauritius_217593-9058.jpg'),
          ],
        ),
      ],
    );
  }

  Widget _buildProductCard(String name, String rating, String imageUrl) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            spreadRadius: 1,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.white, Colors.grey.shade50],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 125,
            decoration: BoxDecoration(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
              image: DecorationImage(
                image: NetworkImage(imageUrl),
                fit: BoxFit.cover,
              ),
            ),
            child: Align(
              alignment: Alignment.topRight,
              child: Container(
                margin: const EdgeInsets.all(8),
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.favorite_border,
                  color: Colors.red,
                  size: 18,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.star, color: Colors.amber, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      rating,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      '\$2.99',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.green,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.green.shade400,
                            Colors.green.shade700
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.green.withOpacity(0.3),
                            blurRadius: 5,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child:
                          const Icon(Icons.add, color: Colors.white, size: 18),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCustomBottomNavigationBar(BuildContext context) {
    return Container(
      height: 70,
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          // Home Button
          _buildNavBarItem(
            icon: Icons.home,
            label: 'Home',
            isActive: true,
            onTap: () {
              // Already on home page
            },
          ),

          // Message Button
          _buildNavBarItem(
            icon: Icons.message,
            label: 'Message',
            isActive: false,
            onTap: () {
              _showComingSoon(context);
            },
          ),

          // Cart Button
          _buildNavBarItem(
            icon: Icons.shopping_cart,
            label: 'Cart',
            isActive: false,
            onTap: () {
              _showComingSoon(context);
            },
          ),

          // Location Button
          _buildNavBarItem(
            icon: Icons.location_on,
            label: 'Location',
            isActive: false,
            onTap: () {
              // Will be linked to LocationPage later
              _showComingSoon(context);
            },
          ),

          // Settings Button
          _buildNavBarItem(
            icon: Icons.settings,
            label: 'Settings',
            isActive: false,
            onTap: () {
              // Will be linked to SettingsPage later
              _showComingSoon(context);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildNavBarItem({
    required IconData icon,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isActive ? Colors.green : Colors.grey.shade600,
            size: 24,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: isActive ? Colors.green : Colors.grey.shade600,
            ),
          ),
        ],
      ),
    );
  }

  void _showComingSoon(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('This feature is coming soon!'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}

class UploadProductPage extends StatefulWidget {
  const UploadProductPage({super.key});

  @override
  State<UploadProductPage> createState() => _UploadProductPageState();
}

class _UploadProductPageState extends State<UploadProductPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _priceController = TextEditingController();
  final _descriptionController = TextEditingController();
  String _selectedCategory = 'Vegetables';
  File? _imageFile;
  final ImagePicker _picker = ImagePicker();
  bool _isUploading = false;

  final List<String> _categories = [
    'Vegetables',
    'Fruits',
    'Nuts',
    'Chilli',
    'Pepper',
    'Ginger',
    'Other'
  ];

  Future<void> _pickImage() async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        setState(() {
          _imageFile = File(pickedFile.path);
        });
      }
    } catch (e) {
      _showErrorSnackbar('Failed to pick image: ${e.toString()}');
    }
  }

  Future<void> _uploadProduct() async {
    if (!_formKey.currentState!.validate()) return;
    if (_imageFile == null) {
      _showErrorSnackbar('Please select a product image');
      return;
    }

    setState(() {
      _isUploading = true;
    });

    // Simulate network request
    await Future.delayed(const Duration(seconds: 2));

    setState(() {
      _isUploading = false;
    });

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Product uploaded successfully!'),
        backgroundColor: Colors.green,
      ),
    );

    Navigator.pop(context);
  }

  void _showErrorSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Upload Product'),
        backgroundColor: Colors.green.shade600,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.green.shade50, Colors.white],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Product Image Uploader
                  GestureDetector(
                    onTap: _pickImage,
                    child: Container(
                      height: 200,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade300),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: _imageFile != null
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(16),
                              child: Image.file(
                                _imageFile!,
                                fit: BoxFit.cover,
                                width: double.infinity,
                              ),
                            )
                          : Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.add_photo_alternate,
                                  size: 60,
                                  color: Colors.green.shade300,
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Tap to select product image',
                                  style: TextStyle(
                                    color: Colors.grey.shade600,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Product Name
                  TextFormField(
                    controller: _nameController,
                    decoration: InputDecoration(
                      labelText: 'Product Name',
                      prefixIcon:
                          const Icon(Icons.shopping_bag, color: Colors.green),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter product name';
                      }
                      if (value.length < 3) {
                        return 'Name must be at least 3 characters';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Product Price
                  TextFormField(
                    controller: _priceController,
                    decoration: InputDecoration(
                      labelText: 'Price (\$)',
                      prefixIcon:
                          const Icon(Icons.attach_money, color: Colors.green),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter product price';
                      }
                      if (double.tryParse(value) == null) {
                        return 'Please enter a valid price';
                      }
                      if (double.parse(value) <= 0) {
                        return 'Price must be greater than 0';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Product Category Dropdown
                  DropdownButtonFormField<String>(
                    value: _selectedCategory,
                    decoration: InputDecoration(
                      labelText: 'Category',
                      prefixIcon:
                          const Icon(Icons.category, color: Colors.green),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    items: _categories.map((String category) {
                      return DropdownMenuItem<String>(
                        value: category,
                        child: Text(category),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      setState(() {
                        _selectedCategory = newValue!;
                      });
                    },
                  ),
                  const SizedBox(height: 16),

                  // Product Description
                  TextFormField(
                    controller: _descriptionController,
                    decoration: InputDecoration(
                      labelText: 'Description',
                      prefixIcon:
                          const Icon(Icons.description, color: Colors.green),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    maxLines: 4,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter product description';
                      }
                      if (value.length < 10) {
                        return 'Description must be at least 10 characters';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),

                  // Upload Button
                  ElevatedButton(
                    onPressed: _isUploading ? null : _uploadProduct,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 2,
                    ),
                    child: _isUploading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Text(
                            'UPLOAD PRODUCT',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}