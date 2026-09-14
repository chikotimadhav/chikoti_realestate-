import 'package:flutter/material.dart';
import '../data/models/user_model.dart';
import '../data/repositories/auth_repository.dart';

class AuthProvider extends ChangeNotifier {
  final AuthRepository _repository;
  UserModel? _user;
  bool _isLoading = false;
  String _errorMessage = '';

  AuthProvider({AuthRepository? repository})
      : _repository = repository ?? AuthRepository() {
    _initAuth();
  }

  UserModel? get user => _user;
  bool get isLoggedIn => _user != null;
  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;

  Future<void> _initAuth() async {
    _user = await _repository.getStoredUser();
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      _user = await _repository.login(email: email, password: password);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception:', '').trim();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    String role = 'buyer',
  }) async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      _user = await _repository.register(
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: role,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception:', '').trim();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateProfile({
    String? name,
    String? address,
    String? avatarUrl,
  }) async {
    if (_user == null) return false;
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      _user = await _repository.updateProfile(
        currentUser: _user!,
        name: name,
        address: address,
        avatarUrl: avatarUrl,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception:', '').trim();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    _user = null;
    notifyListeners();
  }
}
