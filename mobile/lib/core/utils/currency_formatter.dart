import 'package:intl/intl.dart';

class CurrencyFormatter {
  static String format(dynamic price) {
    if (price == null) return '—';
    double val = 0.0;
    if (price is num) {
      val = price.toDouble();
    } else if (price is String) {
      val = double.tryParse(price) ?? 0.0;
    }

    if (val <= 0) return 'Price on Request';

    if (val >= 10000000) {
      final cr = val / 10000000;
      return '₹${cr.toStringAsFixed(2).replaceAll(RegExp(r'\.?0+$'), '')} Cr';
    } else if (val >= 100000) {
      final lk = val / 100000;
      return '₹${lk.toStringAsFixed(1).replaceAll(RegExp(r'\.?0+$'), '')} L';
    } else {
      final formatter = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
      return formatter.format(val);
    }
  }

  static String formatFull(dynamic price) {
    if (price == null) return '—';
    double val = 0.0;
    if (price is num) {
      val = price.toDouble();
    } else if (price is String) {
      val = double.tryParse(price) ?? 0.0;
    }
    final formatter = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    return formatter.format(val);
  }
}
