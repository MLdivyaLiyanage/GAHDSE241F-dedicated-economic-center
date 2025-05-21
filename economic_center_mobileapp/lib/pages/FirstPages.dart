import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

// App Colors
class AppColors {
  static const Color kPrimary = Color(0xFF4CAF50);
  static const Color kPrimary050 = Color(0xFFE8F5E9);
  static const Color kGreyScale300 = Color(0xFFD1D5DB);
  static const Color kGreyScale900 = Color(0xFF1F2937);
  static const Color kWhite = Colors.white;
}

class WalkthroughScreen extends StatefulWidget {
  const WalkthroughScreen({super.key});

  @override
  State<WalkthroughScreen> createState() => _WalkthroughScreenState();
}

class _WalkthroughScreenState extends State<WalkthroughScreen> {
  final PageController controller = PageController();
  int _currentIndex = 0;

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // PageView for walkthrough screens
            SizedBox(
              height: size.height - 118, // Accounting for bottom sheet height
              child: PageView.builder(
                controller: controller,
                onPageChanged: (value) {
                  setState(() {
                    _currentIndex = value;
                  });
                },
                itemCount: onboardingList.length,
                itemBuilder: (context, index) {
                  return WalkthroughScreenOne(
                    onboarding: onboardingList[index],
                  );
                },
              ),
            ),

            // Page indicator
            Positioned(
              bottom: 150,
              left: 0,
              right: 0,
              child: Center(
                child: SmoothPageIndicator(
                  controller: controller,
                  effect: const WormEffect(
                    activeDotColor: AppColors.kPrimary,
                    dotColor: AppColors.kGreyScale300,
                  ),
                  count: onboardingList.length,
                ),
              ),
            ),
          ],
        ),
      ),
      bottomSheet: Container(
        width: size.width,
        color: AppColors.kWhite,
        height: 118,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            if (_currentIndex != onboardingList.length - 1)
              RoundedButtonLite(
                onTap: () {
                  controller.jumpToPage(onboardingList.length - 1);
                },
                label: 'Skip',
                width: size.width * 0.35,
              ),
            if (_currentIndex != onboardingList.length - 1)
              const SizedBox(width: 16),
            RoundedButton(
              onTap: () {
                if (_currentIndex == onboardingList.length - 1) {
                  // Navigate to home screen or dashboard
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (context) => const HomeScreen()),
                  );
                } else {
                  controller.nextPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  );
                }
              },
              width: _currentIndex != onboardingList.length - 1
                  ? size.width * 0.5
                  : size.width - 48, // Adjust width for full button
              label: _currentIndex == onboardingList.length - 1
                  ? 'Get Started'
                  : 'Next',
            ),
          ],
        ),
      ),
    );
  }
}

class RoundedButton extends StatelessWidget {
  const RoundedButton({
    required this.onTap,
    required this.label,
    this.color,
    this.width,
    this.height,
    this.style,
    super.key,
  });
  final void Function() onTap;
  final String label;
  final Color? color;
  final double? width;
  final double? height;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(100),
      onTap: onTap,
      child: Container(
        width: width ?? MediaQuery.of(context).size.width - 48,
        height: (height ?? 58),
        decoration: BoxDecoration(
          color: color ?? AppColors.kPrimary,
          borderRadius: BorderRadius.circular(100),
          boxShadow: [
            BoxShadow(
              color: AppColors.kPrimary.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style:
              style ??
              GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                height: 1.6,
                letterSpacing: 0.2,
                color: AppColors.kWhite,
              ),
        ),
      ),
    );
  }
}

class RoundedButtonLite extends StatelessWidget {
  const RoundedButtonLite({
    required this.onTap,
    required this.label,
    this.color,
    this.width,
    this.height,
    this.style,
    super.key,
  });
  final void Function() onTap;
  final String label;
  final Color? color;
  final double? width;
  final double? height;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(100),
      onTap: onTap,
      child: Container(
        width: (width ?? 183),
        height: (height ?? 58),
        decoration: BoxDecoration(
          color: color ?? AppColors.kPrimary050,
          borderRadius: BorderRadius.circular(100),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style:
              (style ??
              GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                height: 1.6,
                letterSpacing: 0.2,
                color: AppColors.kPrimary,
              )),
        ),
      ),
    );
  }
}

class Onboarding {
  final String imageAsset;
  final String title;
  final String description;

  Onboarding({
    required this.imageAsset,
    required this.title,
    required this.description,
  });
}

final List<Onboarding> onboardingList = [
  Onboarding(
    imageAsset: 'assets/images/leaf_logo.png',
    title: 'Welcome to Dambulla Economic Center',
    description:
        'Explore Sri Lanka\'s largest wholesale market for fresh produce and agricultural products in one place.',
  ),
  Onboarding(
    imageAsset: 'assets/images/background35.jpg',
    title: 'Discover Fresh Produce & Wholesale Prices',
    description:
        'Get real-time updates on prices, availability, and connect directly with farmers and vendors.',
  ),
  Onboarding(
    imageAsset: 'assets/images/far.jpg',
    title: 'Navigate the Market Efficiently',
    description:
        'Find your way around 144 shops, various sections and daily auctions with our interactive map feature.',
  ),
  Onboarding(
    imageAsset: 'assets/images/far2.jpg',
    title: 'Connect with Local Farmers & Vendors',
    description:
        'Build relationships with suppliers, arrange bulk orders and get the best deals directly from the source.',
  ),
];

class WalkthroughScreenOne extends StatelessWidget {
  final Onboarding onboarding;
  const WalkthroughScreenOne({super.key, required this.onboarding});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Column(
      children: [
        // Image Container with gradient overlay
        SizedBox(
          height: size.height * 0.5,
          width: size.width,
          child: Stack(
            children: [
              // Background image
              Positioned.fill(
                child: Image.asset(onboarding.imageAsset, fit: BoxFit.cover),
              ),

              // Gradient overlay
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.black.withOpacity(0.1),
                        Colors.black.withOpacity(0.3),
                      ],
                    ),
                  ),
                ),
              ),

              // App Logo at the top
              Positioned(
                top: 20,
                left: 20,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.kWhite.withOpacity(0.9),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.eco, color: AppColors.kPrimary),
                      const SizedBox(width: 8),
                      Text(
                        'DDEC',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.bold,
                          color: AppColors.kPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),

        // Gradient transition
        Container(
          width: size.width,
          height: 80,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                AppColors.kWhite.withOpacity(0),
                AppColors.kWhite.withOpacity(0.5),
                // ignore: deprecated_member_use
                AppColors.kWhite.withOpacity(0.8),
                AppColors.kWhite.withOpacity(0.9),
                AppColors.kWhite,
              ],
              stops: const [0, 0.4219, 0.6198, 0.8073, 1],
            ),
          ),
        ),

        // Text content
        Expanded(
          child: Container(
            color: AppColors.kWhite,
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              children: [
                Text(
                  onboarding.title,
                  maxLines: 2,
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.w700,
                    height: 1.4,
                    color: AppColors.kGreyScale900,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Text(
                  onboarding.description,
                  maxLines: 4,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                    height: 1.6,
                    letterSpacing: 0.2,
                    color: Colors.black54,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// Home Screen (to be implemented)
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dambulla Economic Center'),
        backgroundColor: AppColors.kPrimary,
        foregroundColor: AppColors.kWhite,
      ),
      body: const Center(
        child: Text('Welcome to the Dambulla Dedicated Economic Center App!'),
      ),
    );
  }
}
