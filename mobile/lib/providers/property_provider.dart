import 'package:flutter/material.dart';
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

      final results = await Future.wait([propsFuture, featFuture]);
      _allProperties = results[0];
      _featuredProperties = results[1];
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
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
