// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:async';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FarmerMessengerApp());
}

class FarmerMessengerApp extends StatelessWidget {
  const FarmerMessengerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Farmer Connect',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.green,
          brightness: Brightness.light,
        ),
        fontFamily: 'Poppins',
      ),
      home: const FarmerMessagesPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class FarmerMessagesPage extends StatefulWidget {
  const FarmerMessagesPage({super.key});

  @override
  State<FarmerMessagesPage> createState() => _FarmerMessagesPageState();
}

class _FarmerMessagesPageState extends State<FarmerMessagesPage> {
  final List<Farmer> farmers = [
    Farmer(
        'John Doe',
        'Organic Vegetables',
        'Hey, about that tomato order...',
        '9:30 AM',
        false,
        '+94771234567',
        'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb'),
    Farmer(
        'Jane Smith',
        'Dairy Farm',
        'The milk prices have changed',
        'Yesterday',
        true,
        '+94777654321',
        'https://images.unsplash.com/photo-1560343787-b90cb337028e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb'),
    Farmer(
        'Robert Brown',
        'Rice Fields',
        'Sent you the contract',
        'Monday',
        false,
        '+94771122334',
        'https://images.unsplash.com/photo-1574943320219-855150095876?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb'),
    Farmer(
        'Alice Green',
        'Fruit Orchard',
        'Check the mango photos',
        '1/15/23',
        true,
        '+94778877665',
        'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb'),
  ];

  // ignore: unused_field
  final ImagePicker _picker = ImagePicker();

