import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_typography.dart';
import '../core/utils/url_launcher_helper.dart';
import '../data/models/inquiry_model.dart';
import '../data/models/property_model.dart';
import '../data/repositories/property_repository.dart';
import '../providers/auth_provider.dart';
import '../providers/notification_provider.dart';
import '../data/models/notification_model.dart';
import 'custom_text_field.dart';
import 'gold_button.dart';

class InquiryBottomSheet extends StatefulWidget {
  final PropertyModel property;

  const InquiryBottomSheet({super.key, required this.property});

  static void show(BuildContext context, PropertyModel property) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => InquiryBottomSheet(property: property),
    );
  }

  @override
  State<InquiryBottomSheet> createState() => _InquiryBottomSheetState();
}

class _InquiryBottomSheetState extends State<InquiryBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _messageController = TextEditingController();
  bool _isSubmitting = false;
  bool _isSent = false;

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user != null) {
      _nameController.text = user.name;
      _emailController.text = user.email;
      if (user.phone != null) _phoneController.text = user.phone!;
    }
    _messageController.text =
        'Hi, I am interested in ${widget.property.title} in ${widget.property.location}. Please share full documentation and pricing details.';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _submitInquiry() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    final inquiry = InquiryModel(
      propertyId: widget.property.id,
      propertyTitle: widget.property.title,
      buyerName: _nameController.text.trim(),
      buyerEmail: _emailController.text.trim(),
      buyerPhone: _phoneController.text.trim(),
      message: _messageController.text.trim(),
    );

    final success = await PropertyRepository().sendInquiry(inquiry);

    if (mounted) {
      if (success) {
        Provider.of<NotificationProvider>(context, listen: false).addNotification(
          NotificationModel(
            id: 'inq-${DateTime.now().millisecondsSinceEpoch}',
            title: '✅ Inquiry Dispatched',
            message: 'Your inquiry for "${widget.property.title}" was submitted to the seller.',
            type: 'inquiry',
            timestamp: DateTime.now(),
            propertyId: widget.property.id,
          ),
        );
        setState(() {
          _isSubmitting = false;
          _isSent = true;
        });
      } else {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to submit inquiry. Please retry.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        top: 20,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: _isSent ? _buildSuccessState() : _buildFormState(),
      ),
    );
  }

  Widget _buildSuccessState() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: const BoxDecoration(
              color: AppColors.agricultureLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle_rounded, color: AppColors.agriculture, size: 40),
          ),
          const SizedBox(height: 16),
          Text('Inquiry Submitted!', style: AppTypography.heading2()),
          const SizedBox(height: 8),
          Text(
            'The seller and our portfolio executive have received your inquiry. They will contact you shortly on ${_phoneController.text.isNotEmpty ? _phoneController.text : "your phone"}.',
            textAlign: TextAlign.center,
            style: AppTypography.bodyMedium(color: AppColors.textMuted),
          ),
          const SizedBox(height: 24),
          if (widget.property.whatsappNumber.isNotEmpty)
            GoldButton(
              text: 'Chat Immediately on WhatsApp',
              icon: Icons.chat_bubble_outline,
              width: double.infinity,
              onPressed: () {
                UrlLauncherHelper.openWhatsApp(
                  phone: widget.property.whatsappNumber,
                  message: 'Hi, I just submitted an inquiry for ${widget.property.title}.',
                );
                Navigator.pop(context);
              },
            ),
          const SizedBox(height: 10),
          GoldButton(
            text: 'Done',
            isOutlined: true,
            width: double.infinity,
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  Widget _buildFormState() {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 44,
              height: 5,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Property Inquiry', style: AppTypography.heading2()),
          const SizedBox(height: 4),
          Text(
            widget.property.title,
            style: AppTypography.bodySmall(color: AppColors.goldMuted),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const Divider(height: 24),
          CustomTextField(
            label: 'Your Name',
            hintText: 'e.g. Rajesh Kumar',
            controller: _nameController,
            prefixIcon: Icons.person_outline,
            validator: (v) => v == null || v.trim().isEmpty ? 'Name required' : null,
          ),
          const SizedBox(height: 14),
          CustomTextField(
            label: 'Phone Number',
            hintText: 'e.g. +91 98765 43210',
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            prefixIcon: Icons.phone_outlined,
            validator: (v) => v == null || v.trim().isEmpty ? 'Phone number required' : null,
          ),
          const SizedBox(height: 14),
          CustomTextField(
            label: 'Email Address',
            hintText: 'e.g. buyer@example.com',
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            prefixIcon: Icons.email_outlined,
            validator: (v) => v == null || !v.contains('@') ? 'Valid email required' : null,
          ),
          const SizedBox(height: 14),
          CustomTextField(
            label: 'Message',
            hintText: 'Type your message or questions here...',
            controller: _messageController,
            maxLines: 3,
          ),
          const SizedBox(height: 24),
          GoldButton(
            text: 'Send Official Inquiry',
            width: double.infinity,
            isLoading: _isSubmitting,
            onPressed: _submitInquiry,
          ),
        ],
      ),
    );
  }
}
