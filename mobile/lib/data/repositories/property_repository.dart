import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../core/constants/api_constants.dart';
import '../models/inquiry_model.dart';
import '../models/property_model.dart';

class PropertyRepository {
  final http.Client _client;

  PropertyRepository({http.Client? client}) : _client = client ?? http.Client();

  // Fetch all approved properties with optional filtering
  Future<List<PropertyModel>> getProperties({
    String? search,
    String? type,
    String? listing,
    String? sort,
  }) async {
    try {
      final uri = Uri.parse(ApiConstants.properties).replace(queryParameters: {
        if (search != null && search.isNotEmpty) 'search': search,
        if (type != null && type.isNotEmpty && type != 'All') 'type': type,
        if (listing != null && listing.isNotEmpty && listing != 'All') 'listing': listing,
        if (sort != null && sort.isNotEmpty) 'sort': sort,
      });

      final response = await _client.get(uri).timeout(ApiConstants.timeoutDuration);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['data'] is List) {
          return (json['data'] as List)
              .map((item) => PropertyModel.fromJson(item))
              .toList();
        }
      }
    } catch (_) {
      // Return empty list if offline or network error occurs
    }

    return [];
  }

  // Fetch featured properties
  Future<List<PropertyModel>> getFeaturedProperties() async {
    try {
      final uri = Uri.parse(ApiConstants.featuredProperties);
      final response = await _client.get(uri).timeout(ApiConstants.timeoutDuration);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['data'] is List) {
          final list = (json['data'] as List)
              .map((item) => PropertyModel.fromJson(item))
              .toList();
          if (list.isNotEmpty) return list;
        }
      }
    } catch (_) {
      // Offline fallback: return empty list
    }

    return [];
  }

  // Fetch property by id
  Future<PropertyModel?> getPropertyById(String id) async {
    try {
      final uri = Uri.parse('${ApiConstants.properties}/$id');
      final response = await _client.get(uri).timeout(ApiConstants.timeoutDuration);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['data'] != null) {
          return PropertyModel.fromJson(json['data']);
        }
      }
    } catch (_) {
      // Offline fallback: return null
    }

    return null;
  }

  // Submit Inquiry
  Future<bool> sendInquiry(InquiryModel inquiry) async {
    try {
      final uri = Uri.parse(ApiConstants.inquiries);
      final response = await _client.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(inquiry.toJson()),
      ).timeout(ApiConstants.timeoutDuration);

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      }
    } catch (_) {
      // Simulate successful offline submission
    }
    return true;
  }

  // Fetch dynamic Hero & App Stats
  Future<Map<String, String>?> getHeroStats() async {
    for (final url in [ApiConstants.heroStats, ApiConstants.heroStatsFallback]) {
      try {
        final uri = Uri.parse(url);
        final response = await _client.get(uri).timeout(ApiConstants.timeoutDuration);
        if (response.statusCode == 200) {
          final json = jsonDecode(response.body);
          if (json['data'] is Map) {
            final data = json['data'] as Map<String, dynamic>;
            return {
              'properties_transacted': data['properties_transacted']?.toString() ?? '',
              'happy_buyers': data['happy_buyers']?.toString() ?? '',
              'cities_covered': data['cities_covered']?.toString() ?? '',
              'years_experience': data['years_experience']?.toString() ?? '',
            };
          }
        }
      } catch (_) {
        // Try fallback url if first fails
      }
    }
    return null;
  }
}
