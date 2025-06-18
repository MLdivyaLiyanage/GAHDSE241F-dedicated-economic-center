// ignore_for_file: prefer_const_literals_to_create_immutables, deprecated_member_use

import 'package:economic_center_mobileapp/main.dart';
import 'package:economic_center_mobileapp/pages/categary.dart' as categary;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'models.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-Commerce Payment',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        fontFamily: 'Poppins',
        appBarTheme: const AppBarTheme(
          elevation: 0,
          centerTitle: true,
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
        ),
      ),
      home: const PaymentPage(cartItems: [], totalAmount: 0.0),
    );
  }
}

class PaymentService {
  static const String _baseUrl = 'http://10.0.2.2:3000';

  static Future<bool> testConnection() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/health'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      print('Health check response: ${response.statusCode}');
      print('Health check body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['status'] == 'OK';
      }
      return false;
    } catch (e) {
      print('Connection test failed: $e');
      return false;
    }
  }

  static Future<bool> processOrder({
    required String name,
    required String email,
    required String address,
    required String city,
    required String zipCode,
    required List<CartItem> cartItems,
    required ShippingOption shippingMethod,
    required String paymentMethod,
    required double subtotal,
    required double shipping,
    required double tax,
    required double total,
    String? cardNumber,
    String? expiryDate,
    String? cvv,
  }) async {
    try {
      // for (final item in cartItems) {
      //   final success = await categary.ProductService.purchaseProduct(
      //     item.product.id,
      //     item.quantity,
      //   );

      //   if (!success) {
      //     throw Exception('Failed to update stock for ${item.product.name}');
      //   }
      // }
      // // Test connection first
      print('Testing connection...');
      final isConnected = await testConnection();
      if (!isConnected) {
        throw Exception(
            'Cannot connect to server. Please check your connection and ensure the server is running.');
      }

      print('Sending order request...');
      final requestBody = {
        'customerInfo': {
          'name': name,
          'email': email,
          'address': address,
          'city': city,
          'zipCode': zipCode,
        },
        'shippingMethod': shippingMethod.toJson(),
        'paymentMethod': paymentMethod,
        'cardDetails': paymentMethod == 'credit_card'
            ? {
                'number': cardNumber?.replaceAll(' ', ''),
                'expiry': expiryDate,
                'cvv': cvv,
              }
            : null,
        'cartItems': cartItems.map((item) => item.toJson()).toList(),
        'subtotal': subtotal,
        'shipping': shipping,
        'tax': tax,
        'total': total,
      };

      print('Request body: ${json.encode(requestBody)}');

      final response = await http
          .post(
            Uri.parse('$_baseUrl/api/orders'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: json.encode(requestBody),
          )
          .timeout(const Duration(seconds: 30));

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 201) {
        final responseData = json.decode(response.body);
        if (responseData['success'] == true) {
          return true;
        } else {
          throw Exception(responseData['error'] ?? 'Unknown error occurred');
        }
      } else {
        // Try to decode error response
        try {
          final errorData = json.decode(response.body);
          throw Exception(errorData['error'] ??
              errorData['message'] ??
              'Failed to process order');
        } catch (jsonError) {
          // If response is not JSON (like HTML error page)
          throw Exception(
              'Server error: ${response.statusCode}. Please ensure the server is running and accessible.');
        }
      }
    } on TimeoutException {
      throw Exception(
          'Request timeout. Please check your connection and try again.');
    } on FormatException catch (e) {
      throw Exception(
          'Invalid response format. Server might be returning HTML instead of JSON. Error: ${e.message}');
    } catch (e) {
      print('Error in processOrder: $e');
      if (e.toString().contains('Exception:')) {
        rethrow;
      } else {
        throw Exception('Network error: ${e.toString()}');
      }
    }
  }
}

class PaymentPage extends StatefulWidget {
  final List<CartItem> cartItems;
  final double totalAmount;

  const PaymentPage({
    super.key,
    required this.cartItems,
    required this.totalAmount,
  });

  @override
  State<PaymentPage> createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  final _formKey = GlobalKey<FormState>();
  int _selectedPaymentMethod = 0;
  int _selectedShippingMethod = 0;
  bool _isProcessing = false;
  bool _paymentSuccess = false;
  String _errorMessage = '';

  // Removed duplicate build method to resolve the error.

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _zipCodeController = TextEditingController();
  final TextEditingController _cardNumberController = TextEditingController();
  final TextEditingController _expiryController = TextEditingController();
  final TextEditingController _cvvController = TextEditingController();

  late List<CartItem> cartItems;
  late List<ShippingOption> shippingOptions;

