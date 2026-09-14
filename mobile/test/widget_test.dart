import 'package:flutter_test/flutter_test.dart';
import 'package:estatehub/data/models/user_model.dart';
import 'package:estatehub/data/repositories/property_repository.dart';
import 'package:estatehub/providers/language_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('UserModel Tests', () {
    test('UserModel supports address and copyWith', () {
      final user = UserModel(
        id: 'usr-1',
        name: 'Chikoti Investor',
        email: 'investor@estatehub.in',
        phone: '+919876543210',
        role: 'buyer',
        address: 'Banjara Hills, Road No. 12, Hyderabad, Telangana',
      );

      expect(user.name, 'Chikoti Investor');
      expect(user.address, 'Banjara Hills, Road No. 12, Hyderabad, Telangana');

      final updated = user.copyWith(
        name: 'New Investor Name',
        address: 'Gachibowli, Hyderabad, Telangana',
      );

      expect(updated.name, 'New Investor Name');
      expect(updated.address, 'Gachibowli, Hyderabad, Telangana');
      expect(updated.email, 'investor@estatehub.in'); // Email unchanged

      final json = updated.toJson();
      expect(json['address'], 'Gachibowli, Hyderabad, Telangana');

      final restored = UserModel.fromJson(json);
      expect(restored.address, 'Gachibowli, Hyderabad, Telangana');
    });
  });

  group('LanguageProvider Tests', () {
    test('Provides English, Telugu, and Hindi translations', () async {
      SharedPreferences.setMockInitialValues({});
      final provider = LanguageProvider();

      expect(provider.currentLocale, 'en');
      expect(provider.tr('nav_home'), 'Home');
      expect(provider.tr('telangana'), 'Telangana');

      await provider.setLanguage('te');
      expect(provider.currentLocale, 'te');
      expect(provider.tr('nav_home'), 'హోమ్');
      expect(provider.tr('telangana'), 'తెలంగాణ');
      expect(provider.currentLanguageName, 'తెలుగు (Telugu)');

      await provider.setLanguage('hi');
      expect(provider.currentLocale, 'hi');
      expect(provider.tr('nav_home'), 'होम');
      expect(provider.tr('telangana'), 'तेलंगाना');
      expect(provider.currentLanguageName, 'हिन्दी (Hindi)');
    });
  });

  group('PropertyRepository Offline Tests', () {
    test('getProperties returns empty list when offline instead of fake listings', () async {
      final repo = PropertyRepository();
      final properties = await repo.getProperties();
      // Should NOT return 7 mock fake properties
      expect(properties, isEmpty);
    });

    test('getFeaturedProperties returns empty list when offline', () async {
      final repo = PropertyRepository();
      final featured = await repo.getFeaturedProperties();
      expect(featured, isEmpty);
    });

    test('getPropertyById returns null when offline', () async {
      final repo = PropertyRepository();
      final prop = await repo.getPropertyById('non-existent');
      expect(prop, isNull);
    });
  });
}
