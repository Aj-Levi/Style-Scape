import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa'
import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">StyleScape</h3>
                        <p className="text-gray-400 mb-4">
                            Discover the latest fashion trends and express your unique style with our curated collection.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaPinterest size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Shop</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/collections/men" className="hover:text-white transition-colors">Men</Link></li>
                            <li><Link href="/collections/women" className="hover:text-white transition-colors">Women</Link></li>
                            <li><Link href="/collections/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
                            <li><Link href="/collections/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="/collections/sale" className="hover:text-white transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Help</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/customer-service" className="hover:text-white transition-colors">Customer Service</Link></li>
                            <li><Link href="/my-account" className="hover:text-white transition-colors">My Account</Link></li>
                            <li><Link href="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest trends and exclusive offers.</p>
                        <form className="flex flex-col sm:flex-row gap-2">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button 
                                type="submit" 
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} StyleScape. All rights reserved.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer