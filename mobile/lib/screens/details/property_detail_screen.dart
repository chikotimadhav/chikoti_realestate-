import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../widgets/smart_image.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../core/utils/url_launcher_helper.dart';
import '../../data/models/property_model.dart';
import '../../providers/favorites_provider.dart';
import '../../providers/language_provider.dart';
import '../../widgets/inquiry_bottom_sheet.dart';

class PropertyDetailScreen extends StatefulWidget {
  final PropertyModel property;

  const PropertyDetailScreen({super.key, required this.property});

  @override
  State<PropertyDetailScreen> createState() => _PropertyDetailScreenState();
}

class _PropertyDetailScreenState extends State<PropertyDetailScreen> {
  final PageController _imageController = PageController();
  int _currentImageIndex = 0;

  @override
  void dispose() {
    _imageController.dispose();
    super.dispose();
  }

  Color _getTypeColor(String type) {
    switch (type.toLowerCase()) {
      case 'agriculture':
        return AppColors.agriculture;
      case 'commercial':
        return AppColors.commercial;
      case 'residential':
      default:
        return AppColors.residential;
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.property;
    final favorites = Provider.of<FavoritesProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);
    final isFav = favorites.isFavorite(p.id);
    final images = p.images.isNotEmpty ? p.images : [p.primaryImage];
    final typeColor = _getTypeColor(p.landType);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              // Sliver App Bar with Image Carousel
              SliverAppBar(
                expandedHeight: 340,
                pinned: true,
                backgroundColor: AppColors.navy,
                leading: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: CircleAvatar(
                    backgroundColor: Colors.black.withOpacity(0.55),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                ),
                actions: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CircleAvatar(
                      backgroundColor: Colors.black.withOpacity(0.55),
                      child: IconButton(
                        icon: Icon(
                          isFav ? Icons.favorite : Icons.favorite_border,
                          color: isFav ? AppColors.danger : Colors.white,
                          size: 20,
                        ),
                        onPressed: () => favorites.toggleFavorite(p),
                      ),
                    ),
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    children: [
                      // Images Carousel
                      PageView.builder(
                        controller: _imageController,
                        itemCount: images.length,
                        onPageChanged: (idx) => setState(() => _currentImageIndex = idx),
                        itemBuilder: (context, index) {
                          return SmartImage(
                            imageUrl: images[index],
                            fit: BoxFit.cover,
                          );
                        },
                      ),

                      // Gradient Bottom Vignette
                      Positioned(
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 90,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
                            ),
                          ),
                        ),
                      ),

