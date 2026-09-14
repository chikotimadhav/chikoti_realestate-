import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../core/constants/api_constants.dart';
import '../data/models/notification_model.dart';

class NotificationProvider extends ChangeNotifier {
  final http.Client _client;

  // Clean list of live notifications (all old fake mock alerts removed)
  List<NotificationModel> _notifications = [];
  bool _isLoading = false;

  NotificationProvider({http.Client? client}) : _client = client ?? http.Client() {
    fetchUpdates();
  }

  List<NotificationModel> get notifications => _notifications;
  int get unreadCount => _notifications.where((n) => !n.isRead).length;
  bool get isLoading => _isLoading;

  Future<void> fetchUpdates() async {
    _isLoading = true;
    notifyListeners();

    try {
      final uri = Uri.parse(ApiConstants.updates);
      final response = await _client.get(uri).timeout(ApiConstants.timeoutDuration);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['data'] is List) {
          final items = (json['data'] as List)
              .map((item) => NotificationModel.fromJson(item))
              .toList();
          _notifications = items;
        }
      }
    } catch (_) {
      // Keep existing or empty list if network unavailable
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void markAsRead(String id) {
    final idx = _notifications.indexWhere((n) => n.id == id);
    if (idx != -1 && !_notifications[idx].isRead) {
      _notifications[idx].isRead = true;
      notifyListeners();
    }
  }

  void markAllAsRead() {
    for (var n in _notifications) {
      n.isRead = true;
    }
    notifyListeners();
  }

  void clearAll() {
    _notifications.clear();
    notifyListeners();
    try {
      _client.delete(Uri.parse('${ApiConstants.updates}/clear')).then((_) {}, onError: (_) {});
    } catch (_) {}
  }

  void addNotification(NotificationModel notification) {
    _notifications.insert(0, notification);
    notifyListeners();
  }
}
