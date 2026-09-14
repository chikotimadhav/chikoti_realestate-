import 'dart:async';
import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_typography.dart';

class BannerCarousel extends StatefulWidget {
  final VoidCallback onExploreTap;
  final VoidCallback onListPropertyTap;

  const BannerCarousel({
    super.key,
    required this.onExploreTap,
    required this.onListPropertyTap,
  });

  @override
  State<BannerCarousel> createState() => _BannerCarouselState();
}

class _BannerCarouselState extends State<BannerCarousel> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  Timer? _timer;

  final List<Map<String, dynamic>> _banners = [
    {
      'tag': 'EXCLUSIVE LUXURY INVENTORY',
      'title': 'Find Your Perfect\nProperty in India',
      'subtitle': 'Verified plots, gated villas & commercial spaces with high ROI.',
      'btnText': 'Explore Listings',
      'btnAction': 'explore',
      'gradient': const [AppColors.navy, Color(0xFF153E73), Color(0xFF2864B5)],
      'badgeColor': AppColors.gold,
      'bgIcon': Icons.apartment_outlined,
    },
    {
      'tag': 'AGRICULTURAL EXCELLENCE',
      'title': 'Prime Farmlands &\nAgro Investment',
      'subtitle': 'Perennial water source, clear Dharani/Bhubharati passbooks.',
      'btnText': 'View Farmlands',
      'btnAction': 'explore',
      'gradient': const [Color(0xFF0A2218), Color(0xFF0F3A2A), Color(0xFF1A5A42)],
      'badgeColor': AppColors.agriculture,
      'bgIcon': Icons.grass_outlined,
    },
    {
      'tag': 'SELLER PORTAL INTEGRATION',
      'title': 'Reach 50,000+\nVerified Buyers',
      'subtitle': 'List your property today for seamless approval and zero hassle.',
      'btnText': 'List Property',
      'btnAction': 'list',
      'gradient': const [Color(0xFF261208), Color(0xFF3D1E0C), Color(0xFF5A2C12)],
      'badgeColor': AppColors.commercial,
      'bgIcon': Icons.campaign_outlined,
    },
  ];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_pageController.hasClients) {
        int next = (_currentPage + 1) % _banners.length;
        _pageController.animateToPage(
          next,
          duration: const Duration(milliseconds: 600),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 190,
          child: PageView.builder(
            controller: _pageController,
            itemCount: _banners.length,
            onPageChanged: (idx) => setState(() => _currentPage = idx),
            itemBuilder: (context, index) {
              final b = _banners[index];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: b['gradient'] as List<Color>,
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.gold.withOpacity(0.3), width: 1),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.25),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    // Background large watermark icon
                    Positioned(
                      right: -15,
                      bottom: -15,
                      child: Icon(
                        b['bgIcon'] as IconData,
                        size: 130,
                        color: Colors.white.withOpacity(0.06),
                      ),
                    ),

                    // Content
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Tag badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: (b['badgeColor'] as Color).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: b['badgeColor'] as Color, width: 0.8),
                          ),
                          child: Text(
                            b['tag'] as String,
                            style: AppTypography.tag(color: b['badgeColor'] as Color),
                          ),
                        ),

                        // Title & Subtitle
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              b['title'] as String,
                              style: AppTypography.heading2(color: AppColors.cream),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              b['subtitle'] as String,
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.textLight,
                                height: 1.3,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),

                        // Action Button
                        GestureDetector(
                          onTap: b['btnAction'] == 'explore'
                              ? widget.onExploreTap
                              : widget.onListPropertyTap,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                            decoration: BoxDecoration(
                              gradient: AppColors.goldGradient,
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.gold.withOpacity(0.4),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  b['btnText'] as String,
                                  style: AppTypography.button(color: AppColors.navy),
                                ),
                                const SizedBox(width: 4),
                                const Icon(Icons.arrow_forward_rounded, size: 14, color: AppColors.navy),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),

        const SizedBox(height: 10),

        // Dots Indicator
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_banners.length, (idx) {
            final active = idx == _currentPage;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: active ? 22 : 6,
              height: 5,
              decoration: BoxDecoration(
                color: active ? AppColors.gold : Colors.grey.withOpacity(0.35),
                borderRadius: BorderRadius.circular(4),
              ),
            );
          }),
        ),
      ],
    );
  }
}
