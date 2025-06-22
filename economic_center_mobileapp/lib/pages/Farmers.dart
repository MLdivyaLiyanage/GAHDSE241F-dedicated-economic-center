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
      title: 'Farmer Profiles',
      theme: ThemeData(
        primarySwatch: Colors.green,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const FarmerProfilesPage(),
    );
  }
}

class Farmer {
  final int id;
  final int userId;
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final int? age;
  final String nicNumber;
  final String experience;
  final String farmingType;
  final String address;
  final String city;
  final String bio;
  final String profileImage;
  final double? locationLat;
  final double? locationLng;
  final String locationAddress;
  final double rating;
  final int feedbackCount;

  Farmer({
    required this.id,
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.phone,
    this.age,
    required this.nicNumber,
    required this.experience,
    required this.farmingType,
    required this.address,
    required this.city,
    required this.bio,
    required this.profileImage,
    this.locationLat,
    this.locationLng,
    required this.locationAddress,
    required this.rating,
    required this.feedbackCount,
  });

  factory Farmer.fromJson(Map<String, dynamic> json) {
    return Farmer(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      userId: json['user_id'] is int
          ? json['user_id']
          : int.parse(json['user_id'].toString()),
      firstName: json['first_name'] ?? 'Unknown',
      lastName: json['last_name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      age: json['age'] != null
          ? (json['age'] is int
              ? json['age']
              : int.tryParse(json['age'].toString()))
          : null,
      nicNumber: json['nic_number'] ?? '',
      experience: json['experience'] ?? '',
      farmingType: json['farming_type'] ?? '',
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      bio: json['bio'] ?? 'No bio provided',
      profileImage: json['profile_image'] ?? '',
      locationLat: json['location_lat'] != null
          ? (json['location_lat'] is double
              ? json['location_lat']
              : double.tryParse(json['location_lat'].toString()))
          : null,
      locationLng: json['location_lng'] != null
          ? (json['location_lng'] is double
              ? json['location_lng']
              : double.tryParse(json['location_lng'].toString()))
          : null,
      locationAddress: json['location_address'] ?? '',
      rating: json['average_rating'] is double
          ? json['average_rating']
          : double.parse(json['average_rating'].toString()),
      feedbackCount: json['feedback_count'] is int
          ? json['feedback_count']
          : int.parse(json['feedback_count'].toString()),
    );
  }

  String get fullName => '$firstName $lastName';
  String get location => '$address, $city';
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
  final TextEditingController _searchController = TextEditingController();

  String get baseUrl {
    if (Platform.isAndroid) return 'http://10.0.2.2:5300';
    return 'http://localhost:5300';
  }

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
    _fetchFarmers();
  }

  void _onSearchChanged() {
    setState(() => _searchQuery = _searchController.text.toLowerCase());
  }

  Future<void> _fetchFarmers() async {
    setState(() {
      isLoading = true;
      errorMessage = '';
    });

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/farmer-profiles'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          setState(() {
            farmers = (data['profiles'] as List)
                .map((profile) => Farmer.fromJson(profile))
                .toList();
            isLoading = false;
          });
        }
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error: ${e.toString()}';
        isLoading = false;
      });
    }
  }

  List<Farmer> get filteredFarmers {
    return farmers.where((farmer) {
      return farmer.fullName.toLowerCase().contains(_searchQuery) ||
          farmer.location.toLowerCase().contains(_searchQuery) ||
          farmer.farmingType.toLowerCase().contains(_searchQuery);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Farmer Profiles'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchFarmers,
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search farmers...',
                prefixIcon: const Icon(Icons.search),
              ),
            ),
          ),
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : errorMessage.isNotEmpty
                    ? Center(child: Text(errorMessage))
                    : filteredFarmers.isEmpty
                        ? const Center(child: Text('No farmers found'))
                        : ListView.builder(
                            itemCount: filteredFarmers.length,
                            itemBuilder: (context, index) {
                              final farmer = filteredFarmers[index];
                              return _FarmerCard(farmer: farmer);
                            },
                          ),
          ),
        ],
      ),
    );
  }
}

class _FarmerCard extends StatelessWidget {
  final Farmer farmer;

  const _FarmerCard({required this.farmer});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: farmer.profileImage.isNotEmpty
              ? NetworkImage(farmer.profileImage)
              : null,
          child: farmer.profileImage.isEmpty ? const Icon(Icons.person) : null,
        ),
        title: Text(farmer.fullName),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(farmer.location),
            RatingBarIndicator(
              rating: farmer.rating,
              itemBuilder: (context, _) => const Icon(
                Icons.star,
                color: Colors.amber,
              ),
              itemCount: 5,
              itemSize: 16,
            ),
          ],
        ),
        trailing: Text('${farmer.feedbackCount} reviews'),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => FarmerDetailsPage(farmer: farmer),
            ),
          );
        },
      ),
    );
  }
}

class FarmerDetailsPage extends StatelessWidget {
  final Farmer farmer;

  const FarmerDetailsPage({super.key, required this.farmer});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(farmer.fullName),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (farmer.profileImage.isNotEmpty)
              Image.network(farmer.profileImage),
            _buildDetailSection('Personal Info', [
              _buildDetailItem('Name', farmer.fullName),
              _buildDetailItem('Email', farmer.email),
              _buildDetailItem('Phone', farmer.phone),
              if (farmer.age != null)
                _buildDetailItem('Age', farmer.age.toString()),
              _buildDetailItem('NIC', farmer.nicNumber),
            ]),
            _buildDetailSection('Farming Details', [
              _buildDetailItem('Experience', farmer.experience),
              _buildDetailItem('Type', farmer.farmingType),
            ]),
            _buildDetailSection('Location', [
              _buildDetailItem('Address', farmer.address),
              _buildDetailItem('City', farmer.city),
            ]),
            _buildDetailSection('Bio', [
              Text(farmer.bio),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        ...children,
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildDetailItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
