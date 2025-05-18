// ignore_for_file: depend_on_referenced_packages, sort_child_properties_last, deprecated_member_use, unnecessary_string_escapes

import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:http_parser/http_parser.dart';
import 'package:economic_center_mobileapp/pages/UserProfile.dart';
import 'package:economic_center_mobileapp/pages/categary.dart';
import 'package:economic_center_mobileapp/pages/message.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fresh Grocery',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF3B82F6),
          primary: const Color(0xFF3B82F6),
          secondary: const Color(0xFFEF4444),
          tertiary: const Color(0xFF10B981),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        fontFamily: 'Poppins',
        appBarTheme: const AppBarTheme(elevation: 0, centerTitle: true),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 2,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        cardTheme: CardTheme(
          elevation: 3,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF3B82F6),
          primary: const Color(0xFF3B82F6),
          secondary: const Color(0xFFEF4444),
          tertiary: const Color(0xFF10B981),
          brightness: Brightness.dark,
          // ignore: deprecated_member_use
          background: const Color(0xFF0F172A),
          surface: const Color(0xFF1E293B),
          onSurface: Colors.white70,
        ),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        fontFamily: 'Poppins',
        appBarTheme: const AppBarTheme(
          elevation: 0,
          centerTitle: true,
          backgroundColor: Color(0xFF1E293B),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 2,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        cardTheme: CardTheme(
          elevation: 3,
          color: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
      themeMode: ThemeMode.system,
      home: const SriLankaExplorer(),
    );
  }
}

class SriLankaExplorer extends StatefulWidget {
  const SriLankaExplorer({super.key});

  @override
  State<SriLankaExplorer> createState() => _SriLankaExplorerState();
}