  final List<PaymentMethod> paymentMethods = const [
    PaymentMethod(
      name: 'Credit Card',
      apiValue: 'credit_card',
      icon: Icons.credit_card,
      color: Colors.blue,
    ),
    PaymentMethod(
      name: 'Google Pay',
      apiValue: 'google_pay',
      icon: Icons.account_balance_wallet,
      color: Colors.green,
    ),
    PaymentMethod(
      name: 'Cash on Delivery',
      apiValue: 'cash_on_delivery',
      icon: Icons.money,
      color: Colors.orange,
    ),
  ];

  @override
  void initState() {
    super.initState();

    cartItems = List.from(widget.cartItems);

    // If no cart items provided, create sample data for testing
    if (widget.cartItems.isEmpty) {
      cartItems = [
        CartItem(
          cartId: 1,
          product: Product(
            id: 1,
            name: 'Sample Product',
            price: 299.99,
            imageUrl: 'https://via.placeholder.com/150',
            description: 'This is a sample product for testing',
            category: '',
            stockQuantity: 0,
            seller: 'Sample Seller',
          ),
          quantity: 2,
        ),
        CartItem(
          cartId: 2,
          product: Product(
            id: 2,
            name: 'Another Product',
            price: 199.99,
            imageUrl: 'https://via.placeholder.com/150',
            description: 'Another sample product',
            category: '',
            stockQuantity: 0,
            seller: 'Another Seller',
          ),
          quantity: 1,
        ),
      ];
    } else {
      cartItems = List.from(widget.cartItems);
    }

    shippingOptions = [
      ShippingOption(
        id: 1,
        name: 'Standard Delivery',
        price: 50.00,
        days: '3-5',
      ),
      ShippingOption(
        id: 2,
        name: 'Express Delivery',
        price: 100.00,
        days: '1-2',
      ),
      ShippingOption(
        id: 3,
        name: 'Free Delivery',
        price: 0.00,
        days: '5-7',
      ),
    ];
  }

  // double get subtotal => widget.totalAmount;
  // Replace the existing subtotal getter with this:
  double get subtotal {
    if (cartItems.isEmpty) return widget.totalAmount;
    return cartItems.fold(
        0.0, (sum, item) => sum + (item.product.price * item.quantity));
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _zipCodeController.dispose();
    _cardNumberController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
    super.dispose();
  }

  double get shipping => shippingOptions[_selectedShippingMethod].price;
  double get tax => subtotal * 0.05;
  double get total => subtotal + shipping + tax;

