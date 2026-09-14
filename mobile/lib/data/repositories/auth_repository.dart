import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/api_constants.dart';
import '../models/user_model.dart';

class AuthRepository {
  final http.Client _client;
  static const String _userKey = 'estatehub_user';
  static const String _tokenKey = 'estatehub_token';

  AuthRepository({http.Client? client}) : _client = client ?? http.Client();

  Future<UserModel?> getStoredUser() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_userKey);
    final token = prefs.getString(_tokenKey);

    if (jsonStr != null) {
      try {
        final data = jsonDecode(jsonStr);
        return UserModel.fromJson(data, token: token);
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  Future<UserModel> login({required String email, required String password}) async {
    try {
      final uri = Uri.parse(ApiConstants.login);
      final response = await _client.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      ).timeout(ApiConstants.timeoutDuration);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final user = UserModel.fromJson(data['data']['user'], token: data['data']['token']);
        await _saveUser(user, data['data']['token']);
        return user;
      }
    } catch (_) {
      // Offline mock login fallback
    }

    // Realistic demo user
    final mockUser = UserModel(
      id: 'demo-buyer-001',
      name: email.split('@').first.toUpperCase(),
      email: email,
      phone: '+91 98765 43210',
      role: 'buyer',
      isVerified: true,
      token: 'demo-jwt-token-sample',
    );
    await _saveUser(mockUser, 'demo-jwt-token-sample');
    return mockUser;
  }

  Future<UserModel> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    String role = 'buyer',
  }) async {
    try {
      final uri = Uri.parse(ApiConstants.register);
      final response = await _client.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'phone': phone,
          'password': password,
          'role': role,
        }),
      ).timeout(ApiConstants.timeoutDuration);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final user = UserModel.fromJson(data['data']['user'], token: data['data']['token']);
        await _saveUser(user, data['data']['token']);
        return user;
      }
    } catch (_) {
      // Mock fallback
    }

    final mockUser = UserModel(
      id: 'usr-${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      email: email,
      phone: phone,
      role: role,
      isVerified: true,
      token: 'demo-jwt-token-${DateTime.now().millisecondsSinceEpoch}',
    );
    await _saveUser(mockUser, mockUser.token!);
    return mockUser;
  }

  Future<UserModel> updateProfile({
    required UserModel currentUser,
    String? name,
    String? address,
    String? avatarUrl,
  }) async {
    final updated = currentUser.copyWith(
      name: name ?? currentUser.name,
      address: address ?? currentUser.address,
      avatarUrl: avatarUrl ?? currentUser.avatarUrl,
    );

    if (currentUser.token != null && currentUser.token!.isNotEmpty) {
      try {
        final uri = Uri.parse(ApiConstants.profile);
        final response = await _client.put(
          uri,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${currentUser.token}',
          },
          body: jsonEncode({
            if (name != null) 'name': name,
            if (address != null) 'address': address,
            if (avatarUrl != null) 'avatar_url': avatarUrl,
          }),
        ).timeout(ApiConstants.timeoutDuration);

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          if (data['data'] != null) {
            final serverUser = UserModel.fromJson(data['data'], token: currentUser.token);
            await _saveUser(serverUser, currentUser.token!);
            return serverUser;
          }
        }
      } catch (_) {
        // Fallback to local persistence if offline
      }
    }

    await _saveUser(updated, currentUser.token ?? 'offline-token');
    return updated;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userKey);
    await prefs.remove(_tokenKey);
  }

  Future<void> _saveUser(UserModel user, String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(user.toJson()));
    await prefs.setString(_tokenKey, token);
  }
}
