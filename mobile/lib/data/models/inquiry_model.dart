class InquiryModel {
  final String? id;
  final String propertyId;
  final String propertyTitle;
  final String buyerName;
  final String buyerEmail;
  final String buyerPhone;
  final String message;
  final DateTime createdAt;

  InquiryModel({
    this.id,
    required this.propertyId,
    required this.propertyTitle,
    required this.buyerName,
    required this.buyerEmail,
    required this.buyerPhone,
    required this.message,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      'property_id': propertyId,
      'buyer_name': buyerName,
      'buyer_email': buyerEmail,
      'buyer_phone': buyerPhone,
      'message': message,
    };
  }
}
