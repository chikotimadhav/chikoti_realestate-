import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_typography.dart';
import '../data/models/property_model.dart';
import '../providers/favorites_provider.dart';
import 'smart_image.dart';

class PropertyCard extends StatelessWidget {
  final PropertyModel property;
  final VoidCallback onTap;
  final bool isCompact;

  const PropertyCard({
    super.key,
    required this.property,
    required this.onTap,
    this.isCompact = false,
  });

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
    final favorites = Provider.of<FavoritesProvider>(context);
    final isFav = favorites.isFavorite(property.id);
    final typeColor = _getTypeColor(property.landType);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFF1F5F9)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 18,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Stack
            Stack(
              children: [
                SizedBox(
                  height: isCompact ? 140 : 180,
                  width: double.infinity,
                  child: SmartImage(
                    imageUrl: property.primaryImage,
                    fit: BoxFit.cover,
                  ),
                ),
                // Gradient vignette at top and bottom of image
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.4),
                          Colors.transparent,
                          Colors.black.withOpacity(0.3),
                        ],
                      ),
                    ),
                  ),
                ),
                // Top Left: Category Badge & Property ID
                Positioned(
                  top: 10,
                  left: 10,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: typeColor,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          property.landType.toUpperCase(),
                          style: AppTypography.tag(color: AppColors.white),
                        ),
                      ),
                      const SizedBox(width: 5),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.goldBright.withOpacity(0.5), width: 0.8),
                        ),
                        child: Text(
                          '#${property.displayId}',
                          style: const TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.bold,
                            color: AppColors.goldBright,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                // Top Right: Favorite Button
                Positioned(
                  top: 8,
                  right: 8,
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => favorites.toggleFavorite(property),
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.all(7),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.15),
                              blurRadius: 8,
                            ),
                          ],
                        ),
                        child: Icon(
                          isFav ? Icons.favorite : Icons.favorite_border,
                          color: isFav ? AppColors.danger : AppColors.textDark,
                          size: 18,
                        ),
                      ),
                    ),
                  ),
                ),
                // Bottom Left: Listing Type (Sale / Rent)
                Positioned(
                  bottom: 8,
                  left: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.navy.withOpacity(0.85),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppColors.gold.withOpacity(0.5), width: 0.8),
                    ),
                    child: Text(
                      'For ${property.listingType}',
                      style: AppTypography.tag(color: AppColors.cream),
                    ),
                  ),
                ),
                // Bottom Right: Views Count
                Positioned(
                  bottom: 8,
                  right: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.visibility_outlined, size: 12, color: Colors.white70),
                        const SizedBox(width: 4),
                        Text(
                          '${property.views}',
                          style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            // Details section
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Assigned Property ID
                  Container(
                    margin: const EdgeInsets.only(bottom: 5),
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.navy.withOpacity(0.06),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: AppColors.navy.withOpacity(0.12)),
                    ),
                    child: Text(
                      'PROPERTY ID: #${property.displayId}',
                      style: const TextStyle(
                        fontSize: 8.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.navy,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ),
                  // Title
                  Text(
                    property.title,
                    style: AppTypography.heading3(color: AppColors.textDark),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 5),

                  // Location
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, color: AppColors.gold, size: 14),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(
                          property.location,
                          style: AppTypography.bodySmall(color: AppColors.textMuted),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Specifications Chip / Summary
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.backgroundLight,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Text(
                      property.specsSummary,
                      style: AppTypography.bodySmall(color: AppColors.textDark),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Divider
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  const SizedBox(height: 8),

                  // Price & CTA
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Price',
                            style: TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.w500),
                          ),
                          Text(
                            property.formattedPrice,
                            style: AppTypography.priceTag(color: AppColors.navy),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.gold.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Text(
                              'Details',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: AppColors.goldMuted,
                              ),
                            ),
                            SizedBox(width: 2),
                            Icon(Icons.arrow_forward_ios, size: 10, color: AppColors.goldMuted),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
