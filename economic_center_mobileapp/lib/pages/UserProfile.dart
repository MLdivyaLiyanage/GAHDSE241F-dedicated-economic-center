import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const UserProfileScreen(),
    );
  }
}

class UserData {
  String name;
  String email;
  String phone;
  String location;
  String bio;
  String userType;
  File? profileImage;
  int rating;
  int posts;

  UserData({
    required this.name,
    required this.email,
    required this.phone,
    required this.location,
    required this.bio,
    required this.userType,
    this.profileImage,
    required this.rating,
    required this.posts,
  });
}

class UserProfileScreen extends StatefulWidget {
  const UserProfileScreen({super.key});

  @override
  State<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  final ImagePicker _picker = ImagePicker();
  bool _isEditing = false;

  // Initialize with dummy data
  late UserData userData = UserData(
    name: 'Dilmi Ravihansa',
    email: 'Dilmi123@gmail.com',
    phone: '0714359867',
    location: 'Glle',
    bio: 'Hello, I\'m Dilmi Ravihansa.\nI am seller\nWelcome to my profile!',
    userType: 'seller',
    rating: 1000,
    posts: 9920,
  );

  // Controllers for editing form
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _locationController;
  late TextEditingController _bioController;
  late TextEditingController _userTypeController;

  @override
  void initState() {
    super.initState();
    _initControllers();
  }

  void _initControllers() {
    _nameController = TextEditingController(text: userData.name);
    _emailController = TextEditingController(text: userData.email);
    _phoneController = TextEditingController(text: userData.phone);
    _locationController = TextEditingController(text: userData.location);
    _bioController = TextEditingController(text: userData.bio);
    _userTypeController = TextEditingController(text: userData.userType);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _locationController.dispose();
    _bioController.dispose();
    _userTypeController.dispose();
    super.dispose();
  }

