import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

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
      home: const PaymentPage(),
    );
  }
}

// Data Models
class Product {
  final String name;
  final double price;
  final String imageUrl;
  final String description;

  Product({
    required this.name,
    required this.price,
    required this.imageUrl,
    required this.description,
  });
}

class ShippingOption {
  final String name;
  final double price;
  final String days;

  ShippingOption({
    required this.name,
    required this.price,
    required this.days,
  });
}

class PaymentMethod {
  final String name;
  final IconData icon;
  final Color color;

  PaymentMethod({
    required this.name,
    required this.icon,
    required this.color,
  });
}

class PaymentPage extends StatefulWidget {
  const PaymentPage({super.key});

  @override
  State<PaymentPage> createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  final _formKey = GlobalKey<FormState>();
  int _selectedPaymentMethod = 0; // 0=Card, 1=Google Pay, 2=Cash on Delivery
  int _selectedShippingMethod = 0; // 0=Standard, 1=Express, 2=Free
  int quantity = 1;

  // Form controllers
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _zipCodeController = TextEditingController();
  final TextEditingController _cardNumberController = TextEditingController();
  final TextEditingController _expiryController = TextEditingController();
  final TextEditingController _cvvController = TextEditingController();

  // Cart items
  late List<CartItem> cartItems;

  // Shipping options
  final List<ShippingOption> shippingOptions = [
    ShippingOption(name: 'Standard Delivery', price: 50.00, days: '3-5'),
    ShippingOption(name: 'Express Delivery', price: 100.00, days: '1-2'),
    ShippingOption(name: 'Free Delivery', price: 0.00, days: '5-7'),
  ];

  // Payment methods
  final List<PaymentMethod> paymentMethods = [
    PaymentMethod(
        name: 'Credit Card', icon: Icons.credit_card, color: Colors.blue),
    PaymentMethod(
        name: 'Google Pay',
        icon: Icons.account_balance_wallet,
        color: Colors.green),
    PaymentMethod(
        name: 'Cash on Delivery', icon: Icons.money, color: Colors.orange),
  ];

  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    // Initialize cart items
    cartItems = [
      CartItem(
        product: Product(
          name: 'Product Item',
          price: 280.00,
          imageUrl: 'https://example.com/product.jpg',
          description: 'Product description',
        ),
        quantity: 1,
      ),
    ];
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

  double get subtotal {
    return cartItems.fold(
        0, (sum, item) => sum + (item.product.price * item.quantity));
  }

  double get shipping => shippingOptions[_selectedShippingMethod].price;
  double get tax => subtotal * 0.05;
  double get total => subtotal + shipping + tax;

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
              // Shipping Information
              _buildShippingInfoSection(),

              const SizedBox(height: 24),

              // Shipping Method
              _buildShippingMethodSection(),

              const SizedBox(height: 24),

              // Payment Method
              _buildPaymentMethodSection(),

              // Card Details (shown only for credit card)
              if (_selectedPaymentMethod == 0) ...[
                const SizedBox(height: 24),
                _buildCardDetailsSection(),
              ],

              const SizedBox(height: 24),

              // Order Summary
              _buildOrderSummary(),

              const SizedBox(height: 24),

              // Terms and Conditions
              _buildTermsAndConditions(),

              const SizedBox(height: 24),

              // Place Order Button
              _buildPlaceOrderButton(),
            ],
          ),
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
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your name';
                            }
                            return null;
                          },
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
                            if (value == null || value.isEmpty) {
                              return 'Please enter your email';
                            }
                            if (!value.contains('@')) {
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
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your address';
                      }
                      return null;
                    },
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
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your city';
                            }
                            return null;
                          },
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
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your zip code';
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
                  onChanged: (value) {
                    setState(() {
                      _selectedShippingMethod = value!;
                    });
                  },
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
            // Payment method buttons
            SizedBox(
              height: 100,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: paymentMethods.length,
                itemBuilder: (context, index) {
                  final method = paymentMethods[index];
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedPaymentMethod = index;
                      });
                    },
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
                if (_selectedPaymentMethod != 0) return null;
                if (value == null || value.isEmpty) {
                  return 'Please enter card number';
                }
                if (value.replaceAll(' ', '').length != 16) {
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
                      if (_selectedPaymentMethod != 0) return null;
                      if (value == null || value.isEmpty) {
                        return 'Please enter expiry date';
                      }
                      if (value.length != 5 || !value.contains('/')) {
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
                      if (_selectedPaymentMethod != 0) return null;
                      if (value == null || value.isEmpty) {
                        return 'Please enter CVV';
                      }
                      if (value.length < 3 || value.length > 4) {
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

            // Cart items
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

            // Price breakdown
            _buildPriceRow('Subtotal', subtotal),
            _buildPriceRow('Shipping', shipping),
            _buildPriceRow('Tax (5%)', tax),

            const Divider(height: 32),

            // Total
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
    return Row(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: Colors.grey[200],
            borderRadius: BorderRadius.circular(8),
            image: const DecorationImage(
              image: NetworkImage('https://via.placeholder.com/60'),
              fit: BoxFit.cover,
            ),
          ),
        ),
        const SizedBox(width: 16),
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
            ],
          ),
        ),
        const SizedBox(width: 16),
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey[300]!),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.remove, size: 18),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: item.quantity > 1
                    ? () => setState(() {
                          cartItems[index].quantity--;
                        })
                    : null,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: Text(
                  item.quantity.toString(),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, size: 18),
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: () => setState(() {
                  cartItems[index].quantity++;
                }),
              ),
            ],
          ),
        ),
      ],
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
        onPressed: _isProcessing
            ? null
            : () async {
                if (_formKey.currentState!.validate()) {
                  setState(() => _isProcessing = true);

                  // Simulate payment processing (only for non-cash payments)
                  if (_selectedPaymentMethod != 2) {
                    await Future.delayed(const Duration(seconds: 2));
                  }

                  setState(() => _isProcessing = false);

                  // Show success dialog
                  _showPaymentSuccessDialog();
                }
              },
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

  void _showPaymentSuccessDialog() {
    final orderNumber =
        'OR${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}';

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
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
              'Order #$orderNumber',
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
                  Navigator.pop(context); // Close dialog
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
}

// Cart item class
class CartItem {
  final Product product;
  int quantity;

  CartItem({
    required this.product,
    required this.quantity,
  });
}

// Custom input formatters
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
