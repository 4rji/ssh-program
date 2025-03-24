import 'dart:io';
import '../models/ssh_host.dart';

class SSHService {
  Future<List<SSHHost>> findOnlineHosts() async {
    final hosts = await _parseSSHConfig();
    final onlineHosts = <SSHHost>[];

    for (var entry in hosts.entries) {
      final host = entry.key;
      var ip = entry.value;
      
      if (ip.isEmpty) {
        ip = host;
      }

      if (await _isOnline(ip)) {
        onlineHosts.add(SSHHost(name: host, ip: ip));
      }
    }

    // Ordenar por nombre
    onlineHosts.sort((a, b) => a.name.compareTo(b.name));
    return onlineHosts;
  }

  Future<Map<String, String>> _parseSSHConfig() async {
    final hosts = <String, String>{};
    final sshConfigPath = '${Platform.environment['HOME']}/.ssh/config';
    final file = File(sshConfigPath);

    if (!await file.exists()) {
      return hosts;
    }

    String currentHost = '';
    final lines = await file.readAsLines();

    for (var line in lines) {
      // Remover comentarios
      final commentIndex = line.indexOf('#');
      if (commentIndex >= 0) {
        line = line.substring(0, commentIndex);
      }
      line = line.trim();
      
      if (line.isEmpty) {
        continue;
      }

      final parts = line.split(RegExp(r'\s+'));
      if (parts.length < 2) {
        continue;
      }

      final key = parts[0].toLowerCase();
      if (key == 'host') {
        for (var i = 1; i < parts.length; i++) {
          hosts[parts[i]] = '';
          currentHost = parts[i];
        }
      } else if (key == 'hostname' && currentHost.isNotEmpty) {
        hosts[currentHost] = parts[1];
      }
    }

    return hosts;
  }

  Future<bool> _isOnline(String ip) async {
    try {
      final result = await Process.run('ping', ['-c1', '-W1', ip]);
      return result.exitCode == 0;
    } catch (e) {
      return false;
    }
  }

  Future<void> connectToSSH(String host) async {
    // Mostrar mensaje de conexión
    print('Conectando a $host...');
    try {
      // Ejecutar el proceso SSH en segundo plano
      final process = await Process.start('ssh', [host], mode: ProcessStartMode.inheritStdio);
      print('Conexión establecida con $host.');
      
      // Escuchar la salida del proceso para mantener el programa activo
      await process.exitCode;
      print('Conexión finalizada con $host.');
    } catch (e) {
      print('Error al conectar con $host: $e');
    }
  }
}