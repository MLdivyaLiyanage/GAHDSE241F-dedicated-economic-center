import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';
import 'dart:async';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final isDarkMode = prefs.getBool('isDarkMode') ?? true;
  runApp(FarmerCommunicationApp(isDarkMode: isDarkMode));
}

class FarmerCommunicationApp extends StatelessWidget {
  final bool isDarkMode;

  const FarmerCommunicationApp({super.key, required this.isDarkMode});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FarmLink Pro',
      theme: isDarkMode ? _buildDarkTheme() : _buildLightTheme(),
      home: ChatsListScreen(isDarkMode: isDarkMode),
      debugShowCheckedModeBanner: false,
    );
  }

  ThemeData _buildDarkTheme() {
    return ThemeData(
      primarySwatch: Colors.green,
      scaffoldBackgroundColor: const Color(0xFF0A0A0A),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF1A1A1A),
        foregroundColor: Colors.white,
        elevation: 0,
        systemOverlayStyle: SystemUiOverlayStyle.light,
      ),
      cardTheme: CardThemeData(
        color: const Color(0xFF1A1A1A),
        elevation: 8,
        shadowColor: Colors.black26,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      iconTheme: const IconThemeData(color: Colors.white),
      textTheme: const TextTheme(
        bodyLarge: TextStyle(color: Colors.white),
        bodyMedium: TextStyle(color: Colors.white),
      ),
    );
  }

  ThemeData _buildLightTheme() {
    return ThemeData(
      primarySwatch: Colors.green,
      scaffoldBackgroundColor: const Color(0xFFF5F5F5),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        systemOverlayStyle: SystemUiOverlayStyle.dark,
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 2,
        shadowColor: Colors.black12,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      iconTheme: const IconThemeData(color: Colors.black),
      textTheme: const TextTheme(
        bodyLarge: TextStyle(color: Colors.black),
        bodyMedium: TextStyle(color: Colors.black),
      ),
    );
  }
}

class User {
  final String id;
  final String name;
  final String avatar;
  final String location;
  final String profession;
  final String lastMessage;
  final String lastMessageTime;
  final bool isOnline;
  final bool isEncrypted;
  final int unreadCount;
  final bool isChatbot;

  User({
    required this.id,
    required this.name,
    required this.avatar,
    required this.location,
    required this.profession,
    required this.lastMessage,
    required this.lastMessageTime,
    this.isOnline = false,
    this.isEncrypted = true,
    this.unreadCount = 0,
    this.isChatbot = false,
  });
}

class Message {
  final String id;
  final String senderId;
  final String content;
  final DateTime timestamp;
  final MessageType type;
  final String? filePath;
  final String? fileName;
  final bool isRead;
  final MessageStatus status;
  final bool isFromChatbot;

  Message({
    required this.id,
    required this.senderId,
    required this.content,
    required this.timestamp,
    required this.type,
    this.filePath,
    this.fileName,
    this.isRead = false,
    this.status = MessageStatus.sent,
    this.isFromChatbot = false,
  });

  Message copyWith({MessageStatus? status}) {
    return Message(
      id: id,
      senderId: senderId,
      content: content,
      timestamp: timestamp,
      type: type,
      filePath: filePath,
      fileName: fileName,
      isRead: isRead,
      status: status ?? this.status,
      isFromChatbot: isFromChatbot,
    );
  }
}

enum MessageType { text, image, document, audio }

enum MessageStatus { sending, sent, delivered, read }

class FarmingChatbot {
  static const List<String> cropKeywords = [
    'rice',
    'wheat',
    'corn',
    'maize',
    'vegetables',
    'tomato',
    'potato',
    'onion',
    'carrot',
    'cabbage',
    'coconut',
    'tea',
    'coffee',
    'sugarcane'
  ];

  static const List<String> farmingKeywords = [
    'fertilizer',
    'pesticide',
    'irrigation',
    'harvest',
    'planting',
    'seed',
    'soil',
    'weather',
    'rain',
    'drought',
    'disease',
    'pest',
    'organic'
  ];

