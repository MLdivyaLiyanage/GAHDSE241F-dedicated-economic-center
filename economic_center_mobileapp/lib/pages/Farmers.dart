import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io' show Platform;
import 'package:intl/intl.dart';

void main() {
  runApp(const FarmerProfilesApp());
}

class FarmerProfilesApp extends StatelessWidget {
  const FarmerProfilesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AgriConnect Pro',
      theme: ThemeData(
        primarySwatch: Colors.green,
        colorScheme: ColorScheme.light(
          primary: Colors.green[800]!,
          secondary: Colors.amber[700]!,
        ),
        fontFamily: 'Poppins',
        cardTheme: CardThemeData(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
      debugShowCheckedModeBanner: false,
      home: const FarmerProfilesPage(),
    );
  }
}

class FarmerProfilesPage extends StatefulWidget {
  const FarmerProfilesPage({super.key});

  @override
  State<FarmerProfilesPage> createState() => _FarmerProfilesPageState();
}

class _FarmerProfilesPageState extends State<FarmerProfilesPage> {
  List<Farmer> farmers = [];
  bool isLoading = true;
  String errorMessage = '';
  String _searchQuery = '';
  String _selectedFilter = 'All';
  final TextEditingController _searchController = TextEditingController();
  final String currentUserId =
      'user123'; // Replace with actual user ID from auth

