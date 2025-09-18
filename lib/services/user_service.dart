import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'api_interceptor.dart';
import 'api_config.dart';

class UserService {
  final ApiInterceptor interceptor;

  UserService({ApiInterceptor? interceptor})
      : interceptor = interceptor ?? ApiInterceptor();

  Future<User> getProfile() async {
    try {
      final response = await interceptor.get(
        '${ApiConfig.baseUrl}${ApiConfig.profile}',
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return User.fromJson(data['user'] ?? data);
      } else {
        throw Exception('Failed to load profile: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to load profile: $e');
    }
  }

  Future<User> updateProfile(Map<String, dynamic> updates) async {
    try {
      final response = await interceptor.put(
        '${ApiConfig.baseUrl}${ApiConfig.profile}',
        body: json.encode(updates),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return User.fromJson(data['user'] ?? data);
      } else {
        throw Exception('Failed to update profile: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to update profile: $e');
    }
  }

  Future<void> changePassword(String currentPassword,
      String newPassword) async {
    try {
      final response = await interceptor.post(
        '${ApiConfig.baseUrl}/auth/change-password',
        body: json.encode({
          'current_password': currentPassword,
          'new_password': newPassword,
          'new_password_confirmation': newPassword,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to change password: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to change password: $e');
    }
  }

  Future<void> uploadAvatar(String imagePath) async {
    try {
      // Tạo multipart request cho file upload
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiConfig.baseUrl}/user/avatar'),
      );

      // Thêm file
      request.files.add(await http.MultipartFile.fromPath(
        'avatar',
        imagePath,
      ));

      // Thêm token - SỬA CÁCH LẤY TOKEN Ở ĐÂY
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('token');

      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      final response = await request.send();

      if (response.statusCode != 200) {
        throw Exception('Failed to upload avatar: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to upload avatar: $e');
    }
  }
}