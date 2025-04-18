import 'package:economic_center_mobileapp/pages/Home.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('HomePage renders correctly', (WidgetTester tester) async {
    // Build our app and trigger a frame
    await tester.pumpWidget(
      const MaterialApp(
        home: HomePage(),
      ),
    );

    // Verify the app bar is rendered
    expect(find.text('Economic Center'), findsOneWidget);
    expect(find.byIcon(Icons.notifications_outlined), findsOneWidget);
    expect(find.byIcon(Icons.person_outline), findsOneWidget);

    // Verify the search field is present
    expect(find.byType(TextField), findsOneWidget);
    expect(find.text('Search for products, markets...'), findsOneWidget);

    // Verify main sections are rendered
    expect(find.text('Today\'s Price Updates'), findsOneWidget);
    expect(find.text('Economic Centers'), findsOneWidget);
    expect(find.text('Categories'), findsOneWidget);
    expect(find.text('Featured Products'), findsOneWidget);
    expect(find.text('Market Insights'), findsOneWidget);
    expect(find.text('News & Updates'), findsOneWidget);

    // Verify bottom navigation is present
    expect(find.byType(BottomNavigationBar), findsOneWidget);
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Explore'), findsOneWidget);
    expect(find.text('Cart'), findsOneWidget);
    expect(find.text('Reports'), findsOneWidget);
    expect(find.text('Profile'), findsOneWidget);
  });

  testWidgets('Price updates section shows items', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: HomePage(),
      ),
    );

    // Verify price update items are shown
    expect(find.text('Rice'), findsOneWidget);
    expect(find.text('Vegetables'), findsOneWidget);
    expect(find.text('Fruits'), findsOneWidget);
    expect(find.text('Spices'), findsOneWidget);
    expect(find.text('Fish'), findsOneWidget);
  });

  testWidgets('Bottom navigation changes index', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: HomePage(),
      ),
    );

    // Verify initial index is 0 (Home)
    final homeIcon = find.byIcon(Icons.home);
    expect(homeIcon, findsOneWidget);

    // Tap on Explore tab
    await tester.tap(find.text('Explore'));
    await tester.pump();

    // Verify icon changed to filled
    expect(find.byIcon(Icons.explore), findsOneWidget);
    expect(find.byIcon(Icons.explore_outlined), findsNothing);
  });

  testWidgets('Categories grid shows all items', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: HomePage(),
      ),
    );

    // Verify all category items are shown
    expect(find.text('Rice'), findsOneWidget);
    expect(find.text('Meat'), findsOneWidget);
    expect(find.text('Vegetables'), findsOneWidget);
    expect(find.text('Fruits'), findsOneWidget);
    expect(find.text('Dairy'), findsOneWidget);
    expect(find.text('Spices'), findsOneWidget);
    expect(find.text('Beverages'), findsOneWidget);
    expect(find.text('Others'), findsOneWidget);
  });
}