  String get baseUrl {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:5300';
    } else if (Platform.isIOS) {
      return 'http://localhost:5300';
    }
    return 'http://localhost:5300';
  }

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
    _fetchFarmers();
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text.toLowerCase();
    });
  }

  Future<void> _fetchFarmers() async {
    setState(() {
      isLoading = true;
      errorMessage = '';
    });

    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/api/all-profiles'),
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          final profiles = data['profiles'] as List;

          setState(() {
            farmers = profiles.map((profile) {
              double avgRating = (profile['rating'] ?? 0).toDouble();
              int feedbackCount = (profile['feedback_count'] ?? 0).toInt();

              return Farmer(
                id: profile['id'].toString(),
                username: profile['username'] ?? 'Unknown',
                email: profile['email'] ?? '',
                age: profile['age']?.toString() ?? '',
                aboutMe: profile['about_me'] ?? 'No description',
                address: profile['address'] ?? 'No address',
                idNumber: profile['id_number'] ?? '',
                phoneNumber: profile['phone_number'] ?? 'No phone',
                location: profile['location'] ?? 'No location',
                workExperience: profile['work_experience'] ?? 'No experience',
                facebookLink: profile['facebook_link'] ?? '',
                instagramLink: profile['instagram_link'] ?? '',
                profileImage: profile['profile_image'] ?? '',
                rating: avgRating,
                products: profile['products'] ?? [],
                feedbackCount: feedbackCount,
              );
            }).toList();
            isLoading = false;
            errorMessage = '';
          });
        } else {
          setState(() {
            errorMessage = data['error'] ?? 'Failed to load farmers';
            isLoading = false;
          });
        }
      } else {
        setState(() {
          errorMessage = 'Server error: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage =
            'Connection error: ${e.toString().replaceAll('Exception: ', '')}';
        isLoading = false;
      });
    }
  }

  List<Farmer> get filteredFarmers {
    return farmers.where((farmer) {
      final matchesSearch =
          farmer.username.toLowerCase().contains(_searchQuery) ||
          farmer.location.toLowerCase().contains(_searchQuery) ||
          farmer.workExperience.toLowerCase().contains(_searchQuery) ||
          farmer.products.any(
            (p) =>
                p['name']?.toString().toLowerCase().contains(_searchQuery) ??
                false,
          );

      if (_selectedFilter == 'All') {
        return matchesSearch;
      } else {
        return matchesSearch &&
            farmer.workExperience.toLowerCase().contains(
              _selectedFilter.toLowerCase(),
            );
      }
    }).toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Farmer Profiles'),
        centerTitle: true,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchFarmers,
            tooltip: 'Refresh',
          ),
          IconButton(
            icon: const Icon(Icons.filter_alt_outlined),
            onPressed: _showFilterDialog,
            tooltip: 'Filter',
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            child: _buildSearchBar(),
          ),
          _buildFilterChips(),
          Expanded(child: _buildFarmerList()),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return TextField(
      controller: _searchController,
      decoration: InputDecoration(
        hintText: 'Search farmers...',
        prefixIcon: const Icon(Icons.search),
        suffixIcon: _searchQuery.isNotEmpty
            ? IconButton(
                icon: const Icon(Icons.clear),
                onPressed: () {
                  _searchController.clear();
                  setState(() {
                    _searchQuery = '';
                  });
                },
              )
            : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),
          borderSide: BorderSide.none,
        ),
        filled: true,
        fillColor: Colors.white,
      ),
    );
  }

  Widget _buildFilterChips() {
    final filters = ['All', 'Wheat', 'Rice', 'Cotton', 'Organic'];

    return SizedBox(
      height: 50,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        children: filters.map((filter) {
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(filter),
              selected: _selectedFilter == filter,
              onSelected: (selected) {
                setState(() {
                  _selectedFilter = selected ? filter : 'All';
                });
              },
              selectedColor: Theme.of(context).primaryColor,
              labelStyle: TextStyle(
                color: _selectedFilter == filter
                    ? Colors.white
                    : Colors.grey[700],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildFarmerList() {
    if (isLoading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Loading farmers...'),
          ],
        ),
      );
    }

    if (errorMessage.isNotEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 60, color: Colors.red),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                errorMessage,
                style: const TextStyle(color: Colors.red, fontSize: 16),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _fetchFarmers,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (filteredFarmers.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, size: 60, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No farmers found',
              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
            ),
            if (_searchQuery.isNotEmpty || _selectedFilter != 'All')
              TextButton(
                onPressed: () {
                  setState(() {
                    _searchQuery = '';
                    _selectedFilter = 'All';
                    _searchController.clear();
                  });
                },
                child: const Text('Clear filters'),
              ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchFarmers,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: filteredFarmers.length,
        itemBuilder: (context, index) {
          return _buildFarmerCard(filteredFarmers[index]);
        },
      ),
    );
  }

  Widget _buildFarmerCard(Farmer farmer) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => _showFarmerDetails(context, farmer),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildProfileImage(farmer.profileImage),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          farmer.username,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          farmer.location,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        _buildRatingBar(farmer.rating),
                        Text(
                          '${farmer.products.length} products • ${farmer.feedbackCount} reviews',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  if (farmer.workExperience.isNotEmpty)
                    _buildFeatureChip(
                      Icons.agriculture,
                      farmer.workExperience.length > 15
                          ? '${farmer.workExperience.substring(0, 15)}...'
                          : farmer.workExperience,
                    ),
                  if (farmer.phoneNumber.isNotEmpty &&
                      farmer.phoneNumber != 'No phone')
                    _buildFeatureChip(Icons.phone, farmer.phoneNumber),
                  if (farmer.products.isNotEmpty)
                    _buildFeatureChip(
                      Icons.shopping_basket,
                      '${farmer.products.length} product${farmer.products.length > 1 ? 's' : ''}',
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileImage(String imageUrl) {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: Colors.grey[200],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: imageUrl.isNotEmpty
            ? Image.network(
                '$baseUrl$imageUrl',
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Center(
                    child: CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded /
                                loadingProgress.expectedTotalBytes!
                          : null,
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) {
                  return Center(
                    child: Icon(
                      Icons.person,
                      size: 40,
                      color: Colors.grey[500],
                    ),
                  );
                },
              )
            : Center(
                child: Icon(Icons.person, size: 40, color: Colors.grey[500]),
              ),
      ),
    );
  }

  Widget _buildRatingBar(double rating) {
    return Row(
      children: [
        RatingBarIndicator(
          rating: rating,
          itemBuilder: (context, index) =>
              const Icon(Icons.star, color: Colors.amber),
          itemCount: 5,
          itemSize: 16,
          unratedColor: Colors.amber.withAlpha(50),
        ),
        const SizedBox(width: 4),
        Text(
          rating.toStringAsFixed(1),
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildFeatureChip(IconData icon, String text) {
    return Chip(
      avatar: Icon(icon, size: 16, color: Theme.of(context).primaryColor),
      label: Text(text),
      backgroundColor: Colors.green[50],
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    );
  }

  void _showFarmerDetails(BuildContext context, Farmer farmer) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FarmerDetailsPage(
          farmer: farmer,
          baseUrl: baseUrl,
          currentUserId: currentUserId,
        ),
      ),
    ).then((newRating) {
      if (newRating != null) {
        setState(() {
          farmer.rating = newRating;
        });
      }
    });
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Filter Farmers'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: const Text('All Farmers'),
                onTap: () {
                  setState(() {
                    _selectedFilter = 'All';
                  });
                  Navigator.pop(context);
                },
              ),
              ListTile(
                title: const Text('Organic Farmers'),
                onTap: () {
                  setState(() {
                    _selectedFilter = 'Organic';
                  });
                  Navigator.pop(context);
                },
              ),
              ListTile(
                title: const Text('Top Rated'),
                onTap: () {
                  setState(() {
                    farmers.sort((a, b) => b.rating.compareTo(a.rating));
                    _selectedFilter = 'All';
                  });
                  Navigator.pop(context);
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('CANCEL'),
            ),
          ],
        );
      },
    );
  }
}

