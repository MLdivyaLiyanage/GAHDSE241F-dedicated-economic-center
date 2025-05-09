import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:path/path.dart';
import 'package:async/async.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:permission_handler/permission_handler.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

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
  int? id;
  String name;
  String email;
  String phone;
  String location;
  String bio;
  String userType;
  File? profileImage;
  String? profileImageUrl;
  int rating;
  int posts;

  UserData({
    this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.location,
    required this.bio,
    required this.userType,
    this.profileImage,
    this.profileImageUrl,
    required this.rating,
    required this.posts,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'location': location,
      'bio': bio,
      'user_type': userType,
      'profile_image_url': profileImageUrl,
      'rating': rating,
      'posts': posts,
    };
  }

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      id: json['id'],
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      location: json['location'] ?? '',
      bio: json['bio'] ?? '',
      userType: json['user_type'] ?? 'seller',
      profileImageUrl: json['profile_image_url'],
      rating: json['rating'] ?? 0,
      posts: json['posts'] ?? 0,
    );
  }
}

class UserProfileScreen extends StatefulWidget {
  const UserProfileScreen({super.key});

  @override
  State<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  final ImagePicker _picker = ImagePicker();
  bool _isEditing = false;
  bool _isLoading = true;
  final String _baseUrl = 'http://10.0.2.2:3000';
  late SharedPreferences _prefs;

  // Default email for the user - This will be editable now
  final String _defaultEmail = 'divya@gmail.com';

  // Initialize with empty data
  late UserData userData = UserData(
    name: '',
    email: _defaultEmail,
    phone: '',
    location: '',
    bio: '',
    userType: 'seller',
    rating: 0,
    posts: 0,
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
    _initializeApp();
    _requestPermissions();
  }