  Future<void> _processPayment() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isProcessing = true;
      _errorMessage = '';
    });

    try {
      // Then process the payment
      final orderSuccess = await PaymentService.processOrder(
        name: _nameController.text,
        email: _emailController.text,
        address: _addressController.text,
        city: _cityController.text,
        zipCode: _zipCodeController.text,
        cartItems: cartItems,
        shippingMethod: shippingOptions[_selectedShippingMethod],
        paymentMethod: paymentMethods[_selectedPaymentMethod].apiValue,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        cardNumber:
            _selectedPaymentMethod == 0 ? _cardNumberController.text : null,
        expiryDate: _selectedPaymentMethod == 0 ? _expiryController.text : null,
        cvv: _selectedPaymentMethod == 0 ? _cvvController.text : null,
      );

      if (orderSuccess) {
        setState(() {
          _paymentSuccess = true;
        });
        // Await the dialog dismissal
        await _showPaymentSuccessDialog(
            'ORD-${DateTime.now().millisecondsSinceEpoch}');

        // If payment was successful and dialog is dismissed, pop PaymentPage with true
        if (_paymentSuccess && mounted) {
          Navigator.of(context).pop(true);
        }
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() => _isProcessing = false);
    }
  }

  // Make the dialog function async to be awaitable, though not strictly necessary
  // if we handle the pop outside based on _paymentSuccess.
  // The key change is in the onPressed of the "Done" button.
  Future<void> _showPaymentSuccessDialog(String orderId) async {
    return showDialog<void>(
      // Return Future<void> and specify type for showDialog
      context: context,
      barrierDismissible: false,
      builder: (BuildContext dialogContext) => AlertDialog(
        // Use a different context name
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 16),
            CircleAvatar(
              radius: 36,
              backgroundColor:
                  _selectedPaymentMethod == 2 ? Colors.orange : Colors.green,
              child: Icon(
                _selectedPaymentMethod == 2
                    ? Icons.delivery_dining
                    : Icons.check,
                size: 48,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              _selectedPaymentMethod == 2
                  ? 'Order Placed Successfully!'
                  : 'Payment Successful',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              _selectedPaymentMethod == 2
                  ? 'Your order has been placed. Please have Rs. ${total.toStringAsFixed(2)} ready for payment upon delivery.'
                  : 'Thank you for your purchase!',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Order #$orderId',
              style: TextStyle(
                color: Colors.grey[600],
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: 200,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: _selectedPaymentMethod == 2
                      ? Colors.orange
                      : Colors.green,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: () {
                  Navigator.of(dialogContext).pop(); // Pop only the dialog
                },
                child: const Text(
                  'Done',
                  style: TextStyle(
                    fontSize: 16,
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

  Widget _buildShippingInfoSection() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Shipping Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Form(
              key: _formKey,
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _nameController,
                          decoration: const InputDecoration(
                            labelText: 'Full Name',
                            border: OutlineInputBorder(),
                            prefixIcon: Icon(Icons.person),
                          ),
                          validator: (value) => value?.isEmpty ?? true
                              ? 'Please enter your name'
                              : null,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: TextFormField(
                          controller: _emailController,
                          decoration: const InputDecoration(
                            labelText: 'Email',
                            border: OutlineInputBorder(),
                            prefixIcon: Icon(Icons.email),
                          ),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value?.isEmpty ?? true) {
                              return 'Please enter your email';
                            }
                            if (!value!.contains('@')) {
                              return 'Please enter a valid email';
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _addressController,
                    decoration: const InputDecoration(
                      labelText: 'Address',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.home),
                    ),
                    validator: (value) => value?.isEmpty ?? true
                        ? 'Please enter your address'
                        : null,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _cityController,
                          decoration: const InputDecoration(
                            labelText: 'City',
                            border: OutlineInputBorder(),
                            prefixIcon: Icon(Icons.location_city),
                          ),
                          validator: (value) => value?.isEmpty ?? true
                              ? 'Please enter your city'
                              : null,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: TextFormField(
                          controller: _zipCodeController,
                          decoration: const InputDecoration(
                            labelText: 'Zip Code',
                            border: OutlineInputBorder(),
                            prefixIcon: Icon(Icons.pin),
                          ),
                          keyboardType: TextInputType.number,
                          validator: (value) => value?.isEmpty ?? true
                              ? 'Please enter your zip code'
                              : null,
                        ),
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

  Widget _buildShippingMethodSection() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Shipping Method',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Column(
              children: List.generate(shippingOptions.length, (index) {
                final option = shippingOptions[index];
                return RadioListTile<int>(
                  title: Text('${option.name} (${option.days} days)'),
                  subtitle: Text('Rs. ${option.price.toStringAsFixed(2)}'),
                  value: index,
                  groupValue: _selectedShippingMethod,
                  onChanged: (value) =>
                      setState(() => _selectedShippingMethod = value!),
                  contentPadding: EdgeInsets.zero,
                  activeColor: Colors.green,
                );
              }),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentMethodSection() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Payment Method',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 100,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: paymentMethods.length,
                itemBuilder: (context, index) {
                  final method = paymentMethods[index];
                  return GestureDetector(
                    onTap: () => setState(() => _selectedPaymentMethod = index),
                    child: Container(
                      width: 120,
                      margin: const EdgeInsets.only(right: 10),
                      decoration: BoxDecoration(
                        color: _selectedPaymentMethod == index
                            ? method.color.withOpacity(0.2)
                            : Colors.grey[100],
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: _selectedPaymentMethod == index
                              ? method.color
                              : Colors.grey[300]!,
                          width: _selectedPaymentMethod == index ? 2 : 1,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            method.icon,
                            size: 30,
                            color: method.color,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            method.name,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: _selectedPaymentMethod == index
                                  ? method.color
                                  : Colors.black,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCardDetailsSection() {
    if (_selectedPaymentMethod != 0) return const SizedBox.shrink();

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Card Details',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _cardNumberController,
              decoration: const InputDecoration(
                labelText: 'Card Number',
                hintText: '1234 5678 9012 3456',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.credit_card),
              ),
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(16),
                CardNumberFormatter(),
              ],
              validator: (value) {
                if (value?.isEmpty ?? true) return 'Please enter card number';
                if (value!.replaceAll(' ', '').length != 16) {
                  return 'Enter a valid 16-digit card number';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _expiryController,
                    decoration: const InputDecoration(
                      labelText: 'Expiry Date',
                      hintText: 'MM/YY',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.calendar_today),
                    ),
                    keyboardType: TextInputType.datetime,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(4),
                      ExpiryDateFormatter(),
                    ],
                    validator: (value) {
                      if (value?.isEmpty ?? true) {
                        return 'Please enter expiry date';
                      }
                      if (value!.length != 5 || !value.contains('/')) {
                        return 'Enter in MM/YY format';
                      }
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    controller: _cvvController,
                    decoration: const InputDecoration(
                      labelText: 'CVV',
                      hintText: '123',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.lock),
                    ),
                    keyboardType: TextInputType.number,
                    obscureText: true,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(4),
                    ],
                    validator: (value) {
                      if (value?.isEmpty ?? true) return 'Please enter CVV';
                      if (value!.length < 3 || value.length > 4) {
                        return 'Enter 3 or 4 digit CVV';
                      }
                      return null;
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderSummary() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Text(
              'Order Summary',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: cartItems.length,
              separatorBuilder: (context, index) => const Divider(height: 20),
              itemBuilder: (context, index) {
                final item = cartItems[index];
                return _buildCartItemRow(item, index);
              },
            ),
            const Divider(height: 32),
            _buildPriceRow('Subtotal', subtotal),
            _buildPriceRow('Shipping', shipping),
            _buildPriceRow('Tax (5%)', tax),
            const Divider(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Total',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Rs. ${total.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCartItemRow(CartItem item, int index) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Product Image
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
              image: item.product.imageUrl.isNotEmpty
                  ? DecorationImage(
                      image: NetworkImage(
                        item.product.imageUrl.startsWith('http')
                            ? item.product.imageUrl
                            : 'http://10.0.2.2:5000/${item.product.imageUrl}',
                      ),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: item.product.imageUrl.isEmpty
                ? const Icon(Icons.image, size: 30, color: Colors.grey)
                : null,
          ),
          const SizedBox(width: 16),

          // Product Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.product.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Rs. ${item.product.price.toStringAsFixed(2)}',
                  style: const TextStyle(
                    color: Colors.green,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),

                // Quantity Controls
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.remove, size: 18),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () {
                        setState(() {
                          if (item.quantity > 1) {
                            cartItems[index].quantity--;
                          } else {
                            cartItems.removeAt(index);
                          }
                        });
                      },
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey[300]!),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        item.quantity.toString(),
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add, size: 18),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () {
                        setState(() {
                          cartItems[index].quantity++;
                        });
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Total Price
          Text(
            'Rs. ${(item.product.price * item.quantity).toStringAsFixed(2)}',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRow(String label, double value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text('Rs. ${value.toStringAsFixed(2)}'),
        ],
      ),
    );
  }

  Widget _buildTermsAndConditions() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Checkbox(
          value: true,
          onChanged: (value) {},
          activeColor: Colors.green,
        ),
        const Expanded(
          child: Text(
            'I agree to the Terms and Conditions and Privacy Policy. I understand that my payment will be processed securely and my personal data will be handled in accordance with the Privacy Policy.',
            style: TextStyle(fontSize: 12),
          ),
        ),
      ],
    );
  }

  Widget _buildPlaceOrderButton() {
    if (_paymentSuccess) return const SizedBox.shrink();

    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.green,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        onPressed: _isProcessing ? null : _processPayment,
        child: _isProcessing
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 2,
                ),
              )
            : Text(
                _selectedPaymentMethod == 2
                    ? 'Place Order (Pay on Delivery)'
                    : 'Pay Rs. ${total.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
      ),
    );
  }

  Widget _buildErrorMessage() {
    if (_errorMessage.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Text(
        _errorMessage,
        style: const TextStyle(
          color: Colors.red,
          fontWeight: FontWeight.bold,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _buildSuccessMessage() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.check_circle, size: 80, color: Colors.green),
          const SizedBox(height: 20),
          const Text(
            'Payment Successful!',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Text(
            'Thank you for your purchase of Rs. ${total.toStringAsFixed(2)}',
            style: const TextStyle(fontSize: 16),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
              child: const Text('Back to Home'),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (_paymentSuccess)
                _buildSuccessMessage()
              else ...[
                _buildShippingInfoSection(),
                const SizedBox(height: 24),
                _buildShippingMethodSection(),
                const SizedBox(height: 24),
                _buildPaymentMethodSection(),
                if (_selectedPaymentMethod == 0) ...[
                  const SizedBox(height: 24),
                  _buildCardDetailsSection(),
                ],
                const SizedBox(height: 24),
                _buildOrderSummary(),
                const SizedBox(height: 24),
                _buildTermsAndConditions(),
                _buildErrorMessage(),
                const SizedBox(height: 24),
                _buildPlaceOrderButton(),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class CardNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final text = newValue.text.replaceAll(' ', '');
    if (text.length > 16) return oldValue;

    String formatted = '';
    for (int i = 0; i < text.length; i++) {
      if (i > 0 && i % 4 == 0) formatted += ' ';
      formatted += text[i];
    }

    return newValue.copyWith(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

class ExpiryDateFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final text = newValue.text.replaceAll('/', '');
    if (text.length > 4) return oldValue;

    String formatted = text;
    if (text.length >= 2) {
      formatted = '${text.substring(0, 2)}/${text.substring(2)}';
    }

    return newValue.copyWith(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}
