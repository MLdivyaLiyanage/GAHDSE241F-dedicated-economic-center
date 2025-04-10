import 'package:flutter/material.dart';

class Onboarding extends StatefulWidget {
  const Onboarding({super.key});

  @override
  State<Onboarding> createState() => _OnboardingState();
}

class _OnboardingState extends State<Onboarding> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        decoration: const BoxDecoration(
          gradient: LinearGradient(colors: [
            Color(0xffb51837),
            Color(0xff661c3a),
            Color(0xff301939)
          ],
            begin: Alignment.topLeft,
            end: Alignment.topRight,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              "images/greenlogo.png",
              color: Colors.white,
              height: 90,
              width: 90,
              fit: BoxFit.cover,
            ),
            const Text(
              "DEDICATED ECONOMIC\nCENTER",
              style: TextStyle(color: Colors.white, fontSize: 30.0),
            ),
            const SizedBox(height: 80.0),
            const Text(
              "Welcome Back",
              style: TextStyle(
                color: Colors.white,
                fontSize: 38.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 40.0,),
            Container(
              padding: const EdgeInsets.only(top: 12.0, bottom: 12.0),
              margin: const EdgeInsets.only(left: 30.0, right: 30.0),
              width: MediaQuery.of(context).size.width,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.white60, width: 2.0),
                borderRadius: BorderRadius.circular(30),
              ),
              child: const Center(
                child: Text(
                  "SIGN IN",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 25.0,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 40.0,),
            Container(
              padding: const EdgeInsets.only(top: 12.0, bottom: 12.0),
              margin: const EdgeInsets.only(left: 30.0, right: 30.0),
              width: MediaQuery.of(context).size.width,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(30),
              ),
              child: const Center(
                child: Text(
                  "SIGN UP",
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 25.0,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
            SizedBox(height: MediaQuery.of(context).size.height/8,),
            const Text(
                  "Login with Social Media",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20.0,
                  ),
            ),
            const SizedBox(height: 20.0,),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(60)), 
                child: Image.asset(
                  "images/instagram.png",
                  height: 40,
                  width: 40,
                  fit: BoxFit.cover,),
              ),
              const SizedBox(width: 20.0,),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(60)), 
                child: Image.asset(
                  "images/facebook.png",
                  height: 40,
                  width: 40,
                  fit: BoxFit.cover,),
              ),
              const SizedBox(width: 20.0,),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(60)), 
                child: Image.asset(
                  "images/google.png",
                  height: 40,
                  width: 40,
                  fit: BoxFit.cover,),
              )
            ],)
          ],
        ),
      ),
    );
  }
}
