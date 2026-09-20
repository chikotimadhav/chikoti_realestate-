class ApiConstants {
  // Production URL (Render cloud backend powering estateshub.vercel.app)
  static const String baseUrl = 'https://chikoti-realestate.onrender.com';
  
  // Local Android emulator fallback
  static const String emulatorBaseUrl = 'http://10.0.2.2:5000';
  
  // Endpoints
  static const String properties = '$baseUrl/api/properties';
  static const String featuredProperties = '$baseUrl/api/properties/featured';
  static const String inquiries = '$baseUrl/api/inquiries';
  static const String login = '$baseUrl/api/auth/login';
  static const String register = '$baseUrl/api/auth/register';
  static const String me = '$baseUrl/api/auth/me';
  static const String profile = '$baseUrl/api/users/profile';
  static const String updates = '$baseUrl/api/updates';
  static const String heroStats = '$baseUrl/api/settings/hero-stats';
  static const String heroStatsFallback = '$baseUrl/api/properties/hero-stats';
  
  static const Duration timeoutDuration = Duration(seconds: 15);
}