  // ignore: unused_element
  Future<void> _pickImage() async {
    try {
      final XFile? pickedFile =
          await _picker.pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        setState(() {
          userData.profileImage = File(pickedFile.path);
        });
        // Show success message
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile picture updated successfully')),
        );
      }
    } catch (e) {
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    }
  }

  // Add a method to show image source picker
  Future<void> _showImageSourceOptions() async {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Gallery'),
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImageFromSource(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Camera'),
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImageFromSource(ImageSource.camera);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // Modified method to pick image from specific source
  Future<void> _pickImageFromSource(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() {
          userData.profileImage = File(pickedFile.path);
        });
        // Show success message
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile picture updated successfully')),
        );
      }
    } catch (e) {
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    }
  }

  void _toggleEditMode() {
    if (_isEditing) {
      // Save the changes
      setState(() {
        userData.name = _nameController.text;
        userData.email = _emailController.text;
        userData.phone = _phoneController.text;
        userData.location = _locationController.text;
        userData.bio = _bioController.text;
        userData.userType = _userTypeController.text;
        _isEditing = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile updated successfully')),
      );
    } else {
      // Enter edit mode
      setState(() {
        _isEditing = true;
      });
    }
  }

  // ignore: unused_element
  void _showDeleteConfirmation() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Delete Profile'),
          content: const Text(
              'Are you sure you want to delete your profile? This action cannot be undone.'),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Delete', style: TextStyle(color: Colors.red)),
              onPressed: () {
                Navigator.of(context).pop();
                _deleteProfile();
              },
            ),
          ],
        );
      },
    );
  }

  void _deleteProfile() {
    // In a real app, this would make an API call to delete the user account
    // For this demo, we'll just show a confirmation message
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Profile deleted successfully')),
    );

    // In a real app, you would navigate to a login screen or similar
    // For demo purposes, we'll just reset the user data
    setState(() {
      userData = UserData(
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        userType: '',
        rating: 0,
        posts: 0,
      );
      _initControllers();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Green corner shape
          Positioned(
            top: 0,
            left: 0,
            child: Container(
              width: 100,
              height: 100,
              decoration: const BoxDecoration(
                color: Color(0xFF9DE079),
                borderRadius: BorderRadius.only(
                  bottomRight: Radius.circular(100),
                ),
              ),
              child: const Padding(
                padding: EdgeInsets.only(left: 16, top: 36),
                child: Icon(
                  Icons.settings,
                  color: Colors.white,
                  size: 30,
                ),
              ),
            ),
          ),

          // Main content
          SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),

                    // Profile title
                    const Center(
                      child: Text(
                        'My Profile',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF5B5B5B),
                        ),
                      ),
                    ),

                    const Divider(
                      color: Color(0xFFCCE5B7),
                      thickness: 1,
                      height: 30,
                    ),

                    // Profile Header Section
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Profile info
                          Expanded(
                            flex: 3,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  userData.name,
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF5B5B5B),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  userData.email,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF28B463),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Text(
                                    'Online',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                // Display bio content from userData
                                Text(
                                  userData.bio,
                                  style: const TextStyle(fontSize: 14),
                                ),
                                Text(
                                  "I am ${userData.userType}",
                                  style: const TextStyle(fontSize: 14),
                                ),
                              ],
                            ),
                          ),

                          // Profile image - Now wrapped with GestureDetector for image picking
                          Expanded(
                            flex: 2,
                            child: Stack(
                              alignment: Alignment.bottomRight,
                              children: [
                                GestureDetector(
                                  onTap: _showImageSourceOptions,
                                  child: Container(
                                    height: 100,
                                    width: 100,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: const Color(0xFFCCE5B7),
                                        width: 2,
                                      ),
                                      image: userData.profileImage != null
                                          ? DecorationImage(
                                              image: FileImage(
                                                  userData.profileImage!),
                                              fit: BoxFit.cover,
                                            )
                                          : const DecorationImage(
                                              image: AssetImage(
                                                  'assets/default_profile.png'),
                                              fit: BoxFit.cover,
                                            ),
                                    ),
                                  ),
                                ),
                                // Change profile image button
                                Positioned(
                                  right: 0,
                                  bottom: 0,
                                  child: GestureDetector(
                                    onTap: _showImageSourceOptions,
                                    child: Container(
                                      width: 30,
                                      height: 30,
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF28B463),
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: Colors.white,
                                          width: 2,
                                        ),
                                      ),
                                      child: const Icon(
                                        Icons.camera_alt,
                                        color: Colors.white,
                                        size: 16,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Stats Section
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildStatColumn(userData.rating.toString(), 'Rating',
                              Icons.star, Colors.amber),
                          _buildStatColumn(userData.posts.toString(), 'Posts',
                              null, Colors.blue),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // About Me Section
                    const Text(
                      'About Me',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF5B5B5B),
                      ),
                    ),

                    const SizedBox(height: 16),

                    _isEditing
                        ? _buildEditableAboutMe()
                        : _buildDisplayAboutMe(),
                  ],
                ),
              ),
            ),
          ),

          // Edit button
          Positioned(
            top: 40,
            right: 20,
            child: IconButton(
              icon: Icon(_isEditing ? Icons.save : Icons.edit),
              color: const Color(0xFF28B463),
              onPressed: _toggleEditMode,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatColumn(
      String value, String label, IconData? icon, Color color) {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(icon, color: color, size: 16),
              const SizedBox(width: 4),
            ],
            Text(
              value,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildDisplayAboutMe() {
    return Column(
      children: [
        _buildInfoRow(userData.name, Icons.person),
        _buildInfoRow(userData.email, Icons.email),
        _buildInfoRow(userData.phone, Icons.phone),
        _buildInfoRow(userData.location, Icons.location_on),
        _buildInfoRow(userData.bio, Icons.description),
      ],
    );
  }

  Widget _buildEditableAboutMe() {
    return Column(
      children: [
        TextField(
          controller: _nameController,
          decoration: const InputDecoration(
            labelText: 'Name',
            prefixIcon: Icon(Icons.person),
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Email',
            prefixIcon: Icon(Icons.email),
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _phoneController,
          decoration: const InputDecoration(
            labelText: 'Phone',
            prefixIcon: Icon(Icons.phone),
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _locationController,
          decoration: const InputDecoration(
            labelText: 'Location',
            prefixIcon: Icon(Icons.location_on),
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        // Added bio field to edit form
        TextField(
          controller: _bioController,
          decoration: const InputDecoration(
            labelText: 'Bio',
            prefixIcon: Icon(Icons.description),
            border: OutlineInputBorder(),
          ),
          maxLines: 3, // Allow multiple lines for bio
        ),
        const SizedBox(height: 12),
        // Added user type field
        TextField(
          controller: _userTypeController,
          decoration: const InputDecoration(
            labelText: 'User Type',
            prefixIcon: Icon(Icons.person_outline),
            border: OutlineInputBorder(),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Colors.grey.shade300),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 20, color: Colors.black54),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 16,
                color: Color(0xFF5B5B5B),
              ),
            ),
          ),
          Container(
            width: 24,
            height: 24,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Color(0xFFE0E0E0),
            ),
            child: const Icon(
              Icons.arrow_forward_ios,
              size: 12,
              color: Colors.black54,
            ),
          ),
        ],
      ),
    );
  }
}
