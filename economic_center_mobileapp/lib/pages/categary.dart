// ignore_for_file: deprecated_member_use, duplicate_ignore, use_build_context_synchronously, sort_child_properties_last, unused_field, prefer_final_fields, unused_element, unnecessary_to_list_in_spreads, unnecessary_to_list_in_spreads, prefer_const_constructors, prefer_const_literals_to_create_immutables, empty_statements

import 'package:economic_center_mobileapp/pages/Payment.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:economic_center_mobileapp/pages/models.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sri Lanka Economic Center',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0C4B33),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Poppins',
      ),
      home: const CategoryScreen(),
    );
  }
}

class ProductService {
  static const String _baseUrl =
      'http://10.0.2.2:5001'; // Updated to match farmer upload backend

  static Future<List<Product>> fetchProducts() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/products'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> jsonResponse = json.decode(response.body);
        return jsonResponse
            .map((product) => Product.fromJson(product))
            .toList();
      } else {
        throw Exception(
            'Failed to load products: ${response.statusCode}\n${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: ${e.toString()}');
    }
  }

  static Future<bool> purchaseMultipleProducts(List<CartItem> cartItems) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/products/batch-purchase'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'items': cartItems
              .map((item) => {
                    'productId': item.product.id,
                    'quantity': item.quantity,
                  })
              .toList(),
        }),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to process purchase');
      }
    } catch (e) {
      throw Exception('Network error: ${e.toString()}');
    }
  }

  // In your ProductService class, add this method:
  static Future<bool> purchaseProduct(int productId, int quantity) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/products/$productId/purchase'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({'quantity': quantity}),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to purchase product');
      }
    } catch (e) {
      throw Exception('Network error: ${e.toString()}');
    }
  }

  static Future<List<CartItem>> getCartItems() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/cart'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> jsonResponse = json.decode(response.body);
        return jsonResponse
            .map((item) => CartItem(
                  product: Product.fromJson(item),
                  quantity: item['quantity'],
                  cartId: item['cart_id'],
                ))
            .toList();
      } else {
        throw Exception('Failed to load cart items: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: ${e.toString()}');
    }
  }

  static Future<CartItem?> addToCart(int productId, int quantity) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/cart'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'productId': productId,
          'quantity': quantity,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        if (responseData['success'] == true &&
            responseData['cartItem'] != null) {
          // Ensure the product data within cartItem is correctly parsed
          Map<String, dynamic> cartItemJson = responseData['cartItem'];
          // The backend sends product details flat inside the cartItem,
          // but CartItem.fromJson expects a nested 'product' object.
          // We need to reconstruct it if it's not already nested.
          // Based on your backend, p.* is selected, so product fields are at the top level of cartItem.
          // Product.fromJson needs these fields.
          // Manually construct Product from the flat cartItemJson, then create CartItem
          Product product = Product.fromJson(
              cartItemJson); // Product.fromJson can handle the flat structure
          return CartItem(
              product: product,
              quantity: cartItemJson['quantity'] ??
                  1, // Get quantity directly from cartItemJson
              cartId: cartItemJson[
                  'cart_id'] // Get cart_id directly from cartItemJson
              );
        } else {
          throw Exception(responseData['error'] ??
              'Failed to add to cart: Invalid response format');
        }
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to add to cart');
      }
    } catch (e) {
      // Consider logging the error or handling it more gracefully
      print('Error in ProductService.addToCart: $e');
      throw Exception('Network error or parsing issue: ${e.toString()}');
    }
  }

  static Future<bool> updateCartItem(int cartItemId, int quantity) async {
    try {
      // Validate cartItemId before making the request
      if (cartItemId <= 0) {
        throw Exception('Invalid cart item ID');
      }

      print('Updating cart item with ID: $cartItemId, quantity: $quantity');

      final response = await http.put(
        Uri.parse('$_baseUrl/api/cart/$cartItemId'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({'quantity': quantity}),
      );

      if (response.statusCode == 200) {
        print('Cart item updated successfully');
        return true;
      } else {
        final errorData = json.decode(response.body);
        print('Update cart item error: ${errorData['error']}');
        throw Exception(errorData['error'] ?? 'Failed to update cart');
      }
    } catch (e) {
      print('Update cart item network error: $e');
      throw Exception('Network error: ${e.toString()}');
    }
  }

  static Future<bool> removeFromCart(int cartItemId, {int? userId}) async {
    try {
      // Validate cartItemId before making the request
      if (cartItemId <= 0) {
        throw Exception('Invalid cart item ID');
      }

      String url = '$_baseUrl/api/cart/$cartItemId';
      if (userId != null && userId > 0) {
        url += '?user_id=$userId';
      }

      print('Removing cart item with ID: $cartItemId, URL: $url');

      final response = await http.delete(
        Uri.parse(url),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        print('Item removed: ${responseData['message']}');
        return true;
      } else {
        final errorData = json.decode(response.body);
        print('Remove from cart error: ${errorData['error']}');
        throw Exception(errorData['error'] ?? 'Failed to remove from cart');
      }
    } catch (e) {
      print('Remove from cart network error: $e');
      throw Exception('Network error: ${e.toString()}');
    }
  }

  static Future<bool> clearCartBackend({int? userId}) async {
    try {
      String url = '$_baseUrl/api/cart/clear';
      if (userId != null) {
        url += '?user_id=$userId';
      }

      final response = await http.delete(
        Uri.parse(url),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        print(
            'Cart cleared: ${responseData['deletedItems']} items deleted for user ${userId ?? 'null'}');
        return true;
      } else {
        final errorData = json.decode(response.body);
        print('Clear cart error: ${errorData['error']}');
        throw Exception(errorData['error'] ?? 'Failed to clear cart');
      }
    } catch (e) {
      print('Clear cart network error: $e');
      throw Exception('Network error: ${e.toString()}');
    }
  }

  static Future<bool> checkout({int? userId}) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/cart/checkout'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'user_id': userId,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        print(
            'Checkout completed: ${responseData['deletedCartItems']} cart items deleted for user ${userId ?? 'null'}');
        return true;
      } else {
        final errorData = json.decode(response.body);
        print('Checkout error: ${errorData['error']}');
        throw Exception(errorData['error'] ?? 'Checkout failed');
      }
    } catch (e) {
      print('Checkout network error: $e');
      throw Exception('Network error: ${e.toString()}');
    }
  }

  static Future<Product> fetchProductDetails(int productId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/products/$productId'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        return Product.fromJson(json.decode(response.body));
      } else {
        throw Exception(
            'Failed to load product: ${response.statusCode}\n${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: ${e.toString()}');
    }
  }

  static Future<Review> addReview({
    required int productId,
    required String username,
    required int rating,
    required String comment,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/products/$productId/reviews'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'username': username,
          'rating': rating,
          'comment': comment,
        }),
      );

      if (response.statusCode == 201) {
        final jsonResponse = json.decode(response.body);
        return Review.fromJson(jsonResponse['review']);
      } else {
        throw Exception(
            'Failed to add review: ${response.statusCode}\n${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: ${e.toString()}');
    }
  }

  static Future<bool> updateProductStock(int productId, int newStock) async {
    try {
      final response = await http.put(
        Uri.parse('$_baseUrl/api/products/$productId/stock'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({'stock': newStock}),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  // Removed duplicate purchaseProduct method to resolve the naming conflict.
}

class CategoryScreen extends StatefulWidget {
  final Map<String, dynamic>? userData;

  const CategoryScreen({super.key, this.userData});

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  @override
  Widget build(BuildContext context) {
    return ProductScreen(userData: widget.userData);
  }
}

class ProductScreen extends StatefulWidget {
  final Map<String, dynamic>? userData;

  const ProductScreen({super.key, this.userData});

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  String selectedCategory = 'All';
  bool showLocalOnly = true;
  bool _isLoading = true;
  String _errorMessage = '';
  List<Product> products = [];

  @override
  void initState() {
    super.initState();
    _fetchProducts();
    _fetchCartItems(); // Fetch cart items on init
  }

  Future<void> _fetchProducts() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final fetchedProducts = await ProductService.fetchProducts();
      if (mounted) {
        setState(() {
          products = fetchedProducts;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString().replaceAll('Exception: ', '');
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $_errorMessage')),
        );
      }
    }
  }

  List<CartItem> cartItems = [];
  double get totalCartValue {
    return cartItems.fold(
        0, (total, item) => total + (item.product.price * item.quantity));
  }

  // Method to fetch cart items and update state
  Future<void> _fetchCartItems() async {
    try {
      final fetchedCartItems = await ProductService.getCartItems();
      if (mounted) {
        setState(() {
          cartItems = fetchedCartItems;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  'Error fetching cart: ${e.toString().replaceAll('Exception: ', '')}')),
        );
      }
    }
  }

  // Modified addToCart method
  void addToCart(Product product, {int quantityToAdd = 1}) async {
    if (!mounted) return; // Early return if widget is disposed

    try {
      // ProductService.addToCart now returns CartItem?
      CartItem? addedItem =
          await ProductService.addToCart(product.id, quantityToAdd);

      if (!mounted) return; // Check again after async operation

      if (addedItem != null) {
        // Successfully added/updated, backend returned the item.
        // Refresh the whole cart for simplicity.
        await _fetchCartItems();
        await _fetchProducts();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  const Icon(Icons.check_circle, color: Colors.white),
                  const SizedBox(width: 8),
                  Text('${product.name} (x$quantityToAdd) added to cart'),
                ],
              ),
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
              backgroundColor: Theme.of(context).colorScheme.primary,
              duration: const Duration(seconds: 1),
            ),
          );
        }
      } else {
        // If addedItem is null, it implies a failure.
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to add ${product.name} to cart.')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  'Error adding to cart: ${e.toString().replaceAll('Exception: ', '')}')),
        );
      }
    }
  }

  // Modified removeFromCart method with better error handling
  void removeFromCart(CartItem item) async {
    if (!mounted) return; // Early return if widget is disposed

    try {
      // Validate cartId before attempting removal
      if (item.cartId <= 0) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Invalid cart item ID')),
          );
        }
        return;
      }

      bool success;
      String message;

      if (item.quantity > 1) {
        success =
            await ProductService.updateCartItem(item.cartId, item.quantity - 1);
        message = '${item.product.name} quantity updated';
      } else {
        // Pass null for userId since we're not implementing user auth yet
        success =
            await ProductService.removeFromCart(item.cartId, userId: null);
        message = '${item.product.name} removed from cart';
      }

      if (!mounted) return; // Check again after async operation

      if (success) {
        await _fetchCartItems(); // Refresh cart from server
        await _fetchProducts(); // Refresh product list and update stock on cards
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(message),
              backgroundColor:
                  item.quantity > 1 ? Colors.blueGrey : Colors.orange,
              duration: const Duration(seconds: 1),
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
                content:
                    Text('Failed to update cart for ${item.product.name}')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content:
                Text('Error: ${e.toString().replaceAll('Exception: ', '')}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void clearCart() async {
    if (!mounted) return; // Early return if widget is disposed

    try {
      // Pass null for userId since we're not implementing user auth yet
      bool success = await ProductService.clearCartBackend(userId: null);

      if (!mounted) return; // Check again after async operation

      if (success) {
        await _fetchCartItems(); // Refresh local cart
        await _fetchProducts(); // Refresh product list and update stock on cards
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Row(
                children: [
                  Icon(Icons.delete_forever, color: Colors.white),
                  SizedBox(width: 8),
                  Text('Cart cleared successfully'),
                ],
              ),
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
              backgroundColor: Colors.red.shade700,
              duration: const Duration(seconds: 2),
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to clear cart from database')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
                'Error clearing cart: ${e.toString().replaceAll('Exception: ', '')}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _showCartDialog(BuildContext context) {
    if (!mounted) return; // Early return if widget is disposed

    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.shopping_cart),
            const SizedBox(width: 8),
            const Text('Shopping Cart'),
            const Spacer(),
            if (cartItems.isNotEmpty)
              TextButton(
                onPressed: () {
                  Navigator.pop(dialogContext);
                  if (mounted) {
                    clearCart();
                  }
                },
                child: const Text('Clear All',
                    style: TextStyle(color: Colors.red)),
              ),
          ],
        ),
        content: SizedBox(
          width: double.maxFinite,
          height: 400,
          child: cartItems.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.shopping_cart_outlined,
                          size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('Your cart is empty',
                          style: TextStyle(fontSize: 18, color: Colors.grey)),
                    ],
                  ),
                )
              : Column(
                  children: [
                    Expanded(
                      child: ListView.builder(
                        itemCount: cartItems.length,
                        itemBuilder: (context, index) {
                          final item = cartItems[index];
                          return Card(
                            margin: const EdgeInsets.symmetric(vertical: 4),
                            child: ListTile(
                              leading: Container(
                                width: 50,
                                height: 50,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  color: Colors.grey[200],
                                ),
                                child: item.product.imageUrl.isNotEmpty
                                    ? ClipRRect(
                                        borderRadius: BorderRadius.circular(8),
                                        child: Image.network(
                                          item.product.imageUrl
                                                  .startsWith('http')
                                              ? item.product.imageUrl
                                              : 'http://10.0.2.2:5001/${item.product.imageUrl}',
                                          fit: BoxFit.cover,
                                          errorBuilder:
                                              (context, error, stackTrace) {
                                            return const Icon(
                                                Icons.image_not_supported);
                                          },
                                        ),
                                      )
                                    : const Icon(Icons.image_not_supported),
                              ),
                              title: Text(
                                item.product.name,
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              subtitle: Text(
                                  'Rs. ${item.product.price.toStringAsFixed(2)}'),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon:
                                        const Icon(Icons.remove_circle_outline),
                                    onPressed: () {
                                      if (mounted) {
                                        removeFromCart(item);
                                      }
                                    },
                                  ),
                                  Text('${item.quantity}'),
                                  IconButton(
                                    icon: const Icon(Icons.add_circle_outline),
                                    onPressed: () {
                                      if (mounted) {
                                        addToCart(item.product);
                                      }
                                    },
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const Divider(),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total:',
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            'Rs. ${totalCartValue.toStringAsFixed(2)}',
                            style: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Close'),
          ),
          if (cartItems.isNotEmpty)
            ElevatedButton(
              onPressed: () {
                Navigator.pop(dialogContext);
                if (mounted) {
                  _showCheckoutDialog(context);
                }
              },
              child: const Text('Checkout'),
            ),
        ],
      ),
    );
  }

  void _showCheckoutDialog(BuildContext context) {
    if (!mounted) return; // Early return if widget is disposed

    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Checkout'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
                'Proceed to payment? Your cart will be cleared after successful payment.'),
            const SizedBox(height: 16),
            Text(
              'Total: Rs. ${totalCartValue.toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(dialogContext); // Close the dialog first

              if (!mounted) return; // Check if still mounted before navigation

              try {
                final paymentSuccess = await Navigator.push<bool>(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PaymentPage(
                      cartItems:
                          List.from(cartItems), // Pass the current cart items
                      totalAmount: totalCartValue,
                      userId:
                          null, // Pass null for now, implement user auth later
                    ),
                  ),
                );

                if (!mounted) return; // Check again after navigation

                if (paymentSuccess == true) {
                  // Clear cart from backend after successful payment
                  await ProductService.clearCartBackend(userId: null);

                  // Refresh UI
                  if (mounted) {
                    _fetchProducts(); // Refresh products to show updated stock
                    _fetchCartItems(); // Refresh cart (should be empty after checkout)

                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content:
                            Text('Payment successful! Cart has been cleared.'),
                        backgroundColor: Colors.green,
                        duration: Duration(seconds: 3),
                      ),
                    );
                  }
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Error: ${e.toString()}'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            child: const Text('Proceed'),
          ),
        ],
      ),
    );
  }

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

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'All':
        return Icons.category;
      case 'Fruits':
        return Icons.apple;
      case 'Vegetables':
        return Icons.eco;
      case 'Nuts':
        return Icons.grain;
      case 'Chilli':
        return Icons.local_fire_department;
      case 'Pepper':
        return Icons.kebab_dining;
      case 'Ginger':
        return Icons.grass;
      default:
        return Icons.shopping_bag;
    }
  }

  @override
  Widget build(BuildContext context) {
    final userRole = widget.userData?['role'] ?? 'customer';
    final userName = widget.userData?['username'] ?? 'Customer';

    return Scaffold(
      appBar: AppBar(
        title: Text(userRole == 'farmer'
            ? 'Sri Lankan Marketplace'
            : 'Sri Lankan Marketplace - Customer'),
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
          if (userRole == 'customer')
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Row(
                children: [
                  Text(
                    'Hi, $userName',
                    style: const TextStyle(fontSize: 12, color: Colors.white70),
                  ),
                  const SizedBox(width: 8),
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: Colors.grey[300],
                    child: Icon(
                      Icons.person,
                      color: Colors.grey[600],
                      size: 20,
                    ),
                  ),
                ],
              ),
            ),
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
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _errorMessage.isNotEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Error: $_errorMessage'),
                            const SizedBox(height: 20),
                            ElevatedButton(
                              onPressed: _fetchProducts,
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      )
                    : filteredProducts.isEmpty
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
                        : RefreshIndicator(
                            onRefresh: _fetchProducts,
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
                                return ProductCard(
                                  product: product,
                                  onAddToCart: () => addToCart(product),
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
      floatingActionButton: Stack(
        alignment: Alignment.bottomRight,
        children: [
          FloatingActionButton(
            onPressed: () {
              if (mounted) {
                _showCartDialog(context);
              }
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
                decoration: const BoxDecoration(
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
}

class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback? onAddToCart;

  const ProductCard({super.key, required this.product, this.onAddToCart});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ProductDetailPage(
                productId: product.id,
                onAddToCart: (p) {
                  if (onAddToCart != null) {
                    onAddToCart!();
                  } else {
                    final state =
                        context.findAncestorStateOfType<_ProductScreenState>();
                    state?.addToCart(product);
                  }
                },
              ),
            ),
          );
        },
        child: Card(
          elevation: 3,
          shadowColor: Colors.black26,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: ConstrainedBox(
            constraints: const BoxConstraints(
              minHeight: 200,
              maxHeight: 240,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Image Container
                Container(
                  height: 120,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius:
                        const BorderRadius.vertical(top: Radius.circular(16)),
                    color: Colors.grey[200],
                  ),
                  child: ClipRRect(
                    borderRadius:
                        const BorderRadius.vertical(top: Radius.circular(16)),
                    child: product.imageUrl.isNotEmpty
                        ? Image.network(
                            product.imageUrl.startsWith('http')
                                ? product.imageUrl
                                : 'http://10.0.2.2:5001/${product.imageUrl}',
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
                                  value: loadingProgress.expectedTotalBytes !=
                                          null
                                      ? loadingProgress.cumulativeBytesLoaded /
// ...
                                          loadingProgress.expectedTotalBytes!
                                      : null,
                                  strokeWidth: 2,
                                  color: theme.colorScheme.primary,
                                ),
                              );
                            },
                          )
                        : Center(
                            child: Icon(Icons.image_not_supported,
                                size: 40, color: Colors.grey[400]),
                          ),
                  ),
                ),

                // Content
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        height: 20,
                        child: Text(
                          product.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(height: 2),
                      SizedBox(
                        height: 16,
                        child: Text(
                          product.category,
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.grey[600],
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'Rs. ${product.price.toStringAsFixed(2)}',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                  color: theme.colorScheme.primary,
                                ),
                              ),
                              Text(
                                'Stock: ${product.stockQuantity}',
                                style: TextStyle(
                                  fontSize: 10,
                                  color: product.stockQuantity > 0
                                      ? Colors.green
                                      : Colors.red,
                                ),
                              ),
                            ],
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.star,
                                size: 14,
                                color: Colors.amber[700],
                              ),
                              const SizedBox(width: 2),
                              Text(
                                product.rating.toStringAsFixed(1),
                                style: TextStyle(
                                  fontSize: 10,
                                  color: Colors.grey[700],
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.add_shopping_cart,
                                    size: 18),
                                onPressed: product.stockQuantity > 0
                                    ? () {
                                        if (onAddToCart != null) {
                                          onAddToCart!();
                                        } else {
                                          final state =
                                              context.findAncestorStateOfType<
                                                  _ProductScreenState>();
                                          state?.addToCart(product);
                                        }
                                      }
                                    : null,
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
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
        ));
  }
}

