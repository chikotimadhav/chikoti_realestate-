import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_strings.dart';
import '../core/constants/app_typography.dart';
import '../providers/property_provider.dart';

class StatsCounterBar extends StatelessWidget {
  const StatsCounterBar({super.key});

  @override
  Widget build(BuildContext context) {
    final propProvider = Provider.of<PropertyProvider>(context);
    final stats = propProvider.heroStats;

    final transacted = stats['properties_transacted']?.isNotEmpty == true
        ? stats['properties_transacted']!
        : AppStrings.statTransacted;
    final buyers = stats['happy_buyers']?.isNotEmpty == true
        ? stats['happy_buyers']!
        : AppStrings.statBuyers;
    final cities = stats['cities_covered']?.isNotEmpty == true
        ? stats['cities_covered']!
        : AppStrings.statCities;
    final experience = stats['years_experience']?.isNotEmpty == true
        ? stats['years_experience']!
        : AppStrings.statExperience;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.navy,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.gold.withOpacity(0.35)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        child: Row(
          children: [
            _buildStatItem('🏠', transacted, AppStrings.statTransactedLabel),
            _buildDivider(),
            _buildStatItem('👥', buyers, AppStrings.statBuyersLabel),
            _buildDivider(),
            _buildStatItem('🏙️', cities, AppStrings.statCitiesLabel),
            _buildDivider(),
            _buildStatItem('⭐', experience, AppStrings.statExperienceLabel),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 36,
      width: 1,
      color: AppColors.gold.withOpacity(0.25),
    );
  }

  Widget _buildStatItem(String icon, String value, String label) {
    return Expanded(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(icon, style: const TextStyle(fontSize: 16)),
          const SizedBox(height: 3),
          Text(
            value,
            style: AppTypography.heading3(color: AppColors.goldBright),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontSize: 9.5,
              color: AppColors.textLight,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
