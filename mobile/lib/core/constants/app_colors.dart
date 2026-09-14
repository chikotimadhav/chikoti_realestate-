import 'package:flutter/material.dart';

class AppColors {
  // Brand Luxury Colors
  static const Color navy = Color(0xFF1D4F91); // Brand Primary Royal Blue
  static const Color navyMid = Color(0xFF153E73);
  static const Color navyLight = Color(0xFF2864B5);
  
  static const Color gold = Color(0xFFC9A84C);
  static const Color goldBright = Color(0xFFF0C040);
  static const Color goldMuted = Color(0xFF8B6914);
  static const Color goldSurface = Color(0xFFFFFBEB);
  
  static const Color cream = Color(0xFFF5F0E8);
  static const Color white = Color(0xFFFFFFFF);
  static const Color backgroundLight = Color(0xFFF2F4F7); // Brand Light Surface/Background
  static const Color surfaceCard = Color(0xFFFFFFFF);
  
  // Text Shades
  static const Color textDark = Color(0xFF0F172A);
  static const Color textBody = Color(0xFF374151);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textLight = Color(0xFF94A3B8);
  
  // Border & Divider
  static const Color border = Color(0xFFE2E8F0);
  static const Color borderGold = Color(0x33C9A84C);
  
  // Categories & Statuses
  static const Color agriculture = Color(0xFF059669);
  static const Color agricultureLight = Color(0xFFD1FAE5);
  
  static const Color commercial = Color(0xFFD97706);
  static const Color commercialLight = Color(0xFFFEF3C7);
  
  static const Color residential = Color(0xFF2563EB);
  static const Color residentialLight = Color(0xFFDBEAFE);
  
  static const Color saleTag = Color(0xFF1D4F91);
  static const Color rentTag = Color(0xFF7C3AED);
  static const Color leaseTag = Color(0xFF0284C7);
  
  // Functional
  static const Color success = Color(0xFF059669);
  static const Color danger = Color(0xFFDC2626);
  static const Color whatsapp = Color(0xFF25D366);
  
  // Gradients
  static const LinearGradient goldGradient = LinearGradient(
    colors: [gold, goldBright],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient navyHeroGradient = LinearGradient(
    colors: [navy, navyMid, Color(0xFF0F2E59)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
