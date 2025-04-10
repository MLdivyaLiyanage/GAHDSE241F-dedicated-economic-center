import 'package:flutter/material.dart';

class SignUp extends StatefulWidget {
  const SignUp({super.key});

  @override
  State<SignUp> createState() => _SignUpState();
}

class _SignUpState extends State<SignUp> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String? _selectedRole;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color.fromARGB(255, 168, 231, 178), // Teal/turquoise
              Color.fromARGB(255, 168, 231, 178), // Green
            ],
          ),
        ),
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                
                // Top Row - Dots and Logo
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Three green dots
                    Row(
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: const BoxDecoration(
                            color: Color(0xFF4CDA64),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 5),
                        Container(
                          width: 10,
                          height: 10,
                          decoration: const BoxDecoration(
                            color: Color(0xFF4CDA64),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 5),
                        Container(
                          width: 10,
                          height: 10,
                          decoration: const BoxDecoration(
                            color: Color(0xFF4CDA64),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                    ),
                    
                    // Logo circle
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.9),
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Center(
                        child: Image.asset(
                          'images/leaf_logo.png', 
                          width: 30,
                          height: 30,
                          errorBuilder: (context, error, stackTrace) => const Icon(
                            Icons.eco,
                            color: Color(0xFF4CDA64),
                            size: 30,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 10),
                
                // Header
                const Text(
                  'DEDICATED',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Text(
                  'ECONOMIC CENTRE',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Text(
                  'Sri Lanka',
                  style: TextStyle(
                    color: Colors.black87,
                    fontSize: 20,
                  ),
                ),
                
                const SizedBox(height: 15),
                
                // Farmers illustration
                Center(
                  child: Image.asset(
                    'images/farmers.png',
                    height: 120,
                    errorBuilder: (context, error, stackTrace) => Container(
                      height: 120,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.people,
                          size: 50,
                          color: Colors.white70,
                        ),
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 20),
                
                // Green container for signup fields
                Container(
                  padding: const EdgeInsets.all(15),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Color(0xFF00A19D), // Darker teal
                        Color(0xFF4CDA64), // Brighter green
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Sign Up Title with icon
                      Row(
                        children: [
                          const Text(
                            'Sign Up',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.black,
                              borderRadius: BorderRadius.circular(15),
                            ),
                            child: Image.asset(
                              'images/plant_icon.png',
                              height: 30,
                              width: 30,
                              errorBuilder: (context, error, stackTrace) => const Icon(
                                Icons.spa,
                                size: 24,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Name Field
                      const Padding(
                        padding: EdgeInsets.only(left: 5.0, bottom: 5.0),
                        child: Text(
                          'Username',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 15),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: TextFormField(
                          controller: _nameController,
                          style: const TextStyle(color: Colors.black87),
                          decoration: const InputDecoration(
                            hintText: 'Username',
                            hintStyle: TextStyle(color: Colors.grey),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 12),
                      
                      // Role Field
                      const Padding(
                        padding: EdgeInsets.only(left: 5.0, bottom: 5.0),
                        child: Text(
                          'Role',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 15),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: DropdownButtonFormField<String>(
                          value: _selectedRole,
                          dropdownColor: Colors.white,
                          style: const TextStyle(color: Colors.black87),
                          decoration: const InputDecoration(
                            hintText: 'Select role',
                            hintStyle: TextStyle(color: Colors.grey),
                            suffixIcon: Icon(Icons.keyboard_arrow_down_rounded),
                            border: InputBorder.none,
                          ),
                          items: const [
                            DropdownMenuItem(value: 'Framer', child: Text('Framer')),
                            DropdownMenuItem(value: 'Customer', child: Text('Customer')),
                          ],
                          onChanged: (value) {
                            setState(() {
                              _selectedRole = value;
                            });
                          },
                        ),
                      ),
                      
                      const SizedBox(height: 12),
                      
                      // Email Field
                      const Padding(
                        padding: EdgeInsets.only(left: 5.0, bottom: 5.0),
                        child: Text(
                          'Email',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 15),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: TextFormField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          style: const TextStyle(color: Colors.black87),
                          decoration: const InputDecoration(
                            hintText: 'Email',
                            hintStyle: TextStyle(color: Colors.grey),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 12),
                      
                      // Password Field
                      const Padding(
                        padding: EdgeInsets.only(left: 5.0, bottom: 5.0),
                        child: Text(
                          'Password',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 15),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: TextFormField(
                          controller: _passwordController,
                          obscureText: true,
                          style: const TextStyle(color: Colors.black87),
                          decoration: const InputDecoration(
                            hintText: 'Password',
                            hintStyle: TextStyle(color: Colors.grey),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Next Button
                      Center(
                        child: GestureDetector(
                          onTap: () {
                            if (_nameController.text.isEmpty ||
                                _emailController.text.isEmpty ||
                                _passwordController.text.isEmpty ||
                                _selectedRole == null) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Please fill all fields'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            } else {
                              // Proceed with sign up
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const NextScreen(),
                                ),
                              );
                            }
                          },
                          child: Container(
                            width: 120,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(25),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  spreadRadius: 1,
                                  blurRadius: 3,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Center(
                              child: Text(
                                "Next",
                                style: TextStyle(
                                  color: Color(0xFF00A19D),
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 15),
                
                // Sign In Link
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Already have an account? ',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 14,
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.pop(context);
                        },
                        child: const Text(
                          'Sign in',
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class NextScreen extends StatelessWidget {
  const NextScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF00A19D), // Teal/turquoise
              Color(0xFF4CDA64), // Green
            ],
          ),
        ),
        child: const Center(
          child: Text(
            'Next Screen',
            style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}