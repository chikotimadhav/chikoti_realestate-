import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/constants/app_typography.dart';
import '../../core/utils/url_launcher_helper.dart';
import '../../data/models/user_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/favorites_provider.dart';
import '../../providers/language_provider.dart';
import '../auth/login_screen.dart';
import '../notifications/notifications_screen.dart';
import 'edit_profile_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  Widget _buildUserAvatar(UserModel? user, BuildContext context) {
    ImageProvider? imageProvider;
    if (user?.avatarUrl != null && user!.avatarUrl!.isNotEmpty) {
      if (user.avatarUrl!.startsWith('http')) {
        imageProvider = NetworkImage(user.avatarUrl!);
      } else if (File(user.avatarUrl!).existsSync()) {
        imageProvider = FileImage(File(user.avatarUrl!));
      }
    }

    return Stack(
      children: [
        Container(
          width: 68,
          height: 68,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: AppColors.white,
            border: Border.all(color: AppColors.gold, width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.18),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: ClipOval(
            child: imageProvider != null
                ? Image(
                    image: imageProvider,
                    fit: BoxFit.cover,
                    width: 68,
                    height: 68,
                    errorBuilder: (_, __, ___) => _buildFallbackInitial(user),
                  )
                : _buildFallbackInitial(user),
          ),
        ),
        Positioned(
          bottom: 0,
          right: 0,
          child: GestureDetector(
            onTap: () {
              if (user != null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const EditProfileScreen()),
                );
              } else {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              }
            },
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppColors.gold,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.navy, width: 1.5),
              ),
              child: const Icon(
                Icons.edit,
                size: 12,
                color: AppColors.navy,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFallbackInitial(UserModel? user) {
    return Container(
      decoration: const BoxDecoration(
        gradient: AppColors.goldGradient,
      ),
      child: Center(
        child: Text(
          user != null ? user.initials : '👤',
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppColors.navy,
          ),
        ),
      ),
    );
  }

  void _showLanguageBottomSheet(BuildContext context, LanguageProvider langProvider) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  const Icon(Icons.translate_rounded, color: AppColors.navy, size: 22),
                  const SizedBox(width: 10),
                  Text(
                    langProvider.tr('select_language'),
                    style: AppTypography.heading2(),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'Choose your preferred language for navigation and listings in Telangana',
                style: AppTypography.bodySmall(),
              ),
              const SizedBox(height: 16),
              ...LanguageProvider.supportedLanguages.map((lang) {
                final isSelected = langProvider.currentLocale == lang['code'];
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.navy.withOpacity(0.06) : AppColors.backgroundLight,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isSelected ? AppColors.navy : AppColors.border,
                      width: isSelected ? 1.5 : 1,
                    ),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
                    leading: Text(lang['flag'] ?? '🌐', style: const TextStyle(fontSize: 24)),
                    title: Text(
                      lang['nativeName'] ?? '',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                        color: isSelected ? AppColors.navy : AppColors.textDark,
                      ),
                    ),
                    subtitle: Text(lang['name'] ?? '', style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                    trailing: isSelected
                        ? const Icon(Icons.check_circle_rounded, color: AppColors.navy)
                        : const Icon(Icons.radio_button_unchecked, color: AppColors.textLight),
                    onTap: () async {
                      await langProvider.setLanguage(lang['code']!);
                      if (context.mounted) {
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Language set to ${lang['nativeName']} (${lang['name']})'),
                            duration: const Duration(seconds: 2),
                            backgroundColor: AppColors.navy,
                          ),
                        );
                      }
                    },
                  ),
                );
              }),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final favCount = Provider.of<FavoritesProvider>(context).count;
    final langProvider = Provider.of<LanguageProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Text(langProvider.tr('account_services'), style: AppTypography.heading2(color: AppColors.cream)),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: AppColors.gold),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        child: Column(
          children: [
            // User Header Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.navy,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.gold.withOpacity(0.35)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.15),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      // Avatar with edit badge
                      _buildUserAvatar(user, context),
                      const SizedBox(width: 16),

                      // User Info
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user != null ? user.name : 'Welcome, Guest Investor',
                              style: AppTypography.heading3(color: AppColors.cream),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              user != null ? user.email : 'Sign in to access inquiries & portfolio',
                              style: const TextStyle(fontSize: 12, color: AppColors.textLight),
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.gold.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppColors.gold, width: 0.8),
                              ),
                              child: Text(
                                user != null
                                    ? 'VERIFIED ${user.role.toUpperCase()}'
                                    : 'GUEST MODE',
                                style: AppTypography.tag(color: AppColors.goldBright),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  // Display Address if set
                  if (user?.address != null && user!.address!.isNotEmpty) ...[
                    const SizedBox(height: 14),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.location_on_outlined, size: 16, color: AppColors.gold),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              user.address!,
                              style: const TextStyle(fontSize: 12, color: AppColors.cream),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  // Action Buttons row inside header card
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.gold,
                            foregroundColor: AppColors.navy,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () {
                            if (user != null) {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const EditProfileScreen()),
                              );
                            } else {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const LoginScreen()),
                              );
                            }
                          },
                          icon: const Icon(Icons.edit_outlined, size: 16),
                          label: Text(
                            langProvider.tr('edit_profile'),
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.cream,
                          side: const BorderSide(color: AppColors.gold, width: 1),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () => _showLanguageBottomSheet(context, langProvider),
                        icon: const Icon(Icons.translate_rounded, size: 16, color: AppColors.gold),
                        label: Text(
                          langProvider.currentLocale.toUpperCase(),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // If guest, show login prompt banner
            if (user == null) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.lock_open_rounded, color: AppColors.goldMuted, size: 28),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'Sign In to EstateHub',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          Text(
                            'Synchronize saved properties and view inquiry statuses.',
                            style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.gold,
                        foregroundColor: AppColors.navy,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const LoginScreen()),
                        );
                      },
                      child: Text(langProvider.tr('login'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Stats Counter row
            Row(
              children: [
                Expanded(
                  child: _buildProfileStatCard(
                    icon: Icons.favorite,
                    color: AppColors.danger,
                    value: '$favCount',
                    label: langProvider.tr('saved_properties'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildProfileStatCard(
                    icon: Icons.send_rounded,
                    color: AppColors.residential,
                    value: '1 Active',
                    label: langProvider.tr('direct_inquiries'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Settings & Preferences Section (Requested feature)
            _buildSectionHeader(langProvider.tr('app_settings')),
            const SizedBox(height: 10),
            _buildMenuCard([
              _buildMenuItem(
                icon: Icons.translate_rounded,
                title: langProvider.tr('change_language'),
                subtitle: 'Active: ${langProvider.currentLanguageName}',
                onTap: () => _showLanguageBottomSheet(context, langProvider),
              ),
              _buildDivider(),
              _buildMenuItem(
                icon: Icons.manage_accounts_outlined,
                title: langProvider.tr('edit_profile'),
                subtitle: 'Update name, residential address & profile photo',
                onTap: () {
                  if (user != null) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const EditProfileScreen()),
                    );
                  } else {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                    );
                  }
                },
              ),
            ]),
            const SizedBox(height: 24),

            // Services & Portals Section
            _buildSectionHeader(langProvider.tr('portals_title')),
            const SizedBox(height: 10),
            _buildMenuCard([
              _buildMenuItem(
                icon: Icons.add_business_rounded,
                title: 'List Property (Seller Portal)',
                subtitle: 'estateshub-seller-portal.vercel.app',
                onTap: () => UrlLauncherHelper.openUrl('https://estateshub-seller-portal.vercel.app/'),
              ),
              _buildDivider(),
              _buildMenuItem(
                icon: Icons.public_rounded,
                title: 'Bhubharati Land Records',
                subtitle: 'Know land status & survey numbers in Telangana',
                onTap: () => UrlLauncherHelper.openUrl('https://bhubharati.telangana.gov.in/knowLandStatus'),
              ),
              _buildDivider(),
              _buildMenuItem(
                icon: Icons.satellite_alt_rounded,
                title: 'Bhuvan ISRO 2D/3D Satellite',
                subtitle: 'Satellite geospatial land verification',
                onTap: () => UrlLauncherHelper.openUrl('https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/bhuvan2d.php'),
              ),
            ]),
            const SizedBox(height: 24),

            // Official Support & Direct Contact
            _buildSectionHeader(langProvider.tr('support_title')),
            const SizedBox(height: 10),
            _buildMenuCard([
              _buildMenuItem(
                icon: Icons.phone_rounded,
                title: 'Call Senior Portfolio Advisor',
                subtitle: AppStrings.defaultPhone,
                onTap: () => UrlLauncherHelper.makePhoneCall(AppStrings.defaultPhone),
              ),
              _buildDivider(),
              _buildMenuItem(
                icon: Icons.chat_bubble_outline_rounded,
                title: 'WhatsApp Concierge Desk',
                subtitle: 'Instant responses for surveys & pricing',
                onTap: () => UrlLauncherHelper.openWhatsApp(
                  phone: AppStrings.defaultWhatsapp,
                  message: 'Hello EstateHub Concierge! I need assistance with property verification in Telangana.',
                ),
              ),
              _buildDivider(),
              _buildMenuItem(
                icon: Icons.mail_outline_rounded,
                title: 'Email Legal & Verification Team',
                subtitle: AppStrings.defaultEmail,
                onTap: () => UrlLauncherHelper.sendEmail(email: AppStrings.defaultEmail),
              ),
            ]),
            const SizedBox(height: 24),

            // App Information & Legal
            _buildSectionHeader(langProvider.tr('about_title')),
            const SizedBox(height: 10),
            _buildMenuCard([
              _buildMenuItem(
                icon: Icons.verified_outlined,
                title: 'RERA Compliance & Certification',
                subtitle: 'Registered & Certified Brokerage Firm in Telangana',
                onTap: () {},
              ),
              _buildDivider(),
              _buildMenuItem(
                icon: Icons.info_outline_rounded,
                title: 'About EstateHub',
                subtitle: 'Version 1.0.0 (Build 2026)',
                onTap: () {},
              ),
            ]),
            const SizedBox(height: 24),

            // Logout Button (if logged in)
            if (user != null)
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.danger),
                    foregroundColor: AppColors.danger,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    authProvider.logout();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Logged out successfully')),
                    );
                  },
                  child: Text(
                    langProvider.tr('sign_out'),
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                ),
              ),

            const SizedBox(height: 32),
            Text(
              '© ${DateTime.now().year} EstateHub Telangana. All rights reserved.',
              style: const TextStyle(fontSize: 11, color: AppColors.textLight),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title,
        style: AppTypography.heading3(color: AppColors.textDark),
      ),
    );
  }

  Widget _buildProfileStatCard({
    required IconData icon,
    required Color color,
    required String value,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 10),
          Text(value, style: AppTypography.heading2()),
          const SizedBox(height: 2),
          Text(label, style: AppTypography.bodySmall()),
        ],
      ),
    );
  }

  Widget _buildMenuCard(List<Widget> items) {
    return Material(
      color: AppColors.white,
      borderRadius: BorderRadius.circular(16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(children: items),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.navy.withOpacity(0.06),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: AppColors.navy, size: 20),
      ),
      title: Text(title, style: AppTypography.heading3().copyWith(fontSize: 14)),
      subtitle: Text(subtitle, style: AppTypography.bodySmall()),
      trailing: const Icon(Icons.arrow_forward_ios, size: 12, color: AppColors.textLight),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
    );
  }

  Widget _buildDivider() => const Divider(height: 1, indent: 64, color: AppColors.border);
}
