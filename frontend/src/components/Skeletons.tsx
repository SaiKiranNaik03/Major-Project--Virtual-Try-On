import React from 'react';

// Product Card Skeleton
export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div className="relative">
        <div className="w-full h-80 bg-gray-200 animate-pulse"></div>
      </div>
      <div className="p-5">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-2/3"></div>
        <div className="flex space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
      </div>
    </div>
  );
};

// Collection Page Skeleton
export const CollectionPageSkeleton = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex py-4 mb-8">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mx-2"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Mobile Filter Button Skeleton */}
        <div className="lg:hidden mb-6">
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters Skeleton */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24 border border-gray-100">
              <div className="space-y-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="space-y-3">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-5 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Sort and Results Count Skeleton */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-40"></div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Detail Skeleton
export const ProductDetailSkeleton = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex py-4 mb-8">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mx-2"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Skeleton
export const CartSkeleton = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-24 h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
              </div>
            ))}
          </div>
          {/* Order Summary Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-6"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-full mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wishlist Skeleton
export const WishlistSkeleton = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-6"></div>
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Virtual Try-On Skeleton
export const VirtualTryOnSkeleton = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera View Skeleton */}
          <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse"></div>
          {/* Controls Skeleton */}
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 