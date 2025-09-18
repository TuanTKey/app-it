import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'api_config.dart';

class ApiInterceptor {
  final http.Client client;
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  ApiInterceptor({http.Client? client}) : client = client ?? http.Client();

  Future<http.Response> get(String url, {Map<String, String>? headers}) async {
    return _requestWithToken((token) {
      return client.get(
        Uri.parse(url),
        headers: headers ?? ApiConfig.headersWithToken(token),
      );
    });
  }

  Future<http.Response> post(String url, {Map<String, String>? headers, Object? body}) async {
    return _requestWithToken((token) {
      return client.post(
        Uri.parse(url),
        headers: headers ?? ApiConfig.headersWithToken(token),
        body: body,
      );
    });
  }

  Future<http.Response> put(String url, {Map<String, String>? headers, Object? body}) async {
    return _requestWithToken((token) {
      return client.put(
        Uri.parse(url),
        headers: headers ?? ApiConfig.headersWithToken(token),
        body: body,
      );
    });
  }

  Future<http.Response> delete(String url, {Map<String, String>? headers}) async {
    return _requestWithToken((token) {
      return client.delete(
        Uri.parse(url),
        headers: headers ?? ApiConfig.headersWithToken(token),
      );
    });
  }

  Future<http.Response> _requestWithToken(
      Future<http.Response> Function(String token) request,
      ) async {
    final prefs = await _prefs;
    String? token = prefs.getString('token');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    // Thực hiện request
    http.Response response = await request(token);

    // Nếu token hết hạn, thử refresh
    if (response.statusCode == 401) {
      final String? newToken = await _refreshToken();
      if (newToken != null) {
        // Thử lại request với token mới
        response = await request(newToken);
      } else {
        throw Exception('Authentication failed');
      }
    }

    return response;
  }

  Future<String?> _refreshToken() async {
    final prefs = await _prefs;
    final String? refreshToken = prefs.getString('refresh_token');

    if (refreshToken == null) return null;

    try {
      final response = await client.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.refreshToken}'),
        headers: ApiConfig.headers,
        body: json.encode({'refresh_token': refreshToken}),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final String newToken = data['token'] ?? data['access_token'];
        final String newRefreshToken = data['refresh_token'] ?? refreshToken;

        await prefs.setString('token', newToken);
        await prefs.setString('refresh_token', newRefreshToken);

        return newToken;
      }
    } catch (e) {
      print('Token refresh failed: $e');
    }

    return null;
  }
}