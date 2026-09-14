import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_strings.dart';
import '../core/constants/app_typography.dart';

class StatsCounterBar extends StatelessWidget {
  const StatsCounterBar({super.key});

  @override
  Widget build(BuildContext context) {
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
            _buildStatItem('🏠', AppStrings.statTransacted, AppStrings.statTransactedLabel),
            _buildDivider(),
            _buildStatItem('👥', AppStrings.statBuyers, AppStrings.statBuyersLabel),
            _buildDivider(),
            _buildStatItem('🏙️', AppStrings.statCities, AppStrings.statCitiesLabel),
            _buildDivider(),
            _buildStatItem('⭐', AppStrings.statExperience, AppStrings.statExperienceLabel),
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
