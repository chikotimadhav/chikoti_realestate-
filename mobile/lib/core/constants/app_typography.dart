import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  // Editorial Serif Headers (Playfair Display)
  static TextStyle headingHero({Color color = AppColors.cream}) => GoogleFonts.playfairDisplay(
    fontSize: 32,
    fontWeight: FontWeight.w900,
    color: color,
    height: 1.18,
    letterSpacing: -0.5,
  );

  static TextStyle heading1({Color color = AppColors.textDark}) => GoogleFonts.playfairDisplay(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: color,
    height: 1.25,
  );

  static TextStyle heading2({Color color = AppColors.textDark}) => GoogleFonts.playfairDisplay(
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: color,
    height: 1.3,
  );

  static TextStyle heading3({Color color = AppColors.textDark}) => GoogleFonts.playfairDisplay(
    fontSize: 17,
    fontWeight: FontWeight.w700,
    color: color,
  );

  // Clean Geometric Sans Body (DM Sans)
  static TextStyle bodyLarge({Color color = AppColors.textBody}) => GoogleFonts.dmSans(
    fontSize: 15,
    fontWeight: FontWeight.w400,
    color: color,
    height: 1.5,
  );

  static TextStyle bodyMedium({Color color = AppColors.textBody}) => GoogleFonts.dmSans(
    fontSize: 13.5,
    fontWeight: FontWeight.w400,
    color: color,
    height: 1.45,
  );

  static TextStyle bodySmall({Color color = AppColors.textMuted}) => GoogleFonts.dmSans(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    color: color,
  );

  // Badges, Buttons, Tags
  static TextStyle labelBold({Color color = AppColors.textDark}) => GoogleFonts.dmSans(
    fontSize: 12.5,
    fontWeight: FontWeight.w700,
    color: color,
    letterSpacing: 0.3,
  );

  static TextStyle button({Color color = AppColors.navy}) => GoogleFonts.dmSans(
    fontSize: 15,
    fontWeight: FontWeight.w700,
    color: color,
    letterSpacing: 0.4,
  );

  static TextStyle priceTag({Color color = AppColors.goldMuted}) => GoogleFonts.playfairDisplay(
    fontSize: 20,
    fontWeight: FontWeight.w900,
    color: color,
  );

  static TextStyle tag({Color color = AppColors.textDark}) => GoogleFonts.dmSans(
    fontSize: 11,
    fontWeight: FontWeight.w700,
    color: color,
    letterSpacing: 0.5,
  );
}
