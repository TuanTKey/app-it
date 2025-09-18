import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'api_config.dart';

class AuthService {
  final http.Client client;

  AuthService({http.Client? client}) : client = client ?? http.Client();

  Future<Map<String, dynamic>> _handleResponse(http.Response response) async {
    final Map<String, dynamic> data = json.decode(response.body);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    } else {
      final errorMessage = data['message'] ??
          data['error'] ??
          'Đã xảy ra lỗi (${response.statusCode})';
      throw Exception(errorMessage);
    }
  }

  Future<User> login(String email, String password) async {
    try {
      final response = await client.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.login}'),
        headers: ApiConfig.headers,
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      final Map<String, dynamic> data = await _handleResponse(response);

      // Giả sử API trả về: { "user": {...}, "token": "jwt_token" }
      final User user = User.fromJson(data['user']);
      user.token = data['token'] ?? data['access_token'];

      // Lưu thông tin user và token
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user', json.encode(user.toJson()));
      await prefs.setString('token', user.token!);
      await prefs.setString('refresh_token', data['refresh_token'] ?? '');

      return user;
    } catch (e) {
      throw Exception('Đăng nhập thất bại: ${e.toString()}');
    }
  }

  Future<User> register(String name, String email, String password, String role) async {
    try {
      final response = await client.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.register}'),
        headers: ApiConfig.headers,
        body: json.encode({
          'name': name,
          'email': email,
          'password': password,
          'password_confirmation': password,
          'role': role,
        }),
      );

      final Map<String, dynamic> data = await _handleResponse(response);

      final User user = User.fromJson(data['user']);
      user.token = data['token'] ?? data['access_token'];

      // Lưu thông tin user và token
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user', json.encode(user.toJson()));
      await prefs.setString('token', user.token!);
      await prefs.setString('refresh_token', data['refresh_token'] ?? '');

      return user;
    } catch (e) {
      throw Exception('Đăng ký thất bại: ${e.toString()}');
    }
  }

  Future<void> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? token = prefs.getString('token');

      if (token != null) {
        // Gọi API logout nếu có token
        await client.post(
          Uri.parse('${ApiConfig.baseUrl}${ApiConfig.logout}'),
          headers: ApiConfig.headersWithToken(token),
        );
      }
    } catch (e) {
      print('Logout API error: $e');
      // Vẫn tiếp tục xóa local data dù API call fail
    } finally {
      // Luôn xóa dữ liệu local
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('user');
      await prefs.remove('token');
      await prefs.remove('refresh_token');
    }
  }

  Future<User?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final String? userString = prefs.getString('user');
    final String? token = prefs.getString('token');

    if (userString != null && token != null) {
      // Kiểm tra token còn valid không
      final bool isValid = await _checkTokenValidity(token);
      if (isValid) {
        final Map<String, dynamic> userMap = json.decode(userString);
        return User.fromJson(userMap);
      } else {
        // Thử refresh token
        try {
          final User? refreshedUser = await _refreshToken();
          return refreshedUser;
        } catch (e) {
          await logout(); // Token hết hạn và không refresh được
          return null;
        }
      }
    }
    return null;
  }

  Future<bool> _checkTokenValidity(String token) async {
    // Có thể implement JWT decode để check expiration
    // Hoặc gọi API validate token
    try {
      final response = await client.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.profile}'),
        headers: ApiConfig.headersWithToken(token),
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<User?> _refreshToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? refreshToken = prefs.getString('refresh_token');

      if (refreshToken == null) return null;

      final response = await client.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.refreshToken}'),
        headers: ApiConfig.headers,
        body: json.encode({'refresh_token': refreshToken}),
      );

      final Map<String, dynamic> data = await _handleResponse(response);

      // Cập nhật token mới
      final String? userString = prefs.getString('user');
      if (userString != null) {
        final Map<String, dynamic> userMap = json.decode(userString);
        final User user = User.fromJson(userMap);
        user.token = data['token'] ?? data['access_token'];

        await prefs.setString('user', json.encode(user.toJson()));
        await prefs.setString('token', user.token!);
        await prefs.setString('refresh_token', data['refresh_token'] ?? refreshToken);

        return user;
      }
    } catch (e) {
      print('Refresh token failed: $e');
    }
    return null;
  }

  // Hàm utility để lấy token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  // Hàm utility để kiểm tra đăng nhập
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token') != null;
  }
}