  void _showFarmerProfile(BuildContext context, Farmer farmer) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: LinearGradient(
              colors: [Colors.green.shade50, Colors.green.shade100],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircleAvatar(
                radius: 48,
                backgroundColor: _getAvatarColor(farmer.name),
                backgroundImage: farmer.avatarUrl.isNotEmpty
                    ? NetworkImage(farmer.avatarUrl) as ImageProvider
                    : null,
                child: farmer.avatarUrl.isEmpty
                    ? Text(
                        farmer.name[0].toUpperCase(),
                        style:
                            const TextStyle(fontSize: 36, color: Colors.white),
                      )
                    : null,
              ),
              const SizedBox(height: 16),
              Text(
                farmer.name,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
              ),
              Text(
                farmer.specialty,
                style: TextStyle(color: Colors.grey.shade700),
              ),
              const SizedBox(height: 6),
              Text(farmer.phone, style: const TextStyle(color: Colors.grey)),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildProfileAction(Icons.message, 'Message', () {
                    Navigator.pop(context);
                    _openChat(farmer);
                  }),
                  _buildProfileAction(Icons.call, 'Call', () {
                    Navigator.pop(context);
                    _makePhoneCall(farmer.phone);
                  }),
                  _buildProfileAction(Icons.video_call, 'Video', () {
                    Navigator.pop(context);
                    _startVideoCall(farmer.name);
                  }),
                ],
              ),
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: () => Navigator.pop(context),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.green.shade700),
                ),
                child: Text('Close',
                    style: TextStyle(color: Colors.green.shade700)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileAction(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(
            backgroundColor: Colors.green.shade200,
            child: Icon(icon, color: Colors.green.shade800),
          ),
          const SizedBox(height: 6),
          Text(label, style: TextStyle(color: Colors.green.shade800)),
        ],
      ),
    );
  }

  Color _getAvatarColor(String name) {
    final colors = [
      Colors.green,
      Colors.blue,
      Colors.orange,
      Colors.purple,
      Colors.teal,
      Colors.brown,
    ];
    return colors[name.hashCode % colors.length];
  }

  void _openChat(Farmer farmer) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ChatScreen(farmer: farmer),
      ),
    );
  }

  void _makePhoneCall(String phoneNumber) async {
    try {
      await Clipboard.setData(ClipboardData(text: phoneNumber));
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Number copied: $phoneNumber'),
          backgroundColor: Colors.green.shade700,
          action: SnackBarAction(
            label: 'Call',
            textColor: Colors.white,
            onPressed: () {
              // In a real app, you would use url_launcher to call
              // launchUrl(Uri.parse('tel:$phoneNumber'));
            },
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    }
  }

  void _startVideoCall(String farmerName) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Starting video call with $farmerName'),
        backgroundColor: Colors.green.shade700,
      ),
    );
    // In a real app, integrate with WebRTC or similar
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.green.shade50,
              Colors.white,
            ],
          ),
          image: const DecorationImage(
            image: NetworkImage(
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb'),
            opacity: 0.15,
            fit: BoxFit.cover,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              _buildAppBar(),
              const SizedBox(height: 8),
              _buildSearchBar(),
              const SizedBox(height: 8),
              Expanded(
                child: ListView.builder(
                  itemCount: farmers.length,
                  itemBuilder: (context, index) {
                    final farmer = farmers[index];
                    return _buildFarmerListTile(farmer);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.green.shade600,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 4,
        child: const Icon(Icons.message, color: Colors.white),
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Start new conversation'),
              backgroundColor: Colors.green,
            ),
          );
        },
      ),
    );
  }

  Widget _buildAppBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          const Text(
            'Farmer Connect',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.green,
            ),
          ),
          const Spacer(),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            color: Colors.green.shade700,
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Notifications')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.more_vert),
            color: Colors.green.shade700,
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('More options')),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: TextField(
          decoration: InputDecoration(
            hintText: 'Search farmers...',
            prefixIcon: Icon(Icons.search, color: Colors.green.shade300),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(vertical: 15),
          ),
        ),
      ),
    );
  }

  Widget _buildFarmerListTile(Farmer farmer) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      elevation: 0,
      color: Colors.white.withOpacity(0.8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        onTap: () => _openChat(farmer),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: GestureDetector(
          onTap: () => _showFarmerProfile(context, farmer),
          child: CircleAvatar(
            radius: 28,
            backgroundColor: _getAvatarColor(farmer.name),
            backgroundImage: farmer.avatarUrl.isNotEmpty
                ? NetworkImage(farmer.avatarUrl) as ImageProvider
                : null,
            child: farmer.avatarUrl.isEmpty
                ? Text(
                    farmer.name[0].toUpperCase(),
                    style: const TextStyle(color: Colors.white, fontSize: 18),
                  )
                : null,
          ),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                farmer.name,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            Text(
              farmer.time,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 2),
            Text(
              farmer.specialty,
              style: TextStyle(fontSize: 12, color: Colors.green.shade700),
            ),
            const SizedBox(height: 3),
            Row(
              children: [
                Expanded(
                  child: Text(
                    farmer.lastMessage,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: farmer.isRead ? Colors.grey : Colors.black87,
                      fontWeight:
                          farmer.isRead ? FontWeight.normal : FontWeight.bold,
                    ),
                  ),
                ),
                if (!farmer.isRead)
                  Container(
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
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
}

class Farmer {
  final String name;
  final String specialty;
  final String lastMessage;
  final String time;
  final bool isRead;
  final String phone;
  final String avatarUrl;

  Farmer(this.name, this.specialty, this.lastMessage, this.time, this.isRead,
      this.phone,
      [this.avatarUrl = '']);
}

class ChatScreen extends StatefulWidget {
  final Farmer farmer;

  const ChatScreen({super.key, required this.farmer});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();

    // Initial messages for demonstration
    _messages.add(ChatMessage('Hello, how are your crops doing?', false, false,
        DateTime.now().subtract(const Duration(days: 1))));
    _messages.add(ChatMessage('They are growing well! Sent you some photos',
        true, false, DateTime.now().subtract(const Duration(hours: 23))));
    _messages.add(ChatMessage(
        '',
        true,
        true,
        DateTime.now().subtract(
            const Duration(hours: 23)))); // This would be an image in real app
    _messages.add(ChatMessage('Can we meet tomorrow to discuss the contract?',
        false, false, DateTime.now().subtract(const Duration(hours: 2))));

    // Automatically scroll to bottom when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToBottom();
    });
  }

  void _scrollToBottom() {
    _scrollController.animateTo(
      0.0,
      curve: Curves.easeOut,
      duration: const Duration(milliseconds: 300),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: const NetworkImage(
              'https://images.unsplash.com/photo-1560015534-cee980ba7e13?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
            ),
            opacity: 0.15,
            colorFilter: ColorFilter.mode(
              Colors.white.withOpacity(0.9),
              BlendMode.lighten,
            ),
            fit: BoxFit.cover,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              _buildChatAppBar(),
              Expanded(
                child: _buildChatMessages(),
              ),
              if (_isTyping) _buildTypingIndicator(),
              _buildMessageInput(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChatAppBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
          CircleAvatar(
            backgroundColor: Colors.green.shade200,
            backgroundImage: widget.farmer.avatarUrl.isNotEmpty
                ? NetworkImage(widget.farmer.avatarUrl) as ImageProvider
                : null,
            child: widget.farmer.avatarUrl.isEmpty
                ? Text(widget.farmer.name[0])
                : null,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.farmer.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  widget.farmer.specialty,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.call),
            color: Colors.green,
            onPressed: () => _makePhoneCall(widget.farmer.phone),
          ),
          IconButton(
            icon: const Icon(Icons.video_call),
            color: Colors.green,
            onPressed: () => _startVideoCall(widget.farmer.name),
          ),
        ],
      ),
    );
  }

  Widget _buildChatMessages() {
    return ListView.builder(
      controller: _scrollController,
      reverse: true,
      padding: const EdgeInsets.all(16),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final message = _messages[index];
        final bool showTime = index == 0 ||
            _messages[index].timestamp.day !=
                _messages[index - 1].timestamp.day;

        return Column(
          children: [
            if (showTime) _buildDateSeparator(message.timestamp),
            _buildMessageBubble(message),
          ],
        );
      },
    );
  }

  Widget _buildDateSeparator(DateTime timestamp) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16),
      child: Center(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.green.shade50,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            _getFormattedDate(timestamp),
            style: TextStyle(
              color: Colors.green.shade700,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  String _getFormattedDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = DateTime(now.year, now.month, now.day - 1);
    final dateToCheck = DateTime(date.year, date.month, date.day);

    if (dateToCheck == today) {
      return 'Today';
    } else if (dateToCheck == yesterday) {
      return 'Yesterday';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }

  Widget _buildTypingIndicator() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      alignment: Alignment.centerLeft,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Text('${widget.farmer.name} is typing',
                    style:
                        TextStyle(color: Colors.grey.shade700, fontSize: 12)),
                const SizedBox(width: 8),
                _buildDot(1),
                _buildDot(2),
                _buildDot(3),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDot(int delay) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 1),
      child: const DecoratedBox(
        decoration: BoxDecoration(
          color: Colors.grey,
          shape: BoxShape.circle,
        ),
        child: SizedBox(
          width: 5,
          height: 5,
        ),
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage message) {
    final time = _formatTime(message.timestamp);

    return Align(
      alignment: message.isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: message.isImage
            ? const EdgeInsets.all(2)
            : const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: message.isMe ? Colors.green.shade100 : Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 2,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            message.isImage
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      width: 200,
                      height: 150,
                      color: Colors.grey.shade200,
                      child: const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.image, size: 48, color: Colors.grey),
                            SizedBox(height: 8),
                            Text('Farm Photo', style: TextStyle(fontSize: 12)),
                          ],
                        ),
                      ),
                    ),
                  )
                : Text(message.text),
            const SizedBox(height: 4),
            Text(
              time,
              style: TextStyle(
                fontSize: 10,
                color: Colors.grey.shade500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  Widget _buildMessageInput() {
    return Container(
      padding: const EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.add),
            color: Colors.green,
            onPressed: () => _showAttachmentOptions(),
          ),
          Expanded(
            child: TextField(
              controller: _messageController,
              decoration: InputDecoration(
                hintText: 'Type your message...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.grey.shade100,
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
              minLines: 1,
              maxLines: 5,
            ),
          ),
          const SizedBox(width: 8),
          Container(
            decoration: const BoxDecoration(
              color: Colors.green,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.send),
              color: Colors.white,
              onPressed: () {
                if (_messageController.text.isNotEmpty) {
                  _sendMessage(_messageController.text);
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  void _sendMessage(String text) {
    setState(() {
      // Add user message
      _messages.insert(
        0,
        ChatMessage(text, true, false, DateTime.now()),
      );
      _messageController.clear();
    });

    // Show the AI bot typing indicator
    setState(() {
      _isTyping = true;
    });

    // Simulate AI farmer response after a delay
    Timer(const Duration(seconds: 2), () {
      if (!mounted) return;

      setState(() {
        _isTyping = false;

        // Generate AI response based on user message
        final String aiResponse = _generateAIResponse(text);

        // Add AI response
        _messages.insert(
          0,
          ChatMessage(aiResponse, false, false, DateTime.now()),
        );
      });

      _scrollToBottom();
    });
  }

  String _generateAIResponse(String userMessage) {
    // Simple AI response logic based on keywords in user message
    final lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.contains('price') ||
        lowerCaseMessage.contains('cost')) {
      return "Our current prices are very competitive. For ${widget.farmer.specialty}, we're offering special rates this season. Would you like a detailed price list?";
    } else if (lowerCaseMessage.contains('meet') ||
        lowerCaseMessage.contains('visit')) {
      return "I'd be happy to meet with you. I'm available any weekday between 9 AM and 4 PM at my farm. When would be convenient for you?";
    } else if (lowerCaseMessage.contains('order') ||
        lowerCaseMessage.contains('buy')) {
      return "Thank you for your interest in ordering our products! For ${widget.farmer.specialty}, we require a minimum order of 5kg. How much would you like to order?";
    } else if (lowerCaseMessage.contains('weather') ||
        lowerCaseMessage.contains('rain')) {
      return "The weather has been quite favorable this season. We've had good rainfall which has helped with our crops. The forecast looks promising too.";
    } else if (lowerCaseMessage.contains('quality') ||
        lowerCaseMessage.contains('organic')) {
      return "We take great pride in our quality standards. All our products are grown using organic methods without any harmful pesticides. Would you like to know more about our farming practices?";
    } else if (lowerCaseMessage.contains('delivery') ||
        lowerCaseMessage.contains('shipping')) {
      return "We offer delivery services within Sri Lanka. For orders over 10kg, delivery is free. Standard delivery takes 2-3 business days depending on your location.";
    } else if (lowerCaseMessage.contains('hello') ||
        lowerCaseMessage.contains('hi') ||
        lowerCaseMessage.contains('hey')) {
      return "Hello! It's great to hear from you. How can I help you today with our ${widget.farmer.specialty}?";
    } else {
      return "Thank you for your message. I'm currently in the fields but will get back to you with more details about our ${widget.farmer.specialty} soon. Is there anything specific you'd like to know?";
    }
  }

  void _showAttachmentOptions() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.blue.shade100,
                  child: const Icon(Icons.image, color: Colors.blue),
                ),
                title: const Text('Send Photo'),
                onTap: () {
                  Navigator.pop(context);
                  _pickAndSendImage();
                },
              ),
              ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.orange.shade100,
                  child: const Icon(Icons.camera_alt, color: Colors.orange),
                ),
                title: const Text('Take Photo'),
                onTap: () {
                  Navigator.pop(context);
                  _takeAndSendPhoto();
                },
              ),
              ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.purple.shade100,
                  child:
                      const Icon(Icons.insert_drive_file, color: Colors.purple),
                ),
                title: const Text('Send Document'),
                onTap: () {
                  Navigator.pop(context);
                  _sendDocument();
                },
              ),
              ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.green.shade100,
                  child: const Icon(Icons.location_on, color: Colors.green),
                ),
                title: const Text('Share Location'),
                onTap: () {
                  Navigator.pop(context);
                  _shareLocation();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _pickAndSendImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null && mounted) {
        setState(() {
          _messages.insert(0, ChatMessage('', true, true, DateTime.now()));
        });

        // Show the AI bot typing indicator after sending an image
        setState(() {
          _isTyping = true;
        });

        // Simulate AI response to the image
        Timer(const Duration(seconds: 2), () {
          if (!mounted) return;

          setState(() {
            _isTyping = false;
            // Add AI response to the image
            _messages.insert(
              0,
              ChatMessage(
                  "Thanks for sharing the image of your crops. They look healthy! How has the growth been this season?",
                  false,
                  false,
                  DateTime.now()),
            );
          });

          _scrollToBottom();
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking image: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _takeAndSendPhoto() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.camera);
      if (image != null && mounted) {
        setState(() {
          _messages.insert(0, ChatMessage('', true, true, DateTime.now()));
        });

        // Similar AI response flow as with gallery images
        setState(() {
          _isTyping = true;
        });

        Timer(const Duration(seconds: 2), () {
          if (!mounted) return;

          setState(() {
            _isTyping = false;
            _messages.insert(
              0,
              ChatMessage(
                  "I can see the current condition of your farm. Everything looks well-maintained. Is there any specific area you're concerned about?",
                  false,
                  false,
                  DateTime.now()),
            );
          });

          _scrollToBottom();
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error taking photo: ${e.toString()}')),
        );
      }
    }
  }

  void _sendDocument() {
    // Implementation would use file_picker and upload to server
    setState(() {
      _messages.insert(
        0,
        ChatMessage("[Contract Document]", true, false, DateTime.now()),
      );
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Document sent'),
        backgroundColor: Colors.green,
      ),
    );

    // AI response to document
    setState(() {
      _isTyping = true;
    });

    Timer(const Duration(seconds: 3), () {
      if (!mounted) return;

      setState(() {
        _isTyping = false;
        _messages.insert(
          0,
          ChatMessage(
              "Thank you for sending the document. I'll review it and get back to you shortly with my feedback.",
              false,
              false,
              DateTime.now()),
        );
      });

      _scrollToBottom();
    });
  }

  void _shareLocation() {
    // Implementation would use geolocator in a real app
    setState(() {
      _messages.insert(
        0,
        ChatMessage("📍 [My Current Location]", true, false, DateTime.now()),
      );
    });

    // AI response to location
    setState(() {
      _isTyping = true;
    });

    Timer(const Duration(seconds: 2), () {
      if (!mounted) return;

      setState(() {
        _isTyping = false;
        _messages.insert(
          0,
          ChatMessage(
              "I see your location. I'm about 15km away from you. Would you like me to arrange delivery to this address?",
              false,
              false,
              DateTime.now()),
        );
      });

      _scrollToBottom();
    });
  }

  void _makePhoneCall(String phoneNumber) {
    // In a real app, use url_launcher
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Calling $phoneNumber'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _startVideoCall(String farmerName) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Starting video call with $farmerName'),
        backgroundColor: Colors.green,
      ),
    );
  }
}

class ChatMessage {
  final String text;
  final bool isMe;
  final bool isImage;
  final DateTime timestamp;

  ChatMessage(this.text, this.isMe, this.isImage, this.timestamp);
}
