import 'package:flutter/material.dart';

void main() {
  runApp(const Mango());
}

class Mango extends StatelessWidget {
  const Mango({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Product Details',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        fontFamily: 'Poppins',
      ),
      home: const ProductDetailPage(),
    );
  }
}

class ProductDetailPage extends StatefulWidget {
  const ProductDetailPage({super.key});

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  // Sample images for product gallery
  final List<String> productImages = [
    'https://img.freepik.com/free-photo/delicious-mango-still-life_23-2151542201.jpg?t=st=1745936057~exp=1745939657~hmac=6ccf28f5a15baaadee2709fca927c9010a78a519376b0c88156078d1a571695b&w=740',
    'https://img.freepik.com/free-photo/mango-tree-with-nature_1150-12252.jpg?t=st=1745936083~exp=1745939683~hmac=fe67200408e3c7d04c2b5210c4d525ce870b891f156c574657ce01697b451e7a&w=996',
    'https://img.freepik.com/free-photo/delicious-raw-mango-fruit-tree_23-2149204866.jpg?t=st=1745936106~exp=1745939706~hmac=5ff0cedacc4087d6f040f8b18b0c8784634e0cb5fc05c3730622e66c92c314a3&w=740',
    'https://img.freepik.com/free-photo/delicious-mango-still-life_23-2151542199.jpg?t=st=1745936127~exp=1745939727~hmac=3b6e444d2f88b4247dcd3867628beed648db8861d194a0087414577624b96adf&w=740',
  ];

  // Sample review data
  final List<Review> reviews = [
    Review(
      username: 'Gardening Enthusiast',
      rating: 5,
      date: '15 Apr 2025',
      comment:
          'Excellent germination rate! Almost all seeds sprouted within a week. Very happy with the purchase.',
    ),
    Review(
      username: 'Green Thumb',
      rating: 4,
      date: '10 Apr 2025',
      comment:
          'Good quality seeds. Plants are growing well, but a few seeds didn\'t germinate.',
    ),
  ];

  int _currentImageIndex = 0;
  bool _showReviewForm = false;

  // Overall rating calculation
  double get averageRating {
    if (reviews.isEmpty) return 0;
    return reviews.map((r) => r.rating).reduce((a, b) => a + b) /
        reviews.length;
  }

