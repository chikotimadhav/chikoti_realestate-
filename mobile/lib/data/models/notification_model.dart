class NotificationModel {
  final String id;
  final String title;
  final String message;
  final String type; // listing, price_drop, inquiry, system
  final DateTime timestamp;
  bool isRead;
  final String? propertyId;

  NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.timestamp,
    this.isRead = false,
    this.propertyId,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      message: json['message']?.toString() ?? '',
      type: json['type']?.toString() ?? 'system',
      timestamp: json['timestamp'] != null
          ? (DateTime.tryParse(json['timestamp'].toString()) ?? DateTime.now())
          : json['created_at'] != null
              ? (DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now())
              : DateTime.now(),
      isRead: json['is_read'] == true,
      propertyId: json['property_id']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'type': type,
      'timestamp': timestamp.toIso8601String(),
      'is_read': isRead,
      'property_id': propertyId,
    };
  }
}
