import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_typography.dart';
import '../core/utils/currency_formatter.dart';
import '../providers/property_provider.dart';
import 'gold_button.dart';

class FilterBottomSheet extends StatefulWidget {
  const FilterBottomSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const FilterBottomSheet(),
    );
  }

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  late String _category;
  late String _listing;
  late String _sort;
  int? _bedrooms;
  RangeValues _priceRange = const RangeValues(100000, 50000000); // 1 Lakh to 5 Cr

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<PropertyProvider>(context, listen: false);
    _category = provider.selectedCategory;
    _listing = provider.selectedListing;
    _sort = provider.selectedSort;
    _bedrooms = provider.selectedBedrooms;
    if (provider.minPrice != null || provider.maxPrice != null) {
      _priceRange = RangeValues(
        provider.minPrice ?? 100000,
        provider.maxPrice ?? 50000000,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<PropertyProvider>(context, listen: false);

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        top: 20,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle bar
            Center(
              child: Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Filters & Sort', style: AppTypography.heading2()),
                TextButton(
                  onPressed: () {
                    setState(() {
                      _category = 'All';
                      _listing = 'All';
                      _sort = 'newest';
                      _bedrooms = null;
                      _priceRange = const RangeValues(100000, 50000000);
                    });
                    provider.resetFilters();
                  },
                  child: Text(
                    'Reset All',
                    style: AppTypography.labelBold(color: AppColors.goldMuted),
                  ),
                ),
              ],
            ),
            const Divider(height: 24),

            // Property Category
            Text('Property Type', style: AppTypography.labelBold()),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: ['All', 'Residential', 'Commercial', 'Agriculture'].map((cat) {
                final selected = _category == cat;
                return ChoiceChip(
                  label: Text(cat),
                  selected: selected,
                  onSelected: (val) => setState(() => _category = cat),
                  selectedColor: AppColors.navy,
                  backgroundColor: AppColors.backgroundLight,
                  labelStyle: TextStyle(
                    color: selected ? AppColors.cream : AppColors.textBody,
                    fontWeight: FontWeight.w600,
                  ),
                  side: BorderSide(
                    color: selected ? AppColors.gold : AppColors.border,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Listing Type
            Text('Listing Purpose', style: AppTypography.labelBold()),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              children: ['All', 'Sale', 'Rent', 'Lease'].map((l) {
                final selected = _listing == l;
                return ChoiceChip(
                  label: Text(l == 'All' ? 'All' : 'For $l'),
                  selected: selected,
                  onSelected: (val) => setState(() => _listing = l),
                  selectedColor: AppColors.navy,
                  backgroundColor: AppColors.backgroundLight,
                  labelStyle: TextStyle(
                    color: selected ? AppColors.cream : AppColors.textBody,
                    fontWeight: FontWeight.w600,
                  ),
                  side: BorderSide(
                    color: selected ? AppColors.gold : AppColors.border,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Bedrooms (if Residential)
            if (_category == 'All' || _category == 'Residential') ...[
              Text('Bedrooms (BHK)', style: AppTypography.labelBold()),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                children: [null, 1, 2, 3, 4].map((beds) {
                  final selected = _bedrooms == beds;
                  return ChoiceChip(
                    label: Text(beds == null ? 'Any' : '$beds BHK'),
                    selected: selected,
                    onSelected: (val) => setState(() => _bedrooms = beds),
                    selectedColor: AppColors.navy,
                    backgroundColor: AppColors.backgroundLight,
                    labelStyle: TextStyle(
                      color: selected ? AppColors.cream : AppColors.textBody,
                      fontWeight: FontWeight.w600,
                    ),
                    side: BorderSide(
                      color: selected ? AppColors.gold : AppColors.border,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
            ],

            // Price Range
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Price Range', style: AppTypography.labelBold()),
                Text(
                  '${CurrencyFormatter.format(_priceRange.start)} - ${CurrencyFormatter.format(_priceRange.end)}',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.navy),
                ),
              ],
            ),
            RangeSlider(
              values: _priceRange,
              min: 100000,
              max: 50000000,
              divisions: 50,
              activeColor: AppColors.gold,
              inactiveColor: Colors.grey[300],
              onChanged: (values) => setState(() => _priceRange = values),
            ),
            const SizedBox(height: 20),

            // Sorting
            Text('Sort By', style: AppTypography.labelBold()),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                {'key': 'newest', 'label': 'Newest Listings'},
                {'key': 'price_asc', 'label': 'Price: Low → High'},
                {'key': 'price_desc', 'label': 'Price: High → Low'},
              ].map((s) {
                final selected = _sort == s['key'];
                return ChoiceChip(
                  label: Text(s['label']!),
                  selected: selected,
                  onSelected: (val) => setState(() => _sort = s['key']!),
                  selectedColor: AppColors.navy,
                  backgroundColor: AppColors.backgroundLight,
                  labelStyle: TextStyle(
                    color: selected ? AppColors.cream : AppColors.textBody,
                    fontWeight: FontWeight.w600,
                  ),
                  side: BorderSide(
                    color: selected ? AppColors.gold : AppColors.border,
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 26),

            // Apply Button
            GoldButton(
              text: 'Apply Filters',
              width: double.infinity,
              onPressed: () {
                provider.setSelectedCategory(_category);
                provider.setSelectedListing(_listing);
                provider.setSelectedSort(_sort);
                provider.setBedroomsFilter(_bedrooms);
                provider.setPriceRange(_priceRange.start, _priceRange.end);
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}
