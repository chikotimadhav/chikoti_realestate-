import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/models/property_model.dart';

class FavoritesProvider extends ChangeNotifier {
  static const String _favsKey = 'estatehub_favorites_list';
  final Map<String, PropertyModel> _favoriteProperties = {};

  List<PropertyModel> get favorites => _favoriteProperties.values.toList();
  int get count => _favoriteProperties.length;

  FavoritesProvider() {
    _loadFavorites();
  }

  bool isFavorite(String id) => _favoriteProperties.containsKey(id);

  Future<void> _loadFavorites() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList(_favsKey);
      if (list != null) {
        for (var item in list) {
          final map = jsonDecode(item);
          final prop = PropertyModel.fromJson(map);
          _favoriteProperties[prop.id] = prop;
        }
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> toggleFavorite(PropertyModel property) async {
    if (_favoriteProperties.containsKey(property.id)) {
      _favoriteProperties.remove(property.id);
    } else {
      _favoriteProperties[property.id] = property;
    }
    notifyListeners();
    await _saveFavorites();
  }

  Future<void> removeFavorite(String id) async {
    if (_favoriteProperties.containsKey(id)) {
      _favoriteProperties.remove(id);
      notifyListeners();
      await _saveFavorites();
    }
  }

  Future<void> _saveFavorites() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = _favoriteProperties.values
          .map((p) => jsonEncode(p.toJson()))
          .toList();
      await prefs.setStringList(_favsKey, list);
    } catch (_) {}
  }
}
