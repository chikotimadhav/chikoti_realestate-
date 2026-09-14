import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../core/constants/app_colors.dart';

class SmartImage extends StatelessWidget {
  final String? imageUrl;
  final BoxFit fit;
  final double? width;
  final double? height;
  final Widget? placeholder;
  final Widget? errorWidget;

  const SmartImage({
    super.key,
    required this.imageUrl,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
    this.placeholder,
    this.errorWidget,
  });

  @override
  Widget build(BuildContext context) {
    final raw = imageUrl?.trim() ?? '';

    if (raw.isEmpty) {
      return _buildDefaultError();
    }

    // 1. Base64 Data URI (e.g. data:image/jpeg;base64,/9j/4AAQSk...)
    if (raw.startsWith('data:image') || raw.contains(';base64,')) {
      try {
        final commaIdx = raw.indexOf(',');
        final b64String = commaIdx != -1 ? raw.substring(commaIdx + 1) : raw;
        final Uint8List bytes = base64Decode(b64String);
        return Image.memory(
          bytes,
          fit: fit,
          width: width,
          height: height,
          errorBuilder: (_, __, ___) => errorWidget ?? _buildDefaultError(),
        );
      } catch (_) {
        return errorWidget ?? _buildDefaultError();
      }
    }

    // 2. Standard Web URL (http / https)
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return CachedNetworkImage(
        imageUrl: raw,
        fit: fit,
        width: width,
        height: height,
        placeholder: (_, __) => placeholder ?? _buildDefaultPlaceholder(),
        errorWidget: (_, __, ___) => errorWidget ?? _buildDefaultError(),
      );
    }

    // 3. Local Asset
    if (raw.startsWith('assets/')) {
      return Image.asset(
        raw,
        fit: fit,
        width: width,
        height: height,
        errorBuilder: (_, __, ___) => errorWidget ?? _buildDefaultError(),
      );
    }

    // 4. Try raw base64 decode if long string
    if (raw.length > 200 && !raw.contains(' ')) {
      try {
        final Uint8List bytes = base64Decode(raw);
        return Image.memory(
          bytes,
          fit: fit,
          width: width,
          height: height,
          errorBuilder: (_, __, ___) => errorWidget ?? _buildDefaultError(),
        );
      } catch (_) {}
    }

    return errorWidget ?? _buildDefaultError();
  }

  Widget _buildDefaultPlaceholder() {
    return Container(
      width: width,
      height: height,
      color: const Color(0xFFE2E8F0),
      child: const Center(
        child: SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.gold),
        ),
      ),
    );
  }

  Widget _buildDefaultError() {
    return Container(
      width: width,
      height: height,
      color: AppColors.navyLight,
      child: const Center(
        child: Icon(Icons.home_work_outlined, color: AppColors.gold, size: 36),
      ),
    );
  }
}