  // Rating distribution
  Map<int, double> get ratingDistribution {
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
        title: const Text('Product Details'),
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
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image Gallery with indicators
            Stack(
              alignment: Alignment.bottomCenter,
              children: [
                SizedBox(
                  height: 300,
                  child: PageView.builder(
                    itemCount: productImages.length,
                    onPageChanged: (index) {
                      setState(() {
                        _currentImageIndex = index;
                      });
                    },
                    itemBuilder: (context, index) {
                      return Image.network(
                        productImages[index],
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: Colors.grey[200],
                            child: const Center(
                              child: Icon(Icons.image_not_supported, size: 50),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),
                // Image indicators
                Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: productImages.asMap().entries.map((entry) {
                      return Container(
                        width: 8,
                        height: 8,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _currentImageIndex == entry.key
                              ? Colors.white
                              // ignore: deprecated_member_use
                              : Colors.white.withOpacity(0.5),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),

            // Product Info Section
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Price
                  const Text(
                    'Rs. 734',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Product Name
                  const Text(
                    'Mango',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Rating and Sold Count
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 20),
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
                        '153 sold',
                        style: TextStyle(fontSize: 14),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Product Details Section
                  const Text(
                    'Product Details',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Product description and specifications
                  const Text(
                    'I sell fresh, juicy mangoes, handpicked from the best local farms. Known for their rich, tropical flavor and vibrant color, these mangoes are perfect for snacking, smoothies, salads, and desserts. ',
                    style: TextStyle(fontSize: 14),
                  ),

                  const SizedBox(height: 16),

                  // Product specifications in table format
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
                    children: const [
                      TableRow(
                        children: [
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text(
                              'Variety',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text('Alphonso (Hapus) '),
                          ),
                        ],
                      ),
                      TableRow(
                        children: [
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text(
                              'Seeds per pack',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text(' 5 to 10'),
                          ),
                        ],
                      ),
                      TableRow(
                        children: [
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text(
                              'Germination rate',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text('60–80%'),
                          ),
                        ],
                      ),
                      TableRow(
                        children: [
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text(
                              'Growth time',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text('2 to 4 weeks'),
                          ),
                        ],
                      ),
                      TableRow(
                        children: [
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text(
                              'Shelf life',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(vertical: 8.0),
                            child: Text('1 to 2 weeks'),
                          ),
                        ],
                      ),
                    ],
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
                          backgroundColor: Colors.green,
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
                                } else if (index < averageRating.ceil() &&
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
                            _buildRatingBar(5, ratingDistribution[5] ?? 0),
                            _buildRatingBar(4, ratingDistribution[4] ?? 0),
                            _buildRatingBar(3, ratingDistribution[3] ?? 0),
                            _buildRatingBar(2, ratingDistribution[2] ?? 0),
                            _buildRatingBar(1, ratingDistribution[1] ?? 0),
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
                        _buildReviewItem(
                          username: review.username,
                          rating: review.rating,
                          date: review.date,
                          comment: review.comment,
                        ),
                        const Divider(),
                      ],
                    );
                    // ignore: unnecessary_to_list_in_spreads
                  }).toList(),

                  if (reviews.isNotEmpty)
                    Center(
                      child: TextButton(
                        onPressed: () {},
                        child: const Text('View All Reviews'),
                      ),
                    ),

                  const SizedBox(height: 16),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          onPressed: () {},
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
                            side: const BorderSide(color: Colors.orange),
                          ),
                          onPressed: () {},
                          child: const Text(
                            'Add to Cart',
                            style: TextStyle(
                              color: Colors.orange,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
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

  // Review form widget
  Widget _buildReviewForm() {
    // Controllers for form fields
    final TextEditingController nameController = TextEditingController();
    final TextEditingController commentController = TextEditingController();
    int selectedRating = 5;

    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Write a Review',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          // Name field
          TextField(
            controller: nameController,
            decoration: const InputDecoration(
              labelText: 'Your Name',
              border: OutlineInputBorder(),
              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
          ),
          const SizedBox(height: 16),

          // Rating selector
          StatefulBuilder(
            builder: (context, setState) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Your Rating:',
                    style: TextStyle(fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: List.generate(
                      5,
                      (index) => IconButton(
                        onPressed: () {
                          setState(() {
                            selectedRating = index + 1;
                          });
                        },
                        icon: Icon(
                          index < selectedRating
                              ? Icons.star
                              : Icons.star_border,
                          color: Colors.amber,
                        ),
                        constraints: const BoxConstraints(),
                        padding: const EdgeInsets.only(right: 4),
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: 16),

          // Comment field
          TextField(
            controller: commentController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Your Review',
              hintText: 'Share your experience with this product',
              border: OutlineInputBorder(),
              contentPadding: EdgeInsets.all(12),
            ),
          ),
          const SizedBox(height: 16),

          // Submit and Cancel buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  onPressed: () {
                    // Add new review
                    if (nameController.text.isNotEmpty &&
                        commentController.text.isNotEmpty) {
                      setState(() {
                        reviews.insert(
                          0,
                          Review(
                            username: nameController.text,
                            rating: selectedRating,
                            date:
                                '${DateTime.now().day} Apr 2025', // Simplified date
                            comment: commentController.text,
                          ),
                        );
                        _showReviewForm = false;
                      });
                    }
                  },
                  child: const Text(
                    'Submit Review',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              TextButton(
                onPressed: () {
                  setState(() {
                    _showReviewForm = false;
                  });
                },
                child: const Text('Cancel'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Helper method to build rating bars
  Widget _buildRatingBar(int stars, double percentage) {
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

  // Helper method to build review items
  Widget _buildReviewItem({
    required String username,
    required int rating,
    required String date,
    required String comment,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                username,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              Text(
                date,
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
                index < rating ? Icons.star : Icons.star_border,
                color: Colors.amber,
                size: 16,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            comment,
            style: const TextStyle(fontSize: 14),
          ),
        ],
      ),
    );
  }
}

// Review model class
class Review {
  final String username;
  final int rating;
  final String date;
  final String comment;

  Review({
    required this.username,
    required this.rating,
    required this.date,
    required this.comment,
  });
}
