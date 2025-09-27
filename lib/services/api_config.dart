class ApiConfig {
  static const String baseUrl = 'https://your-backend-domain.com/api';
  // Hoặc sử dụng localhost cho development (đối với Android emulator dùng 10.0.2.2)
  static const String baseUrl = 'http://10.0.2.2:3000/api';

  // Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh-token';
  static const String profile = '/user/profile';

  // Headers
  static const Map<String, String> headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  static Map<String, String> headersWithToken(String token) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }
}