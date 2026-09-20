import 'package:flutter/material.dart';
import '../core/constants/app_strings.dart';
import '../data/models/property_model.dart';
import '../data/repositories/property_repository.dart';

class PropertyProvider extends ChangeNotifier {
  final PropertyRepository _repository;

  PropertyProvider({PropertyRepository? repository})
      : _repository = repository ?? PropertyRepository();

  List<PropertyModel> _allProperties = [];
  List<PropertyModel> _featuredProperties = [];
  bool _isLoading = false;
  String _errorMessage = '';

  // Dynamic Hero Stats
  Map<String, String> _heroStats = {
    'properties_transacted': AppStrings.statTransacted,
    'happy_buyers': AppStrings.statBuyers,
    'cities_covered': AppStrings.statCities,
    'years_experience': AppStrings.statExperience,
  };

  // Filter States
  String _searchQuery = '';
  String _selectedCategory = 'All'; // All, Residential, Commercial, Agriculture
  String _selectedListing = 'All';  // All, Sale, Rent, Lease
  String _selectedSort = 'newest';  // newest, price_asc, price_desc
  double? _minPrice;
  double? _maxPrice;
  int? _selectedBedrooms;

  List<PropertyModel> get allProperties => _allProperties;
  List<PropertyModel> get featuredProperties => _featuredProperties;
  Map<String, String> get heroStats => _heroStats;
  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;

  String get searchQuery => _searchQuery;
  String get selectedCategory => _selectedCategory;
  String get selectedListing => _selectedListing;
  String get selectedSort => _selectedSort;
  double? get minPrice => _minPrice;
  double? get maxPrice => _maxPrice;
  int? get selectedBedrooms => _selectedBedrooms;

  // Filtered properties getter
  List<PropertyModel> get filteredProperties {
    List<PropertyModel> list = List.from(_allProperties);

    // Search query
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      list = list.where((p) =>
          p.title.toLowerCase().contains(q) ||
          p.location.toLowerCase().contains(q) ||
          p.description.toLowerCase().contains(q)).toList();
    }

    // Category
    if (_selectedCategory != 'All') {
      list = list.where((p) => p.landType.toLowerCase() == _selectedCategory.toLowerCase()).toList();
    }

    // Listing
    if (_selectedListing != 'All') {
      list = list.where((p) => p.listingType.toLowerCase() == _selectedListing.toLowerCase()).toList();
    }

    // Bedrooms
    if (_selectedBedrooms != null && _selectedBedrooms! > 0) {
      list = list.where((p) => p.bedrooms == _selectedBedrooms).toList();
    }

    // Price range
    if (_minPrice != null) {
      list = list.where((p) => p.price >= _minPrice!).toList();
    }
    if (_maxPrice != null) {
      list = list.where((p) => p.price <= _maxPrice!).toList();
    }

    // Sort
    if (_selectedSort == 'price_asc') {
      list.sort((a, b) => a.price.compareTo(b.price));
    } else if (_selectedSort == 'price_desc') {
      list.sort((a, b) => b.price.compareTo(a.price));
    }

    return list;
  }

  Future<void> fetchAll() async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      final propsFuture = _repository.getProperties();
      final featFuture = _repository.getFeaturedProperties();
      final statsFuture = _repository.getHeroStats();

      final results = await Future.wait([propsFuture, featFuture, statsFuture]);
      _allProperties = results[0] as List<PropertyModel>;
      _featuredProperties = results[1] as List<PropertyModel>;
      final fetchedStats = results[2] as Map<String, String>?;
      if (fetchedStats != null) {
        _heroStats = {
          'properties_transacted': (fetchedStats['properties_transacted']?.isNotEmpty ?? false)
              ? fetchedStats['properties_transacted']!
              : _heroStats['properties_transacted']!,
          'happy_buyers': (fetchedStats['happy_buyers']?.isNotEmpty ?? false)
              ? fetchedStats['happy_buyers']!
              : _heroStats['happy_buyers']!,
          'cities_covered': (fetchedStats['cities_covered']?.isNotEmpty ?? false)
              ? fetchedStats['cities_covered']!
              : _heroStats['cities_covered']!,
          'years_experience': (fetchedStats['years_experience']?.isNotEmpty ?? false)
              ? fetchedStats['years_experience']!
              : _heroStats['years_experience']!,
        };
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshStats() async {
    try {
      final fetched = await _repository.getHeroStats();
      if (fetched != null) {
        _heroStats = {
          'properties_transacted': (fetched['properties_transacted']?.isNotEmpty ?? false)
              ? fetched['properties_transacted']!
              : _heroStats['properties_transacted']!,
          'happy_buyers': (fetched['happy_buyers']?.isNotEmpty ?? false)
              ? fetched['happy_buyers']!
              : _heroStats['happy_buyers']!,
          'cities_covered': (fetched['cities_covered']?.isNotEmpty ?? false)
              ? fetched['cities_covered']!
              : _heroStats['cities_covered']!,
          'years_experience': (fetched['years_experience']?.isNotEmpty ?? false)
              ? fetched['years_experience']!
              : _heroStats['years_experience']!,
        };
        notifyListeners();
      }
    } catch (_) {}
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setSelectedCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setSelectedListing(String listing) {
    _selectedListing = listing;
    notifyListeners();
  }

  void setSelectedSort(String sort) {
    _selectedSort = sort;
    notifyListeners();
  }

  void setBedroomsFilter(int? bedrooms) {
    _selectedBedrooms = bedrooms;
    notifyListeners();
  }

  void setPriceRange(double? min, double? max) {
    _minPrice = min;
    _maxPrice = max;
    notifyListeners();
  }

  void resetFilters() {
    _searchQuery = '';
    _selectedCategory = 'All';
    _selectedListing = 'All';
    _selectedSort = 'newest';
    _minPrice = null;
    _maxPrice = null;
    _selectedBedrooms = null;
    notifyListeners();
  }
}
