import 'package:flutter/material.dart';

class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String category;
  final bool isLocal;
  final double rating;
  final String seller;
  final int reviewCount;
  final int stockQuantity;
  final List<Review>? reviews;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.category,
    required this.stockQuantity,
    this.isLocal = true,
    this.rating = 4.0,
    this.seller = 'Local Seller',
    this.reviewCount = 0,
    this.reviews,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      name: json['name']?.toString() ?? 'No Name',
      description:
          json['description']?.toString() ?? 'No description available',
      price: (json['price'] is String)
          ? double.tryParse(json['price']) ?? 0.0
          : (json['price']?.toDouble() ?? 0.0),
      imageUrl: json['image_url']?.toString() ?? '',
      category: json['category']?.toString() ?? 'Uncategorized',
      stockQuantity: json['quantity'] ??
          json['stock_quantity'] ??
          json['stock'] ??
          0, // Handle farmer backend 'quantity' field
      isLocal: json['is_local'] ?? true,
      rating: (json['rating'] is String)
          ? double.tryParse(json['rating']) ?? 4.0
          : (json['rating']?.toDouble() ?? 4.0),
      seller: json['farmer_name']?.toString() ??
          json['seller']?.toString() ??
          'Local Farmer', // Use farmer_name if available, fallback to seller, then default
      reviewCount: json['review_count'] ?? 0,
      reviews: json['reviews'] != null
          ? (json['reviews'] as List).map((i) => Review.fromJson(i)).toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'price': price,
        'image_url': imageUrl,
        'category': category,
        'stock_quantity': stockQuantity,
        'is_local': isLocal,
        'rating': rating,
        'seller': seller,
        'review_count': reviewCount,
        'reviews': reviews?.map((review) => review.toJson()).toList(),
      };
}

class Review {
  final int id;
  final String username;
  final int rating;
  final String comment;
  final String date;

  Review({
    required this.id,
    required this.username,
    required this.rating,
    required this.comment,
    required this.date,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] ?? 0,
      username: json['username']?.toString() ?? 'Anonymous',
      rating: json['rating'] ?? 5,
      comment: json['comment']?.toString() ?? '',
      date: json['created_at'] != null
          ? _formatDate(json['created_at'].toString())
          : 'Unknown date',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'username': username,
        'rating': rating,
        'comment': comment,
        'date': date,
      };

  static String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      return '${date.day} ${_getMonthName(date.month)} ${date.year}';
    } catch (e) {
      return dateString;
    }
  }

  static String _getMonthName(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return months[month - 1];
  }
}

class CartItem {
  final Product product;
  int quantity;
  int cartId;

  CartItem({
    required this.product,
    this.quantity = 1,
    required this.cartId,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    // The backend returns product fields at the top level, not nested under 'product'
    // So we need to build the Product from the same map

    // Ensure cartId is properly parsed as an integer
    int parsedCartId;
    if (json['cart_id'] is String) {
      parsedCartId = int.tryParse(json['cart_id']) ?? 0;
    } else {
      parsedCartId = json['cart_id'] ?? 0;
    }

    // Ensure quantity is properly parsed as an integer
    int parsedQuantity;
    if (json['quantity'] is String) {
      parsedQuantity = int.tryParse(json['quantity']) ?? 1;
    } else {
      parsedQuantity = json['quantity'] ?? 1;
    }

    return CartItem(
      product: Product.fromJson({
        ...json,
        // Ensure stockQuantity is updated from the latest cart/product info
        'stock_quantity': json['stock_quantity'] ?? json['stock'] ?? 0,
      }),
      quantity: parsedQuantity,
      cartId: parsedCartId,
    );
  }

  Map<String, dynamic> toJson() => {
        'product': product.toJson(),
        'quantity': quantity,
        'cart_id': cartId,
      };
}

class ShippingOption {
  final int id;
  final String name;
  final double price;
  final String days;

  ShippingOption({
    required this.id,
    required this.name,
    required this.price,
    required this.days,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'price': price,
        'days': days,
      };
}

class PaymentMethod {
  final String name;
  final String apiValue;
  final IconData icon;
  final Color color;

  const PaymentMethod({
    required this.name,
    required this.apiValue,
    required this.icon,
    required this.color,
  });
}

extension ProductCopyWith on Product {
  Product copyWith({
    int? id,
    String? name,
    String? description,
    double? price,
    String? imageUrl,
    String? category,
    bool? isLocal,
    double? rating,
    String? seller,
    int? reviewCount,
    int? stockQuantity,
    List<Review>? reviews,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      imageUrl: imageUrl ?? this.imageUrl,
      category: category ?? this.category,
      stockQuantity: stockQuantity ?? this.stockQuantity,
      isLocal: isLocal ?? this.isLocal,
      rating: rating ?? this.rating,
      seller: seller ?? this.seller,
      reviewCount: reviewCount ?? this.reviewCount,
      reviews: reviews ?? this.reviews,
    );
  }
}
