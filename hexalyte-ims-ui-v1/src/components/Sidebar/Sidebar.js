// import React, { useState, useEffect } from "react";
// import { Link, useHistory, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "context/AuthContext";
//
// // You can keep these imports if needed
// import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
// import UserDropdown from "components/Dropdowns/UserDropdown.js";
// import { getStoredTokens } from "auth/tokenService";
//
// const BASE_URL = process.env.REACT_APP_BASE_URL;
//
// export default function Sidebar() {
//   const [collapseShow, setCollapseShow] = useState("hidden");
//   const [expandedSections, setExpandedSections] = useState({});
//   const history = useHistory();
//   const location = useLocation();
//
//   // Close sidebar when route changes (especially on mobile)
//   useEffect(() => {
//     setCollapseShow("hidden");
//   }, [location.pathname]);
//
//   // Handle clicks outside the sidebar to close it on mobile
//   useEffect(() => {
//     function handleClickOutside(event) {
//       const sidebar = document.getElementById("main-sidebar");
//       if (sidebar && !sidebar.contains(event.target) && window.innerWidth < 768) {
//         setCollapseShow("hidden");
//       }
//     }
//
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//
//   async function userLogout() {
//     try {
//       const response = await axios.post(`${BASE_URL}auth/logout`);
//       localStorage.removeItem('user');
//       history.push("/auth/login");
//     } catch (error) {
//       console.log(error);
//     }
//   }
//
//   // Helper function to determine if a link is active
//   const isActive = (path) => {
//     return location.pathname.indexOf(path) !== -1;
//   };
//
//   // Helper function to check if any child in a section is active
//   const isSectionActive = (paths) => {
//     return paths.some(path => location.pathname.indexOf(path) !== -1);
//   };
//
//   // Toggle section expansion
//   const toggleSection = (sectionKey) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [sectionKey]: !prev[sectionKey]
//     }));
//   };
//
//   const [currUserRole, setCurrUserRole] = useState(null);
//
//   useEffect(() => {
//     const sessionUser = getStoredTokens()
//     if (sessionUser) {
//       setCurrUserRole(() => sessionUser.user.role)
//     }
//   }, []);
//
//   // Auto-expand sections with active items
//   useEffect(() => {
//     const sectionsToExpand = {};
//
//     // Check each section for active items
//     if (isSectionActive(["/admin/sales-orders", "/admin/purchase-orders", "/admin/track-orders", "/admin/discounts", "/admin/order-history"])) {
//       sectionsToExpand.orders = true;
//     }
//     if (isSectionActive(["/admin/manage-products", "/admin/manage-categories", "/admin/add-product", "/admin/view-products"])) {
//       sectionsToExpand.products = true;
//     }
//     if (isSectionActive(["/admin/manage-inventory", "/admin/manage-warehouses", "/admin/warehouse-stock-transfer"])) {
//       sectionsToExpand.inventory = true;
//     }
//     if (isSectionActive(["/admin/manage-users", "/admin/manage-customers", "/admin/manage-suppliers"])) {
//       sectionsToExpand.people = true;
//     }
//     if (isSectionActive(["/admin/delivery-list", "/admin/create-delivery", "/admin/delivery-companies", "/admin/tracking-upload"])) {
//       sectionsToExpand.delivery = true;
//     }
//     if (isSectionActive(["/admin/customer-ads", "/admin/bulk-upload-ads"])) {
//       sectionsToExpand.marketing = true;
//     }
//
//     setExpandedSections(prev => ({ ...prev, ...sectionsToExpand }));
//   }, [location.pathname]);
//
//   return (
//     <>
//       <nav
//         id="main-sidebar"
//         className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-lg bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-0 px-0"
//       >
//         <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
//           {/* Toggler */}
//           <button
//             className="cursor-pointer text-gray-600 md:hidden px-5 py-2 text-xl leading-none bg-transparent rounded-md hover:bg-gray-100 transition-colors duration-200"
//             type="button"
//             onClick={() => setCollapseShow("bg-white m-2 py-3 px-6 shadow-lg rounded-lg")}
//             aria-label="Toggle navigation menu"
//           >
//             <i className="fas fa-bars"></i>
//           </button>
//
//           {/* User (mobile only) */}
//           <ul className="md:hidden items-center flex flex-wrap list-none px-4">
//             <li className="inline-block relative">
//               <NotificationDropdown />
//             </li>
//             <li className="inline-block relative">
//               <UserDropdown />
//             </li>
//           </ul>
//
//           {/* Collapse */}
//           <div
//             className={
//               "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-0 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded-lg transition-all duration-300 " +
//               collapseShow
//             }
//           >
//             {/* Collapse header (mobile only) */}
//             <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-gray-200">
//               <div className="flex flex-wrap items-center">
//                 <div className="w-6/12">
//                   <Link
//                     className="flex items-center text-gray-800 font-bold p-4"
//                     to="/"
//                   >
//                     <i className="fas fa-cubes mr-2 text-blue-600"></i>
//                     Hexa - IMS
//                   </Link>
//                 </div>
//                 <div className="w-6/12 flex justify-end">
//                   <button
//                     type="button"
//                     className="cursor-pointer text-gray-600 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded-md hover:bg-gray-100 transition-colors duration-200"
//                     onClick={() => setCollapseShow("hidden")}
//                     aria-label="Close menu"
//                   >
//                     <i className="fas fa-times"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>
//
//             {/* Navigation */}
//             <div className="flex-1 w-full">
//               {/* Dashboard */}
//               <SidebarItem
//                 to="/admin/dashboard"
//                 text="Dashboard"
//                 icon="fas fa-th-large"
//                 isActive={isActive("/admin/dashboard")}
//               />
//
//               {/* Orders Section */}
//               <SidebarSection
//                 title="Orders"
//                 icon="fas fa-shopping-cart"
//                 isExpanded={expandedSections.orders}
//                 isActive={isSectionActive(["/admin/sales-orders", "/admin/purchase-orders", "/admin/track-orders", "/admin/discounts", "/admin/order-history"])}
//                 onToggle={() => toggleSection('orders')}
//               >
//                 {/*<SidebarSubItem*/}
//                 {/*  to="/admin/orders/manage-orders"*/}
//                 {/*  text="Manage Orders"*/}
//                 {/*  isActive={isActive("/admin/orders/manage-orders")}*/}
//                 {/*/>*/}
//                 <SidebarSubItem
//                   to="/admin/orders/new-orders"
//                   text="New Order"
//                   isActive={isActive("/admin/orders/new-orders")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/orders/assign-delivery-partner"
//                   text="Assign Delivery Partner"
//                   isActive={isActive("/admin/orders/assign-delivery-partner")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/orders/pack-order"
//                   text="Pack Order"
//                   isActive={isActive("/admin/orders/pack-order")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/orders/dispatch-order"
//                   text="Dispatch Orders"
//                   isActive={isActive("/admin/orders/dispatch-order")}
//                 />
//                 {/*<SidebarSubItem*/}
//                 {/*  to="/admin/orders/dispatch-note-panel"*/}
//                 {/*  text="Dispatch Note Panel"*/}
//                 {/*  isActive={isActive("/admin/orders/dispatch-note-panel")}*/}
//                 {/*/>*/}
//                 {/* <SidebarSubItem
//                   to="/admin/sales-orders"
//                   text="Sales Orders"
//                   isActive={isActive("/admin/sales-orders")}
//                 /> */}
//                 {/* <SidebarSubItem
//                   to="/admin/purchase-orders"
//                   text="Purchase Orders"
//                   isActive={isActive("/admin/purchase-orders")}
//                 /> */}
//                 {/* <SidebarSubItem
//                   to="/admin/track-orders"
//                   text="Track Orders"
//                   isActive={isActive("/admin/track-orders")}
//                 /> */}
//                 {/* <SidebarSubItem
//                   to="/admin/discounts"
//                   text="Discounts"
//                   isActive={isActive("/admin/discounts")}
//                 /> */}
//                 {/* <SidebarSubItem
//                   to="/admin/order-history"
//                   text="Order History"
//                   isActive={isActive("/admin/order-history")}
//                 /> */}
//               </SidebarSection>
//
//               {/* Products Section */}
//               {/*<SidebarSection*/}
//               {/*  title="Products"*/}
//               {/*  icon="fas fa-box"*/}
//               {/*  isExpanded={expandedSections.products}*/}
//               {/*  isActive={isSectionActive(["/admin/manage-products", "/admin/manage-categories", "/admin/add-product", "/admin/view-products"])}*/}
//               {/*  onToggle={() => toggleSection('products')}*/}
//               {/*>*/}
//               {/*  <SidebarSubItem*/}
//               {/*    to="/admin/products/add"*/}
//               {/*    text="Add Product"*/}
//               {/*    isActive={isActive("/admin/products/add")}*/}
//               {/*  />*/}
//               {/*  <SidebarSubItem*/}
//               {/*    to="/admin/products/view"*/}
//               {/*    text="View Products"*/}
//               {/*    isActive={isActive("/admin/products/view")}*/}
//               {/*  />*/}
//               {/*  <SidebarSubItem*/}
//               {/*    to="/admin/manage-categories"*/}
//               {/*    text="Manage Categories"*/}
//               {/*    isActive={isActive("/admin/manage-categories")}*/}
//               {/*  />*/}
//               {/*  <SidebarSubItem*/}
//               {/*    to="/admin/manage-products"*/}
//               {/*    text="Manage Products"*/}
//               {/*    isActive={isActive("/admin/manage-products")}*/}
//               {/*  />*/}
//               {/*</SidebarSection>*/}
//
//               <SidebarSection
//                 title="Products"
//                 icon="fas fa-box"
//                 isExpanded={expandedSections.products}
//                 isActive={isSectionActive(["/admin/manage-products", "/admin/manage-categories", "/admin/add-product", "/admin/products/view"])}
//                 onToggle={() => toggleSection('products')}
//               >
//                 <SidebarSubItem
//                   to="/admin/products/add"
//                   text="Add Product"
//                   isActive={isActive("/admin/products/add")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/manage-categories"
//                   text="Manage Categories"
//                   isActive={isActive("/admin/manage-categories")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/manage-products"
//                   text="Manage Products"
//                   isActive={isActive("/admin/manage-products")}
//                   isExpanded={expandedSections.manageProducts}
//                   onToggle={() => toggleSection('manageProducts')}
//                 >
//                   <SidebarSubItem
//                     to="/admin/products/view"
//                     text="View Products"
//                     isActive={isActive("/admin/products/view")}
//                     isNested={true}
//                   />
//                 </SidebarSubItem>
//               </SidebarSection>
//
//               {/* Inventory Section */}
//               <SidebarSection
//                 title="Inventory"
//                 icon="fas fa-boxes"
//                 isExpanded={expandedSections.inventory}
//                 isActive={isSectionActive(["/admin/manage-inventory", "/admin/manage-warehouses", "/admin/warehouse-stock-transfer"])}
//                 onToggle={() => toggleSection('inventory')}
//               >
//                 <SidebarSubItem
//                   to="/admin/add-to-inventory"
//                   text="Add to Inventory"
//                   isActive={isActive("/admin/add-to-inventory")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/manage-inventory"
//                   text="Manage Inventory"
//                   isActive={isActive("/admin/manage-inventory")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/manage-warehouses"
//                   text="Manage Warehouses"
//                   isActive={isActive("/admin/manage-warehouses")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/warehouse-stock-transfer"
//                   text="Stock Transfer"
//                   isActive={isActive("/admin/warehouse-stock-transfer")}
//                 />
//               </SidebarSection>
//
//               {/* Delivery Section */}
//               <SidebarSection
//                 title="Delivery"
//                 icon="fas fa-truck"
//                 isExpanded={expandedSections.delivery}
//                 isActive={isSectionActive(["/admin/delivery-list", "/admin/create-delivery", "/admin/delivery-companies", "/admin/tracking-upload"])}
//                 onToggle={() => toggleSection('delivery')}
//               >
//                 <SidebarSubItem
//                   to="/admin/delivery-list"
//                   text="Delivery List"
//                   isActive={isActive("/admin/delivery-list")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/create-delivery"
//                   text="Create Delivery"
//                   isActive={isActive("/admin/create-delivery")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/delivery/companies"
//                   text="Delivery Companies"
//                   isActive={isActive("/admin/delivery/companies")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/delivery/tracking-numbers"
//                   text="Tracking Numbers"
//                   isActive={isActive("/admin/delivery/tracking-numbers")}
//                 />
//               </SidebarSection>
//
//               {/* People Section */}
//               <SidebarSection
//                 title="People"
//                 icon="fas fa-users"
//                 isExpanded={expandedSections.people}
//                 isActive={isSectionActive(["/admin/manage-users", "/admin/manage-customers", "/admin/manage-suppliers"])}
//                 onToggle={() => toggleSection('people')}
//               >
//                 {currUserRole === "admin" && (
//                   <SidebarSubItem
//                     to="/admin/manage-users"
//                     text="Manage Users"
//                     isActive={isActive("/admin/manage-users")}
//                   />
//                 )}
//                 <SidebarSubItem
//                   to="/admin/manage-customers"
//                   text="Manage Customers"
//                   isActive={isActive("/admin/manage-customers")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/manage-suppliers"
//                   text="Manage Suppliers"
//                   isActive={isActive("/admin/manage-suppliers")}
//                 />
//               </SidebarSection>
//
//               {/* Marketing Section */}
//               <SidebarSection
//                 title="Marketing"
//                 icon="fas fa-bullhorn"
//                 isExpanded={expandedSections.marketing}
//                 isActive={isSectionActive(["/admin/customer-ads", "/admin/bulk-upload-ads"])}
//                 onToggle={() => toggleSection('marketing')}
//               >
//                 <SidebarSubItem
//                   to="/admin/customer-ads"
//                   text="Customer Ads"
//                   isActive={isActive("/admin/customer-ads")}
//                 />
//                 <SidebarSubItem
//                   to="/admin/bulk-upload-ads"
//                   text="Bulk Upload"
//                   isActive={isActive("/admin/bulk-upload-ads")}
//                 />
//               </SidebarSection>
//
//               {/* Reports */}
//               <SidebarItem
//                 to="/admin/reports"
//                 text="Reports"
//                 icon="fas fa-chart-bar"
//                 isActive={isActive("/admin/reports")}
//               />
//
//               {/* Analytics */}
//               <SidebarItem
//                 to="/admin/analytics"
//                 text="Analytics"
//                 icon="fas fa-chart-line"
//                 isActive={isActive("/admin/analytics")}
//               />
//
//               {/* Logout Button */}
//               <div className="px-3 py-2 mt-4">
//                 <button
//                   className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//                   onClick={userLogout}
//                 >
//                   <i className="fas fa-sign-out-alt w-5 mr-3 text-sm"></i>
//                   <span>Log Out</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }
//
// // Main sidebar item component
// function SidebarItem({ to, text, icon, isActive }) {
//   return (
//     <div className="px-3 py-1">
//       <Link
//         to={to}
//         className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
//           ? "text-blue-600 bg-blue-50"
//           : "text-gray-600 hover:bg-gray-100"
//           }`}
//       >
//         <i className={`${icon} w-5 mr-3 text-sm`}></i>
//         <span>{text}</span>
//       </Link>
//     </div>
//   );
// }
//
// // Expandable section component
// function SidebarSection({ title, icon, children, isExpanded, isActive, onToggle }) {
//   return (
//     <div className="px-3 py-1">
//       <button
//         onClick={onToggle}
//         className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
//           ? "text-blue-600 bg-blue-50"
//           : "text-gray-600 hover:bg-gray-100"
//           }`}
//       >
//         <div className="flex items-center">
//           <i className={`${icon} w-5 mr-3 text-sm`}></i>
//           <span>{title}</span>
//         </div>
//         <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
//           }`}></i>
//       </button>
//
//       {isExpanded && (
//         <div className="ml-6 mt-1 space-y-1">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }
//
// // Sub-item component for dropdown items
// function SidebarSubItem({ to, text, isActive }) {
//   return (
//     <Link
//       to={to}
//       className={`block px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${isActive
//         ? "text-blue-600 bg-blue-50 font-medium"
//         : "text-gray-600 hover:bg-gray-100"
//         }`}
//     >
//       {text}
//     </Link>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "context/AuthContext";

