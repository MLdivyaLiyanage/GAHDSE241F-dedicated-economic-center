import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dambulla Economic Center',
      theme: ThemeData(
        primarySwatch: Colors.green,
        useMaterial3: true,
        fontFamily: GoogleFonts.inter().fontFamily,
      ),
      home: const WalkthroughScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

// Modern App Colors with enhanced palette
class AppColors {
  // Primary colors
  static const Color kPrimary = Color(0xFF059669);
  static const Color kPrimaryLight = Color(0xFF10B981);
  static const Color kPrimaryDark = Color(0xFF047857);
  static const Color kPrimary050 = Color(0xFFECFDF5);
  static const Color kPrimary100 = Color(0xFFD1FAE5);
  static const Color kPrimary900 = Color(0xFF064E3B);

  // Neutrals
  static const Color kNeutral50 = Color(0xFFFAFAFA);
  static const Color kNeutral100 = Color(0xFFF5F5F5);
  static const Color kNeutral200 = Color(0xFFE5E5E5);
  static const Color kNeutral300 = Color(0xFFD4D4D4);
  static const Color kNeutral400 = Color(0xFFA3A3A3);
  static const Color kNeutral500 = Color(0xFF737373);
  static const Color kNeutral600 = Color(0xFF525252);
  static const Color kNeutral700 = Color(0xFF404040);
  static const Color kNeutral800 = Color(0xFF262626);
  static const Color kNeutral900 = Color(0xFF171717);

  // Semantic colors
  static const Color kWhite = Colors.white;
  static const Color kBlack = Colors.black;
  static const Color kSecondary = Color(0xFF3B82F6);
  static const Color kAccent = Color(0xFFF59E0B);
  static const Color kError = Color(0xFFEF4444);
  static const Color kSuccess = Color(0xFF10B981);
  static const Color kWarning = Color(0xFFF59E0B);

