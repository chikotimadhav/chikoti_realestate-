import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_typography.dart';
import '../../core/utils/url_launcher_helper.dart';
import '../../providers/language_provider.dart';
import '../../providers/notification_provider.dart';
import '../../providers/property_provider.dart';
import '../../widgets/banner_carousel.dart';
import '../../widgets/category_chip.dart';
import '../../widgets/property_card.dart';
import '../../widgets/shimmer_loader.dart';
import '../../widgets/stats_counter_bar.dart';
import '../details/property_detail_screen.dart';
import '../notifications/notifications_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final propertyProvider = Provider.of<PropertyProvider>(context);
    final notifProvider = Provider.of<NotificationProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);
    final unreadNotifs = notifProvider.unreadCount;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: RefreshIndicator(
        color: AppColors.gold,
        backgroundColor: AppColors.navy,
        onRefresh: () => propertyProvider.fetchAll(),
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
          // Luxury App Bar
          SliverAppBar(
            pinned: true,
            expandedHeight: 70,
            backgroundColor: AppColors.navy,
            title: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.goldBright, width: 1.5),
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      'assets/images/logo.jpg',
                      fit: BoxFit.cover,
                      errorBuilder: (c, e, s) => const Icon(Icons.apartment, color: AppColors.gold, size: 22),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      AppStrings.appName,
                      style: AppTypography.heading2(color: AppColors.cream),
                    ),
                    Row(
                      children: [
                        const Icon(Icons.location_on, size: 10, color: AppColors.gold),
                        const SizedBox(width: 2),
                        Text(
                          lang.tr('telangana'),
                          style: const TextStyle(fontSize: 10, color: AppColors.textLight),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            actions: [
              // Notification Bell with Badge
              IconButton(
                icon: Stack(
                  children: [
                    const Icon(Icons.notifications_none_rounded, color: AppColors.gold, size: 26),
                    if (unreadNotifs > 0)
                      Positioned(
                        right: 0,
                        top: 0,
                        child: Container(
                          padding: const EdgeInsets.all(3),
                          decoration: const BoxDecoration(
                            color: AppColors.danger,
                            shape: BoxShape.circle,
                          ),
                          constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                          child: Text(
                            '$unreadNotifs',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 8.5,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                  ],
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                  );
                },
              ),
              const SizedBox(width: 8),
            ],
          ),

          // Body Content
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),

                // Search Bar Prompt
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: GestureDetector(
                    onTap: () {
                      // Trigger Explore Tab search
                      final controller = DefaultTabController.maybeOf(context);
                      if (controller != null) controller.animateTo(1);
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.border),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 10,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.search_rounded, color: AppColors.goldMuted, size: 22),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              lang.tr('search_placeholder'),
                              style: AppTypography.bodyMedium(color: AppColors.textLight),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: AppColors.navy,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.tune_rounded, color: AppColors.gold, size: 16),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Hero Banner Carousel
                BannerCarousel(
                  onExploreTap: () {
                    // switch to explore
                  },
                  onListPropertyTap: () {
                    UrlLauncherHelper.openUrl('https://estateshub-seller-portal.vercel.app/');
                  },
                ),
                const SizedBox(height: 22),

                // Stats Counter Bar
                const StatsCounterBar(),
                const SizedBox(height: 26),

                // Categories Row
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(lang.tr('property_types'), style: AppTypography.heading2()),
                      Text(
                        'Curated Corridors',
                        style: AppTypography.bodySmall(color: AppColors.goldMuted),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 46,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    children: [
                      CategoryChip(
                        label: lang.tr('all_properties'),
                        icon: '🏛️',
                        isSelected: propertyProvider.selectedCategory == 'All',
                        onTap: () => propertyProvider.setSelectedCategory('All'),
                      ),
                      const SizedBox(width: 8),
                      CategoryChip(
                        label: lang.tr('residential'),
                        icon: '🏡',
                        activeColor: AppColors.residential,
                        isSelected: propertyProvider.selectedCategory == 'Residential',
                        onTap: () => propertyProvider.setSelectedCategory('Residential'),
                      ),
                      const SizedBox(width: 8),
                      CategoryChip(
                        label: lang.tr('agriculture'),
                        icon: '🌾',
                        activeColor: AppColors.agriculture,
                        isSelected: propertyProvider.selectedCategory == 'Agriculture',
                        onTap: () => propertyProvider.setSelectedCategory('Agriculture'),
                      ),
                      const SizedBox(width: 8),
                      CategoryChip(
                        label: lang.tr('commercial'),
                        icon: '🏢',
                        activeColor: AppColors.commercial,
                        isSelected: propertyProvider.selectedCategory == 'Commercial',
                        onTap: () => propertyProvider.setSelectedCategory('Commercial'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 28),

                // Featured Properties Section
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, color: AppColors.gold, size: 22),
                          const SizedBox(width: 6),
                          Text(lang.tr('featured_properties'), style: AppTypography.heading2()),
                        ],
                      ),
                      TextButton(
                        onPressed: () => propertyProvider.setSelectedSort('newest'),
                        child: Text(
                          lang.tr('view_all'),
                          style: AppTypography.labelBold(color: AppColors.goldMuted),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),

                // Featured horizontal cards list
                propertyProvider.isLoading
                    ? SizedBox(
                        height: 310,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: 3,
                          separatorBuilder: (_, __) => const SizedBox(width: 14),
                          itemBuilder: (_, __) => const ShimmerLoader(width: 260, height: 300),
                        ),
                      )
                    : propertyProvider.featuredProperties.isEmpty
                        ? Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Container(
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: AppColors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.wifi_off_rounded, color: AppColors.textLight, size: 28),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(lang.tr('no_properties_offline'), style: AppTypography.heading3().copyWith(fontSize: 14)),
                                        const SizedBox(height: 2),
                                        Text('Connect to internet or pull down to refresh inventory.', style: AppTypography.bodySmall()),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          )
                        : SizedBox(
                            height: 325,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: propertyProvider.featuredProperties.length,
                              separatorBuilder: (_, __) => const SizedBox(width: 14),
                              itemBuilder: (context, index) {
                                final prop = propertyProvider.featuredProperties[index];
                                return SizedBox(
                                  width: 280,
                                  child: PropertyCard(
                                    property: prop,
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => PropertyDetailScreen(property: prop),
                                        ),
                                      );
                                    },
                                  ),
                                );
                              },
                            ),
                          ),
                const SizedBox(height: 32),

                // Official Land Verification Portals Section
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppColors.cream,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.gold.withOpacity(0.35)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.verified_user_rounded, color: AppColors.goldMuted, size: 20),
                          SizedBox(width: 6),
                          Text(
                            AppStrings.portalsTitle,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.0,
                              color: AppColors.goldMuted,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      _buildPortalTile(
                        icon: '🗺️',
                        title: AppStrings.portalBhubharati,
                        subtitle: AppStrings.portalBhubharatiSub,
                        url: 'https://bhubharati.telangana.gov.in/knowLandStatus',
                      ),
                      const SizedBox(height: 10),
                      _buildPortalTile(
                        icon: '🛰️',
                        title: AppStrings.portalBhuvan,
                        subtitle: AppStrings.portalBhuvanSub,
                        url: 'https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/bhuvan2d.php',
                      ),
                      const SizedBox(height: 10),
                      _buildPortalTile(
                        icon: '📍',
                        title: AppStrings.portalMaps,
                        subtitle: AppStrings.portalMapsSub,
                        url: 'https://maps.google.com',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Latest Listings Grid
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(lang.tr('latest_inventory'), style: AppTypography.heading2()),
                      Text(
                        '${propertyProvider.allProperties.length} properties',
                        style: AppTypography.bodySmall(),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // Vertical properties list
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: propertyProvider.allProperties.isEmpty
                      ? Container(
                          padding: const EdgeInsets.all(24),
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: AppColors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.cloud_off_rounded, size: 44, color: AppColors.textLight),
                              const SizedBox(height: 12),
                              Text(lang.tr('no_properties_offline'), style: AppTypography.heading3()),
                              const SizedBox(height: 6),
                              Text(
                                'Connect to the internet or pull down to reload verified listings.',
                                textAlign: TextAlign.center,
                                style: AppTypography.bodySmall(),
                              ),
                              const SizedBox(height: 16),
                              ElevatedButton.icon(
                                onPressed: () => propertyProvider.fetchAll(),
                                icon: const Icon(Icons.refresh_rounded, size: 18),
                                label: Text(lang.tr('refresh_listings')),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.navy,
                                  foregroundColor: AppColors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                ),
                              ),
                            ],
                          ),
                        )
                      : ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: propertyProvider.allProperties.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 16),
                          itemBuilder: (context, index) {
                            final prop = propertyProvider.allProperties[index];
                            return PropertyCard(
                              property: prop,
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => PropertyDetailScreen(property: prop),
                                  ),
                                );
                              },
                            );
                          },
                        ),
                ),
                const SizedBox(height: 28),

                // Seller Portal CTA Card (List Property)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppColors.navy, Color(0xFF153E73)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.gold.withOpacity(0.35)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.12),
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
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppColors.gold.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.add_business_rounded, color: AppColors.gold, size: 24),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Sell With EstateHub',
                                    style: AppTypography.heading3(color: AppColors.cream),
                                  ),
                                  Text(
                                    'Reach verified property buyers & investors',
                                    style: AppTypography.bodySmall(color: AppColors.textLight),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () {
                              UrlLauncherHelper.openUrl('https://estateshub-seller-portal.vercel.app/');
                            },
                            icon: const Icon(Icons.open_in_new_rounded, size: 16),
                            label: const Text('List Property'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.gold,
                              foregroundColor: AppColors.navy,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 36),

                // Testimonials
                Container(
                  color: AppColors.navy,
                  padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 16),
                  child: Column(
                    children: [
                      const Icon(Icons.format_quote_rounded, color: AppColors.gold, size: 36),
                      const SizedBox(height: 8),
                      Text(
                        'What Our Buyers Say',
                        style: AppTypography.heading2(color: AppColors.cream),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.06),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.gold.withOpacity(0.2)),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: List.generate(
                                5,
                                (i) => const Icon(Icons.star, color: AppColors.gold, size: 18),
                              ),
                            ),
                            const SizedBox(height: 12),
                            const Text(
                              '"Found my dream farm plot within 2 weeks! The team verified title deeds on Bhubharati with total transparency. Highly recommended!"',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: AppColors.cream,
                                fontStyle: FontStyle.italic,
                                height: 1.5,
                              ),
                            ),
                            const SizedBox(height: 14),
                            const Text(
                              'Rajesh Kumar • Hyderabad Buyer',
                              style: TextStyle(
                                color: AppColors.goldBright,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ],
      ),
    ),
  );
  }

  Widget _buildPortalTile({
    required String icon,
    required String title,
    required String subtitle,
    required String url,
  }) {
    return GestureDetector(
      onTap: () => UrlLauncherHelper.openUrl(url),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 6,
            ),
          ],
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 22)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppTypography.heading3(color: AppColors.textDark)),
                  Text(subtitle, style: AppTypography.bodySmall(color: AppColors.textMuted)),
                ],
              ),
            ),
            const Icon(Icons.open_in_new_rounded, size: 16, color: AppColors.goldMuted),
          ],
        ),
      ),
    );
  }
}