  static const Map<String, List<String>> responses = {
    'greeting': [
      'Hello! I\'m FarmBot, your agricultural assistant. How can I help you today?',
      'Hi there! I\'m here to help with farming questions. What would you like to know?',
      'Welcome! I can assist with crop advice, weather info, and farming techniques.',
    ],
    'crop_advice': [
      'For healthy crops, ensure proper soil pH (6.0-7.0), adequate water, and regular monitoring for pests.',
      'Consider crop rotation to maintain soil fertility and reduce disease risk.',
      'Use organic fertilizers like compost to improve soil health naturally.',
    ],
    'weather': [
      'Check local weather forecasts before planting. Avoid planting before heavy rains.',
      'Monitor temperature and humidity levels for optimal crop growth.',
      'Consider drought-resistant varieties if water is scarce in your area.',
    ],
    'pest_control': [
      'Use integrated pest management: combine biological, cultural, and chemical methods.',
      'Regular field inspection helps early detection of pest problems.',
      'Neem oil and beneficial insects are effective organic pest control methods.',
    ],
    'fertilizer': [
      'Test your soil before applying fertilizers to determine nutrient needs.',
      'Use NPK fertilizers based on crop requirements and growth stage.',
      'Organic matter like compost improves soil structure and fertility.',
    ],
    'harvest': [
      'Harvest crops at the right maturity stage for best quality and yield.',
      'Early morning is often the best time for harvesting to avoid heat stress.',
      'Proper post-harvest handling reduces losses and maintains quality.',
    ],
    'irrigation': [
      'Drip irrigation saves water and delivers nutrients directly to roots.',
      'Water deeply but less frequently to encourage deep root growth.',
      'Monitor soil moisture levels to avoid over or under-watering.',
    ],
    'market': [
      'Research local market prices before selling your produce.',
      'Consider direct-to-consumer sales for better profit margins.',
      'Group selling with other farmers can help negotiate better prices.',
    ],
    'guide': [
      'Welcome to FarmLink Pro! Here are some tips to get started:\n\n'
          '1. Chat with farmers or our AI assistant for farming advice\n'
          '2. Share photos of your crops for diagnosis\n'
          '3. Get weather updates and market prices\n'
          '4. Join farming communities to connect with others\n'
          '5. Use the marketplace to buy/sell produce',
      'FarmLink Pro User Guide:\n\n'
          '- Tap the "+" button to start new chats\n'
          '- Long press messages to save important info\n'
          '- Use the search feature to find past conversations\n'
          '- Customize your profile in settings\n'
          '- Switch between light/dark mode in settings',
    ],
    'default': [
      'That\'s an interesting question! Can you provide more details about your farming situation?',
      'I\'d be happy to help! Could you tell me more about your specific crop or farming challenge?',
      'For the best advice, please share more details about your location and crop type.',
    ]
  };

  static String generateResponse(String userMessage) {
    final message = userMessage.toLowerCase();

    // Greeting detection
    if (_containsAny(
        message, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
      return _getRandomResponse('greeting');
    }

    // Guide detection
    if (_containsAny(message, ['guide', 'help', 'tutorial', 'how to use'])) {
      return _getRandomResponse('guide');
    }

    // Crop-specific advice
    if (_containsAny(message, cropKeywords)) {
      return _getRandomResponse('crop_advice');
    }

    // Weather-related
    if (_containsAny(message, ['weather', 'rain', 'drought', 'temperature'])) {
      return _getRandomResponse('weather');
    }

    // Pest control
    if (_containsAny(message, ['pest', 'insect', 'disease', 'bug', 'worm'])) {
      return _getRandomResponse('pest_control');
    }

    // Fertilizer advice
    if (_containsAny(message, ['fertilizer', 'nutrient', 'soil', 'npk'])) {
      return _getRandomResponse('fertilizer');
    }

    // Harvest advice
    if (_containsAny(message, ['harvest', 'harvest time', 'when to harvest'])) {
      return _getRandomResponse('harvest');
    }

    // Irrigation
    if (_containsAny(message, ['irrigation', 'water', 'watering', 'drip'])) {
      return _getRandomResponse('irrigation');
    }

    // Market advice
    if (_containsAny(message, ['market', 'price', 'sell', 'selling'])) {
      return _getRandomResponse('market');
    }

    // Default response
    return _getRandomResponse('default');
  }

  static bool _containsAny(String text, List<String> keywords) {
    return keywords.any((keyword) => text.contains(keyword));
  }

  static String _getRandomResponse(String category) {
    final responseList = responses[category] ?? responses['default']!;
    final random = Random();
    return responseList[random.nextInt(responseList.length)];
  }

  static List<String> getSuggestions() {
    return [
      'How to improve soil health?',
      'Best time to plant rice?',
      'Organic pest control methods',
      'Weather forecast for farming',
      'Fertilizer recommendations',
      'Harvest timing advice',
      'Market price updates',
      'Irrigation techniques',
      'How to use this app?',
      'Show me the user guide',
    ];
  }
}

class ChatsListScreen extends StatefulWidget {
  final bool isDarkMode;

  const ChatsListScreen({super.key, required this.isDarkMode});

