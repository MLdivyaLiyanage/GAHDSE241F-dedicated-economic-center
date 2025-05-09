import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';

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
        cardTheme: CardTheme(
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
  final List<Farmer> farmers = [
    Farmer(
      id: '1',
      name: "Rajesh Kumar",
      location: "Punjab, India",
      rating: 4.7,
      specialty: "Organic Wheat",
      experience: "12 years",
      imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6",
      farmSize: "8 acres",
      products: "Wheat, Barley, Mustard",
      contact: "+91 98765 43210",
      feedbacks: [
        FeedbackItem(
          userId: 'user1',
          userName: 'Amit Sharma',
          rating: 4.5,
          comment: 'Excellent quality wheat, very professional',
          date: DateTime(2023, 5, 10),
        ),
        FeedbackItem(
          userId: 'user2',
          userName: 'Priya Patel',
          rating: 5.0,
          comment: 'Best organic products in the region',
          date: DateTime(2023, 6, 15),
        ),
      ],
    ),
    Farmer(
      id: '2',
      name: "Priya Patel",
      location: "Gujarat, India",
      rating: 4.9,
      specialty: "Cotton & Groundnuts",
      experience: "8 years",
      imageUrl:
          "https://img.freepik.com/free-photo/asian-farmer-wearing-straw-hat-loincloth-stand-carrying-hoe-shoulder-rice-field_1150-54022.jpg",
      farmSize: "12 acres",
      products: "Cotton, Groundnuts, Castor",
      contact: "+91 87654 32109",
      feedbacks: [
        FeedbackItem(
          userId: 'user3',
          userName: 'Rahul Verma',
          rating: 4.8,
          comment: 'Consistent quality cotton supply',
          date: DateTime(2023, 4, 22),
        ),
      ],
    ),
  ];

  String _searchQuery = '';
  String _selectedFilter = 'All';
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _feedbackController = TextEditingController();
  // ignore: unused_field
  final double _newRating = 3.0;

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text.toLowerCase();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _feedbackController.dispose();
    super.dispose();
  }

  List<Farmer> get filteredFarmers {
    return farmers.where((farmer) {
      final matchesSearch = farmer.name.toLowerCase().contains(_searchQuery) ||
          farmer.location.toLowerCase().contains(_searchQuery) ||
          farmer.specialty.toLowerCase().contains(_searchQuery) ||
          farmer.products.toLowerCase().contains(_searchQuery);

      if (_selectedFilter == 'All') {
        return matchesSearch;
      } else {
        return matchesSearch && farmer.specialty.contains(_selectedFilter);
      }
    }).toList();
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
          Expanded(
            child: _buildFarmerList(),
          ),
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
                color:
                    _selectedFilter == filter ? Colors.white : Colors.grey[700],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildFarmerList() {
    if (filteredFarmers.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, size: 60, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No farmers found',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
              ),
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

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: filteredFarmers.length,
      itemBuilder: (context, index) {
        return _buildFarmerCard(filteredFarmers[index]);
      },
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
                  _buildProfileImage(farmer.imageUrl),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          farmer.name,
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
                          '${farmer.feedbacks.length} reviews',
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
                  _buildFeatureChip(Icons.agriculture, farmer.specialty),
                  _buildFeatureChip(Icons.calendar_today, farmer.experience),
                  _buildFeatureChip(Icons.landscape, farmer.farmSize),
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
        child: Image.network(
          imageUrl,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) {
            return Center(
              child: Icon(
                Icons.person,
                size: 40,
                color: Colors.grey[500],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildRatingBar(double rating) {
    return Row(
      children: [
        RatingBarIndicator(
          rating: rating,
          itemBuilder: (context, index) => const Icon(
            Icons.star,
            color: Colors.amber,
          ),
          itemCount: 5,
          itemSize: 16,
          unratedColor: Colors.amber.withAlpha(50),
        ),
        const SizedBox(width: 4),
        Text(
          rating.toStringAsFixed(1),
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureChip(IconData icon, String text) {
    return Chip(
      avatar: Icon(icon, size: 16, color: Theme.of(context).primaryColor),
      label: Text(text),
      backgroundColor: Colors.green[50],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    );
  }

  void _showFarmerDetails(BuildContext context, Farmer farmer) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FarmerDetailsPage(
          farmer: farmer,
          onFeedbackSubmitted: (feedback) {
            setState(() {
              farmer.feedbacks.add(feedback);
              // Update average rating
              final totalRating =
                  farmer.feedbacks.fold(0.0, (sum, f) => sum + f.rating);
              farmer.rating = totalRating / farmer.feedbacks.length;
            });
          },
        ),
      ),
    );
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
  final Function(FeedbackItem) onFeedbackSubmitted;

  const FarmerDetailsPage({
    super.key,
    required this.farmer,
    required this.onFeedbackSubmitted,
  });

  @override
  State<FarmerDetailsPage> createState() => _FarmerDetailsPageState();
}

class _FarmerDetailsPageState extends State<FarmerDetailsPage> {
  late final TextEditingController _feedbackController;
  late double _newRating;

  @override
  void initState() {
    super.initState();
    _feedbackController = TextEditingController();
    _newRating = 3.0;
  }

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.farmer.name),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
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
            _buildFeedbackSection(),
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
            child: Image.network(
              widget.farmer.imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Center(
                  child: Icon(
                    Icons.person,
                    size: 40,
                    color: Colors.grey[500],
                  ),
                );
              },
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.farmer.name,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                widget.farmer.location,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 8),
              _buildRatingBar(),
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
          itemBuilder: (context, index) => const Icon(
            Icons.star,
            color: Colors.amber,
          ),
          itemCount: 5,
          itemSize: 20,
          unratedColor: Colors.amber.withAlpha(50),
        ),
        const SizedBox(width: 8),
        Text(
          widget.farmer.rating.toStringAsFixed(1),
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
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
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        _buildDetailRow(
            Icons.agriculture, 'Specialty', widget.farmer.specialty),
        _buildDetailRow(
            Icons.calendar_today, 'Experience', widget.farmer.experience),
        _buildDetailRow(Icons.landscape, 'Farm Size', widget.farmer.farmSize),
        _buildDetailRow(Icons.phone, 'Contact', widget.farmer.contact),
      ],
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.green[700]),
          const SizedBox(width: 8),
          Text(
            '$label: ',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: Text(value),
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
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: widget.farmer.products.split(', ').map((product) {
            return Chip(
              label: Text(product.trim()),
              backgroundColor: Colors.green[50],
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildFeedbackSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Feedback & Reviews',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              '${widget.farmer.feedbacks.length} reviews',
              style: TextStyle(
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        if (widget.farmer.feedbacks.isEmpty)
          const Text(
            'No reviews yet',
            style: TextStyle(color: Colors.grey),
          )
        else
          Column(
            children: widget.farmer.feedbacks.map((feedback) {
              return _buildFeedbackItem(feedback);
            }).toList(),
          ),
      ],
    );
  }

  Widget _buildFeedbackItem(FeedbackItem feedback) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                feedback.userName,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${feedback.date.day}/${feedback.date.month}/${feedback.date.year}',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          RatingBarIndicator(
            rating: feedback.rating,
            itemBuilder: (context, index) => const Icon(
              Icons.star,
              color: Colors.amber,
            ),
            itemCount: 5,
            itemSize: 16,
            unratedColor: Colors.amber.withAlpha(50),
          ),
          const SizedBox(height: 4),
          Text(
            feedback.comment,
            style: const TextStyle(
              fontSize: 14,
            ),
          ),
          const Divider(height: 24),
        ],
      ),
    );
  }

  Widget _buildAddFeedbackSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Add Your Feedback',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        RatingBar.builder(
          initialRating: _newRating,
          minRating: 1,
          direction: Axis.horizontal,
          allowHalfRating: true,
          itemCount: 5,
          itemSize: 30,
          itemBuilder: (context, _) => const Icon(
            Icons.star,
            color: Colors.amber,
          ),
          onRatingUpdate: (rating) {
            setState(() {
              _newRating = rating;
            });
          },
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _feedbackController,
          decoration: InputDecoration(
            hintText: 'Write your feedback...',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          maxLines: 3,
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () {
              if (_feedbackController.text.isNotEmpty) {
                final newFeedback = FeedbackItem(
                  userId: 'current_user_id',
                  userName: 'Current User',
                  rating: _newRating,
                  comment: _feedbackController.text,
                  date: DateTime.now(),
                );

                widget.onFeedbackSubmitted(newFeedback);
                _feedbackController.clear();
                _newRating = 3.0;

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Thank you for your feedback!'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            child: const Text('SUBMIT FEEDBACK'),
          ),
        ),
      ],
    );
  }
}

class Farmer {
  final String id;
  final String name;
  final String location;
  double rating;
  final String specialty;
  final String experience;
  final String imageUrl;
  final String farmSize;
  final String products;
  final String contact;
  List<FeedbackItem> feedbacks;

  Farmer({
    required this.id,
    required this.name,
    required this.location,
    required this.rating,
    required this.specialty,
    required this.experience,
    required this.imageUrl,
    required this.farmSize,
    required this.products,
    required this.contact,
    required this.feedbacks,
  });
}

class FeedbackItem {
  final String userId;
  final String userName;
  final double rating;
  final String comment;
  final DateTime date;

  FeedbackItem({
    required this.userId,
    required this.userName,
    required this.rating,
    required this.comment,
    required this.date,
  });
}
