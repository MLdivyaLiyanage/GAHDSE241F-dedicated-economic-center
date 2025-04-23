import 'package:flutter/material.dart';

void main() {
  runApp(const MessengerApp());
}

class MessengerApp extends StatelessWidget {
  const MessengerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Messenger',
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(fontSize: 16),
          bodyMedium: TextStyle(fontSize: 14),
        ),
      ),
      home: const MessagesPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class MessagesPage extends StatefulWidget {
  const MessagesPage({super.key});

  @override
  State<MessagesPage> createState() => _MessagesPageState();
}

class _MessagesPageState extends State<MessagesPage> {
  final List<Message> messages = [
    Message('Sadun', 'Hello, how are you?', '2:30 PM', false),
    Message('Arjelo', 'Thank you 😊', '2:15 PM', true),
    Message('Doloto', '', '1:45 PM', false),
    Message('Dilmi', 'Wow, that\'s amazing', '1:30 PM', true),
    Message('Ruwan', 'Nice work 😊', '12:45 PM', false),
    Message('Diviya', 'OK, see you tomorrow', '12:30 PM', true),
    Message('Sumanasiri', 'I am fine, how about you?', '11:15 AM', false),
    Message('Reese', '', '10:30 AM', false),
  ];

  void _showProfile(BuildContext context, String username) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircleAvatar(
                radius: 48,
                backgroundColor: _getAvatarColor(username),
                child: Text(
                  username[0].toUpperCase(),
                  style: const TextStyle(fontSize: 36, color: Colors.white),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                username,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
              ),
              const SizedBox(height: 6),
              const Text('Last seen recently',
                  style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildProfileAction(Icons.message, 'Message'),
                  _buildProfileAction(Icons.call, 'Call'),
                  _buildProfileAction(Icons.video_call, 'Video'),
                ],
              ),
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Close'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileAction(IconData icon, String label) {
    return Column(
      children: [
        CircleAvatar(
          backgroundColor: Colors.indigo.shade100,
          child: Icon(icon, color: Colors.indigo),
        ),
        const SizedBox(height: 6),
        Text(label),
      ],
    );
  }

  Color _getAvatarColor(String name) {
    final colors = [
      Colors.red,
      Colors.blue,
      Colors.green,
      Colors.orange,
      Colors.purple,
      Colors.teal,
      Colors.pink,
    ];
    return colors[name.hashCode % colors.length];
  }

  void _showMessageOptions(Message msg) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Message from ${msg.sender}',
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 20),
            ListTile(
              leading: const Icon(Icons.mark_chat_read),
              title: const Text('Mark as Read'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Marked as read: ${msg.sender}')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete),
              title: const Text('Delete'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Deleted message from ${msg.sender}')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.close),
              title: const Text('Cancel'),
              onTap: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        title: const Text('Smart Messenger'),
        elevation: 0,
        actions: const [
          Icon(Icons.search),
          SizedBox(width: 16),
          Icon(Icons.more_vert),
          SizedBox(width: 12),
        ],
      ),
      body: ListView.separated(
        itemCount: messages.length,
        separatorBuilder: (_, __) => const Divider(height: 0),
        itemBuilder: (context, index) {
          final msg = messages[index];
          return ListTile(
            onTap: () => ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Opening chat with ${msg.sender}')),
            ),
            onLongPress: () => _showMessageOptions(msg),
            leading: GestureDetector(
              onTap: () => _showProfile(context, msg.sender),
              child: CircleAvatar(
                backgroundColor: _getAvatarColor(msg.sender),
                radius: 24,
                child: Text(
                  msg.sender[0].toUpperCase(),
                  style: const TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            title: Text(msg.sender,
                style: const TextStyle(fontWeight: FontWeight.w600)),
            subtitle: Text(
              msg.text.isNotEmpty ? msg.text : '(No message)',
              style: TextStyle(
                color: msg.isRead ? Colors.grey : Colors.black87,
              ),
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(msg.time,
                    style: const TextStyle(color: Colors.grey, fontSize: 12)),
                if (!msg.isRead)
                  const Icon(Icons.mark_chat_unread,
                      color: Colors.indigo, size: 18)
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: Colors.indigo,
        icon: const Icon(Icons.edit),
        label: const Text("New Chat"),
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('New message button tapped')),
          );
        },
      ),
    );
  }
}

class Message {
  final String sender;
  final String text;
  final String time;
  final bool isRead;

  Message(this.sender, this.text, this.time, this.isRead);
}
