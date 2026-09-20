import '../../core/utils/currency_formatter.dart';

class PropertyModel {
  final String id;
  final String title;
  final String landType; // Agriculture, Commercial, Residential
  final String listingType; // Sale, Rent, Lease
  final double price;
  final String location;
  final double? lat;
  final double? lng;
  final String description;
  final String contactNumber;
  final String whatsappNumber;
  final String status;
  final bool isFeatured;
  final int views;
  final List<String> images;

  // Agriculture
  final double? acres;
  final String? soilType;
  final String? waterSource;
  final String? currentCrop;
  final double? cropYield;
  final String? electricity;
  final String? fencing;
  final List<String> agriFacilities;

  // Commercial
  final double? builtArea;
  final String? floor;
  final double? frontage;
  final String? businessType;
  final String? parking;
  final String? footfall;
  final String? landmarks;
  final List<String> commAmenities;

  // Residential
  final double? areaSqft;
  final int? bedrooms;
  final int? bathrooms;
  final String? furnishing;
  final String? resFloor;
  final List<String> resAmenities;

  PropertyModel({
    required this.id,
    required this.title,
    required this.landType,
    this.listingType = 'Sale',
    required this.price,
    required this.location,
    this.lat,
    this.lng,
    this.description = '',
    this.contactNumber = '',
    this.whatsappNumber = '',
    this.status = 'approved',
    this.isFeatured = false,
    this.views = 0,
    this.images = const [],
    this.acres,
    this.soilType,
    this.waterSource,
    this.currentCrop,
    this.cropYield,
    this.electricity,
    this.fencing,
    this.agriFacilities = const [],
    this.builtArea,
    this.floor,
    this.frontage,
    this.businessType,
    this.parking,
    this.footfall,
    this.landmarks,
    this.commAmenities = const [],
    this.areaSqft,
    this.bedrooms,
    this.bathrooms,
    this.furnishing,
    this.resFloor,
    this.resAmenities = const [],
  });

  String get displayId {
    if (id.trim().isEmpty) return 'PROP-N/A';
    final clean = id.trim();
    if (clean.toLowerCase().startsWith('prop-') || clean.toLowerCase().startsWith('eh-')) {
      return clean.toUpperCase();
    }
    if (clean.length > 8) {
      return 'PROP-${clean.substring(0, 8).toUpperCase()}';
    }
    return 'PROP-${clean.toUpperCase()}';
  }

  String get primaryImage {
    if (images.isNotEmpty && images.first.isNotEmpty) {
      return images.first;
    }
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800';
  }

  String get formattedPrice => CurrencyFormatter.format(price);

  String get specsSummary {
    if (landType == 'Residential') {
      final beds = bedrooms != null ? '${bedrooms} BHK' : '';
      final area = areaSqft != null ? '${areaSqft!.toInt()} sq.ft' : '';
      return [beds, area].where((s) => s.isNotEmpty).join(' • ');
    } else if (landType == 'Agriculture') {
      final ac = acres != null ? '${acres} Acres' : '';
      final soil = soilType ?? '';
      return [ac, soil].where((s) => s.isNotEmpty).join(' • ');
    } else if (landType == 'Commercial') {
      final area = builtArea != null ? '${builtArea!.toInt()} sq.ft' : '';
      final bType = businessType ?? '';
      return [area, bType].where((s) => s.isNotEmpty).join(' • ');
    }
    return location;
  }

  List<String> get allAmenities {
    if (landType == 'Residential') return resAmenities;
    if (landType == 'Commercial') return commAmenities;
    if (landType == 'Agriculture') return agriFacilities;
    return [];
  }

  factory PropertyModel.fromJson(Map<String, dynamic> json) {
    List<String> parseList(dynamic val) {
      if (val == null) return [];
      if (val is List) return val.map((e) => e.toString()).toList();
      return [];
    }

    double parseDouble(dynamic val) {
      if (val == null) return 0.0;
      if (val is num) return val.toDouble();
      return double.tryParse(val.toString()) ?? 0.0;
    }

    int? parseInt(dynamic val) {
      if (val == null) return null;
      if (val is int) return val;
      return int.tryParse(val.toString());
    }

    final propId = json['id']?.toString() ?? json['_id']?.toString() ?? '';
    return PropertyModel(
      id: propId,
      title: json['title']?.toString() ?? 'Untitled Property',
      landType: json['land_type']?.toString() ?? 'Residential',
      listingType: json['listing_type']?.toString() ?? 'Sale',
      price: parseDouble(json['price']),
      location: json['location']?.toString() ?? 'Hyderabad, India',
      lat: json['lat'] != null ? parseDouble(json['lat']) : null,
      lng: json['lng'] != null ? parseDouble(json['lng']) : null,
      description: json['description']?.toString() ?? '',
      contactNumber: json['contact_number']?.toString() ?? '',
      whatsappNumber: json['whatsapp_number']?.toString() ?? '',
      status: json['status']?.toString() ?? 'approved',
      isFeatured: json['is_featured'] == true || json['is_featured'] == 1,
      views: parseInt(json['views']) ?? 0,
      images: parseList(json['images']),
      // Agri
      acres: json['acres'] != null ? parseDouble(json['acres']) : null,
      soilType: json['soil_type']?.toString(),
      waterSource: json['water_source']?.toString(),
      currentCrop: json['current_crop']?.toString(),
      cropYield: json['crop_yield'] != null ? parseDouble(json['crop_yield']) : null,
      electricity: json['electricity']?.toString(),
      fencing: json['fencing']?.toString(),
      agriFacilities: parseList(json['agri_facilities']),
      // Commercial
      builtArea: json['built_area'] != null ? parseDouble(json['built_area']) : null,
      floor: json['floor']?.toString(),
      frontage: json['frontage'] != null ? parseDouble(json['frontage']) : null,
      businessType: json['business_type']?.toString(),
      parking: json['parking']?.toString(),
      footfall: json['footfall']?.toString(),
      landmarks: json['landmarks']?.toString(),
      commAmenities: parseList(json['comm_amenities']),
      // Residential
      areaSqft: json['area_sqft'] != null ? parseDouble(json['area_sqft']) : null,
      bedrooms: parseInt(json['bedrooms']),
      bathrooms: parseInt(json['bathrooms']),
      furnishing: json['furnishing']?.toString(),
      resFloor: json['res_floor']?.toString(),
      resAmenities: parseList(json['res_amenities']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'land_type': landType,
      'listing_type': listingType,
      'price': price,
      'location': location,
      'lat': lat,
      'lng': lng,
      'description': description,
      'contact_number': contactNumber,
      'whatsapp_number': whatsappNumber,
      'status': status,
      'is_featured': isFeatured,
      'views': views,
      'images': images,
      'acres': acres,
      'soil_type': soilType,
      'water_source': waterSource,
      'current_crop': currentCrop,
      'crop_yield': cropYield,
      'electricity': electricity,
      'fencing': fencing,
      'agri_facilities': agriFacilities,
      'built_area': builtArea,
      'floor': floor,
      'frontage': frontage,
      'business_type': businessType,
      'parking': parking,
      'footfall': footfall,
      'landmarks': landmarks,
      'comm_amenities': commAmenities,
      'area_sqft': areaSqft,
      'bedrooms': bedrooms,
      'bathrooms': bathrooms,
      'furnishing': furnishing,
      'res_floor': resFloor,
      'res_amenities': resAmenities,
    };
  }
}