// You can keep these imports if needed
import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { getStoredTokens } from "auth/tokenService";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const [expandedSections, setExpandedSections] = useState({});
  const history = useHistory();
  const location = useLocation();

  // Close sidebar when route changes (especially on mobile)
  useEffect(() => {
    setCollapseShow("hidden");
  }, [location.pathname]);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    function handleClickOutside(event) {
      const sidebar = document.getElementById("main-sidebar");
      if (sidebar && !sidebar.contains(event.target) && window.innerWidth < 768) {
        setCollapseShow("hidden");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function userLogout() {
    try {
      const response = await axios.post(`${BASE_URL}auth/logout`);
      localStorage.removeItem('user');
      history.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  }

  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname.indexOf(path) !== -1;
  };

  // Helper function to check if any child in a section is active
  const isSectionActive = (paths) => {
    return paths.some(path => location.pathname.indexOf(path) !== -1);
  };

  // Toggle section expansion
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const [currUserRole, setCurrUserRole] = useState(null);

  useEffect(() => {
    const sessionUser = getStoredTokens()
    if (sessionUser) {
      setCurrUserRole(() => sessionUser.user.role)
    }
  }, []);

  // Auto-expand sections with active items
  useEffect(() => {
    const sectionsToExpand = {};

    // Check each section for active items
    if (isSectionActive(["/admin/sales-orders", "/admin/purchase-orders", "/admin/track-orders", "/admin/discounts", "/admin/order-history"])) {
      sectionsToExpand.orders = true;
    }
    if (isSectionActive(["/admin/manage-products", "/admin/manage-categories", "/admin/add-product", "/admin/products/view"])) {
      sectionsToExpand.products = true;
    }
    if (isSectionActive(["/admin/products/view"])) {
      sectionsToExpand.manageProducts = true;
    }
    if (isSectionActive(["/admin/manage-inventory", "/admin/manage-warehouses", "/admin/warehouse-stock-transfer"])) {
      sectionsToExpand.inventory = true;
    }
    if (isSectionActive(["/admin/manage-users", "/admin/manage-customers", "/admin/manage-suppliers"])) {
      sectionsToExpand.people = true;
    }
    if (isSectionActive(["/admin/delivery-list", "/admin/create-delivery", "/admin/delivery-companies", "/admin/tracking-upload"])) {
      sectionsToExpand.delivery = true;
    }
    if (isSectionActive(["/admin/customer-ads", "/admin/bulk-upload-ads"])) {
      sectionsToExpand.marketing = true;
    }

    setExpandedSections(prev => ({ ...prev, ...sectionsToExpand }));
  }, [location.pathname]);

  return (
    <>
      <nav
        id="main-sidebar"
        className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-lg bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-0 px-0"
      >
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-gray-600 md:hidden px-5 py-2 text-xl leading-none bg-transparent rounded-md hover:bg-gray-100 transition-colors duration-200"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6 shadow-lg rounded-lg")}
            aria-label="Toggle navigation menu"
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* User (mobile only) */}
          <ul className="md:hidden items-center flex flex-wrap list-none px-4">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>

          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-0 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded-lg transition-all duration-300 " +
              collapseShow
            }
          >
            {/* Collapse header (mobile only) */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-gray-200">
              <div className="flex flex-wrap items-center">
                <div className="w-6/12">
                  <Link
                    className="flex items-center text-gray-800 font-bold p-4"
                    to="/"
                  >
                    <i className="fas fa-cubes mr-2 text-blue-600"></i>
                    Hexa - IMS
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-gray-600 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded-md hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setCollapseShow("hidden")}
                    aria-label="Close menu"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 w-full">
              {/* Dashboard */}
              <SidebarItem
                to="/admin/dashboard"
                text="Dashboard"
                icon="fas fa-th-large"
                isActive={isActive("/admin/dashboard")}
              />

              {/* Orders Section */}
              <SidebarSection
                title="Orders"
                icon="fas fa-shopping-cart"
                isExpanded={expandedSections.orders}
                isActive={isSectionActive(["/admin/orders", "/admin/sales-orders", "/admin/purchase-orders", "/admin/track-orders", "/admin/discounts", "/admin/order-history"])}
                onToggle={() => toggleSection('orders')}
              >
                <SidebarSubItem
                  to="/admin/orders/new-orders"
                  text="New Order"
                  isActive={isActive("/admin/orders/new-orders")}
                />
                <SidebarSubItem
                  to="/admin/orders/new-orders/bulk-upload"
                  text="Bulk Upload"
                  isActive={isActive("/admin/orders/new-orders/bulk-upload")}
                />
                <SidebarSubItem
                  to="/admin/orders/assign-delivery-partner"
                  text="Assign Delivery Partner"
                  isActive={isActive("/admin/orders/assign-delivery-partner")}
                />
                <SidebarSubItem
                  to="/admin/orders/status-manager"
                  text="Order Status Manager"
                  isActive={isActive("/admin/orders/status-manager")}
                />
                <SidebarSubItem
                  to="/admin/orders/pack-order"
                  text="Pack Order"
                  isActive={isActive("/admin/orders/pack-order")}
                />
                <SidebarSubItem
                  to="/admin/orders/dispatch-order"
                  text="Dispatch Orders"
                  isActive={isActive("/admin/orders/dispatch-order")}
                />
              </SidebarSection>

              {/* Products Section */}
              <SidebarSection
                title="Products"
                icon="fas fa-box"
                isExpanded={expandedSections.products}
                isActive={isSectionActive(["/admin/manage-products", "/admin/manage-categories", "/admin/add-product", "/admin/products/view"])}
                onToggle={() => toggleSection('products')}
              >
                <SidebarSubItem
                  to="/admin/products/add"
                  text="Add Product"
                  isActive={isActive("/admin/products/add")}
                />
                <SidebarSubItem
                  to="/admin/manage-categories"
                  text="Manage Categories"
                  isActive={isActive("/admin/manage-categories")}
                />
                <SidebarSubItem
                  to="/admin/products/manage"
                  text="Manage Products"
                  isActive={isActive("/admin/products/manage")}
                  hasChildren={true}
                  isExpanded={expandedSections.manageProducts}
                  onToggle={() => toggleSection('manageProducts')}
                >
                  <SidebarSubItem
                    to="/admin/products/view"
                    text="View Products"
                    isActive={isActive("/admin/products/view")}
                    isNested={true}
                  />
                </SidebarSubItem>
              </SidebarSection>

              {/* Inventory Section */}
              <SidebarSection
                title="Inventory"
                icon="fas fa-boxes"
                isExpanded={expandedSections.inventory}
                isActive={isSectionActive(["/admin/manage-inventory", "/admin/manage-warehouses", "/admin/warehouse-stock-transfer"])}
                onToggle={() => toggleSection('inventory')}
              >
                <SidebarSubItem
                  to="/admin/add-to-inventory"
                  text="Add to Inventory"
                  isActive={isActive("/admin/add-to-inventory")}
                />
                <SidebarSubItem
                  to="/admin/manage-inventory"
                  text="Manage Inventory"
                  isActive={isActive("/admin/manage-inventory")}
                />
                <SidebarSubItem
                  to="/admin/manage-warehouses"
                  text="Manage Warehouses"
                  isActive={isActive("/admin/manage-warehouses")}
                />
                <SidebarSubItem
                  to="/admin/warehouse-stock-transfer"
                  text="Stock Transfer"
                  isActive={isActive("/admin/warehouse-stock-transfer")}
                />
              </SidebarSection>

              {/* Delivery Section */}
              <SidebarSection
                title="Delivery"
                icon="fas fa-truck"
                isExpanded={expandedSections.delivery}
                isActive={isSectionActive(["/admin/delivery-list", "/admin/create-delivery", "/admin/delivery-companies", "/admin/tracking-upload"])}
                onToggle={() => toggleSection('delivery')}
              >
                <SidebarSubItem
                  to="/admin/delivery-list"
                  text="Delivery List"
                  isActive={isActive("/admin/delivery-list")}
                />
                <SidebarSubItem
                  to="/admin/create-delivery"
                  text="Create Delivery"
                  isActive={isActive("/admin/create-delivery")}
                />
                <SidebarSubItem
                  to="/admin/delivery/companies"
                  text="Delivery Companies"
                  isActive={isActive("/admin/delivery/companies")}
                />
                <SidebarSubItem
                  to="/admin/delivery/tracking-numbers"
                  text="Tracking Numbers"
                  isActive={isActive("/admin/delivery/tracking-numbers")}
                />
              </SidebarSection>

              {/* People Section */}
              <SidebarSection
                title="People"
                icon="fas fa-users"
                isExpanded={expandedSections.people}
                isActive={isSectionActive(["/admin/manage-users", "/admin/manage-customers", "/admin/manage-suppliers"])}
                onToggle={() => toggleSection('people')}
              >
                {currUserRole === "admin" && (
                  <SidebarSubItem
                    to="/admin/manage-users"
                    text="Manage Users"
                    isActive={isActive("/admin/manage-users")}
                  />
                )}
                <SidebarSubItem
                  to="/admin/manage-customers"
                  text="Manage Customers"
                  isActive={isActive("/admin/manage-customers")}
                />
                <SidebarSubItem
                  to="/admin/manage-suppliers"
                  text="Manage Suppliers"
                  isActive={isActive("/admin/manage-suppliers")}
                />
              </SidebarSection>

              {/* Marketing Section */}
              <SidebarSection
                title="Marketing"
                icon="fas fa-bullhorn"
                isExpanded={expandedSections.marketing}
                isActive={isSectionActive(["/admin/customer-ads", "/admin/bulk-upload-ads"])}
                onToggle={() => toggleSection('marketing')}
              >
                <SidebarSubItem
                  to="/admin/customer-ads"
                  text="Customer Ads"
                  isActive={isActive("/admin/customer-ads")}
                />
                <SidebarSubItem
                  to="/admin/bulk-upload-ads"
                  text="Bulk Upload"
                  isActive={isActive("/admin/bulk-upload-ads")}
                />
              </SidebarSection>

              {/* Reports */}
              <SidebarItem
                to="/admin/reports"
                text="Reports"
                icon="fas fa-chart-bar"
                isActive={isActive("/admin/reports")}
              />

              {/* Analytics */}
              <SidebarItem
                to="/admin/analytics"
                text="Analytics"
                icon="fas fa-chart-line"
                isActive={isActive("/admin/analytics")}
              />

              {/* Logout Button */}
              <div className="px-3 py-2 mt-4">
                <button
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={userLogout}
                >
                  <i className="fas fa-sign-out-alt w-5 mr-3 text-sm"></i>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