  Future<void> _initializeApp() async {
    await _initSharedPreferences();

    // First try to load from local storage
    final hasLocalData = await _loadProfileLocally();

    // Then try to sync with server
    try {
      await _loadUserProfileFromServer();
    } catch (e) {
      // If server load fails but we have local data, show that
      if (hasLocalData) {
        setState(() {
          _isLoading = false;
        });
      } else {
        // No local data and server error
        ScaffoldMessenger.of(context as BuildContext).showSnackBar(
          SnackBar(content: Text('Error loading profile: $e')),
        );
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _initSharedPreferences() async {
    _prefs = await SharedPreferences.getInstance();
  }

  Future<void> _requestPermissions() async {
    await Permission.camera.request();
    await Permission.photos.request();
    if (Platform.isAndroid) {
      await Permission.storage.request();
    }
  }

  void _initControllers() {
    _nameController = TextEditingController(text: userData.name);
    _emailController = TextEditingController(text: userData.email);
    _phoneController = TextEditingController(text: userData.phone);
    _locationController = TextEditingController(text: userData.location);
    _bioController = TextEditingController(text: userData.bio);
    _userTypeController = TextEditingController(text: userData.userType);
  }

  void _updateControllers() {
    _nameController.text = userData.name;
    _emailController.text = userData.email;
    _phoneController.text = userData.phone;
    _locationController.text = userData.location;
    _bioController.text = userData.bio;
    _userTypeController.text = userData.userType;
  }

  Future<void> _saveProfileLocally() async {
    await _prefs.setString('user_profile', json.encode(userData.toJson()));
    if (userData.profileImage != null) {
      final imageBytes = await userData.profileImage!.readAsBytes();
      await _prefs.setString('profile_image', base64Encode(imageBytes));
    }
  }

  Future<bool> _loadProfileLocally() async {
    final profileJson = _prefs.getString('user_profile');
    if (profileJson != null) {
      try {
        final profileData = json.decode(profileJson);
        setState(() {
          userData = UserData.fromJson(profileData);
          _updateControllers();
        });

        final imageString = _prefs.getString('profile_image');
        if (imageString != null) {
          final bytes = base64Decode(imageString);
          final tempDir = await Directory.systemTemp.createTemp();
          final file = File('${tempDir.path}/profile_temp.png');
          await file.writeAsBytes(bytes);
          setState(() {
            userData.profileImage = file;
          });
        }
        return true;
      } catch (e) {
        if (kDebugMode) {
          print('Error loading profile from local storage: $e');
        }
        return false;
      }
    }
    return false;
  }

  Future<void> _loadUserProfileFromServer() async {
    // Use the current email from the controller instead of the default email
    String emailToFetch = _emailController.text.isNotEmpty
        ? _emailController.text
        : _defaultEmail;

    final response =
        await http.get(Uri.parse('$_baseUrl/api/user/$emailToFetch'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        userData = UserData.fromJson(data);
        _updateControllers();
        _isLoading = false;
      });
      await _saveProfileLocally();
    } else if (response.statusCode == 404) {
      // User not found on server, but we can continue with local data or empty data
      setState(() {
        _isLoading = false;
      });
    } else {
      throw Exception('Failed to load profile from server');
    }
  }

  Future<void> _pickImageFromSource(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() {
          userData.profileImage = File(pickedFile.path);
        });
        await _saveProfileLocally();
        ScaffoldMessenger.of(context as BuildContext).showSnackBar(
          const SnackBar(content: Text('Profile picture updated')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context as BuildContext).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    }
  }

  Future<void> _showImageSourceOptions() async {
    final result = await showModalBottomSheet<ImageSource>(
      context: context as BuildContext,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Gallery'),
                onTap: () => Navigator.pop(context, ImageSource.gallery),
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Camera'),
                onTap: () => Navigator.pop(context, ImageSource.camera),
              ),
            ],
          ),
        );
      },
    );

    if (result != null) {
      await _pickImageFromSource(result);
    }
  }

  Future<void> _saveProfile() async {
    setState(() {
      _isLoading = true;
    });

    try {
      var request =
          http.MultipartRequest('POST', Uri.parse('$_baseUrl/api/user'));

      request.fields['name'] = _nameController.text;
      request.fields['email'] = _emailController.text;
      request.fields['phone'] = _phoneController.text;
      request.fields['location'] = _locationController.text;
      request.fields['bio'] = _bioController.text;
      request.fields['user_type'] = _userTypeController.text;
      request.fields['rating'] = userData.rating.toString();
      request.fields['posts'] = userData.posts.toString();

      if (userData.profileImage != null) {
        var stream = http.ByteStream(
            // ignore: deprecated_member_use
            DelegatingStream.typed(userData.profileImage!.openRead()));
        var length = await userData.profileImage!.length();
        var multipartFile = http.MultipartFile('profile_image', stream, length,
            filename: basename(userData.profileImage!.path));
        request.files.add(multipartFile);
      }

      var response = await request.send();
      final responseBody = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        final updatedUserData = json.decode(responseBody);
        setState(() {
          _isEditing = false;
          userData = UserData.fromJson(updatedUserData);
          _updateControllers();
          _isLoading = false;
        });

        await _saveProfileLocally();
        ScaffoldMessenger.of(context as BuildContext).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully')),
        );
      } else {
        throw Exception('Failed to update profile: ${response.statusCode}');
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context as BuildContext).showSnackBar(
        SnackBar(content: Text('Error saving profile: $e')),
      );
    }
  }

  Future<void> _deleteProfile() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await http.delete(
        Uri.parse('$_baseUrl/api/user/${userData.email}'),
      );

      if (response.statusCode == 200) {
        // Clear local storage
        await _prefs.remove('user_profile');
        await _prefs.remove('profile_image');

        ScaffoldMessenger.of(context as BuildContext).showSnackBar(
          const SnackBar(content: Text('Profile deleted successfully')),
        );

        setState(() {
          userData = UserData(
            name: '',
            email: _defaultEmail,
            phone: '',
            location: '',
            bio: '',
            userType: 'seller',
            rating: 0,
            posts: 0,
          );
          _updateControllers();
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to delete profile');
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context as BuildContext).showSnackBar(
        SnackBar(content: Text('Error deleting profile: $e')),
      );
    }
  }

  void _toggleEditMode() {
    if (_isEditing) {
      _saveProfile();
    } else {
      setState(() {
        _isEditing = true;
      });
    }
  }

  void _showDeleteConfirmation() {
    showDialog(
      context: context as BuildContext,
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
            hintText: 'Enter your email address',
          ),
          // Make email field editable by removing the "enabled: false" property
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
        TextField(
          controller: _bioController,
          decoration: const InputDecoration(
            labelText: 'Bio',
            prefixIcon: Icon(Icons.description),
            border: OutlineInputBorder(),
          ),
          maxLines: 3,
        ),
        const SizedBox(height: 12),
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

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

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

                          // Profile image
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
                                          : userData.profileImageUrl != null
                                              ? DecorationImage(
                                                  image: NetworkImage(userData
                                                      .profileImageUrl!),
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

                    // Delete button only when in edit mode
                    if (_isEditing) ...[
                      const SizedBox(height: 24),
                      Center(
                        child: TextButton.icon(
                          onPressed: _showDeleteConfirmation,
                          icon: const Icon(Icons.delete, color: Colors.red),
                          label: const Text('Delete Profile',
                              style: TextStyle(color: Colors.red)),
                        ),
                      ),
                    ],
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
}
