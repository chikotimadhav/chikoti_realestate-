import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/favorites_provider.dart';
import '../../widgets/gold_button.dart';
import '../../widgets/property_card.dart';
import '../details/property_detail_screen.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final favorites = Provider.of<FavoritesProvider>(context);
    final favList = favorites.favorites;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Text('Saved Properties', style: AppTypography.heading2(color: AppColors.cream)),
      ),
      body: favList.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 90,
                      height: 90,
                      decoration: const BoxDecoration(
                        color: AppColors.goldSurface,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.favorite_outline, size: 48, color: AppColors.goldMuted),
                    ),
                    const SizedBox(height: 20),
                    Text('No Saved Properties', style: AppTypography.heading2()),
                    const SizedBox(height: 8),
                    Text(
                      'Tap the heart icon on any property card or detail screen to bookmark listings for quick reference.',
                      textAlign: TextAlign.center,
                      style: AppTypography.bodyMedium(color: AppColors.textMuted),
                    ),
                    const SizedBox(height: 24),
                    GoldButton(
                      text: 'Explore Properties',
                      width: 200,
                      onPressed: () {
                        // Switch to Explore Tab if in BottomNav
                        final controller = DefaultTabController.maybeOf(context);
                        if (controller != null) controller.animateTo(1);
                      },
                    ),
                  ],
                ),
              ),
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  child: Text(
                    '${favList.length} Saved ${favList.length == 1 ? "Listing" : "Listings"}',
                    style: AppTypography.labelBold(color: AppColors.textDark),
                  ),
                ),
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                    itemCount: favList.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 16),
                    itemBuilder: (context, index) {
                      final prop = favList[index];
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
              ],
            ),
    );
  }
}
