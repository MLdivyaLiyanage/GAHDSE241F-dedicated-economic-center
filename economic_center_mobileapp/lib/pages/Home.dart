// ignore_for_file: depend_on_referenced_packages, sort_child_properties_last, deprecated_member_use, unnecessary_string_escapes

import 'package:economic_center_mobileapp/pages/Location.dart';
import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:http_parser/http_parser.dart';
import 'package:economic_center_mobileapp/pages/UserProfile.dart';
import 'package:economic_center_mobileapp/pages/categary.dart';
import 'package:economic_center_mobileapp/pages/message.dart';
import 'package:economic_center_mobileapp/pages/Farmers.dart';
import 'package:economic_center_mobileapp/pages/Aboutus.dart';

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
        primarySwatch: Colors.green,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomePage(
        userData: {'username': 'Guest'}, // Provide default user data
      ),
      debugShowCheckedModeBanner: false,
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/message':
            return MaterialPageRoute(
              builder: (context) => const ChatsListScreen(isDarkMode: false),
            );
          case '/farmers':
            return MaterialPageRoute(
              builder: (context) => const FarmerProfilesPage(),
            );
          case '/farmer-details':
            return MaterialPageRoute(
              builder: (context) => const FarmerProfilesApp(),
            );
          case '/about':
            return MaterialPageRoute(
              builder: (context) => const AboutUsPage(),
            );
          case '/location':
            return MaterialPageRoute(
              builder: (context) => const SriLankaExplorer(),
            );
          default:
            return null;
        }
      },
      onUnknownRoute: (settings) {
        return MaterialPageRoute(
          builder: (context) => Scaffold(
            appBar: AppBar(
              title: const Text('Page Not Found'),
              backgroundColor: Colors.green.shade600,
            ),
            body: const Center(
              child: Text('The requested page could not be found.'),
            ),
          ),
        );
      },
    );
  }
}

class HomePage extends StatelessWidget {
  final Map<String, dynamic> userData;

  const HomePage({super.key, required this.userData});

