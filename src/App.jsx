import './App.css'
import Header from '../component/header/index.jsx'
import Footer from '../component/Footer/Footer.jsx'
// Yahan "as Router" add kiya gaya hai taaki niche <Router> kaam kare
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Home from '../component/Pages/Home/index.jsx'
import ProductListing from '../component/Pages/ProductListing/index.jsx'
import ProductDetailsPage from '../component/Pages/productpage/ProductDetailsPage.jsx'
import ComparePage from '../component/Pages/ComparePage/index.jsx'
import { BlogList, BlogDetail } from '../component/Pages/blog/blog.jsx'

// Auth & User Pages
import AuthPage from '../component/auth/AuthPage.jsx'
import AccountSettings from '../component/auth/AccountSettings.jsx';
import ManageAddresses from '../component/auth/ManageAddresses.jsx';
import PanCardInfo from '../component/pancard/PanCardInfo.jsx';
import GiftCards from '../component/giftcard/GiftCards.jsx';
import MyCoupons from '../component/giftcard/MyCoupons.jsx'; 
import Wishlist from '../component/WishlistDrawer/Wishlist.jsx';   
import MyOrders from '../component/order/MyOrders.jsx'; // Path check kar lein: 'order' ya 'orders'

// Admin Pages
import Dashboard from '../component/Admin/Dashboard.jsx'
import AdminProducts from '../component/Admin/ProductsManagement.jsx'
import AdminUsers from '../component/Admin/UsersManagement.jsx'
import AdminOrders from '../component/Admin/OrdersManagement.jsx'

// Checkout Pages
import CheckoutPage from '../component/checkout/CheckoutPage.jsx'
import PaymentPage from '../component/payment/PaymentPage.jsx'
import OrderSuccess from '../component/Pages/OrderSuccess/OrderSuccess.jsx'

import Sidebar from '../component/Sidebar/Sidebar.jsx';

// Wrapper component
function AppContent() {
  const location = useLocation();
  
  // Header/Footer chhupane wale routes
  const hideHeaderRoutes = ['/checkout', '/payment', '/order-success', '/admin', '/login', '/signup'];
  const shouldHideHeader = hideHeaderRoutes.some(route => location.pathname.startsWith(route));

  // In sabhi paths par Sidebar dikhna chahiye
  const accountPaths = [
    '/account/profile', 
    '/account/addresses', 
    '/account/pan',
    '/orders', 
    '/payments/giftcards', 
    '/payments/upi', 
    '/payments/cards',
    '/coupons', 
    '/reviews', 
    '/wishlist'
  ];
  
  const isAccountPage = accountPaths.some(path => location.pathname.startsWith(path));

  // Placeholder for pending pages
  const PageWrapper = ({ title }) => (
    <div className="md:ml-4 p-8 bg-white flex-1 shadow-sm rounded-sm min-h-[500px]">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-500 italic">Coming Soon: {title} section for Aaramdehi.</p>
    </div>
  );

  return (
    <>
      {!shouldHideHeader && <Header />}
      
      <main className={isAccountPage ? "bg-gray-100 min-h-screen pb-10" : ""}>
        <div className={isAccountPage ? "max-w-[1248px] mx-auto flex flex-col md:flex-row py-4 md:py-8 px-2 md:px-4 gap-0 md:gap-4" : ""}>
          
          {/* Sidebar logic */}
          {isAccountPage && (
            <div className="w-full md:w-80 flex-shrink-0 mb-4 md:mb-0">
              <Sidebar />
            </div>
          )}

          <div className="flex-1 w-full overflow-hidden">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Home/>}/>
              <Route path="/product" element={<ProductListing/>}/>
              <Route path="/products" element={<ProductListing/>}/>
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              
              {/* Authentication */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />

              {/* --- USER ACCOUNT ROUTES --- */}
              <Route path="/account/profile" element={<AccountSettings />} />
              <Route path="/account/addresses" element={<ManageAddresses />} />
              <Route path="/account/pan" element={<PanCardInfo />} />
              
              {/* My Orders (Ab asli component load hoga) */}
              <Route path="/orders" element={<MyOrders />} />
              
              {/* Payments */}
              <Route path="/payments/giftcards" element={<GiftCards />} />
              <Route path="/payments/upi" element={<PageWrapper title="Saved UPI" />} />
              <Route path="/payments/cards" element={<PageWrapper title="Saved Cards" />} />
              
              {/* My Stuff */}
              <Route path="/coupons" element={<MyCoupons />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/reviews" element={<PageWrapper title="My Reviews & Ratings" />} />
              {/* --------------------------- */}
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              
              {/* Checkout & Success */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              
              {/* Blog */}
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
            </Routes>
          </div>
        </div>
      </main>

      {!shouldHideHeader && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router> 
      <AppContent />
    </Router>
  )
}

export default App;