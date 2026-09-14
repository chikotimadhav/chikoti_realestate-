class UserModel {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String role; // buyer, seller, admin
  final String? avatarUrl;
  final String? address;
  final bool isVerified;
  final String? token;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.role = 'buyer',
    this.avatarUrl,
    this.address,
    this.isVerified = true,
    this.token,
  });

  String get initials {
    if (name.trim().isEmpty) return 'U';
    final parts = name.trim().split(' ');
    if (parts.length > 1) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  UserModel copyWith({
    String? name,
    String? email,
    String? phone,
    String? role,
    String? avatarUrl,
    String? address,
    bool? isVerified,
    String? token,
  }) {
    return UserModel(
      id: id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      address: address ?? this.address,
      isVerified: isVerified ?? this.isVerified,
      token: token ?? this.token,
    );
  }

  factory UserModel.fromJson(Map<String, dynamic> json, {String? token}) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'User',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString(),
      role: json['role']?.toString() ?? 'buyer',
      avatarUrl: json['avatar_url']?.toString(),
      address: json['address']?.toString(),
      isVerified: json['is_verified'] == true || json['is_verified'] == 1,
      token: token ?? json['token']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'avatar_url': avatarUrl,
      'address': address,
      'is_verified': isVerified,
      'token': token,
    };
  }
}
