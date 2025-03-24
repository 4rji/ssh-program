import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const SSHManagerApp());
}

class SSHManagerApp extends StatelessWidget {
  const SSHManagerApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SSH Host Manager',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomeScreen(),
    );
  }
}