  @override
  // ignore: library_private_types_in_public_api
  _ChatsListScreenState createState() => _ChatsListScreenState();
}

class _ChatsListScreenState extends State<ChatsListScreen>
    with TickerProviderStateMixin {
  List<User> farmers = [
    User(
      id: 'chatbot',
      name: 'FarmBot AI Assistant',
      avatar: 'assets/chatbot.jpg',
      location: 'AI Assistant',
      profession: 'Agricultural Advisor',
      lastMessage: 'Ask me anything about farming!',
      lastMessageTime: 'Online',
      isOnline: true,
      unreadCount: 0,
      isChatbot: true,
    ),
    User(
      id: '1',
      name: 'Kamal Perera',
      avatar: 'assets/farmer1.jpg',
      location: 'Kandy, Sri Lanka',
      profession: 'Rice Farmer',
      lastMessage: 'The harvest is ready for collection 🌾',
      lastMessageTime: '2 min',
      isOnline: true,
      unreadCount: 3,
    ),
    User(
      id: '2',
      name: 'Nimal Silva',
      avatar: 'assets/farmer2.jpg',
      location: 'Galle, Sri Lanka',
      profession: 'Vegetable Farmer',
      lastMessage: 'Fresh vegetables available today 🥬',
      lastMessageTime: '15 min',
      isOnline: false,
      unreadCount: 1,
    ),
    User(
      id: '3',
      name: 'Chamara Fernando',
      avatar: 'assets/farmer3.jpg',
      location: 'Matara, Sri Lanka',
      profession: 'Coconut Farmer',
      lastMessage: 'Coconut oil production update 🥥',
      lastMessageTime: '1 hour',
      isOnline: true,
      unreadCount: 0,
    ),
    User(
      id: '4',
      name: 'Saman Rajapaksa',
      avatar: 'assets/farmer4.jpg',
      location: 'Kurunegala, Sri Lanka',
      profession: 'Tea Farmer',
      lastMessage: 'Premium tea leaves ready ☕',
      lastMessageTime: '2 hours',
      isOnline: false,
      unreadCount: 5,
    ),
  ];

  List<User> filteredFarmers = [];
  TextEditingController searchController = TextEditingController();
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  int selectedTabIndex = 0;

  @override
  void initState() {
    super.initState();
    filteredFarmers = farmers;
    searchController.addListener(_filterFarmers);

    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    _animationController.forward();
  }

  void _filterFarmers() {
    setState(() {
      filteredFarmers = farmers
          .where((farmer) =>
              farmer.name
                  .toLowerCase()
                  .contains(searchController.text.toLowerCase()) ||
              farmer.profession
                  .toLowerCase()
                  .contains(searchController.text.toLowerCase()))
          .toList();
    });
  }

  Future<void> _toggleTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final newDarkMode = !widget.isDarkMode;
    await prefs.setBool('isDarkMode', newDarkMode);

    // Restart the app with new theme
    // ignore: use_build_context_synchronously
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => FarmerCommunicationApp(isDarkMode: newDarkMode),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 120,
              floating: false,
              pinned: true,
              backgroundColor: theme.appBarTheme.backgroundColor,
              flexibleSpace: FlexibleSpaceBar(
                title: const Text(
                  'FarmLink Pro',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                background: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: widget.isDarkMode
                          ? [const Color(0xFF1A1A1A), const Color(0xFF2A2A2A)]
                          : [Colors.green.shade200, Colors.green.shade50],
                    ),
                  ),
                ),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.more_vert),
                  onPressed: () => _showMoreOptions(),
                ),
              ],
            ),
            SliverToBoxAdapter(
              child: Column(
                children: [
                  // Search Bar
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Container(
                      decoration: BoxDecoration(
                        color: widget.isDarkMode
                            ? const Color(0xFF2A2A2A)
                            : Colors.grey[200],
                        borderRadius: BorderRadius.circular(25),
                        boxShadow: const [
                          BoxShadow(
                            color: Colors.black26,
                            blurRadius: 8,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                      child: TextField(
                        controller: searchController,
                        style:
                            TextStyle(color: theme.textTheme.bodyLarge?.color),
                        decoration: const InputDecoration(
                          hintText: 'Search farmers, crops, or locations...',
                          hintStyle: TextStyle(color: Colors.grey),
                          prefixIcon: Icon(Icons.search, color: Colors.green),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 20, vertical: 15),
                        ),
                      ),
                    ),
                  ),

                  // Online Farmers Section
                  if (farmers.where((f) => f.isOnline).isNotEmpty)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            'Active Now',
                            style: TextStyle(
                              color: theme.textTheme.bodyLarge?.color,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          height: 100,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: farmers.where((f) => f.isOnline).length,
                            itemBuilder: (context, index) {
                              final onlineFarmers =
                                  farmers.where((f) => f.isOnline).toList();
                              final farmer = onlineFarmers[index];
                              return Padding(
                                padding: const EdgeInsets.only(right: 16),
                                child: GestureDetector(
                                  onTap: () => _openFarmerProfile(farmer),
                                  child: Column(
                                    children: [
                                      Stack(
                                        children: [
                                          Container(
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              gradient: LinearGradient(
                                                colors: farmer.isChatbot
                                                    ? [
                                                        Colors.blue,
                                                        Colors.lightBlue
                                                      ]
                                                    : [
                                                        Colors.green,
                                                        Colors.lightGreen
                                                      ],
                                              ),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: (farmer.isChatbot
                                                          ? Colors.blue
                                                          : Colors.green)
                                                      // ignore: deprecated_member_use
                                                      .withOpacity(0.3),
                                                  blurRadius: 12,
                                                  spreadRadius: 2,
                                                ),
                                              ],
                                            ),
                                            child: CircleAvatar(
                                              radius: 30,
                                              backgroundColor:
                                                  Colors.transparent,
                                              child: farmer.isChatbot
                                                  ? const Icon(
                                                      Icons.smart_toy,
                                                      color: Colors.white,
                                                      size: 24,
                                                    )
                                                  : Text(
                                                      farmer.name
                                                          .split(' ')
                                                          .map((n) => n[0])
                                                          .join(),
                                                      style: const TextStyle(
                                                          color: Colors.white,
                                                          fontWeight:
                                                              FontWeight.bold,
                                                          fontSize: 16),
                                                    ),
                                            ),
                                          ),
                                          Positioned(
                                            bottom: 2,
                                            right: 2,
                                            child: Container(
                                              width: 16,
                                              height: 16,
                                              decoration: BoxDecoration(
                                                color: Colors.lightGreen,
                                                shape: BoxShape.circle,
                                                border: Border.all(
                                                    color: widget.isDarkMode
                                                        ? const Color(
                                                            0xFF0A0A0A)
                                                        : Colors.white,
                                                    width: 2),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        farmer.isChatbot
                                            ? 'AI Bot'
                                            : farmer.name.split(' ')[0],
                                        style: TextStyle(
                                            color: theme
                                                .textTheme.bodyLarge?.color,
                                            fontSize: 12,
                                            fontWeight: FontWeight.w500),
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

                  // Tab Bar
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 20),
                    child: Row(
                      children: [
                        _buildTab('Chats', 0),
                        _buildTab('Communities', 1),
                        _buildTab('Marketplace', 2),
                        _buildTab('Updates', 3),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Chat List
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final farmer = filteredFarmers[index];
                  return _buildChatItem(farmer, index);
                },
                childCount: filteredFarmers.length,
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showNewChatOptions(),
        backgroundColor: Colors.green,
        child: const Icon(Icons.add_comment, color: Colors.white),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    final isActive = selectedTabIndex == index;
    final theme = Theme.of(context);

    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => selectedTabIndex = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.only(right: 8),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: isActive
                ? const LinearGradient(
                    colors: [Colors.green, Colors.lightGreen])
                : null,
            color: isActive ? null : Colors.transparent,
            borderRadius: BorderRadius.circular(25),
            border: Border.all(
              color:
                  // ignore: deprecated_member_use
                  isActive ? Colors.transparent : Colors.grey.withOpacity(0.3),
            ),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isActive ? Colors.white : theme.textTheme.bodyLarge?.color,
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildChatItem(User farmer, int index) {
    final theme = Theme.of(context);

    return AnimatedContainer(
      duration: Duration(milliseconds: 300 + (index * 100)),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: widget.isDarkMode ? const Color(0xFF1A1A1A) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: farmer.isChatbot
            // ignore: deprecated_member_use
            ? Border.all(color: Colors.blue.withOpacity(0.3), width: 1)
            : null,
        boxShadow: [
          BoxShadow(
            color: farmer.isChatbot
                ? Colors.blue.withOpacity(0.1)
                : Colors.black12,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: farmer.isChatbot
                      ? [Colors.blue, Colors.lightBlue]
                      : [Colors.green, Colors.lightGreen],
                ),
              ),
              child: CircleAvatar(
                radius: 28,
                backgroundColor: Colors.transparent,
                child: farmer.isChatbot
                    ? const Icon(
                        Icons.smart_toy,
                        color: Colors.white,
                        size: 20,
                      )
                    : Text(
                        farmer.name.split(' ').map((n) => n[0]).join(),
                        style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16),
                      ),
              ),
            ),
            if (farmer.isOnline)
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    color: Colors.lightGreen,
                    shape: BoxShape.circle,
                    border: Border.all(
                        color: widget.isDarkMode
                            ? const Color(0xFF1A1A1A)
                            : Colors.white,
                        width: 2),
                  ),
                ),
              ),
          ],
        ),
        title: Row(
          children: [
            Expanded(
              child: Row(
                children: [
                  if (farmer.isChatbot)
                    const Icon(
                      Icons.psychology,
                      color: Colors.blue,
                      size: 16,
                    ),
                  if (farmer.isChatbot) const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      farmer.name,
                      style: TextStyle(
                          color: theme.textTheme.bodyLarge?.color,
                          fontWeight: FontWeight.bold,
                          fontSize: 16),
                    ),
                  ),
                ],
              ),
            ),
            if (farmer.unreadCount > 0)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: farmer.isChatbot ? Colors.blue : Colors.green,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  farmer.unreadCount.toString(),
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold),
                ),
              ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              farmer.lastMessage,
              style: const TextStyle(color: Colors.grey, fontSize: 14),
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(
                  farmer.isChatbot ? Icons.smart_toy : Icons.location_on,
                  color: Colors.grey,
                  size: 12,
                ),
                const SizedBox(width: 4),
                Text(
                  farmer.location,
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
              ],
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              farmer.lastMessageTime,
              style: const TextStyle(color: Colors.grey, fontSize: 12),
            ),
            const SizedBox(height: 4),
            if (farmer.isEncrypted)
              const Icon(Icons.lock, color: Colors.grey, size: 16),
          ],
        ),
        onTap: () => _openChat(farmer),
      ),
    );
  }

  void _openChat(User farmer) {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) =>
            ChatScreen(farmer: farmer, isDarkMode: widget.isDarkMode),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return SlideTransition(
            position: animation.drive(
              Tween(begin: const Offset(1.0, 0.0), end: Offset.zero),
            ),
            child: child,
          );
        },
      ),
    );
  }

  void _openFarmerProfile(User farmer) {
    if (farmer.isChatbot) {
      _openChat(farmer);
      return;
    }

    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) =>
            FarmerProfileScreen(farmer: farmer, isDarkMode: widget.isDarkMode),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    );
  }

  void _showMoreOptions() {
    final theme = Theme.of(context);

    showModalBottomSheet(
      context: context,
      backgroundColor: theme.cardTheme.color,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Icon(Icons.settings, color: theme.iconTheme.color),
              title: Text('Settings',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () {
                Navigator.pop(context);
                _showSettings();
              },
            ),
            ListTile(
              leading: Icon(Icons.help, color: theme.iconTheme.color),
              title: Text('Help & Guide',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () {
                Navigator.pop(context);
                _showUserGuide();
              },
            ),
            ListTile(
              leading: Icon(Icons.info, color: theme.iconTheme.color),
              title: Text('About',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: Icon(Icons.light_mode, color: theme.iconTheme.color),
              title: Text(
                widget.isDarkMode
                    ? 'Switch to Light Mode'
                    : 'Switch to Dark Mode',
                style: TextStyle(color: theme.textTheme.bodyLarge?.color),
              ),
              onTap: () {
                Navigator.pop(context);
                _toggleTheme();
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showSettings() {
    final theme = Theme.of(context);

    showModalBottomSheet(
      context: context,
      backgroundColor: theme.cardTheme.color,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Icon(Icons.notifications, color: theme.iconTheme.color),
              title: Text('Notifications',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              trailing: Switch(value: true, onChanged: (val) {}),
            ),
            ListTile(
              leading: Icon(Icons.lock, color: theme.iconTheme.color),
              title: Text('Privacy',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.language, color: theme.iconTheme.color),
              title: Text('Language',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              trailing:
                  const Text('English', style: TextStyle(color: Colors.grey)),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.light_mode, color: theme.iconTheme.color),
              title: Text(
                widget.isDarkMode ? 'Light Mode' : 'Dark Mode',
                style: TextStyle(color: theme.textTheme.bodyLarge?.color),
              ),
              trailing: Switch(
                value: widget.isDarkMode,
                onChanged: (val) => _toggleTheme(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showUserGuide() {
    final theme = Theme.of(context);

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(
            title: const Text('User Guide'),
            backgroundColor: theme.appBarTheme.backgroundColor,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome to FarmLink Pro!',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: theme.textTheme.bodyLarge?.color,
                  ),
                ),
                const SizedBox(height: 20),
                _buildGuideSection(
                  'Getting Started',
                  '1. Sign up or log in to your account\n'
                      '2. Complete your farmer profile\n'
                      '3. Connect with other farmers or the AI assistant\n'
                      '4. Explore the marketplace and communities',
                ),
                _buildGuideSection(
                  'Chat Features',
                  '- Send text, images, and documents\n'
                      '- Get farming advice from the AI assistant\n'
                      '- Save important messages for later\n'
                      '- Search your conversation history',
                ),
                _buildGuideSection(
                  'Marketplace',
                  '- List your produce for sale\n'
                      '- Browse products from other farmers\n'
                      '- Negotiate prices securely\n'
                      '- Arrange delivery or pickup',
                ),
                _buildGuideSection(
                  'AI Assistant',
                  'Our AI assistant can help with:\n'
                      '- Crop advice and best practices\n'
                      '- Pest and disease identification\n'
                      '- Weather and irrigation tips\n'
                      '- Market price trends\n'
                      '- General farming questions',
                ),
                const SizedBox(height: 20),
                Center(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      _openChat(farmers.first); // Open chatbot
                    },
                    icon: const Icon(Icons.smart_toy),
                    label: const Text('Try AI Assistant Now'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGuideSection(String title, String content) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: theme.textTheme.bodyLarge?.color,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: TextStyle(
              fontSize: 16,
              color: theme.textTheme.bodyLarge?.color,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  void _showNewChatOptions() {
    final theme = Theme.of(context);

    showModalBottomSheet(
      context: context,
      backgroundColor: theme.cardTheme.color,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.smart_toy, color: Colors.blue),
              title: Text('Chat with AI Assistant',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () {
                Navigator.pop(context);
                _openChat(farmers.first);
              },
            ),
            ListTile(
              leading: const Icon(Icons.person_add, color: Colors.green),
              title: Text('Add Farmer',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.group_add, color: Colors.green),
              title: Text('Create Group',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.store, color: Colors.green),
              title: Text('Browse Marketplace',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    searchController.dispose();
    _animationController.dispose();
    super.dispose();
  }
}

class FarmerProfileScreen extends StatelessWidget {
  final User farmer;
  final bool isDarkMode;

  const FarmerProfileScreen({
    Key? key,
    required this.farmer,
    required this.isDarkMode,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: theme.appBarTheme.backgroundColor,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: isDarkMode
                        ? [
                            Colors.green.withOpacity(0.8),
                            const Color(0xFF1A1A1A)
                          ]
                        : [Colors.green.shade200, Colors.white],
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 60),
                    Hero(
                      tag: farmer.id,
                      child: CircleAvatar(
                        radius: 60,
                        backgroundColor:
                            isDarkMode ? Colors.black : Colors.white,
                        child: CircleAvatar(
                          radius: 55,
                          backgroundColor: Colors.green,
                          child: Text(
                            farmer.name.split(' ').map((n) => n[0]).join(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      farmer.name,
                      style: TextStyle(
                        color: isDarkMode ? Colors.white : Colors.black,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      farmer.profession,
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildInfoCard(
                      context, 'Location', farmer.location, Icons.location_on),
                  _buildInfoCard(
                      context,
                      'Status',
                      farmer.isOnline ? 'Online' : 'Offline',
                      farmer.isOnline ? Icons.circle : Icons.circle_outlined),
                  _buildInfoCard(context, 'Last Seen', farmer.lastMessageTime,
                      Icons.access_time),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () => _startChat(context),
                          icon: const Icon(Icons.chat),
                          label: const Text('Message'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 15),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.phone),
                          label: const Text('Call'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 15),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(
      BuildContext context, String title, String value, IconData icon) {
    Theme.of(context);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, color: Colors.green),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(value),
      ),
    );
  }

  void _startChat(BuildContext context) {
    Navigator.pop(context);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) =>
            ChatScreen(farmer: farmer, isDarkMode: isDarkMode),
      ),
    );
  }
}

class ChatScreen extends StatefulWidget {
  final User farmer;
  final bool isDarkMode;

  const ChatScreen({Key? key, required this.farmer, required this.isDarkMode})
      : super(key: key);

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> with TickerProviderStateMixin {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  List<Message> messages = [];
  late AnimationController _animationController;
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    _initializeMessages();

    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
  }

  void _initializeMessages() {
    if (widget.farmer.isChatbot) {
      messages = [
        Message(
          id: '1',
          senderId: 'chatbot',
          content:
              'Hello! I\'m FarmBot, your AI farming assistant. How can I help you today?',
          timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
          type: MessageType.text,
          isFromChatbot: true,
        ),
        Message(
          id: '2',
          senderId: 'chatbot',
          content:
              'You can ask me about crops, weather, pest control, fertilizers, or any farming questions!',
          timestamp: DateTime.now().subtract(const Duration(minutes: 4)),
          type: MessageType.text,
          isFromChatbot: true,
        ),
      ];
    } else {
      messages = [
        Message(
          id: '1',
          senderId: widget.farmer.id,
          content: widget.farmer.lastMessage,
          timestamp: DateTime.now().subtract(const Duration(minutes: 10)),
          type: MessageType.text,
        ),
      ];
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundColor:
                  widget.farmer.isChatbot ? Colors.blue : Colors.green,
              child: widget.farmer.isChatbot
                  ? const Icon(Icons.smart_toy, color: Colors.white, size: 16)
                  : Text(
                      widget.farmer.name.split(' ').map((n) => n[0]).join(),
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                    ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.farmer.name,
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    widget.farmer.isOnline
                        ? 'Online'
                        : 'Last seen ${widget.farmer.lastMessageTime}',
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          if (!widget.farmer.isChatbot) ...[
            IconButton(icon: const Icon(Icons.phone), onPressed: () {}),
            IconButton(icon: const Icon(Icons.videocam), onPressed: () {}),
          ],
          IconButton(
              icon: const Icon(Icons.more_vert), onPressed: _showChatOptions),
        ],
      ),
      body: Column(
        children: [
          // Quick suggestions for chatbot
          if (widget.farmer.isChatbot && messages.length <= 2)
            Container(
              height: 120,
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Quick Questions:',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: theme.textTheme.bodyLarge?.color,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Expanded(
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: FarmingChatbot.getSuggestions().length,
                      itemBuilder: (context, index) {
                        final suggestion =
                            FarmingChatbot.getSuggestions()[index];
                        return Container(
                          margin: const EdgeInsets.only(right: 8),
                          child: ActionChip(
                            label: Text(
                              suggestion,
                              style: const TextStyle(fontSize: 12),
                            ),
                            onPressed: () => _sendMessage(suggestion),
                            backgroundColor: Colors.green.withOpacity(0.1),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

          // Messages list
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: messages.length + (_isTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == messages.length && _isTyping) {
                  return _buildTypingIndicator();
                }
                return _buildMessageBubble(messages[index]);
              },
            ),
          ),

          // Message input
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message message) {
    final isMe = message.senderId != widget.farmer.id;
    final theme = Theme.of(context);

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        constraints:
            BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        decoration: BoxDecoration(
          color: isMe
              ? Colors.green
              : (widget.isDarkMode
                  ? const Color(0xFF2A2A2A)
                  : Colors.grey[200]),
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (message.type == MessageType.image)
              Container(
                height: 200,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.grey[300],
                ),
                child: const Center(
                  child: Icon(Icons.image, size: 50, color: Colors.grey),
                ),
              )
            else if (message.type == MessageType.document)
              Row(
                children: [
                  Icon(Icons.description,
                      color: isMe ? Colors.white : Colors.grey),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      message.fileName ?? 'Document',
                      style: TextStyle(
                        color: isMe
                            ? Colors.white
                            : theme.textTheme.bodyLarge?.color,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              )
            else
              Text(
                message.content,
                style: TextStyle(
                  color: isMe ? Colors.white : theme.textTheme.bodyLarge?.color,
                  fontSize: 16,
                ),
              ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  _formatTime(message.timestamp),
                  style: TextStyle(
                    color: isMe ? Colors.white70 : Colors.grey,
                    fontSize: 12,
                  ),
                ),
                if (isMe) ...[
                  const SizedBox(width: 4),
                  Icon(
                    message.status == MessageStatus.read
                        ? Icons.done_all
                        : Icons.done,
                    color: message.status == MessageStatus.read
                        ? Colors.blue
                        : Colors.white70,
                    size: 16,
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: widget.isDarkMode ? const Color(0xFF2A2A2A) : Colors.grey[200],
          borderRadius: BorderRadius.circular(18),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildDot(0),
            const SizedBox(width: 4),
            _buildDot(1),
            const SizedBox(width: 4),
            _buildDot(2),
          ],
        ),
      ),
    );
  }

  Widget _buildDot(int index) {
    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return Transform.scale(
          scale: 1.0 +
              (0.3 *
                  (0.5 +
                      0.5 *
                          sin((_animationController.value * 2 * pi) +
                              (index * pi / 3)))),
          child: Container(
            width: 8,
            height: 8,
            decoration: const BoxDecoration(
              color: Colors.grey,
              shape: BoxShape.circle,
            ),
          ),
        );
      },
    );
  }

  Widget _buildMessageInput() {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        border: Border(
          top: BorderSide(color: Colors.grey.withOpacity(0.3)),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: widget.isDarkMode
                    ? const Color(0xFF2A2A2A)
                    : Colors.grey[200],
                borderRadius: BorderRadius.circular(25),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      style: TextStyle(color: theme.textTheme.bodyLarge?.color),
                      decoration: const InputDecoration(
                        hintText: 'Type your message...',
                        hintStyle: TextStyle(color: Colors.grey),
                        border: InputBorder.none,
                        contentPadding:
                            EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                      ),
                      onSubmitted: _sendMessage,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.attach_file, color: Colors.grey),
                    onPressed: _showAttachmentOptions,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
          FloatingActionButton(
            mini: true,
            backgroundColor: Colors.green,
            onPressed: () => _sendMessage(_messageController.text),
            child: const Icon(Icons.send, color: Colors.white),
          ),
        ],
      ),
    );
  }

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;

    final message = Message(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      senderId: 'me',
      content: text,
      timestamp: DateTime.now(),
      type: MessageType.text,
      status: MessageStatus.sending,
    );

    setState(() {
      messages.add(message);
      _messageController.clear();
    });

    _scrollToBottom();

    // Simulate message status updates
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) {
        setState(() {
          final index = messages.indexOf(message);
          if (index != -1) {
            messages[index] = message.copyWith(status: MessageStatus.sent);
          }
        });
      }
    });

    // Handle chatbot response
    if (widget.farmer.isChatbot) {
      setState(() {
        _isTyping = true;
      });

      _animationController.repeat();

      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          final response = FarmingChatbot.generateResponse(text);

          setState(() {
            _isTyping = false;
            messages.add(Message(
              id: DateTime.now().millisecondsSinceEpoch.toString(),
              senderId: 'chatbot',
              content: response,
              timestamp: DateTime.now(),
              type: MessageType.text,
              isFromChatbot: true,
            ));
          });

          _animationController.stop();
          _scrollToBottom();
        }
      });
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _showAttachmentOptions() {
    final theme = Theme.of(context);

    showModalBottomSheet(
      context: context,
      backgroundColor: theme.cardTheme.color,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt, color: Colors.green),
              title: Text('Camera',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () => _pickImage(ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo, color: Colors.green),
              title: Text('Gallery',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () => _pickImage(ImageSource.gallery),
            ),
            ListTile(
              leading: const Icon(Icons.description, color: Colors.green),
              title: Text('Document',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: _pickDocument,
            ),
          ],
        ),
      ),
    );
  }

  void _pickImage(ImageSource source) async {
    Navigator.pop(context);
    // Simulate image picking
    final message = Message(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      senderId: 'me',
      content: 'Image shared',
      timestamp: DateTime.now(),
      type: MessageType.image,
      status: MessageStatus.sending,
    );

    setState(() {
      messages.add(message);
    });
    _scrollToBottom();
  }

  void _pickDocument() async {
    Navigator.pop(context);
    // Simulate document picking
    final message = Message(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      senderId: 'me',
      content: 'Document shared',
      timestamp: DateTime.now(),
      type: MessageType.document,
      fileName: 'farming_report.pdf',
      status: MessageStatus.sending,
    );

    setState(() {
      messages.add(message);
    });
    _scrollToBottom();
  }

  void _showChatOptions() {
    final theme = Theme.of(context);

    showModalBottomSheet(
      context: context,
      backgroundColor: theme.cardTheme.color,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (!widget.farmer.isChatbot) ...[
              ListTile(
                leading: Icon(Icons.person, color: theme.iconTheme.color),
                title: Text('View Profile',
                    style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => FarmerProfileScreen(
                        farmer: widget.farmer,
                        isDarkMode: widget.isDarkMode,
                      ),
                    ),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.block, color: Colors.red),
                title: const Text('Block User',
                    style: TextStyle(color: Colors.red)),
                onTap: () => Navigator.pop(context),
              ),
            ],
            ListTile(
              leading: Icon(Icons.search, color: theme.iconTheme.color),
              title: Text('Search Messages',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: Icon(Icons.clear_all, color: theme.iconTheme.color),
              title: Text('Clear Chat',
                  style: TextStyle(color: theme.textTheme.bodyLarge?.color)),
              onTap: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final difference = now.difference(time);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _animationController.dispose();
    super.dispose();
  }
}