  @override
  Widget build(BuildContext context) {
    final userRole = userData['role'] ?? 'farmer';

    return Scaffold(
      floatingActionButton: userRole == 'farmer'
          ? FloatingActionButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => UploadProductPage(userData: userData),
                  ),
                );
              },
              backgroundColor: Colors.green.shade600,
              child: const Icon(Icons.add_circle_outline_rounded, size: 32),
              tooltip: 'Add Product',
            )
          : null, // Only show add product button for farmers
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
                        Color.fromARGB(255, 121, 232, 52),
                      ],
                    ),
                  ),
                ),
              ),
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Sri Lanka Dedicated Economic Center',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 0.5,
                      shadows: [
                        Shadow(
                          offset: Offset(1, 1),
                          blurRadius: 3,
                          color: Color.fromARGB(100, 0, 0, 0),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    'Welcome ${userData['username'] ?? 'User'}',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.normal,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
              titleSpacing: 0,
              actions: [
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            UserProfileScreen(userData: userData),
                      ),
                    );
                  },
                  child: const Padding(
                    padding: EdgeInsets.only(right: 16.0),
                    child: CircleAvatar(
                      backgroundImage: NetworkImage(
                        'https://randomuser.me/api/portraits/women/42.jpg',
                      ),
                      radius: 18,
                    ),
                  ),
                ),
              ],
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(60),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Search',
                      hintStyle: TextStyle(color: Colors.grey.shade400),
                      prefixIcon: const Icon(
                        Icons.search_rounded,
                        color: Colors.green,
                      ),
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
                  _buildOfferBanner(),
                  _buildCategoriesSection(context),
                  _buildProductsSection(context),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(context),
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
            colors: [Color(0xFFFFA726), Color(0xFFF57C00), Color(0xFFE65100)],
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
              style: TextStyle(color: Colors.white, fontSize: 14),
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
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

  Widget _buildCategoriesSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Categories',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 120,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            children: [
              _buildCategoryItem(
                'Vegetables',
                'https://img.freepik.com/free-photo/harvest-fresh-vegetable-baskets-presented-outdoor-market-sale_346278-729.jpg',
                Icons.grass_rounded,
              ),
              _buildCategoryItem(
                'Fruits',
                'https://img.freepik.com/free-photo/beautiful-street-market-sunset_23-2151530009.jpg',
                Icons.apple_rounded,
              ),
              _buildCategoryItem(
                'Nuts',
                'https://img.freepik.com/free-photo/set-pecan-pistachios-almond-peanut-cashew-pine-nuts-assorted-nuts-dried-fruits-mini-different-bowls-black-pan-top-view_176474-2049.jpg',
                Icons.spa_rounded,
              ),
              _buildCategoryItem(
                'Chilli',
                'https://img.freepik.com/premium-photo/vegetables-sale-market_1048944-22010058.jpg',
                Icons.local_fire_department_rounded,
              ),
              _buildCategoryItem(
                'Pepper',
                'https://img.freepik.com/free-photo/closeup-shot-colorful-asian-spices-market-with-blurry_181624-16223.jpg',
                Icons.eco_rounded,
              ),
              _buildCategoryItem(
                'Ginger',
                'https://img.freepik.com/free-photo/assortment-ginger-wooden-board_23-2148799547.jpg',
                Icons.energy_savings_leaf_rounded,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryItem(String name, String imageUrl, IconData icon) {
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
              child: Center(
                child: Icon(
                  icon,
                  color: Colors.white.withOpacity(0.8),
                  size: 36,
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

  Widget _buildProductsSection(BuildContext context) {
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
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const CategoryScreen(),
                    ),
                  );
                },
                child: const Text('View All'),
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
            _buildProductCard(
              'Tomato',
              '4.9 (27 Reviews)',
              'https://img.freepik.com/free-photo/fresh-tomato-vegetable-growth-healthy-eating-organic-food-generated-by-ai_188544-151682.jpg',
              Icons.favorite_border_rounded,
            ),
            _buildProductCard(
              'Potato',
              '4.7 (15 Reviews)',
              'https://img.freepik.com/premium-photo/fresh-organic-potato-plant-field_86639-848.jpg',
              Icons.favorite_border_rounded,
            ),
            _buildProductCard(
              'Apple',
              '4.8 (22 Reviews)',
              'https://img.freepik.com/free-photo/orchard-full-fruit-trees-agricultural-landscape_1268-30591.jpg',
              Icons.favorite_border_rounded,
            ),
            _buildProductCard(
              'Banana',
              '4.5 (18 Reviews)',
              'https://img.freepik.com/premium-photo/two-bunches-bananas-growing-tree-plontage-island-mauritius_217593-9058.jpg',
              Icons.favorite_border_rounded,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildProductCard(
    String name,
    String rating,
    String imageUrl,
    IconData icon,
  ) {
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
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(16),
              ),
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
                child: Icon(icon, color: Colors.red, size: 20),
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
                    const Icon(
                      Icons.star_rounded,
                      color: Colors.amber,
                      size: 16,
                    ),
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
                      '\Rs.2.99',
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
                            Colors.green.shade700,
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
                      child: const Icon(
                        Icons.add_rounded,
                        color: Colors.white,
                        size: 20,
                      ),
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

  Widget _buildBottomNavigationBar(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.white, Colors.green.shade50],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.transparent,
        elevation: 0,
        selectedItemColor: Colors.green.shade700,
        unselectedItemColor: Colors.grey.shade600,
        selectedIconTheme: const IconThemeData(size: 28),
        unselectedIconTheme: const IconThemeData(size: 26),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline_rounded),
            label: 'Message',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.location_on_outlined),
            label: 'Location',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.more_horiz_rounded),
            label: 'More',
          ),
        ],
        onTap: (index) {
          try {
            if (index == 1) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      const ChatsListScreen(isDarkMode: false),
                ),
              );
            } else if (index == 2) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const SriLankaExplorer(),
                ),
              );
            } else if (index == 3) {
              _showMoreOptions(context);
            }
          } catch (e) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Navigation error: ${e.toString()}'),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
      ),
    );
  }

  void _showMoreOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(
                  Icons.agriculture_rounded,
                  color: Colors.green,
                ),
                title: const Text('Farmers Pages'),
                onTap: () {
                  Navigator.pop(context);
                  try {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const FarmerProfilesPage(),
                      ),
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Navigation error: ${e.toString()}'),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                },
              ),
              ListTile(
                leading: const Icon(
                  Icons.info_outline_rounded,
                  color: Colors.green,
                ),
                title: const Text('About Us'),
                onTap: () {
                  Navigator.pop(context);
                  try {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const AboutUsPage(),
                      ),
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Navigation error: ${e.toString()}'),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                },
              ),
            ],
          ),
        );
      },
    );
  }
}

class UploadProductPage extends StatefulWidget {
  final Map<String, dynamic> userData;

  const UploadProductPage({super.key, required this.userData});

  @override
  State<UploadProductPage> createState() => _UploadProductPageState();
}

class _UploadProductPageState extends State<UploadProductPage> {
  final _formKey = GlobalKey<FormState>();
  final List<ProductForm> _products = [ProductForm()];
  bool _isUploading = false;
  final PageController _pageController = PageController();
  int _currentPage = 0;

