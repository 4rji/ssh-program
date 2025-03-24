import 'package:flutter/material.dart';
import '../services/ssh_service.dart';
import '../models/ssh_host.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final SSHService _sshService = SSHService();
  List<SSHHost> _onlineHosts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadHosts();
  }

  Future<void> _loadHosts() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final hosts = await _sshService.findOnlineHosts();
      setState(() {
        _onlineHosts = hosts;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    }
  }

  void _connectToSSH(String host) async {
    try {
      await _sshService.connectToSSH(host);
      // Esto normalmente no se ejecutará porque la aplicación termina al conectar
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al conectar: ${e.toString()}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SSH Host Manager'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Selecciona un host para conectar vía SSH',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            if (_isLoading)
              const Center(
                child: Column(
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 8),
                    Text('Buscando hosts online...'),
                  ],
                ),
              )
            else if (_onlineHosts.isEmpty)
              const Center(
                child: Text('No hay hosts online'),
              )
            else
              Expanded(
                child: ListView.builder(
                  itemCount: _onlineHosts.length,
                  itemBuilder: (context, index) {
                    final host = _onlineHosts[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 4),
                      child: ListTile(
                        title: Text(host.name),
                        subtitle: Text(host.ip),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text(
                              'ONLINE',
                              style: TextStyle(color: Colors.green),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton(
                              onPressed: () => _connectToSSH(host.name),
                              child: const Text('Conectar'),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _loadHosts,
        tooltip: 'Refrescar',
        child: const Icon(Icons.refresh),
      ),
    );
  }
}