class FarmerDetailsPage extends StatefulWidget {
  final Farmer farmer;
  final String baseUrl;
  final String currentUserId;

  const FarmerDetailsPage({
    super.key,
    required this.farmer,
    required this.baseUrl,
    required this.currentUserId,
  });

  @override
  State<FarmerDetailsPage> createState() => _FarmerDetailsPageState();
}

class _FarmerDetailsPageState extends State<FarmerDetailsPage> {
  late final TextEditingController _feedbackController;
  late double _newRating;
  List<dynamic> _farmerFeedback = [];
  bool _isLoadingFeedback = false;

  @override
  void initState() {
    super.initState();
    _feedbackController = TextEditingController();
    _newRating = widget.farmer.rating;
    _loadFeedback();
  }

  Future<void> _loadFeedback() async {
    setState(() {
      _isLoadingFeedback = true;
    });

    try {
      final response = await http
          .get(
            Uri.parse(
              '${widget.baseUrl}/api/farmer-feedback/${widget.farmer.id}',
            ),
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          setState(() {
            _farmerFeedback = data['feedback'];
          });
        }
      }
    } catch (e) {
      // Handle error silently
    } finally {
      setState(() {
        _isLoadingFeedback = false;
      });
    }
  }

  Future<void> _submitFeedback() async {
    if (_newRating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a rating'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      final response = await http
          .post(
            Uri.parse('${widget.baseUrl}/api/submit-feedback'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({
              'farmerId': widget.farmer.id,
              'userId': widget.currentUserId,
              'rating': _newRating,
              'comment': _feedbackController.text,
            }),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          // ignore: use_build_context_synchronously
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Feedback submitted successfully!'),
              behavior: SnackBarBehavior.floating,
            ),
          );

          await _loadFeedback();
          _feedbackController.clear();

          if (mounted) {
            Navigator.pop(context, data['averageRating']);
          }
        }
      }
    } catch (e) {
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to submit feedback: ${e.toString()}'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.farmer.username),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context, widget.farmer.rating),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildFarmerHeader(),
            const SizedBox(height: 24),
            _buildDetailSection(),
            const SizedBox(height: 16),
            _buildProductsSection(),
            const SizedBox(height: 24),
            _buildRatingSection(),
            const SizedBox(height: 24),
            _buildFeedbackList(),
            const SizedBox(height: 24),
            _buildAddFeedbackSection(),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildFarmerHeader() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            color: Colors.grey[200],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: widget.farmer.profileImage.isNotEmpty
                ? Image.network(
                    '${widget.baseUrl}${widget.farmer.profileImage}',
                    fit: BoxFit.cover,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return Center(
                        child: CircularProgressIndicator(
                          value: loadingProgress.expectedTotalBytes != null
                              ? loadingProgress.cumulativeBytesLoaded /
                                    loadingProgress.expectedTotalBytes!
                              : null,
                        ),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) {
                      return Center(
                        child: Icon(
                          Icons.person,
                          size: 40,
                          color: Colors.grey[500],
                        ),
                      );
                    },
                  )
                : Center(
                    child: Icon(
                      Icons.person,
                      size: 40,
                      color: Colors.grey[500],
                    ),
                  ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.farmer.username,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                widget.farmer.location,
                style: TextStyle(fontSize: 16, color: Colors.grey[600]),
              ),
              const SizedBox(height: 8),
              _buildRatingBar(),
              if (widget.farmer.email.isNotEmpty)
                Text(
                  widget.farmer.email,
                  style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRatingBar() {
    return Row(
      children: [
        RatingBarIndicator(
          rating: widget.farmer.rating,
          itemBuilder: (context, index) =>
              const Icon(Icons.star, color: Colors.amber),
          itemCount: 5,
          itemSize: 20,
          unratedColor: Colors.amber.withAlpha(50),
        ),
        const SizedBox(width: 8),
        Text(
          widget.farmer.rating.toStringAsFixed(1),
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(width: 8),
        Text(
          '(${_farmerFeedback.length} reviews)',
          style: TextStyle(color: Colors.grey[600]),
        ),
      ],
    );
  }

  Widget _buildDetailSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Farmer Details',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        _buildDetailRow(Icons.person, 'About', widget.farmer.aboutMe),
        _buildDetailRow(
          Icons.agriculture,
          'Experience',
          widget.farmer.workExperience,
        ),
        _buildDetailRow(Icons.location_on, 'Address', widget.farmer.address),
        _buildDetailRow(Icons.phone, 'Contact', widget.farmer.phoneNumber),
        if (widget.farmer.age.isNotEmpty)
          _buildDetailRow(Icons.cake, 'Age', widget.farmer.age),
        if (widget.farmer.facebookLink.isNotEmpty)
          _buildDetailRow(
            Icons.facebook,
            'Facebook',
            widget.farmer.facebookLink,
          ),
        if (widget.farmer.instagramLink.isNotEmpty)
          _buildDetailRow(
            Icons.camera_alt,
            'Instagram',
            widget.farmer.instagramLink,
          ),
      ],
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Colors.green[700]),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 2),
                Text(
                  value.isNotEmpty ? value : 'Not provided',
                  style: TextStyle(
                    color: value.isNotEmpty ? Colors.black : Colors.grey,
                  ),
                ),
              ],
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
        const Text(
          'Products',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        if (widget.farmer.products.isEmpty)
          const Text(
            'No products available',
            style: TextStyle(color: Colors.grey),
          )
        else
          Column(
            children: widget.farmer.products.map((product) {
              return _buildProductItem(product);
            }).toList(),
          ),
      ],
    );
  }

  Widget _buildProductItem(Map<String, dynamic> product) {
    double price = 0.0;
    if (product['price'] != null) {
      if (product['price'] is String) {
        price = double.tryParse(product['price']) ?? 0.0;
      } else if (product['price'] is num) {
        price = product['price'].toDouble();
      }
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              product['name'] ?? 'Unnamed Product',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            if (product['images'] != null && product['images'].isNotEmpty)
              SizedBox(
                height: 100,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: product['images'].length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          '${widget.baseUrl}${product['images'][index]}',
                          width: 100,
                          height: 100,
                          fit: BoxFit.cover,
                          loadingBuilder: (context, child, loadingProgress) {
                            if (loadingProgress == null) return child;
                            return Center(
                              child: CircularProgressIndicator(
                                value:
                                    loadingProgress.expectedTotalBytes != null
                                    ? loadingProgress.cumulativeBytesLoaded /
                                          loadingProgress.expectedTotalBytes!
                                    : null,
                              ),
                            );
                          },
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              width: 100,
                              height: 100,
                              color: Colors.grey[200],
                              child: const Icon(Icons.image),
                            );
                          },
                        ),
                      ),
                    );
                  },
                ),
              ),
            const SizedBox(height: 8),
            Text(
              product['details'] ?? 'No details provided',
              style: TextStyle(color: Colors.grey[700]),
            ),
            const SizedBox(height: 8),
            Text(
              'Price: \$${price.toStringAsFixed(2)}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRatingSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Rate This Farmer',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        RatingBar.builder(
          initialRating: _newRating,
          minRating: 1,
          direction: Axis.horizontal,
          allowHalfRating: true,
          itemCount: 5,
          itemPadding: const EdgeInsets.symmetric(horizontal: 4.0),
          itemBuilder: (context, _) =>
              const Icon(Icons.star, color: Colors.amber),
          onRatingUpdate: (rating) {
            setState(() {
              _newRating = rating;
            });
          },
        ),
      ],
    );
  }

  Widget _buildFeedbackList() {
    if (_isLoadingFeedback) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_farmerFeedback.isEmpty) {
      return const Center(
        child: Text('No feedback yet', style: TextStyle(color: Colors.grey)),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Customer Feedback',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _farmerFeedback.length,
          itemBuilder: (context, index) {
            final feedback = _farmerFeedback[index];
            return _buildFeedbackItem(feedback);
          },
        ),
      ],
    );
  }

  Widget _buildFeedbackItem(Map<String, dynamic> feedback) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundImage: feedback['profile_image'] != null
                      ? NetworkImage(
                          '${widget.baseUrl}${feedback['profile_image']}',
                        )
                      : null,
                  child: feedback['profile_image'] == null
                      ? const Icon(Icons.person)
                      : null,
                ),
                const SizedBox(width: 12),
                Text(
                  feedback['username'] ?? 'Anonymous',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const Spacer(),
                Text(
                  feedback['created_at'] != null
                      ? DateFormat(
                          'MMM d, yyyy',
                        ).format(DateTime.parse(feedback['created_at']))
                      : '',
                  style: TextStyle(color: Colors.grey[600], fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                RatingBarIndicator(
                  rating: feedback['rating']?.toDouble() ?? 0,
                  itemBuilder: (context, index) =>
                      const Icon(Icons.star, color: Colors.amber),
                  itemCount: 5,
                  itemSize: 16,
                  unratedColor: Colors.amber.withAlpha(50),
                ),
                const SizedBox(width: 8),
                Text(
                  feedback['rating']?.toStringAsFixed(1) ?? '0.0',
                  style: const TextStyle(fontSize: 12),
                ),
              ],
            ),
            if (feedback['comment'] != null && feedback['comment'].isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  feedback['comment'],
                  style: TextStyle(color: Colors.grey[800]),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildAddFeedbackSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Add Your Feedback',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _feedbackController,
          decoration: InputDecoration(
            hintText: 'Write your feedback...',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
          maxLines: 3,
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _submitFeedback,
            child: const Text('SUBMIT FEEDBACK'),
          ),
        ),
      ],
    );
  }
}

class Farmer {
  final String id;
  final String username;
  final String email;
  final String age;
  final String aboutMe;
  final String address;
  final String idNumber;
  final String phoneNumber;
  final String location;
  final String workExperience;
  final String facebookLink;
  final String instagramLink;
  final String profileImage;
  double rating;
  final List<dynamic> products;
  final int feedbackCount;

  Farmer({
    required this.id,
    required this.username,
    required this.email,
    required this.age,
    required this.aboutMe,
    required this.address,
    required this.idNumber,
    required this.phoneNumber,
    required this.location,
    required this.workExperience,
    required this.facebookLink,
    required this.instagramLink,
    required this.profileImage,
    required this.rating,
    required this.products,
    required this.feedbackCount,
  });
}