// Main sidebar item component
function SidebarItem({ to, text, icon, isActive }) {
  return (
    <div className="px-3 py-1">
      <Link
        to={to}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
          ? "text-blue-600 bg-blue-50"
          : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <i className={`${icon} w-5 mr-3 text-sm`}></i>
        <span>{text}</span>
      </Link>
    </div>
  );
}

// Expandable section component
function SidebarSection({ title, icon, children, isExpanded, isActive, onToggle }) {
  return (
    <div className="px-3 py-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
          ? "text-blue-600 bg-blue-50"
          : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center">
          <i className={`${icon} w-5 mr-3 text-sm`}></i>
          <span>{title}</span>
        </div>
        <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
        }`}></i>
      </button>

      {isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

// Sub-item component for dropdown items - Updated to support nested items
function SidebarSubItem({ to, text, isActive, children, hasChildren, isExpanded, onToggle, isNested }) {
  if (hasChildren) {
    return (
      <div>
        <div className="flex items-center">
          <Link
            to={to}
            className={`flex-1 px-3 py-2 text-sm rounded-l-lg transition-colors duration-200 ${isActive
              ? "text-blue-600 bg-blue-50 font-medium"
              : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {text}
          </Link>
          <button
            onClick={onToggle}
            className={`px-2 py-2 text-sm rounded-r-lg transition-colors duration-200 ${isActive
              ? "text-blue-600 bg-blue-50"
              : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
            }`}></i>
          </button>
        </div>
        {isExpanded && (
          <div className={`ml-4 mt-1 space-y-1 ${isNested ? 'border-l border-gray-200 pl-3' : ''}`}>
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`block px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${isNested ? 'text-xs' : ''} ${isActive
        ? "text-blue-600 bg-blue-50 font-medium"
        : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {text}
    </Link>
  );
}