class ProductDetailPage extends StatefulWidget {
  final int productId;
  final Function(Product)? onAddToCart;

  const ProductDetailPage({
    super.key,
    required this.productId,
    this.onAddToCart,
  });

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  late Future<Product> _productFuture;
  bool _showReviewForm = false;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _commentController = TextEditingController();
  final TextEditingController _stockController = TextEditingController();
  int _selectedRating = 5;
  bool _isUpdatingStock = false;
  int _quantity = 1;
  int _currentImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _productFuture = ProductService.fetchProductDetails(widget.productId);
  }

  Future<void> _refreshProduct() async {
    setState(() {
      _productFuture = ProductService.fetchProductDetails(widget.productId);
    });
  }

  Future<void> _submitReview() async {
    if (_nameController.text.isEmpty || _commentController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all fields')),
      );
      return;
    }

    try {
      await ProductService.addReview(
        productId: widget.productId,
        username: _nameController.text,
        rating: _selectedRating,
        comment: _commentController.text,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Review submitted successfully')),
      );

      setState(() {
        _showReviewForm = false;
        _nameController.clear();
        _commentController.clear();
        _selectedRating = 5;
      });

      await _refreshProduct();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error submitting review: ${e.toString()}')),
      );
    }
  }

  Future<void> _updateStock() async {
    final newStock = int.tryParse(_stockController.text);
    if (newStock == null || newStock < 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid stock quantity')),
      );
      return;
    }

    setState(() {
      _isUpdatingStock = true;
    });

    try {
      final success = await ProductService.updateProductStock(
        widget.productId,
        newStock,
      );

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Stock updated successfully')),
        );
        await _refreshProduct();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to update stock')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    } finally {
      setState(() {
        _isUpdatingStock = false;
      });
    }
  }

  Future<void> _purchaseProduct() async {
    if (_quantity <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a valid quantity')),
      );
      return;
    }

    try {
      final success = await ProductService.purchaseProduct(
        widget.productId,
        _quantity,
      );

      if (success) {
        // Clear the quantity after successful purchase
        setState(() {
          _quantity = 1; // Reset to default quantity of 1
        });

        await _refreshProduct();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Purchased $_quantity items successfully')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to purchase product')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    }
  }

  Widget _buildReviewForm() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Write a Review',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () {
                  setState(() {
                    _showReviewForm = false;
                    _nameController.clear();
                    _commentController.clear();
                    _selectedRating = 5;
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _nameController,
            decoration: const InputDecoration(
              labelText: 'Your Name',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          const Text('Rating:', style: TextStyle(fontWeight: FontWeight.w500)),
          const SizedBox(height: 8),
          Row(
            children: List.generate(5, (index) {
              return IconButton(
                icon: Icon(
                  index < _selectedRating ? Icons.star : Icons.star_border,
                  color: Colors.amber,
                ),
                onPressed: () {
                  setState(() {
                    _selectedRating = index + 1;
                  });
                },
              );
            }),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _commentController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Your Review',
              border: OutlineInputBorder(),
              hintText: 'Share your experience with this product...',
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    setState(() {
                      _showReviewForm = false;
                      _nameController.clear();
                      _commentController.clear();
                      _selectedRating = 5;
                    });
                  },
                  child: const Text('Cancel'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton(
                  onPressed: _submitReview,
                  child: const Text('Submit Review'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRatingBar(int stars, double percentage) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Text('$stars'),
          const SizedBox(width: 4),
          const Icon(Icons.star, size: 12, color: Colors.amber),
          const SizedBox(width: 8),
          Expanded(
            child: Container(
              height: 6,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(3),
              ),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: percentage,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.amber,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '${(percentage * 100).toInt()}%',
            style: const TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewItem(Review review) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: Theme.of(context).colorScheme.primary,
                child: Text(
                  review.username.isNotEmpty
                      ? review.username[0].toUpperCase()
                      : 'U',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review.username,
                      style: const TextStyle(fontWeight: FontWeight.w500),
                    ),
                    Row(
                      children: [
                        Row(
                          children: List.generate(5, (index) {
                            return Icon(
                              index < review.rating
                                  ? Icons.star
                                  : Icons.star_border,
                              size: 14,
                              color: Colors.amber,
                            );
                          }),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          review.date,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            review.comment,
            style: const TextStyle(fontSize: 14),
          ),
        ],
      ),
    );
  }

  // Calculate average rating
  double _calculateAverageRating(List<Review> reviews) {
    if (reviews.isEmpty) return 0;
    return reviews.map((r) => r.rating).reduce((a, b) => a + b) /
        reviews.length;
  }

  // Calculate rating distribution
  Map<int, double> _calculateRatingDistribution(List<Review> reviews) {
    if (reviews.isEmpty) {
      return {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
    }

    Map<int, int> counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
    for (var review in reviews) {
      counts[review.rating] = (counts[review.rating] ?? 0) + 1;
    }

    Map<int, double> percentages = {};
    for (var rating in counts.keys) {
      percentages[rating] = counts[rating]! / reviews.length;
    }

    return percentages;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: FutureBuilder<Product>(
          future: _productFuture,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return Text(snapshot.data!.name);
            }
            return const Text('Product Details');
          },
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () {},
          ),
        ],
      ),
      body: Stack(
        children: [
          RefreshIndicator(
            onRefresh: _refreshProduct,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Product Image Gallery
                  FutureBuilder<Product>(
                    future: _productFuture,
                    builder: (context, snapshot) {
                      if (!snapshot.hasData) return const SizedBox();
                      final product = snapshot.data!;

                      return Stack(
                        alignment: Alignment.bottomCenter,
                        children: [
                          SizedBox(
                            height: 300,
                            child: product.imageUrl.isNotEmpty
                                ? Image.network(
                                    product.imageUrl.startsWith('http')
                                        ? product.imageUrl
                                        : 'http://10.0.2.2:5001/${product.imageUrl}',
                                    fit: BoxFit.cover,
                                    width: double.infinity,
                                    errorBuilder: (context, error, stackTrace) {
                                      return Container(
                                        color: Colors.grey[200],
                                        child: const Center(
                                          child: Icon(Icons.image_not_supported,
                                              size: 50),
                                        ),
                                      );
                                    },
                                  )
                                : Container(
                                    color: Colors.grey[200],
                                    child: const Center(
                                      child: Icon(Icons.image_not_supported,
                                          size: 50),
                                    ),
                                  ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(bottom: 16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  margin:
                                      const EdgeInsets.symmetric(horizontal: 4),
                                  decoration: const BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      );
                    },
                  ),

                  // Product details content
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: FutureBuilder<Product>(
                      future: _productFuture,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return const Center(
                              child: CircularProgressIndicator());
                        }

                        if (snapshot.hasError) {
                          return Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('Error: ${snapshot.error}'),
                                const SizedBox(height: 20),
                                ElevatedButton(
                                  onPressed: _refreshProduct,
                                  child: const Text('Retry'),
                                ),
                              ],
                            ),
                          );
                        }

                        if (!snapshot.hasData) {
                          return const Center(child: Text('Product not found'));
                        }

                        final product = snapshot.data!;
                        final reviews = product.reviews ?? [];
                        final ratingDistribution =
                            _calculateRatingDistribution(reviews);
                        final averageRating = _calculateAverageRating(reviews);

                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Product price and stock info
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Rs. ${product.price.toStringAsFixed(2)}',
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: product.stockQuantity > 0
                                        ? Colors.green[100]
                                        : Colors.red[100],
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    product.stockQuantity > 0
                                        ? 'In Stock: ${product.stockQuantity}'
                                        : 'Out of Stock',
                                    style: TextStyle(
                                      color: product.stockQuantity > 0
                                          ? Colors.green[800]
                                          : Colors.red[800],
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 8),
                            Text(
                              product.name,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                const Icon(Icons.star,
                                    color: Colors.amber, size: 20),
                                const SizedBox(width: 4),
                                Text(
                                  '${averageRating.toStringAsFixed(1)} (${reviews.length})',
                                  style: const TextStyle(fontSize: 14),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  height: 16,
                                  width: 1,
                                  color: Colors.grey,
                                ),
                                const SizedBox(width: 8),
                                const Text(
                                  '176 sold',
                                  style: TextStyle(fontSize: 14),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Product Details',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              product.description,
                              style: const TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 16),
                            Table(
                              border: TableBorder(
                                horizontalInside: BorderSide(
                                  color: Colors.grey.shade300,
                                  width: 1,
                                ),
                              ),
                              columnWidths: const {
                                0: FlexColumnWidth(2),
                                1: FlexColumnWidth(3),
                              },
                              children: [
                                TableRow(
                                  children: [
                                    const Padding(
                                      padding:
                                          EdgeInsets.symmetric(vertical: 8.0),
                                      child: Text(
                                        'Category',
                                        style: TextStyle(
                                            fontWeight: FontWeight.w500),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 8.0),
                                      child: Text(product.category),
                                    ),
                                  ],
                                ),
                                TableRow(
                                  children: [
                                    const Padding(
                                      padding:
                                          EdgeInsets.symmetric(vertical: 8.0),
                                      child: Text(
                                        'Seller',
                                        style: TextStyle(
                                            fontWeight: FontWeight.w500),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 8.0),
                                      child: Text(product.seller),
                                    ),
                                  ],
                                ),
                                TableRow(
                                  children: [
                                    const Padding(
                                      padding:
                                          EdgeInsets.symmetric(vertical: 8.0),
                                      child: Text(
                                        'Local Product',
                                        style: TextStyle(
                                            fontWeight: FontWeight.w500),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 8.0),
                                      child:
                                          Text(product.isLocal ? 'Yes' : 'No'),
                                    ),
                                  ],
                                ),
                                TableRow(
                                  children: [
                                    const Padding(
                                      padding:
                                          EdgeInsets.symmetric(vertical: 8.0),
                                      child: Text(
                                        'Stock Quantity',
                                        style: TextStyle(
                                            fontWeight: FontWeight.w500),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 8.0),
                                      child: Text(
                                          product.stockQuantity.toString()),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            if (product.stockQuantity > 0)
                              Padding(
                                padding: const EdgeInsets.only(bottom: 16),
                                child: Row(
                                  children: [
                                    const Text('Quantity:',
                                        style: TextStyle(fontSize: 16)),
                                    const SizedBox(width: 16),
                                    Container(
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                            color: Colors.grey.shade300),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        children: [
                                          IconButton(
                                            icon: const Icon(Icons.remove),
                                            onPressed: _quantity > 1
                                                ? () =>
                                                    setState(() => _quantity--)
                                                : null,
                                          ),
                                          Text('$_quantity',
                                              style: const TextStyle(
                                                  fontSize: 16)),
                                          IconButton(
                                            icon: const Icon(Icons.add),
                                            onPressed: _quantity <
                                                    product.stockQuantity
                                                ? () =>
                                                    setState(() => _quantity++)
                                                : null,
                                          ),
                                        ],
                                      ),
                                    ),
                                    const Spacer(),
                                    Text(
                                      'Total: Rs. ${(product.price * _quantity).toStringAsFixed(2)}',
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            const Divider(height: 32),

                            // Ratings & Reviews Section with Add Review Button
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Ratings & Reviews (${reviews.length})',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                ElevatedButton.icon(
                                  onPressed: () {
                                    setState(() {
                                      _showReviewForm = true;
                                    });
                                  },
                                  icon: const Icon(Icons.rate_review, size: 16),
                                  label: const Text('Add Review'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor:
                                        Theme.of(context).colorScheme.primary,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 12, vertical: 8),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 16),

                            // Review submission form (conditionally displayed)
                            if (_showReviewForm) _buildReviewForm(),

                            // Rating stats
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Column(
                                  children: [
                                    Text(
                                      averageRating.toStringAsFixed(1),
                                      style: const TextStyle(
                                        fontSize: 36,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Row(
                                      children: List.generate(
                                        5,
                                        (index) {
                                          // Calculate full stars and half stars
                                          if (index < averageRating.floor()) {
                                            return const Icon(Icons.star,
                                                color: Colors.amber, size: 16);
                                          } else if (index <
                                                  averageRating.ceil() &&
                                              averageRating % 1 > 0) {
                                            return const Icon(Icons.star_half,
                                                color: Colors.amber, size: 16);
                                          } else {
                                            return const Icon(Icons.star_border,
                                                color: Colors.amber, size: 16);
                                          }
                                        },
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '${reviews.length} reviews',
                                      style: const TextStyle(
                                        color: Colors.grey,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(width: 24),
                                Expanded(
                                  child: Column(
                                    children: [
                                      _buildRatingBar(
                                          5, ratingDistribution[5] ?? 0),
                                      _buildRatingBar(
                                          4, ratingDistribution[4] ?? 0),
                                      _buildRatingBar(
                                          3, ratingDistribution[3] ?? 0),
                                      _buildRatingBar(
                                          2, ratingDistribution[2] ?? 0),
                                      _buildRatingBar(
                                          1, ratingDistribution[1] ?? 0),
                                    ],
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 16),

                            // Sample reviews
                            ...reviews.map((review) {
                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildReviewItem(review),
                                  const Divider(),
                                ],
                              );
                            }).toList(),

                            if (reviews.isNotEmpty)
                              Center(
                                child: TextButton(
                                  onPressed: () {},
                                  child: const Text('View All Reviews'),
                                ),
                              ),

                            const SizedBox(height: 16),
                            // Add extra space at the bottom for the fixed buttons
                            const SizedBox(height: 80),
                          ],
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Fixed bottom buttons
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                      color: Colors.grey.withOpacity(0.2),
                      spreadRadius: 1,
                      blurRadius: 5,
                      offset: const Offset(0, -2)),
                ],
              ),
              child: FutureBuilder<Product>(
                future: _productFuture,
                builder: (context, snapshot) {
                  if (!snapshot.hasData) return const SizedBox();
                  final product = snapshot.data!;

                  return Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: product.stockQuantity > 0
                                ? Theme.of(context).colorScheme.primary
                                : Colors.grey,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          onPressed: product.stockQuantity > 0
                              ? () async {
                                  try {
                                    // Create a temporary cart item for Buy Now
                                    final cartItem = CartItem(
                                      product: product,
                                      quantity: _quantity,
                                      cartId:
                                          0, // 0 indicates Buy Now (not from actual cart)
                                    );

                                    final paymentSuccess =
                                        await Navigator.push<bool>(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => PaymentPage(
                                          cartItems: [cartItem],
                                          totalAmount:
                                              product.price * _quantity,
                                          userId:
                                              null, // Pass user ID if implementing user auth
                                        ),
                                      ),
                                    );

                                    if (paymentSuccess == true) {
                                      // Refresh product details to show updated stock
                                      _refreshProduct();

                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                              'Purchase completed successfully!'),
                                          backgroundColor: Colors.green,
                                          duration: Duration(seconds: 2),
                                        ),
                                      );
                                    }
                                  } catch (e) {
                                    ScaffoldMessenger.of(context)
                                        .showSnackBar(
                                      SnackBar(
                                        content:
                                            Text('Error: ${e.toString()}'),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                  }
                                }
                              : null,
                          child: const Text(
                            'Buy Now',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            side: BorderSide(
                              color: product.stockQuantity > 0
                                  ? Theme.of(context).colorScheme.primary
                                  : Colors.grey,
                            ),
                          ),
                          onPressed: product.stockQuantity > 0
                              ? () {
                                  final onAddToCartCallback = widget.onAddToCart;
                                  if (onAddToCartCallback != null) {
                                    onAddToCartCallback(product);
                                    if (mounted) {
                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(
                                        SnackBar(
                                          content: Text(
                                              '${product.name} added to cart'),
                                          duration: const Duration(seconds: 1),
                                        ),
                                      );
                                    }
                                  } else {
                                    final state =
                                        context.findAncestorStateOfType<
                                            _ProductScreenState>();
                                    if (state != null) {
                                      state.addToCart(product);
                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(
                                        SnackBar(
                                          content: Text(
                                              '${product.name} added to cart'),
                                          duration:
                                              const Duration(seconds: 1),
                                        ),
                                      );
                                    }
                                  }
                                }
                              : null,
                          child: Text(
                            'Add to Cart',
                            style: TextStyle(
                              color: product.stockQuantity > 0
                                  ? Theme.of(context).colorScheme.primary
                                  : Colors.grey,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRatingBar(int stars, double percentage) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.0),
      child: Row(
        children: [
          Text(
            '$stars',
            style: const TextStyle(fontSize: 12),
          ),
          const SizedBox(width: 4),
          const Icon(Icons.star, color: Colors.amber, size: 14),
          const SizedBox(width: 8),
          Expanded(
            child: Stack(
              children: [
                Container(
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                FractionallySizedBox(
                  widthFactor: percentage,
                  child: Container(
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.amber,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '${(percentage * 100).toInt()}%',
            style: const TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailReviewItem(Review review) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                review.username,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              Text(
                review.date,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: List.generate(
              5,
              (index) => Icon(
                index < review.rating ? Icons.star : Icons.star_border,
                color: Colors.amber,
                size: 16,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            review.comment,
            style: const TextStyle(fontSize: 14),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _commentController.dispose();
    _stockController.dispose();
    super.dispose();
  }
}