  // Gradients
  static const LinearGradient kPrimaryGradient = LinearGradient(
    colors: [kPrimary, kPrimaryLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient kSurfaceGradient = LinearGradient(
    colors: [kNeutral50, kWhite],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}

class WalkthroughScreen extends StatefulWidget {
  const WalkthroughScreen({super.key});

  @override
  State<WalkthroughScreen> createState() => _WalkthroughScreenState();
}

class _WalkthroughScreenState extends State<WalkthroughScreen>
    with TickerProviderStateMixin {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  late AnimationController _fadeController;
  late AnimationController _scaleController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut),
    );
    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.elasticOut),
    );

    _startAnimations();
  }

  void _startAnimations() {
    _fadeController.forward();
    _scaleController.forward();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _fadeController.dispose();
    _scaleController.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentIndex = index;
    });

    // Haptic feedback
    HapticFeedback.lightImpact();

    // Reset and restart animations for new page
    _fadeController.reset();
    _scaleController.reset();
    _startAnimations();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isLastPage = _currentIndex == onboardingList.length - 1;

    return Scaffold(
      backgroundColor: AppColors.kNeutral50,
      body: Stack(
        children: [
          // Background gradient
          Container(
            decoration: const BoxDecoration(
              gradient: AppColors.kSurfaceGradient,
            ),
          ),

          // Main content
          SafeArea(
            child: Column(
              children: [
                // Top section with close button
                _buildTopSection(context),

                // PageView
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: _onPageChanged,
                    itemCount: onboardingList.length,
                    itemBuilder: (context, index) {
                      return AnimatedBuilder(
                        animation: _fadeAnimation,
                        builder: (context, child) {
                          return FadeTransition(
                            opacity: _fadeAnimation,
                            child: ScaleTransition(
                              scale: _scaleAnimation,
                              child: WalkthroughPage(
                                onboarding: onboardingList[index],
                                currentIndex: index,
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),

                // Bottom section
                _buildBottomSection(context, size, isLastPage),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Logo
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              gradient: AppColors.kPrimaryGradient,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: AppColors.kPrimary.withOpacity(0.2),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.eco_rounded,
                  color: AppColors.kWhite,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  'DDEC',
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.bold,
                    color: AppColors.kWhite,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),

          // Skip button (only show if not last page)
          if (!(_currentIndex == onboardingList.length - 1))
            GestureDetector(
              onTap: () => _pageController.animateToPage(
                onboardingList.length - 1,
                duration: const Duration(milliseconds: 400),
                curve: Curves.easeInOut,
              ),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.kWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.kNeutral200),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.kBlack.withOpacity(0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Text(
                  'Skip',
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.w600,
                    color: AppColors.kNeutral600,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBottomSection(BuildContext context, Size size, bool isLastPage) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.kWhite,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.kBlack.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Page indicator
          AnimatedSmoothIndicator(
            activeIndex: _currentIndex,
            count: onboardingList.length,
            effect: const ExpandingDotsEffect(
              activeDotColor: AppColors.kPrimary,
              dotColor: AppColors.kNeutral200,
              dotWidth: 8,
              dotHeight: 8,
              expansionFactor: 3,
              spacing: 8,
            ),
          ),

          const SizedBox(height: 32),

          // Buttons
          if (isLastPage)
            _buildAuthButtons(context, size)
          else
            _buildNavigationButton(context, size),
        ],
      ),
    );
  }

  Widget _buildNavigationButton(BuildContext context, Size size) {
    return ModernButton(
      onTap: () {
        _pageController.nextPage(
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      },
      label: 'Continue',
      isPrimary: true,
      width: size.width - 48,
      icon: Icons.arrow_forward_rounded,
    );
  }

  Widget _buildAuthButtons(BuildContext context, Size size) {
    return Column(
      children: [
        // Welcome text
        Text(
          'Ready to get started?',
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.kNeutral900,
          ),
        ),

        const SizedBox(height: 8),

        Text(
          'Join thousands of users exploring the market',
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: AppColors.kNeutral500,
          ),
        ),

        const SizedBox(height: 32),

        // Sign Up Button
        ModernButton(
          onTap: () => Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const SignUpScreen()),
          ),
          label: 'Create Account',
          isPrimary: true,
          width: size.width - 48,
          icon: Icons.person_add_rounded,
        ),

        const SizedBox(height: 16),

        // Sign In Button
        ModernButton(
          onTap: () => Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const SignInScreen()),
          ),
          label: 'Sign In',
          isPrimary: false,
          width: size.width - 48,
          icon: Icons.login_rounded,
        ),

        const SizedBox(height: 24),

        // Continue as Guest
        GestureDetector(
          onTap: () => Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const HomeScreen()),
          ),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
            child: Text(
              'Continue as Guest',
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.kPrimary,
                decoration: TextDecoration.underline,
                decorationColor: AppColors.kPrimary,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class ModernButton extends StatefulWidget {
  const ModernButton({
    required this.onTap,
    required this.label,
    required this.isPrimary,
    this.width,
    this.height,
    this.icon,
    super.key,
  });

  final VoidCallback onTap;
  final String label;
  final bool isPrimary;
  final double? width;
  final double? height;
  final IconData? icon;

  @override
  State<ModernButton> createState() => _ModernButtonState();
}

class _ModernButtonState extends State<ModernButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        _controller.forward();
        HapticFeedback.lightImpact();
      },
      onTapUp: (_) {
        _controller.reverse();
        widget.onTap();
      },
      onTapCancel: () => _controller.reverse(),
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Container(
              width: widget.width ?? MediaQuery.of(context).size.width - 48,
              height: widget.height ?? 56,
              decoration: BoxDecoration(
                gradient: widget.isPrimary ? AppColors.kPrimaryGradient : null,
                color: widget.isPrimary ? null : AppColors.kWhite,
                borderRadius: BorderRadius.circular(16),
                border: widget.isPrimary
                    ? null
                    : Border.all(color: AppColors.kNeutral200, width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: widget.isPrimary
                        ? AppColors.kPrimary.withOpacity(0.3)
                        : AppColors.kBlack.withOpacity(0.05),
                    blurRadius: widget.isPrimary ? 12 : 8,
                    offset: Offset(0, widget.isPrimary ? 4 : 2),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (widget.icon != null) ...[
                    Icon(
                      widget.icon,
                      color: widget.isPrimary
                          ? AppColors.kWhite
                          : AppColors.kNeutral700,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                  ],
                  Text(
                    widget.label,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: widget.isPrimary
                          ? AppColors.kWhite
                          : AppColors.kNeutral700,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class Onboarding {
  final String? imageAsset;
  final String? imageUrl;
  final String title;
  final String description;
  final IconData? icon;
  final Color? accentColor;

  Onboarding({
    this.imageAsset,
    this.imageUrl,
    required this.title,
    required this.description,
    this.icon,
    this.accentColor,
  }) : assert(imageAsset != null || imageUrl != null,
            'Either imageAsset or imageUrl must be provided');

  bool get isNetworkImage => imageUrl != null && imageUrl!.isNotEmpty;
}

final List<Onboarding> onboardingList = [
  Onboarding(
    imageUrl:
        'https://img.freepik.com/free-photo/man-choosing-vegetable-from-vegetable-stall-supermarket_23-2148209789.jpg?uid=R151657559&ga=GA1.1.2050228733.1735296461&semt=ais_hybrid&w=740',
    title: 'Welcome to Dambulla Economic Center',
    description:
        'Explore Sri Lanka\'s largest wholesale market for fresh produce and agricultural products in one place.',
    icon: Icons.store_rounded,
    accentColor: AppColors.kPrimary,
  ),
  Onboarding(
    imageUrl:
        'https://img.freepik.com/premium-photo/indian-farmer-working-vegetable-garden-sunset_873668-18305.jpg?uid=R151657559&ga=GA1.1.2050228733.1735296461&semt=ais_hybrid&w=740',
    title: 'Discover Fresh Produce & Wholesale Prices',
    description:
        'Get real-time updates on prices, availability, and connect directly with farmers and vendors.',
    icon: Icons.trending_up_rounded,
    accentColor: AppColors.kSecondary,
  ),
  Onboarding(
    imageUrl:
        'https://img.freepik.com/free-photo/community-people-working-together-agriculture-grow-food_23-2151205705.jpg?uid=R151657559&ga=GA1.1.2050228733.1735296461&semt=ais_hybrid&w=740',
    title: 'Navigate the Market Efficiently',
    description:
        'Find your way around 144 shops, various sections and daily auctions with our interactive map feature.',
    icon: Icons.map_rounded,
    accentColor: AppColors.kAccent,
  ),
  Onboarding(
    imageUrl:
        'https://img.freepik.com/free-photo/view-woman-working-agricultural-sector-celebrate-labour-day-women_23-2151252008.jpg?uid=R151657559&ga=GA1.1.2050228733.1735296461&semt=ais_hybrid&w=740',
    title: 'Connect with Local Farmers & Vendors',
    description:
        'Build relationships with suppliers, arrange bulk orders and get the best deals directly from the source.',
    icon: Icons.handshake_rounded,
    accentColor: AppColors.kSuccess,
  ),
];

class WalkthroughPage extends StatelessWidget {
  final Onboarding onboarding;
  final int currentIndex;

  const WalkthroughPage({
    super.key,
    required this.onboarding,
    required this.currentIndex,
  });

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          children: [
            // Image container with modern design
            Container(
              height: size.height * 0.45,
              width: size.width - 48,
              margin: const EdgeInsets.only(bottom: 40),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.kBlack.withOpacity(0.1),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: Stack(
                  children: [
                    // Background image
                    Positioned.fill(
                      child: EnhancedImage(
                        onboarding: onboarding,
                        fit: BoxFit.cover,
                      ),
                    ),

                    // Gradient overlay
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(24),
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              AppColors.kBlack.withOpacity(0.3),
                            ],
                          ),
                        ),
                      ),
                    ),

                    // Icon badge
                    if (onboarding.icon != null)
                      Positioned(
                        top: 20,
                        right: 20,
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.kWhite.withOpacity(0.9),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.kBlack.withOpacity(0.1),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Icon(
                            onboarding.icon,
                            color: onboarding.accentColor ?? AppColors.kPrimary,
                            size: 24,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // Content section
            Column(
              children: [
                // Title
                Text(
                  onboarding.title,
                  style: GoogleFonts.inter(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    height: 1.2,
                    color: AppColors.kNeutral900,
                    letterSpacing: -0.5,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 3,
                ),

                const SizedBox(height: 16),

                // Description
                Text(
                  onboarding.description,
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                    height: 1.5,
                    color: AppColors.kNeutral600,
                    letterSpacing: 0.1,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 4,
                ),

                const SizedBox(height: 24),

                // Feature highlights (for visual interest)
                if (currentIndex < 3)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(3, (index) {
                      return Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: index <= currentIndex
                              ? (onboarding.accentColor ?? AppColors.kPrimary)
                              : AppColors.kNeutral300,
                        ),
                      );
                    }),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// Enhanced image widget with better loading states
class EnhancedImage extends StatelessWidget {
  final Onboarding onboarding;
  final BoxFit fit;
  final double? width;
  final double? height;

  const EnhancedImage({
    super.key,
    required this.onboarding,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    if (onboarding.isNetworkImage) {
      return Image.network(
        onboarding.imageUrl!,
        fit: fit,
        width: width,
        height: height,
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return Container(
            width: width,
            height: height,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.kNeutral100,
                  AppColors.kNeutral50,
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Center(
              child: CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded /
                        loadingProgress.expectedTotalBytes!
                    : null,
                valueColor:
                    const AlwaysStoppedAnimation<Color>(AppColors.kPrimary),
                strokeWidth: 3,
              ),
            ),
          );
        },
        errorBuilder: (context, error, stackTrace) => _buildErrorWidget(),
      );
    } else {
      return Image.asset(
        onboarding.imageAsset!,
        fit: fit,
        width: width,
        height: height,
        errorBuilder: (context, error, stackTrace) => _buildErrorWidget(),
      );
    }
  }

  Widget _buildErrorWidget() {
    return Container(
      width: width,
      height: height,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.kNeutral100, AppColors.kNeutral50],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: const Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.image_not_supported_rounded,
            size: 48,
            color: AppColors.kNeutral400,
          ),
          SizedBox(height: 12),
          Text(
            'Image not available',
            style: TextStyle(
              color: AppColors.kNeutral500,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

// Placeholder screens with modern design
class SignInScreen extends StatelessWidget {
  const SignInScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.kNeutral50,
      appBar: AppBar(
        title: Text(
          'Sign In',
          style: GoogleFonts.inter(fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppColors.kNeutral900,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: AppColors.kPrimaryGradient,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.kPrimary.withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.login_rounded,
                  size: 48,
                  color: AppColors.kWhite,
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'Welcome Back!',
                style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.kNeutral900,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Sign in to your account to continue',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: AppColors.kNeutral600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SignUpScreen extends StatelessWidget {
  const SignUpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.kNeutral50,
      appBar: AppBar(
        title: Text(
          'Create Account',
          style: GoogleFonts.inter(fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppColors.kNeutral900,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: AppColors.kPrimaryGradient,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.kPrimary.withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.person_add_rounded,
                  size: 48,
                  color: AppColors.kWhite,
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'Join Us Today!',
                style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.kNeutral900,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Create your account and start exploring the market',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: AppColors.kNeutral600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.kNeutral50,
      body: CustomScrollView(
        slivers: [
          // Modern App Bar
          SliverAppBar(
            expandedHeight: 200,
            floating: false,
            pinned: true,
            backgroundColor: AppColors.kPrimary,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                'DDEC',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w800,
                  color: AppColors.kWhite,
                  fontSize: 20,
                ),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppColors.kPrimaryGradient,
                ),
                child: const Stack(
                  children: [
                    Positioned(
                      top: 60,
                      right: -20,
                      child: Icon(
                        Icons.eco_rounded,
                        size: 120,
                        color: Colors.white12,
                      ),
                    ),
                    Positioned(
                      bottom: 20,
                      left: -30,
                      child: Icon(
                        Icons.store_rounded,
                        size: 80,
                        color: Colors.white12,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Welcome section
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppColors.kWhite,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.kBlack.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppColors.kPrimary100,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.waving_hand_rounded,
                                color: AppColors.kPrimary,
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                'Welcome to DDEC!',
                                style: GoogleFonts.inter(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.kNeutral900,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'You\'re exploring as a guest. Discover Sri Lanka\'s largest wholesale market for fresh produce and agricultural products.',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: AppColors.kNeutral600,
                            height: 1.5,
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Quick stats
                        Row(
                          children: [
                            Expanded(
                              child: _buildStatCard(
                                icon: Icons.store_rounded,
                                value: '144+',
                                label: 'Shops',
                                color: AppColors.kPrimary,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _buildStatCard(
                                icon: Icons.people_rounded,
                                value: '1000+',
                                label: 'Vendors',
                                color: AppColors.kSecondary,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _buildStatCard(
                                icon: Icons.schedule_rounded,
                                value: 'Daily',
                                label: 'Auctions',
                                color: AppColors.kAccent,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Features section
                  Text(
                    'Explore Features',
                    style: GoogleFonts.inter(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: AppColors.kNeutral900,
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Feature cards
                  _buildFeatureCard(
                    icon: Icons.trending_up_rounded,
                    title: 'Real-time Prices',
                    description:
                        'Get live updates on wholesale prices and market trends',
                    color: AppColors.kSuccess,
                  ),

                  const SizedBox(height: 16),

                  _buildFeatureCard(
                    icon: Icons.map_rounded,
                    title: 'Interactive Map',
                    description:
                        'Navigate through different sections and locate shops easily',
                    color: AppColors.kSecondary,
                  ),

                  const SizedBox(height: 16),

                  _buildFeatureCard(
                    icon: Icons.handshake_rounded,
                    title: 'Direct Connect',
                    description:
                        'Connect with farmers and vendors for bulk orders',
                    color: AppColors.kAccent,
                  ),

                  const SizedBox(height: 32),

                  // CTA section
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: AppColors.kPrimaryGradient,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.kPrimary.withOpacity(0.3),
                          blurRadius: 15,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        const Icon(
                          Icons.eco_rounded,
                          color: AppColors.kWhite,
                          size: 48,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Ready to get started?',
                          style: GoogleFonts.inter(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: AppColors.kWhite,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Create an account to unlock all features and start connecting with the market community.',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: AppColors.kWhite.withOpacity(0.9),
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 20),
                        ModernButton(
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(
                                builder: (context) => const SignUpScreen()),
                          ),
                          label: 'Create Account',
                          isPrimary: false,
                          icon: Icons.person_add_rounded,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppColors.kNeutral600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureCard({
    required IconData icon,
    required String title,
    required String description,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.kWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.kNeutral200),
        boxShadow: [
          BoxShadow(
            color: AppColors.kBlack.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.kNeutral900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: AppColors.kNeutral600,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          const Icon(
            Icons.arrow_forward_ios_rounded,
            color: AppColors.kNeutral400,
            size: 16,
          ),
        ],
      ),
    );
  }
}
