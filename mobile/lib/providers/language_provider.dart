import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider extends ChangeNotifier {
  static const String _prefKey = 'estatehub_language';

  String _currentLocale = 'en'; // 'en', 'te', 'hi'

  LanguageProvider() {
    _loadLanguage();
  }

  String get currentLocale => _currentLocale;

  String get currentLanguageName {
    switch (_currentLocale) {
      case 'te':
        return 'తెలుగు (Telugu)';
      case 'hi':
        return 'हिन्दी (Hindi)';
      default:
        return 'English';
    }
  }

  static const List<Map<String, String>> supportedLanguages = [
    {
      'code': 'en',
      'name': 'English',
      'nativeName': 'English',
      'flag': '🇬🇧',
    },
    {
      'code': 'te',
      'name': 'Telugu',
      'nativeName': 'తెలుగు',
      'flag': '🇮🇳',
    },
    {
      'code': 'hi',
      'name': 'Hindi',
      'nativeName': 'हिन्दी',
      'flag': '🇮🇳',
    },
  ];

  Future<void> _loadLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefKey);
    if (saved != null && ['en', 'te', 'hi'].contains(saved)) {
      _currentLocale = saved;
      notifyListeners();
    }
  }

  Future<void> setLanguage(String code) async {
    if (!['en', 'te', 'hi'].contains(code)) return;
    _currentLocale = code;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, code);
  }

  // Translation dictionary for core application labels
  static final Map<String, Map<String, String>> _translations = {
    'nav_home': {
      'en': 'Home',
      'te': 'హోమ్',
      'hi': 'होम',
    },
    'nav_explore': {
      'en': 'Explore',
      'te': 'అన్వేషించండి',
      'hi': 'खोजें',
    },
    'nav_saved': {
      'en': 'Saved',
      'te': 'సేవ్ చేసినవి',
      'hi': 'सहेजे गए',
    },
    'nav_profile': {
      'en': 'Profile',
      'te': 'ప్రొఫైల్',
      'hi': 'प्रोफ़ाइल',
    },
    'account_services': {
      'en': 'Account & Services',
      'te': 'ఖాతా & సేవలు',
      'hi': 'खाता और सेवाएँ',
    },
    'app_settings': {
      'en': 'Settings & Preferences',
      'te': 'సెట్టింగ్‌లు & ప్రాధాన్యతలు',
      'hi': 'सेटिंग्स और प्राथमिकताएं',
    },
    'change_language': {
      'en': 'Change App Language',
      'te': 'యాప్ భాషను మార్చండి',
      'hi': 'ऐप की भाषा बदलें',
    },
    'select_language': {
      'en': 'Select Language',
      'te': 'భాషను ఎంచుకోండి',
      'hi': 'भाषा चुनें',
    },
    'edit_profile': {
      'en': 'Edit Profile',
      'te': 'ప్రొఫైల్ సవరించండి',
      'hi': 'प्रोफ़ाइल संपादित करें',
    },
    'user_information': {
      'en': 'User Information',
      'te': 'వినియోగదారు సమాచారం',
      'hi': 'उपयोगकर्ता जानकारी',
    },
    'account_details': {
      'en': 'Account Details (Read Only)',
      'te': 'ఖాతా వివరాలు (చదవడానికి మాత్రమే)',
      'hi': 'खाता विवरण (केवल पढ़ने के लिए)',
    },
    'editable_details': {
      'en': 'Editable Information',
      'te': 'సవరించదగిన సమాచారం',
      'hi': 'संपादन योग्य जानकारी',
    },
    'name': {
      'en': 'Full Name',
      'te': 'పూర్తి పేరు',
      'hi': 'पूरा नाम',
    },
    'address': {
      'en': 'Address',
      'te': 'చిరునామా',
      'hi': 'पता',
    },
    'save_changes': {
      'en': 'Save Changes',
      'te': 'మార్పులను సేవ్ చేయండి',
      'hi': 'बदलाव सहेजें',
    },
    'change_photo': {
      'en': 'Change Photo',
      'te': 'ఫోటో మార్చండి',
      'hi': 'फोटो बदलें',
    },
    'choose_avatar': {
      'en': 'Choose Profile Picture',
      'te': 'ప్రొఫైల్ చిత్రాన్ని ఎంచుకోండి',
      'hi': 'प्रोफ़ाइल तस्वीर चुनें',
    },
    'sign_out': {
      'en': 'Sign Out of Account',
      'te': 'ఖాతా నుండి సైన్ అవుట్ అవ్వండి',
      'hi': 'खाते से साइन आउट करें',
    },
    'login': {
      'en': 'Login',
      'te': 'లాగిన్',
      'hi': 'लॉगिन',
    },
    'telangana': {
      'en': 'Telangana',
      'te': 'తెలంగాణ',
      'hi': 'तेलंगाना',
    },
    'featured_listings': {
      'en': 'Featured Listings',
      'te': 'ప్రత్యేక జాబితాలు',
      'hi': 'विशेष लिस्टिंग',
    },
    'latest_inventory': {
      'en': 'Latest Verified Inventory',
      'te': 'తాజా ధృవీకరించబడిన ఆస్తులు',
      'hi': 'नवीनतम सत्यापित संपत्तियां',
    },
    'saved_properties': {
      'en': 'Saved Properties',
      'te': 'సేవ్ చేసిన ఆస్తులు',
      'hi': 'सहेजी गई संपत्तियां',
    },
    'direct_inquiries': {
      'en': 'Direct Inquiries',
      'te': 'ప్రత్యక్ష విచారణలు',
      'hi': 'प्रत्यक्ष पूछताछ',
    },
    'portals_title': {
      'en': 'EstateHub Portals & Services',
      'te': 'ఎస్టేట్‌హబ్ పోర్టల్స్ & సేవలు',
      'hi': 'एस्टेटहब पोर्टल्स और सेवाएं',
    },
    'support_title': {
      'en': 'Support & Advisory Services',
      'te': 'మద్దతు & సలహా సేవలు',
      'hi': 'सहायता और सलाहकार सेवाएं',
    },
    'about_title': {
      'en': 'About & Regulatory',
      'te': 'గురించి & చట్టబద్ధ సమాచారం',
      'hi': 'के बारे में और नियामक',
    },
    'all_properties': {
      'en': 'All Properties',
      'te': 'అన్ని ఆస్తులు',
      'hi': 'सभी संपत्तियां',
    },
    'residential': {
      'en': 'Residential',
      'te': 'నివాస',
      'hi': 'आवासीय',
    },
    'agriculture': {
      'en': 'Agriculture',
      'te': 'వ్యవసాయం',
      'hi': 'कृषि',
    },
    'commercial': {
      'en': 'Commercial',
      'te': 'వాణిజ్య',
      'hi': 'व्यावसायिक',
    },
    'for_sale': {
      'en': 'For Sale',
      'te': 'అమ్మకానికి',
      'hi': 'बिक्री के लिए',
    },
    'for_rent': {
      'en': 'For Rent',
      'te': 'అద్దెకు',
      'hi': 'किराए के लिए',
    },
    'for_lease': {
      'en': 'For Lease',
      'te': 'లీజుకు',
      'hi': 'पट्टे पर',
    },
    'price': {
      'en': 'Price',
      'te': 'ధర',
      'hi': 'कीमत',
    },
    'bedrooms': {
      'en': 'Bedrooms',
      'te': 'బెడ్‌రూమ్‌లు',
      'hi': 'बेडरूम',
    },
    'bathrooms': {
      'en': 'Bathrooms',
      'te': 'బాత్‌రూమ్‌లు',
      'hi': 'बाथरूम',
    },
    'area_sqft': {
      'en': 'Area (Sq.Ft)',
      'te': 'విస్తీర్ణం (చ.అ.)',
      'hi': 'क्षेत्रफल (वर्ग फुट)',
    },
    'acres': {
      'en': 'Acres',
      'te': 'ఎకరాలు',
      'hi': 'एकड़',
    },
    'water_source': {
      'en': 'Water Source',
      'te': 'నీటి వనరు',
      'hi': 'जल स्रोत',
    },
    'soil_type': {
      'en': 'Soil Type',
      'te': 'నేల రకం',
      'hi': 'मिट्टी का प्रकार',
    },
    'furnishing': {
      'en': 'Furnishing',
      'te': 'ఫర్నిషింగ్',
      'hi': 'साज-सज्जा',
    },
    'schedule_visit': {
      'en': 'Schedule Site Visit',
      'te': 'సైట్ సందర్శనను షెడ్యూల్ చేయండి',
      'hi': 'साइट यात्रा निर्धारित करें',
    },
    'send_inquiry': {
      'en': 'Send Inquiry',
      'te': 'విచారణ పంపండి',
      'hi': 'पूछताछ भेजें',
    },
    'call_advisor': {
      'en': 'Call Advisor',
      'te': 'సలహాదారునికి కాల్ చేయండి',
      'hi': 'सलाहकार को कॉल करें',
    },
    'whatsapp_chat': {
      'en': 'WhatsApp Concierge',
      'te': 'వాట్సాప్ సహాయం',
      'hi': 'व्हाट्सएप सहायता',
    },
    'overview': {
      'en': 'Overview & Details',
      'te': 'అవలోకనం & వివరాలు',
      'hi': 'अवलोकन और विवरण',
    },
    'amenities': {
      'en': 'Amenities & Features',
      'te': 'సౌకర్యాలు & లక్షణాలు',
      'hi': 'सुविधाएं और विशेषताएं',
    },
    'location_map': {
      'en': 'Location & Verification',
      'te': 'స్థానం & ధృవీకరణ',
      'hi': 'स्थान और सत्यापन',
    },
    'search_placeholder': {
      'en': 'Search city, survey no, villa...',
      'te': 'నగరం, సర్వే నంబర్, విల్లాను శోధించండి...',
      'hi': 'शहर, सर्वेक्षण संख्या, विला खोजें...',
    },
    'updates_alerts': {
      'en': 'Updates & Alerts',
      'te': 'నవీకరణలు & హెచ్చరికలు',
      'hi': 'अपडेट और अलर्ट',
    },
  };

  String tr(String key) {
    if (_translations.containsKey(key)) {
      return _translations[key]?[_currentLocale] ?? _translations[key]?['en'] ?? key;
    }
    return key;
  }
}
