import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/notification_provider.dart';
import '../../providers/property_provider.dart';
import '../details/property_detail_screen.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  IconData _getIcon(String type) {
    switch (type) {
      case 'listing':
        return Icons.star_rounded;
      case 'price_drop':
        return Icons.trending_down_rounded;
      case 'inquiry':
        return Icons.mark_email_read_rounded;
      case 'system':
      default:
        return Icons.campaign_rounded;
    }
  }

  Color _getColor(String type) {
    switch (type) {
      case 'listing':
        return AppColors.gold;
      case 'price_drop':
        return AppColors.danger;
      case 'inquiry':
        return AppColors.agriculture;
      case 'system':
      default:
        return AppColors.navy;
    }
  }

  @override
  Widget build(BuildContext context) {
    final notifProvider = Provider.of<NotificationProvider>(context);
    final propertyProvider = Provider.of<PropertyProvider>(context, listen: false);
    final notifications = notifProvider.notifications;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Text('Updates & Alerts', style: AppTypography.heading2(color: AppColors.cream)),
        actions: [
          if (notifications.isNotEmpty) ...[
            TextButton(
              onPressed: () => notifProvider.clearAll(),
              child: const Text('Clear All', style: TextStyle(color: AppColors.cream, fontSize: 12)),
            ),
            if (notifProvider.unreadCount > 0)
              TextButton(
                onPressed: () => notifProvider.markAllAsRead(),
                child: const Text('Mark Read', style: TextStyle(color: AppColors.goldBright, fontSize: 12)),
              ),
          ],
        ],
      ),
      body: RefreshIndicator(
        color: AppColors.gold,
        backgroundColor: AppColors.navy,
        onRefresh: () => notifProvider.fetchUpdates(),
        child: notifications.isEmpty
            ? ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.25),
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.notifications_off_outlined, size: 60, color: AppColors.textLight),
                        const SizedBox(height: 16),
                        Text('No Updates or Alerts', style: AppTypography.heading2()),
                        const SizedBox(height: 6),
                        Text(
                          'New property listings from the seller portal will appear here.',
                          textAlign: TextAlign.center,
                          style: AppTypography.bodySmall(),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () => notifProvider.fetchUpdates(),
                          icon: const Icon(Icons.refresh_rounded, size: 16),
                          label: const Text('Refresh Alerts'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.navy,
                            foregroundColor: AppColors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              )
            : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: notifications.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final notif = notifications[index];
                final iconColor = _getColor(notif.type);

                return GestureDetector(
                  onTap: () {
                    notifProvider.markAsRead(notif.id);
                    if (notif.propertyId != null) {
                      final prop = propertyProvider.allProperties.firstWhere(
                        (p) => p.id == notif.propertyId,
                        orElse: () => propertyProvider.allProperties.first,
                      );
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PropertyDetailScreen(property: prop),
                        ),
                      );
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: notif.isRead ? AppColors.white : AppColors.goldSurface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: notif.isRead ? AppColors.border : AppColors.gold.withOpacity(0.4),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.03),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: iconColor.withOpacity(0.12),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(_getIcon(notif.type), color: iconColor, size: 20),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      notif.title,
                                      style: TextStyle(
                                        fontSize: 13.5,
                                        fontWeight: notif.isRead ? FontWeight.w600 : FontWeight.bold,
                                        color: AppColors.textDark,
                                      ),
                                    ),
                                  ),
                                  Text(
                                    DateFormat.jm().format(notif.timestamp),
                                    style: const TextStyle(fontSize: 10, color: AppColors.textLight),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 5),
                              Text(
                                notif.message,
                                style: AppTypography.bodySmall(
                                  color: notif.isRead ? AppColors.textMuted : AppColors.textBody,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
      ),
    );
  }
}
