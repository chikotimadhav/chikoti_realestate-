import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/language_provider.dart';
import '../../providers/property_provider.dart';
import '../../widgets/filter_bottom_sheet.dart';
import '../../widgets/property_card.dart';
import '../details/property_detail_screen.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<PropertyProvider>(context, listen: false);
    _searchController.text = provider.searchQuery;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final propertyProvider = Provider.of<PropertyProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);
    final filtered = propertyProvider.filteredProperties;

    final categories = [
      {'key': 'All', 'label': lang.tr('all_properties')},
      {'key': 'Residential', 'label': lang.tr('residential')},
      {'key': 'Agriculture', 'label': lang.tr('agriculture')},
      {'key': 'Commercial', 'label': lang.tr('commercial')},
    ];

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Text(lang.tr('explore_properties'), style: AppTypography.heading2(color: AppColors.cream)),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune_rounded, color: AppColors.goldBright),
            onPressed: () => FilterBottomSheet.show(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter Header Bar
          Container(
            color: AppColors.navy,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              children: [
                // Search Input Field
                Container(
                  decoration: BoxDecoration(
                    color: AppColors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (val) => propertyProvider.setSearchQuery(val),
                    style: const TextStyle(color: AppColors.textDark, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: lang.tr('search_placeholder'),
                      hintStyle: const TextStyle(color: AppColors.textLight, fontSize: 13.5),
                      prefixIcon: const Icon(Icons.search_rounded, color: AppColors.goldMuted, size: 20),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, size: 18, color: Colors.grey),
                              onPressed: () {
                                _searchController.clear();
                                propertyProvider.setSearchQuery('');
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Horizontal Category filter chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: categories.map((cat) {
                      final selected = propertyProvider.selectedCategory == cat['key'];
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(cat['label']!),
                          selected: selected,
                          onSelected: (val) => propertyProvider.setSelectedCategory(cat['key']!),
                          selectedColor: AppColors.gold,
                          backgroundColor: Colors.white.withOpacity(0.12),
                          labelStyle: TextStyle(
                            color: selected ? AppColors.navy : AppColors.cream,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                          checkmarkColor: AppColors.navy,
                          side: BorderSide.none,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          // Active filter counters & sorting row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${filtered.length} ${lang.tr('properties_found')}',
                  style: AppTypography.labelBold(color: AppColors.textDark),
                ),
                GestureDetector(
                  onTap: () => FilterBottomSheet.show(context),
                  child: Row(
                    children: [
                      const Icon(Icons.sort_rounded, size: 18, color: AppColors.goldMuted),
                      const SizedBox(width: 4),
                      Text(
                        propertyProvider.selectedSort == 'price_asc'
                            ? lang.tr('price_low_high')
                            : propertyProvider.selectedSort == 'price_desc'
                                ? lang.tr('price_high_low')
                                : lang.tr('newest_first'),
                        style: AppTypography.bodySmall(color: AppColors.goldMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Property Listings Grid/List
          Expanded(
            child: RefreshIndicator(
              color: AppColors.gold,
              backgroundColor: AppColors.navy,
              onRefresh: () => propertyProvider.fetchAll(),
              child: filtered.isEmpty
                  ? ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.15),
                        Center(
                          child: Padding(
                            padding: const EdgeInsets.all(32),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.home_work_outlined, size: 64, color: AppColors.textLight),
                                const SizedBox(height: 16),
                                Text(lang.tr('no_properties_found'), style: AppTypography.heading2()),
                                const SizedBox(height: 8),
                                Text(
                                  'No listings matched your active search and filters. Try adjusting price or property type.',
                                  textAlign: TextAlign.center,
                                  style: AppTypography.bodyMedium(color: AppColors.textMuted),
                                ),
                                const SizedBox(height: 20),
                                ElevatedButton(
                                  onPressed: () {
                                    _searchController.clear();
                                    propertyProvider.resetFilters();
                                  },
                                  child: Text(lang.tr('reset_filters')),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    )
                  : ListView.separated(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                      itemCount: filtered.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 16),
                      itemBuilder: (context, index) {
                        final prop = filtered[index];
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
          ),
        ],
      ),
    );
  }
}