                      // Image Dots Indicator
                      if (images.length > 1)
                        Positioned(
                          bottom: 16,
                          left: 0,
                          right: 0,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(images.length, (idx) {
                              final active = idx == _currentImageIndex;
                              return AnimatedContainer(
                                duration: const Duration(milliseconds: 250),
                                margin: const EdgeInsets.symmetric(horizontal: 3),
                                width: active ? 20 : 6,
                                height: 5,
                                decoration: BoxDecoration(
                                  color: active ? AppColors.goldBright : Colors.white.withOpacity(0.6),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              );
                            }),
                          ),
                        ),
                    ],
                  ),
                ),
              ),

              // Property Details Body
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 110),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Badges Row
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: typeColor,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              lang.tr(p.landType.toLowerCase()).toUpperCase(),
                              style: AppTypography.tag(color: AppColors.white),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.navy,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              'FOR ${lang.tr(p.listingType.toLowerCase()).toUpperCase()}',
                              style: AppTypography.tag(color: AppColors.goldBright),
                            ),
                          ),
                          const Spacer(),
                          Row(
                            children: [
                              const Icon(Icons.visibility_outlined, size: 14, color: AppColors.textMuted),
                              const SizedBox(width: 4),
                              Text('${p.views} views', style: AppTypography.bodySmall()),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Assigned Property ID Row
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: AppColors.navy.withOpacity(0.06),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.navy.withOpacity(0.12)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.tag, size: 13, color: AppColors.navy),
                                const SizedBox(width: 4),
                                Text(
                                  'PROPERTY ID: #${p.displayId}',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.navy,
                                    fontFamily: 'monospace',
                                    letterSpacing: 0.3,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                InkWell(
                                  onTap: () {
                                    Clipboard.setData(ClipboardData(text: p.id));
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('Property ID copied: ${p.displayId}'),
                                        duration: const Duration(seconds: 2),
                                        backgroundColor: AppColors.navy,
                                        behavior: SnackBarBehavior.floating,
                                      ),
                                    );
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(3),
                                    decoration: BoxDecoration(
                                      color: AppColors.gold.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Icon(Icons.copy, size: 12, color: AppColors.navy),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),

                      // Title
                      Text(p.title, style: AppTypography.heading1()),
                      const SizedBox(height: 8),

                      // Location
                      Row(
                        children: [
                          const Icon(Icons.location_on, color: AppColors.gold, size: 18),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              p.location,
                              style: AppTypography.bodyMedium(color: AppColors.textMuted),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Price Tag Highlight Box
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.gold.withOpacity(0.08),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  lang.tr('price'),
                                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  p.formattedPrice,
                                  style: AppTypography.headingHero(color: AppColors.navy),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppColors.agricultureLight,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.verified, color: AppColors.agriculture, size: 16),
                                  const SizedBox(width: 4),
                                  Text(
                                    lang.tr('verified_title'),
                                    style: const TextStyle(color: AppColors.agriculture, fontWeight: FontWeight.bold, fontSize: 11),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Property Specifications Grid
                      Text(lang.tr('property_specs'), style: AppTypography.heading2()),
                      const SizedBox(height: 12),
                      _buildSpecGrid(p, lang),
                      const SizedBox(height: 24),

                      // Amenities / Facilities
                      if (p.allAmenities.isNotEmpty) ...[
                        Text(lang.tr('features_amenities'), style: AppTypography.heading2()),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: p.allAmenities.map((amenity) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              decoration: BoxDecoration(
                                color: AppColors.white,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.check_circle_outline, size: 14, color: AppColors.goldMuted),
                                  const SizedBox(width: 6),
                                  Text(amenity, style: AppTypography.bodySmall(color: AppColors.textDark)),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 24),
                      ],

                      // Description
                      Text(lang.tr('property_description'), style: AppTypography.heading2()),
                      const SizedBox(height: 10),
                      Text(
                        p.description.isNotEmpty
                            ? p.description
                            : 'No specific description provided for this listing. Contact our certified advisors for full due diligence and survey reports.',
                        style: AppTypography.bodyLarge(),
                      ),
                      const SizedBox(height: 28),

                      // Official Verification Guarantee Card
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.navy,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: AppColors.gold.withOpacity(0.18),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.security, color: AppColors.goldBright, size: 28),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: const [
                                  Text(
                                    'EstateHub Assurance & Due Diligence',
                                    style: TextStyle(
                                      color: AppColors.cream,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    'Encumbrance free titles, legal verification, and government land survey records verified.',
                                    style: TextStyle(color: AppColors.textLight, fontSize: 11, height: 1.3),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Bottom Fixed Action Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.12),
                    blurRadius: 18,
                    offset: const Offset(0, -4),
                  ),
                ],
                border: Border(top: BorderSide(color: AppColors.border, width: 1)),
              ),
              child: SafeArea(
                child: Row(
                  children: [
                    // Call Button
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.navy, width: 1.5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.phone_in_talk, color: AppColors.navy),
                        onPressed: () {
                          final phone = p.contactNumber.isNotEmpty ? p.contactNumber : '+919876543210';
                          UrlLauncherHelper.makePhoneCall(phone);
                        },
                      ),
                    ),
                    const SizedBox(width: 10),

                    // WhatsApp Button
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.whatsapp,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.whatsapp.withOpacity(0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white),
                        onPressed: () {
                          final wa = p.whatsappNumber.isNotEmpty ? p.whatsappNumber : '919876543210';
                          UrlLauncherHelper.openWhatsApp(
                            phone: wa,
                            message: 'Hi! I am interested in ${p.title} (ID: ${p.id}) on EstateHub.',
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 12),

                    // Send Inquiry Button
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.navy,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: () => InquiryBottomSheet.show(context, p),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.send_rounded, color: AppColors.gold, size: 18),
                            const SizedBox(width: 8),
                            Text(lang.tr('inquire_now'), style: AppTypography.button(color: AppColors.gold)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecGrid(PropertyModel p, LanguageProvider lang) {
    List<Map<String, String>> specs = [];

    if (p.landType == 'Residential') {
      if (p.bedrooms != null) specs.add({'icon': '🛏️', 'label': lang.tr('bedrooms'), 'val': '${p.bedrooms} BHK'});
      if (p.bathrooms != null) specs.add({'icon': '🛁', 'label': lang.tr('bathrooms'), 'val': '${p.bathrooms} Baths'});
      if (p.areaSqft != null) specs.add({'icon': '📐', 'label': lang.tr('area'), 'val': '${p.areaSqft!.toInt()} sq.ft'});
      if (p.furnishing != null) specs.add({'icon': '🪑', 'label': lang.tr('furnishing'), 'val': p.furnishing!});
      if (p.resFloor != null) specs.add({'icon': '🏢', 'label': lang.tr('floor'), 'val': p.resFloor!});
    } else if (p.landType == 'Agriculture') {
      if (p.acres != null) specs.add({'icon': '🌾', 'label': lang.tr('area'), 'val': '${p.acres} Acres'});
      if (p.soilType != null) specs.add({'icon': '🌱', 'label': lang.tr('soil_type'), 'val': p.soilType!});
      if (p.waterSource != null) specs.add({'icon': '💧', 'label': lang.tr('water_source'), 'val': p.waterSource!});
      if (p.currentCrop != null) specs.add({'icon': '🌽', 'label': lang.tr('current_crop'), 'val': p.currentCrop!});
      if (p.electricity != null) specs.add({'icon': '⚡', 'label': lang.tr('power_supply'), 'val': p.electricity!});
      if (p.fencing != null) specs.add({'icon': '🛡️', 'label': lang.tr('fencing'), 'val': p.fencing!});
    } else if (p.landType == 'Commercial') {
      if (p.builtArea != null) specs.add({'icon': '📐', 'label': lang.tr('built_area'), 'val': '${p.builtArea!.toInt()} sq.ft'});
      if (p.businessType != null) specs.add({'icon': '🏢', 'label': lang.tr('usage_type'), 'val': p.businessType!});
      if (p.parking != null) specs.add({'icon': '🅿️', 'label': lang.tr('parking'), 'val': p.parking!});
      if (p.footfall != null) specs.add({'icon': '👥', 'label': lang.tr('footfall'), 'val': p.footfall!});
      if (p.floor != null) specs.add({'icon': '🚪', 'label': lang.tr('floor'), 'val': p.floor!});
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: specs.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 2.8,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
        ),
        itemBuilder: (context, index) {
          final s = specs[index];
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.backgroundLight,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                Text(s['icon']!, style: const TextStyle(fontSize: 18)),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(s['label']!, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                      Text(
                        s['val']!,
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textDark),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
