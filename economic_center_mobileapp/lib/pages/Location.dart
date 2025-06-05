// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geocoding/geocoding.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sri Lanka Explorer',
      debugShowCheckedModeBanner: false,
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
        appBarTheme: const AppBarTheme(
          elevation: 0,
          centerTitle: true,
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
        cardTheme: CardThemeData(
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
        ).copyWith(
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
        cardTheme: CardThemeData(
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
  late GoogleMapController _mapController;
  final TextEditingController _searchController = TextEditingController();
  bool _isLoading = true;
  String? _errorMsg;
  MapType _currentMapType = MapType.normal;
  bool _showSatelliteView = false;
  bool _showFullScreenMap = false;
  late TabController _tabController;

  static const LatLng _sriLankaCoords = LatLng(7.8731, 80.7718);
  final Set<Marker> _markers = {};
  final List<LocationData> _locations = [];
  LocationData? _selectedLocation;

  static const CameraPosition _initialCameraPosition = CameraPosition(
    target: _sriLankaCoords,
    zoom: 8,
  );

  final Set<Polygon> _polygons = {};
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _setupInitialLocations();
    _setupSriLankaBoundary();
    _isLoading = false;
  }

  @override
  void dispose() {
    _mapController.dispose();
    _searchController.dispose();
    _tabController.dispose();
    super.dispose();
  }

  void _setupSriLankaBoundary() {
    final List<LatLng> sriLankaBoundary = [
      const LatLng(9.8358, 80.2041),
      const LatLng(8.7925, 81.1787),
      const LatLng(7.8731, 81.8593),
      const LatLng(6.9271, 81.7917),
      const LatLng(6.0350, 81.1159),
      const LatLng(6.0542, 80.2504),
      const LatLng(7.2374, 79.8708),
      const LatLng(8.7261, 79.8989),
      const LatLng(9.8358, 80.2041),
    ];

    _polygons.add(
      Polygon(
        polygonId: const PolygonId('srilanka_boundary'),
        points: sriLankaBoundary,
        strokeColor: const Color(0xFF3B82F6),
        strokeWidth: 3,
        // ignore: duplicate_ignore
        // ignore: deprecated_member_use
        fillColor: const Color(0xFF93C5FD).withOpacity(0.35),
      ),
    );
  }

  void _setupInitialLocations() {
    final List<LocationData> initialLocations = [
      LocationData(
          id: 1,
          name: 'Colombo',
          position: const LatLng(6.9271, 79.8612),
          type: 'City',
          description: 'Commercial capital and largest city of Sri Lanka'),
      LocationData(
          id: 2,
          name: 'Kandy',
          position: const LatLng(7.2906, 80.6337),
          type: 'City',
          description: 'Cultural capital famous for Temple of the Tooth Relic'),
      LocationData(
          id: 3,
          name: 'Dambulla DEC',
          position: const LatLng(7.8679, 80.6494),
          type: 'Economic Center',
          description:
              'Major Dedicated Economic Centre for agricultural products'),
      LocationData(
          id: 4,
          name: 'Narahenpita DEC',
          position: const LatLng(6.9053, 79.8795),
          type: 'Economic Center',
          description: 'Economic hub in the Colombo district'),
      LocationData(
          id: 5,
          name: 'Meegoda DEC',
          position: const LatLng(6.8361, 80.0953),
          type: 'Economic Center',
          description: 'Important agricultural trading center near Colombo'),
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
        infoWindow: InfoWindow(
          title: location.name,
          snippet: location.type,
        ),
        icon: markerIcon,
        onTap: () => setState(() => _selectedLocation = location),
      ),
    );
  }

  Future<void> _searchLocation() async {
    final query = _searchController.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _isLoading = true;
      _isSearching = true;
      _errorMsg = null;
    });

    try {
      final locations = await locationFromAddress('$query, Sri Lanka');

      if (locations.isEmpty) {
        throw Exception('Location not found');
      }

      final location = locations.first;
      final newPosition = LatLng(location.latitude, location.longitude);

      // Validate if within Sri Lanka bounds
      if (location.latitude < 5.9 ||
          location.latitude > 9.9 ||
          location.longitude < 79.4 ||
          location.longitude > 81.9) {
        throw Exception('Location is outside Sri Lanka');
      }

      final newLocation = LocationData(
        id: DateTime.now().millisecondsSinceEpoch,
        name: query,
        position: newPosition,
        type: 'Custom',
        description: 'Searched location: $query',
      );

      setState(() {
        _addMarker(newLocation);
        _locations.add(newLocation);
        _selectedLocation = newLocation;
        _searchController.clear();
      });

      await _mapController.animateCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(target: newPosition, zoom: 14),
        ),
      );
    } catch (e) {
      setState(() => _errorMsg = 'Error: ${e.toString()}');
      // ignore: use_build_context_synchronously
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      setState(() {
        _isLoading = false;
        _isSearching = false;
      });
    }
  }

  void _toggleMapType() {
    setState(() {
      _showSatelliteView = !_showSatelliteView;
      _currentMapType = _showSatelliteView ? MapType.satellite : MapType.normal;
      if (!_showSatelliteView) {
        // ignore: duplicate_ignore
        // ignore: deprecated_member_use
        _mapController.setMapStyle(_mapStyle);
      } else {
        // ignore: duplicate_ignore
        // ignore: deprecated_member_use
        _mapController.setMapStyle(null);
      }
    });
  }

  void _toggleFullScreenMap() {
    setState(() => _showFullScreenMap = !_showFullScreenMap);
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
                        Color(0xFF800000),
                        Color(0xFFFF7722),
                        Color(0xFFF9BC24),
                        Color(0xFF018749),
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
                GoogleMap(
                  initialCameraPosition: _initialCameraPosition,
                  markers: _markers,
                  polygons: _polygons,
                  mapType: _currentMapType,
                  myLocationEnabled: true,
                  myLocationButtonEnabled: false,
                  zoomControlsEnabled: false,
                  compassEnabled: true,
                  onMapCreated: (controller) {
                    _mapController = controller;
                    // ignore: duplicate_ignore
                    // ignore: deprecated_member_use
                    controller.setMapStyle(_mapStyle);
                    setState(() => _isLoading = false);
                  },
                ),
                if (_isLoading)
                  Container(
                    color: Colors.black.withOpacity(0.5),
                    child: const Center(
                      child: CircularProgressIndicator(color: Colors.white),
                    ),
                  ),
                if (_errorMsg != null)
                  Center(
                    child: Card(
                      margin: const EdgeInsets.all(16),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.error,
                                color: Colors.red, size: 48),
                            const SizedBox(height: 16),
                            Text(_errorMsg!,
                                style: const TextStyle(color: Colors.red)),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: () => setState(() => _errorMsg = null),
                              child: const Text('Try Again'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                if (!_showFullScreenMap) ...[
                  Positioned(
                    top: 16,
                    right: 16,
                    child: Column(
                      children: [
                        _buildMapControlButton(
                          icon: _showSatelliteView
                              ? Icons.map_rounded
                              : Icons.satellite_alt_rounded,
                          tooltip: _showSatelliteView
                              ? 'Map View'
                              : 'Satellite View',
                          onPressed: _toggleMapType,
                          color: _showSatelliteView
                              ? Theme.of(context).colorScheme.secondary
                              : Theme.of(context).colorScheme.primary,
                        ),
                        const SizedBox(height: 8),
                        _buildMapControlButton(
                          icon: _showFullScreenMap
                              ? Icons.fullscreen_exit_rounded
                              : Icons.fullscreen_rounded,
                          tooltip: _showFullScreenMap
                              ? 'Exit Fullscreen'
                              : 'Fullscreen',
                          onPressed: _toggleFullScreenMap,
                        ),
                        const SizedBox(height: 8),
                        _buildMapControlButton(
                          icon: Icons.center_focus_strong_rounded,
                          tooltip: 'Reset View',
                          onPressed: () => _mapController.animateCamera(
                            CameraUpdate.newCameraPosition(
                                _initialCameraPosition),
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (_selectedLocation != null)
                    Positioned(
                      left: 16,
                      right: 16,
                      bottom: 16,
                      child: _buildLocationCard(),
                    ),
                ],
              ],
            ),
          ),
          if (!_showFullScreenMap) _buildInfoPanel(),
        ],
      ),
    );
  }

  Widget _buildMapControlButton({
    required IconData icon,
    required String tooltip,
    required VoidCallback onPressed,
    Color? color,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black26, blurRadius: 6, offset: Offset(0, 2)),
        ],
      ),
      child: IconButton(
        icon: Icon(icon, color: color ?? Theme.of(context).colorScheme.primary),
        onPressed: onPressed,
        tooltip: tooltip,
      ),
    );
  }

  Widget _buildLocationCard() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final location = _selectedLocation!;

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  location.type == 'Economic Center'
                      ? Icons.store_rounded
                      : Icons.location_city_rounded,
                  color: location.type == 'Economic Center'
                      ? Theme.of(context).colorScheme.tertiary
                      : Theme.of(context).colorScheme.secondary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    location.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => setState(() => _selectedLocation = null),
                ),
              ],
            ),
            const Divider(),
            Text(
              'Type: ${location.type}',
              style: TextStyle(
                  color: isDarkMode ? Colors.white70 : Colors.black87),
            ),
            const SizedBox(height: 4),
            Text(
              location.description,
              style: TextStyle(
                  color: isDarkMode ? Colors.white60 : Colors.black54),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.pin_drop,
                  size: 16,
                  color: isDarkMode ? Colors.white54 : Colors.black45,
                ),
                const SizedBox(width: 4),
                Text(
                  'Lat: ${location.position.latitude.toStringAsFixed(4)}, '
                  'Lng: ${location.position.longitude.toStringAsFixed(4)}',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDarkMode ? Colors.white54 : Colors.black45,
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
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Directions feature coming soon!'),
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
                    _mapController.animateCamera(
                      CameraUpdate.newCameraPosition(
                        CameraPosition(
                          target: location.position,
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
    );
  }

  Widget _buildSearchBar() {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
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
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
                onSubmitted: (_) => _searchLocation(),
              ),
            ),
          ),
          const SizedBox(width: 12),
          ElevatedButton(
            onPressed: _isSearching ? null : _searchLocation,
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              minimumSize: const Size(48, 48),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isSearching
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
    return Container(
      height: 140,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        children: [
          TabBar(
            controller: _tabController,
            tabs: const [
              Tab(text: 'Locations'),
              Tab(text: 'About'),
            ],
            indicatorColor: Theme.of(context).colorScheme.primary,
            labelColor: Theme.of(context).colorScheme.primary,
            unselectedLabelColor: Theme.of(context).textTheme.bodySmall?.color,
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildLocationsTab(),
                _buildAboutTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationsTab() {
    return ListView.builder(
      scrollDirection: Axis.horizontal,
      itemCount: _locations.length,
      itemBuilder: (context, index) {
        final location = _locations[index];
        final isSelected = _selectedLocation?.id == location.id;

        return Card(
          margin: const EdgeInsets.only(right: 12, top: 8, bottom: 8),
          color: isSelected
              ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
              : null,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(
              color: isSelected
                  ? Theme.of(context).colorScheme.primary
                  : Theme.of(context).dividerColor,
              width: isSelected ? 2 : 1,
            ),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () {
              setState(() => _selectedLocation = location);
              _mapController.animateCamera(
                CameraUpdate.newCameraPosition(
                  CameraPosition(target: location.position, zoom: 14),
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
                        color: location.type == 'Economic Center'
                            ? Theme.of(context).colorScheme.tertiary
                            : Theme.of(context).colorScheme.secondary,
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
                    style: const TextStyle(fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildAboutTab() {
    return SingleChildScrollView(
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
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String content,
  }) {
    return Card(
      margin: const EdgeInsets.only(right: 12, top: 8, bottom: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Theme.of(context).dividerColor),
      ),
      child: Container(
        width: 200,
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon,
                    size: 16, color: Theme.of(context).colorScheme.primary),
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
                  color: Theme.of(context).textTheme.bodySmall?.color,
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

  final String _mapStyle = '''
  [
    {"elementType": "geometry", "stylers": [{"color": "#f5f5f5"}]},
    {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
    {"elementType": "labels.text.fill", "stylers": [{"color": "#616161"}]},
    {"elementType": "labels.text.stroke", "stylers": [{"color": "#f5f5f5"}]},
    {"featureType": "administrative", "elementType": "geometry", "stylers": [{"visibility": "on"}]},
    {"featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{"color": "#3B82F6"}, {"weight": 2.5}]},
    {"featureType": "administrative.land_parcel", "stylers": [{"visibility": "off"}]},
    {"featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{"color": "#bdbdbd"}]},
    {"featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{"color": "#8B4513"}, {"weight": 1}]},
    {"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#eeeeee"}]},
    {"featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#757575"}]},
    {"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#e5f7df"}]},
    {"featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{"color": "#9e9e9e"}]},
    {"featureType": "road", "elementType": "geometry", "stylers": [{"color": "#ffffff"}]},
    {"featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{"color": "#757575"}]},
    {"featureType": "road.highway", "elementType": "geometry", "stylers": [{"color": "#e8e8e8"}]},
    {"featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}]},
    {"featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{"color": "#9e9e9e"}]},
    {"featureType": "transit.line", "elementType": "geometry", "stylers": [{"color": "#e5e5e5"}]},
    {"featureType": "transit.station", "elementType": "geometry", "stylers": [{"color": "#eeeeee"}]},
    {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#b3e0ff"}]},
    {"featureType": "water", "elementType": "labels.text.fill", "stylers": [{"color": "#3d5a80"}]}
  ]
  ''';
}

class LocationData {
  final int id;
  final String name;
  final LatLng position;
  final String type;
  final String description;

  LocationData({
    required this.id,
    required this.name,
    required this.position,
    this.type = 'Custom',
    this.description = '',
  });
}