class _SriLankaExplorerState extends State<SriLankaExplorer>
    with SingleTickerProviderStateMixin {
  GoogleMapController? _mapController;
  final TextEditingController _searchController = TextEditingController();
  bool _isLoading = true;
  String? _errorMsg;
  MapType _currentMapType = MapType.normal;
  bool _showSatelliteView = false;
  bool _showFullScreenMap = false;
  late TabController _tabController;

  // Sri Lanka coordinates (center of the country)
  static const LatLng _sriLankaCoords = LatLng(7.8731, 80.7718);

  // Markers for locations
  final Set<Marker> _markers = {};
  final List<LocationData> _locations = [];

  // Selected location
  LocationData? _selectedLocation;

  // Initial camera position
  static const CameraPosition _initialCameraPosition = CameraPosition(
    target: _sriLankaCoords,
    zoom: 8,
  );

  // Sri Lanka boundary polygon
  final Set<Polygon> _polygons = {};

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _setupInitialLocations();
    _setupSriLankaBoundary();
  }

  @override
  void dispose() {
    _mapController?.dispose();
    _searchController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  void _setupSriLankaBoundary() {
    // Define Sri Lanka boundary with polygon (simplified coordinates)
    final List<LatLng> sriLankaBoundary = [
      const LatLng(9.8358, 80.2041), // Northern point
      const LatLng(8.7925, 81.1787), // Eastern point
      const LatLng(7.8731, 81.8593), // East coast
      const LatLng(6.9271, 81.7917), // Southeast
      const LatLng(6.0350, 81.1159), // Southern point
      const LatLng(6.0542, 80.2504), // Southwest coast
      const LatLng(7.2374, 79.8708), // Western coast
      const LatLng(8.7261, 79.8989), // Northwestern area
      const LatLng(9.8358, 80.2041), // Back to Northern point
    ];

    _polygons.add(
      Polygon(
        polygonId: const PolygonId('srilanka_boundary'),
        points: sriLankaBoundary,
        strokeColor: const Color(0xFF3B82F6),
        strokeWidth: 3,
        // ignore: deprecated_member_use
        fillColor: const Color(0xFF93C5FD).withOpacity(0.35),
      ),
    );
  }

  void _setupInitialLocations() {
    // Add some initial markers for key cities and Dedicated Economic Centers
    final List<LocationData> initialLocations = [
      LocationData(
        id: 1,
        name: 'Colombo',
        position: const LatLng(6.9271, 79.8612),
        type: 'City',
        description: 'Commercial capital and largest city of Sri Lanka',
      ),
      LocationData(
        id: 2,
        name: 'Kandy',
        position: const LatLng(7.2906, 80.6337),
        type: 'City',
        description: 'Cultural capital famous for Temple of the Tooth Relic',
      ),
      LocationData(
        id: 3,
        name: 'Dambulla DEC',
        position: const LatLng(7.8679, 80.6494),
        type: 'Economic Center',
        description:
            'Major Dedicated Economic Centre for agricultural products',
      ),
      LocationData(
        id: 4,
        name: 'Narahenpita DEC',
        position: const LatLng(6.9053, 79.8795),
        type: 'Economic Center',
        description: 'Economic hub in the Colombo district',
      ),
      LocationData(
        id: 5,
        name: 'Meegoda DEC',
        position: const LatLng(6.8361, 80.0953),
        type: 'Economic Center',
        description: 'Important agricultural trading center near Colombo',
      ),
    ];

    for (final location in initialLocations) {
      _addMarker(location);
      _locations.add(location);
    }
  }

  void _addMarker(LocationData location) {
    final BitmapDescriptor markerIcon = location.type == 'Economic Center'
        ? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen)
        : BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed);

    _markers.add(
      Marker(
        markerId: MarkerId(location.id.toString()),
        position: location.position,
        infoWindow: InfoWindow(title: location.name, snippet: location.type),
        icon: markerIcon,
        onTap: () {
          setState(() {
            _selectedLocation = location;
          });
        },
      ),
    );
  }

  Future<void> _searchLocation() async {
    if (_searchController.text.trim().isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Geocode the address with Sri Lanka bounds
      final locations = await locationFromAddress(
        '${_searchController.text}, Sri Lanka',
      );

      if (locations.isNotEmpty) {
        final location = locations.first;
        final newLocation = LocationData(
          id: DateTime.now().millisecondsSinceEpoch,
          name: _searchController.text,
          position: LatLng(location.latitude, location.longitude),
          type: 'Custom',
          description: 'User searched location',
        );

        // Check if location is within Sri Lanka bounds (approximate check)
        if (location.latitude >= 5.9 &&
            location.latitude <= 9.9 &&
            location.longitude >= 79.4 &&
            location.longitude <= 81.9) {
          setState(() {
            _addMarker(newLocation);
            _locations.add(newLocation);
            _selectedLocation = newLocation;
            _searchController.clear();
          });

          // Animate to the location
          _mapController?.animateCamera(
            CameraUpdate.newCameraPosition(
              CameraPosition(target: newLocation.position, zoom: 14),
            ),
          );
        } else {
          // ignore: use_build_context_synchronously
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Location not found in Sri Lanka'),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      } else {
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Location not found'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMsg = 'Error searching location: $e';
      });
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // ignore: unused_element
  void _clearMarkers() {
    setState(() {
      // Keep only the initial markers
      _markers.clear();
      _locations.clear();
      _selectedLocation = null;
      _setupInitialLocations();

      // Reset map to initial position
      _mapController?.animateCamera(
        CameraUpdate.newCameraPosition(_initialCameraPosition),
      );
    });
  }

  void _toggleMapType() {
    setState(() {
      _showSatelliteView = !_showSatelliteView;
      _currentMapType = _showSatelliteView ? MapType.satellite : MapType.normal;
    });
  }

  void _toggleFullScreenMap() {
    setState(() {
      _showFullScreenMap = !_showFullScreenMap;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: _showFullScreenMap
          ? null
          : AppBar(
              title: Column(
                children: [
                  const Text(
                    'DEDICATED ECONOMIC CENTRES',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    'Sri Lanka Explorer',
                    style: TextStyle(
                      fontSize: 14,
                      color: isDarkMode ? Colors.white70 : Colors.black54,
                    ),
                  ),
                ],
              ),
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(4),
                child: Container(
                  height: 4,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Color(0xFF800000), // Maroon
                        Color(0xFFFF7722), // Orange
                        Color(0xFFF9BC24), // Yellow
                        Color(0xFF018749), // Green
                      ],
                    ),
                  ),
                ),
              ),
            ),
      body: Column(
        children: [
          if (!_showFullScreenMap) _buildSearchBar(),
          Expanded(
            child: Stack(
              children: [
                // Map view
                GoogleMap(
                  initialCameraPosition: _initialCameraPosition,
                  markers: _markers,
                  polygons: _polygons,
                  mapType: _currentMapType,
                  myLocationEnabled: true,
                  myLocationButtonEnabled: false,
                  zoomControlsEnabled: false,
                  compassEnabled: true,
                  onMapCreated: (GoogleMapController controller) {
                    _mapController = controller;

                    // Set custom map style
                    if (!_showSatelliteView) {
                      // ignore: deprecated_member_use
                      controller.setMapStyle(_mapStyle);
                    }

                    setState(() {
                      _isLoading = false;
                    });
                  },
                ),

                // Map Controls Overlay
                Positioned(
                  top: 16,
                  right: 16,
                  child: Column(
                    children: [
                      // Satellite toggle
                      Container(
                        decoration: BoxDecoration(
                          color: Theme.of(context).cardColor,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black26,
                              blurRadius: 6,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: IconButton(
                          icon: Icon(
                            _showSatelliteView
                                ? Icons.satellite_alt_rounded
                                : Icons.map_rounded,
                            color: _showSatelliteView
                                ? Theme.of(context).colorScheme.secondary
                                : Theme.of(context).colorScheme.primary,
                          ),
                          onPressed: _toggleMapType,
                          tooltip: _showSatelliteView
                              ? 'Show Map'
                              : 'Show Satellite',
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Fullscreen toggle
                      Container(
                        decoration: BoxDecoration(
                          color: Theme.of(context).cardColor,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black26,
                              blurRadius: 6,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: IconButton(
                          icon: Icon(
                            _showFullScreenMap
                                ? Icons.fullscreen_exit_rounded
                                : Icons.fullscreen_rounded,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          onPressed: _toggleFullScreenMap,
                          tooltip: _showFullScreenMap
                              ? 'Exit Fullscreen'
                              : 'Fullscreen',
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Reset view
                      Container(
                        decoration: BoxDecoration(
                          color: Theme.of(context).cardColor,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black26,
                              blurRadius: 6,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: IconButton(
                          icon: Icon(
                            Icons.center_focus_strong_rounded,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          onPressed: () {
                            _mapController?.animateCamera(
                              CameraUpdate.newCameraPosition(
                                _initialCameraPosition,
                              ),
                            );
                          },
                          tooltip: 'Reset View',
                        ),
                      ),
                    ],
                  ),
                ),

                // Loading indicator
                if (_isLoading)
                  Container(
                    // ignore: deprecated_member_use
                    color: Colors.black.withOpacity(0.5),
                    child: const Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircularProgressIndicator(color: Colors.white),
                          SizedBox(height: 16),
                          Text(
                            'Loading map of Sri Lanka...',
                            style: TextStyle(color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),

                // Error message
                if (_errorMsg != null)
                  Container(
                    // ignore: deprecated_member_use
                    color: Colors.black.withOpacity(0.7),
                    child: Center(
                      child: Card(
                        margin: const EdgeInsets.all(32),
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.error_outline,
                                color: Colors.red,
                                size: 48,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                _errorMsg!,
                                style: const TextStyle(color: Colors.red),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton.icon(
                                onPressed: () {
                                  setState(() {
                                    _errorMsg = null;
                                    _isLoading = true;
                                  });
                                  // Reinitialize map
                                  if (_mapController != null) {
                                    _mapController!.dispose();
                                    _mapController = null;
                                  }
                                },
                                icon: const Icon(Icons.refresh),
                                label: const Text('Try Again'),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                // Location Detail Card (when location is selected)
                if (_selectedLocation != null && !_showFullScreenMap)
                  Positioned(
                    left: 16,
                    right: 16,
                    bottom: 16,
                    child: Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  _selectedLocation!.type == 'Economic Center'
                                      ? Icons.store_rounded
                                      : Icons.location_city_rounded,
                                  color:
                                      _selectedLocation!.type ==
                                          'Economic Center'
                                      ? Theme.of(context).colorScheme.tertiary
                                      : Theme.of(context).colorScheme.secondary,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    _selectedLocation!.name,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.close),
                                  onPressed: () {
                                    setState(() {
                                      _selectedLocation = null;
                                    });
                                  },
                                ),
                              ],
                            ),
                            const Divider(),
                            Text(
                              'Type: ${_selectedLocation!.type}',
                              style: TextStyle(
                                color: isDarkMode
                                    ? Colors.white70
                                    : Colors.black87,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _selectedLocation!.description,
                              style: TextStyle(
                                color: isDarkMode
                                    ? Colors.white60
                                    : Colors.black54,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(
                                  Icons.pin_drop,
                                  size: 16,
                                  color: isDarkMode
                                      ? Colors.white54
                                      : Colors.black45,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'Lat: ${_selectedLocation!.position.latitude.toStringAsFixed(4)}, '
                                  'Lng: ${_selectedLocation!.position.longitude.toStringAsFixed(4)}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: isDarkMode
                                        ? Colors.white54
                                        : Colors.black45,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                OutlinedButton.icon(
                                  icon: const Icon(Icons.directions),
                                  label: const Text('Directions'),
                                  onPressed: () {
                                    // Future implementation: open directions in map
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text(
                                          'Directions feature coming soon!',
                                        ),
                                        behavior: SnackBarBehavior.floating,
                                      ),
                                    );
                                  },
                                ),
                                const SizedBox(width: 8),
                                ElevatedButton.icon(
                                  icon: const Icon(Icons.explore),
                                  label: const Text('Explore'),
                                  onPressed: () {
                                    // Zoom in to location
                                    _mapController?.animateCamera(
                                      CameraUpdate.newCameraPosition(
                                        CameraPosition(
                                          target: _selectedLocation!.position,
                                          zoom: 16,
                                          tilt: 45,
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavigationBar(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.white, Colors.green.shade50],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: isDarkMode ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    // ignore: deprecated_member_use
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search locations in Sri Lanka...',
                  hintStyle: TextStyle(
                    color: isDarkMode ? Colors.white60 : Colors.black45,
                  ),
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear),
                          onPressed: () {
                            _searchController.clear();
                            setState(() {});
                          },
                        )
                      : null,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                ),
                onChanged: (value) {
                  setState(() {});
                },
                onSubmitted: (_) => _searchLocation(),
              ),
            ),
          ),
          const SizedBox(width: 12),
          ElevatedButton(
            onPressed: _isLoading ? null : _searchLocation,
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              minimumSize: const Size(48, 48),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : const Icon(Icons.search),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoPanel() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      height: 140,
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            // ignore: deprecated_member_use
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TabBar(
            controller: _tabController,
            tabs: const [
              Tab(text: 'Locations'),
              Tab(text: 'About'),
            ],
            indicatorColor: Theme.of(context).colorScheme.primary,
            labelColor: Theme.of(context).colorScheme.primary,
            unselectedLabelColor: isDarkMode ? Colors.white60 : Colors.black54,
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Locations tab
                _locations.isEmpty
                    ? const Center(child: Text('No locations to display'))
                    : ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _locations.length,
                        itemBuilder: (context, index) {
                          final location = _locations[index];
                          final isSelected =
                              _selectedLocation?.id == location.id;

                          return Card(
                            margin: const EdgeInsets.only(
                              right: 12,
                              top: 8,
                              bottom: 8,
                            ),
                            color: isSelected
                                ? Theme.of(context).colorScheme.primary
                                  // ignore: deprecated_member_use
                                  .withOpacity(0.1)
                                : null,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: isSelected
                                  ? BorderSide(
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.primary,
                                      width: 2,
                                    )
                                  : BorderSide(
                                      color: isDarkMode
                                          ? Colors.white12
                                          : Colors.black12,
                                    ),
                            ),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(12),
                              onTap: () {
                                setState(() {
                                  _selectedLocation = location;
                                });

                                // Animate to the location
                                _mapController?.animateCamera(
                                  CameraUpdate.newCameraPosition(
                                    CameraPosition(
                                      target: location.position,
                                      zoom: 14,
                                    ),
                                  ),
                                );
                              },
                              child: Container(
                                width: 150,
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Icon(
                                          location.type == 'Economic Center'
                                              ? Icons.store_rounded
                                              : Icons.location_city_rounded,
                                          size: 16,
                                          color:
                                              location.type == 'Economic Center'
                                              ? Theme.of(
                                                  context,
                                                ).colorScheme.tertiary
                                              : Theme.of(
                                                  context,
                                                ).colorScheme.secondary,
                                        ),
                                        const SizedBox(width: 4),
                                        Expanded(
                                          child: Text(
                                            location.type,
                                            style: const TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w500,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      location.name,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),

                // About tab
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildInfoCard(
                        icon: Icons.info_outline,
                        title: 'About Sri Lanka',
                        content:
                            'Island nation in South Asia known for its diverse landscapes and rich cultural heritage.',
                      ),
                      _buildInfoCard(
                        icon: Icons.store,
                        title: 'Dedicated Economic Centres',
                        content:
                            'Special markets for agricultural products connecting farmers directly with buyers.',
                      ),
                      _buildInfoCard(
                        icon: Icons.public,
                        title: 'Key Facts',
                        content:
                            'Capital: Colombo (Commercial) | Population: 22 million | Languages: Sinhala, Tamil, English',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String content,
  }) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Card(
      margin: const EdgeInsets.only(right: 12, top: 8, bottom: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: isDarkMode ? Colors.white12 : Colors.black12),
      ),
      child: Container(
        width: 200,
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  size: 16,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Expanded(
              child: Text(
                content,
                style: TextStyle(
                  fontSize: 11,
                  color: isDarkMode ? Colors.white70 : Colors.black87,
                ),
                overflow: TextOverflow.ellipsis,
                maxLines: 3,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
