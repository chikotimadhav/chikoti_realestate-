import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/gold_button.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedRole = 'buyer'; // buyer or seller
  bool _obscurePassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.register(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      password: _passwordController.text,
      role: _selectedRole,
    );

    if (mounted) {
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Account created successfully, ${authProvider.user?.name}!'),
            backgroundColor: AppColors.agriculture,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(authProvider.errorMessage.isNotEmpty
                ? authProvider.errorMessage
                : 'Registration failed. Please check your details.'),
            backgroundColor: AppColors.danger,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.navy),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Create Account', style: AppTypography.heading1(color: AppColors.navy)),
                const SizedBox(height: 6),
                Text(
                  'Join EstateHub to explore verified lands & luxury villas',
                  style: AppTypography.bodyMedium(color: AppColors.textMuted),
                ),
                const SizedBox(height: 24),

                // Role selection chips
                Text('I am registering as:', style: AppTypography.labelBold()),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: ChoiceChip(
                        label: const Center(child: Text('Property Buyer / Investor')),
                        selected: _selectedRole == 'buyer',
                        onSelected: (val) => setState(() => _selectedRole = 'buyer'),
                        selectedColor: AppColors.navy,
                        backgroundColor: AppColors.white,
                        labelStyle: TextStyle(
                          color: _selectedRole == 'buyer' ? AppColors.cream : AppColors.textDark,
                          fontWeight: FontWeight.bold,
                        ),
                        side: BorderSide(
                          color: _selectedRole == 'buyer' ? AppColors.gold : AppColors.border,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ChoiceChip(
                        label: const Center(child: Text('Land Owner / Seller')),
                        selected: _selectedRole == 'seller',
                        onSelected: (val) => setState(() => _selectedRole = 'seller'),
                        selectedColor: AppColors.navy,
                        backgroundColor: AppColors.white,
                        labelStyle: TextStyle(
                          color: _selectedRole == 'seller' ? AppColors.cream : AppColors.textDark,
                          fontWeight: FontWeight.bold,
                        ),
                        side: BorderSide(
                          color: _selectedRole == 'seller' ? AppColors.gold : AppColors.border,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                CustomTextField(
                  label: 'Full Name',
                  hintText: 'e.g. Madhav Chikoti',
                  controller: _nameController,
                  prefixIcon: Icons.person_outline,
                  validator: (v) => v == null || v.trim().isEmpty ? 'Name required' : null,
                ),
                const SizedBox(height: 14),

                CustomTextField(
                  label: 'Email Address',
                  hintText: 'e.g. madhav@example.com',
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  prefixIcon: Icons.email_outlined,
                  validator: (v) => v == null || !v.contains('@') ? 'Valid email required' : null,
                ),
                const SizedBox(height: 14),

                CustomTextField(
                  label: 'Phone Number',
                  hintText: 'e.g. +91 98765 43210',
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  prefixIcon: Icons.phone_outlined,
                  validator: (v) => v == null || v.trim().isEmpty ? 'Phone number required' : null,
                ),
                const SizedBox(height: 14),

                CustomTextField(
                  label: 'Password',
                  hintText: 'Minimum 6 characters',
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  prefixIcon: Icons.lock_outline,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off : Icons.visibility,
                      color: AppColors.textLight,
                      size: 20,
                    ),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                  validator: (v) => v == null || v.length < 6 ? 'Password must be 6+ characters' : null,
                ),
                const SizedBox(height: 26),

                GoldButton(
                  text: 'Create Account',
                  isLoading: authProvider.isLoading,
                  onPressed: _handleRegister,
                ),
                const SizedBox(height: 16),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Already registered?',
                      style: AppTypography.bodyMedium(color: AppColors.textMuted),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (_) => const LoginScreen()),
                        );
                      },
                      child: Text(
                        'Sign In',
                        style: AppTypography.labelBold(color: AppColors.goldMuted),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