  // Update the base URL to match the backend port
  static const String _baseUrl = 'http://10.0.2.2:5001';

  final List<String> _categories = [
    'Vegetables',
    'Fruits',
    'Nuts',
    'Chilli',
    'Pepper',
    'Ginger',
    'Other',
  ];

  void _addProduct() {
    setState(() {
      _products.add(ProductForm());
    });
    // Navigate to the new product page
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _pageController.animateToPage(
        _products.length - 1,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    });
  }

  void _removeProduct(int index) {
    if (_products.length > 1) {
      setState(() {
        _products[index].dispose();
        _products.removeAt(index);
        if (_currentPage >= _products.length) {
          _currentPage = _products.length - 1;
        }
      });
      // Navigate to a valid page
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _pageController.animateToPage(
          _currentPage,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      });
    }
  }

  Future<void> _uploadProducts() async {
    if (!_formKey.currentState!.validate()) return;

    // Validate that all products have images
    for (int i = 0; i < _products.length; i++) {
      if (_products[i].imageFile == null) {
        _showErrorSnackbar('Please select an image for product ${i + 1}');
        return;
      }

      // Check if file exists
      bool fileExists = await _products[i].imageFile!.exists();
      if (!fileExists) {
        _showErrorSnackbar(
            'Image file not found for product ${i + 1}. Please select again.');
        return;
      }
    }

    setState(() {
      _isUploading = true;
    });

    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$_baseUrl/api/products/multiple'),
      );

      // Get farmer ID from logged-in user data
      final farmerId = widget.userData['id'] ?? widget.userData['userId'];
      // Remove farmer_name since we'll get it from users table via JOIN

      if (farmerId == null) {
        _showErrorSnackbar('User ID not found. Please login again.');
        return;
      }

      // Prepare products data with proper validation
      List<Map<String, dynamic>> productsData = [];
      for (var product in _products) {
        // Validate required fields before adding
        if (product.nameController.text.trim().isEmpty ||
            product.priceController.text.trim().isEmpty ||
            product.stockController.text.trim().isEmpty) {
          _showErrorSnackbar(
              'Please fill all required fields for each product');
          return;
        }

        productsData.add({
          'name': product.nameController.text.trim(),
          'price': product.priceController.text.trim(),
          'quantity': product.stockController.text.trim(),
          'category': product.selectedCategory,
          'description': product.descriptionController.text.trim(),
          'farmer_id': farmerId, // Use the logged-in user's ID
          // Remove farmer_name - it will be fetched from users table
          'address': product.addressController.text.trim().isEmpty
              ? null
              : product.addressController.text.trim(),
        });
      }

      print('Farmer ID being used: $farmerId');
      request.fields['products'] = json.encode(productsData);
      print('Products data: ${json.encode(productsData)}');

      // Add image files in the same order as products
      for (int i = 0; i < _products.length; i++) {
        try {
          var imageFile = await http.MultipartFile.fromPath(
            'images',
            _products[i].imageFile!.path,
            contentType: MediaType('image', 'jpeg'),
          );
          request.files.add(imageFile);
          print('Added image ${i + 1}: ${_products[i].imageFile!.path}');
        } catch (e) {
          print('Error adding image ${i + 1}: $e');
          _showErrorSnackbar('Error processing image ${i + 1}: $e');
          return;
        }
      }

      print('Sending request to: $_baseUrl/api/products/multiple');
      print('Total files: ${request.files.length}');
      print('Total products: ${productsData.length}');

      // Send the request with timeout
      var response = await request.send().timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw Exception('Request timed out. Please check your connection.');
        },
      );

      final responseBody = await response.stream.bytesToString();

      print('Response status: ${response.statusCode}');
      print('Response body: $responseBody');

      if (response.statusCode == 201) {
        final jsonResponse = json.decode(responseBody);
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
                jsonResponse['message'] ?? 'Products uploaded successfully!'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 3),
          ),
        );
        Navigator.pop(
            context, true); // Return true to indicate successful upload
      } else {
        try {
          final jsonResponse = json.decode(responseBody);
          _showErrorSnackbar(
            'Failed to upload products: ${jsonResponse['error'] ?? 'Unknown error'}',
          );
        } catch (e) {
          _showErrorSnackbar(
              'Server error: ${response.statusCode} - $responseBody');
        }
      }
    } on SocketException {
      _showErrorSnackbar(
        'Could not connect to the server. Please check your connection and ensure the backend is running on port 5001.',
      );
    } on HttpException {
      _showErrorSnackbar('Could not reach the server. Please try again later.');
    } on FormatException catch (e) {
      _showErrorSnackbar('Invalid server response: $e');
    } on Exception catch (e) {
      _showErrorSnackbar('Connection error: ${e.toString()}');
    } catch (e) {
      print('Upload error: $e');
      _showErrorSnackbar('An unexpected error occurred: ${e.toString()}');
    } finally {
      if (mounted) {
        setState(() {
          _isUploading = false;
        });
      }
    }
  }

  void _showErrorSnackbar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 4),
      ),
    );
  }

  @override
  void dispose() {
    for (var product in _products) {
      product.dispose();
    }
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Upload Products (${_products.length})'),
        backgroundColor: Colors.green.shade600,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            onPressed: _addProduct,
            tooltip: 'Add Another Product',
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.green.shade50, Colors.white],
          ),
        ),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: _products.length,
                  onPageChanged: (index) {
                    setState(() {
                      _currentPage = index;
                    });
                  },
                  itemBuilder: (context, index) {
                    return _buildProductForm(index);
                  },
                ),
              ),
              Container(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(_products.length, (index) {
                        return Container(
                          margin: const EdgeInsets.symmetric(horizontal: 2),
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: index == _currentPage
                                ? Colors.green
                                : Colors.green.withOpacity(0.3),
                            shape: BoxShape.circle,
                          ),
                        );
                      }),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Page ${_currentPage + 1} of ${_products.length}',
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _isUploading ? null : _uploadProducts,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 3,
                        minimumSize: const Size(double.infinity, 50),
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
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.cloud_upload_outlined,
                                    size: 24),
                                const SizedBox(width: 8),
                                Text(
                                  'Upload ${_products.length} Product${_products.length > 1 ? 's' : ''}',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
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
  }

  Widget _buildProductForm(int index) {
    final product = _products[index];

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Product ${index + 1} of ${_products.length}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (_products.length > 1)
                  IconButton(
                    icon: const Icon(Icons.delete_rounded, color: Colors.red),
                    onPressed: () => _removeProduct(index),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: () async {
                await product.pickImage();
                setState(() {}); // Trigger rebuild to show selected image
              },
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
                child: product.imageFile != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.file(
                          product.imageFile!,
                          fit: BoxFit.cover,
                          width: double.infinity,
                        ),
                      )
                    : Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.add_photo_alternate_rounded,
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
            TextFormField(
              controller: product.nameController,
              decoration: InputDecoration(
                labelText: 'Product Name',
                prefixIcon: const Icon(Icons.shopping_bag_outlined,
                    color: Colors.green),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
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
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: product.priceController,
                    decoration: InputDecoration(
                      labelText: 'Price (Rs.)',
                      prefixIcon: const Icon(Icons.currency_rupee_rounded,
                          color: Colors.green),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter price';
                      }
                      if (double.tryParse(value) == null ||
                          double.parse(value) <= 0) {
                        return 'Enter valid price';
                      }
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    controller: product.stockController,
                    decoration: InputDecoration(
                      labelText: 'Quantity (kg)',
                      prefixIcon: const Icon(Icons.inventory_2_outlined,
                          color: Colors.green),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter quantity';
                      }
                      if (int.tryParse(value) == null || int.parse(value) < 0) {
                        return 'Enter valid quantity';
                      }
                      return null;
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: product.selectedCategory,
              decoration: InputDecoration(
                labelText: 'Category',
                prefixIcon:
                    const Icon(Icons.category_outlined, color: Colors.green),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
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
                  product.selectedCategory = newValue!;
                });
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: product.descriptionController,
              decoration: InputDecoration(
                labelText: 'Description',
                prefixIcon:
                    const Icon(Icons.description_outlined, color: Colors.green),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Colors.white,
              ),
              maxLines: 3,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter description';
                }
                if (value.length < 10) {
                  return 'Description must be at least 10 characters';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: product.addressController,
              decoration: InputDecoration(
                labelText: 'Address (Optional)',
                prefixIcon:
                    const Icon(Icons.location_on_outlined, color: Colors.green),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                fillColor: Colors.white,
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class ProductForm {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController priceController = TextEditingController();
  final TextEditingController stockController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  String selectedCategory = 'Vegetables';
  File? imageFile;
  final ImagePicker _picker = ImagePicker();

  Future<void> pickImage() async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        imageFile = File(pickedFile.path);
        print('Image selected: ${pickedFile.path}');
        print('File exists: ${await imageFile!.exists()}');
      } else {
        print('No image selected');
      }
    } catch (e) {
      print('Failed to pick image: $e');
      // You might want to show this error to the user
    }
  }

  void dispose() {
    nameController.dispose();
    priceController.dispose();
    stockController.dispose();
    descriptionController.dispose();
    addressController.dispose();
  }
}
