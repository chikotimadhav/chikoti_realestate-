import 'package:url_launcher/url_launcher.dart';

class UrlLauncherHelper {
  static Future<bool> makePhoneCall(String phoneNumber) async {
    final cleanNumber = phoneNumber.replaceAll(RegExp(r'[^\d+]'), '');
    final uri = Uri.parse('tel:$cleanNumber');
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri);
    }
    return false;
  }

  static Future<bool> openWhatsApp({
    required String phone,
    String message = 'Hi, I found your listing on EstateHub and would like to know more details.',
  }) async {
    final cleanPhone = phone.replaceAll(RegExp(r'[^\d]'), '');
    final encodedMessage = Uri.encodeComponent(message);
    
    // Attempt standard wa.me link which works on Android, iOS & Web
    final url = 'https://wa.me/$cleanPhone?text=$encodedMessage';
    final uri = Uri.parse(url);
    
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
    return false;
  }

  static Future<bool> openUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
    return false;
  }

  static Future<bool> sendEmail({
    required String email,
    String subject = 'EstateHub Property Inquiry',
    String body = '',
  }) async {
    final uri = Uri(
      scheme: 'mailto',
      path: email,
      query: 'subject=${Uri.encodeComponent(subject)}&body=${Uri.encodeComponent(body)}',
    );
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri);
    }
    return false;
  }
}
