i am trying to build a ecommerce website where artist, handloom makers, niche craft makers, cookie makers, pickle makers. etc... will be able to sign up and sell their art and craft, goods, etc. custormers will be able to mention what type of product they want ( like choosing a type of wood, size of painting, etc) and place their order. i have also attached the screenshots of how i would want my website to look like.

Financial ledgers and commission tracking must be strictly immutable and traceable—similar to how a SHA-1 commit history guarantees consistency in a version control system.

Here is the blueprint for a production-grade MERN e-commerce commission platform.

---

### **1. System Requirements**

**Functional Requirements**

* **Multi-Role Authentication:** Distinct access levels for Buyers, Vendors, and Platform Admins.
* **Vendor Storefronts:** Vendors can manage inventory, view their sales dashboard, and request payouts.
* **Automated Commission Split:** The system automatically calculates the platform fee and the vendor's net earnings at the point of sale.
* **Order Lifecycle Management:** Tracking orders from payment to fulfillment.

**Non-Functional Requirements**

* **Data Integrity (ACID Compliance):** Ensuring money isn't lost if a server crashes halfway through an order.
* **Scalability:** The backend must handle traffic spikes during sales events without locking up the database.
* **Security:** Strict JWT-based authentication, rate limiting, and environment variable protection for payment gateway keys.

---

### **2. Production Architecture**

To ensure maintainability, we will avoid a monolithic "spaghetti" codebase and use a **Modular Monolith** structure with Clean Architecture principles (Routes → Controllers → Services → Repositories).

* **Frontend (React.js):** * **Hosting:** Vercel .
* **State Management:** Redux Toolkit for cart and session management.
* **Data Fetching:** React Query (TanStack Query) for caching and synchronizing backend data.


* **Backend (Node.js / Express.js):**
* **Hosting:** Render.
* **Architecture:** Feature-based module grouping (e.g., all user logic in one folder, all order logic in another).
* **Payment Processing:** **Stripe Connect** is the industry standard for this. It handles the regulatory compliance of splitting payments between the platform (you) and the vendors.


* **Database (MongoDB):**
* **Hosting:** MongoDB Atlas (minimum M10 cluster for production/ m0 for testing puposes).
* **Critical Feature:** You **must** enable Replica Sets. MongoDB only supports multi-document ACID transactions (essential for financial operations) when deployed as a replica set.

### **The Cloudinary Upload Pipeline**
To prevent your server's memory from crashing during multiple high-res uploads, the architecture follows a precise sequence:

The Request: The client sends the image via multipart/form-data.

The Interceptor (Multer): A middleware called multer parses the incoming form data. Instead of saving the file to your server's disk, it holds the file briefly in RAM (Memory Storage).

The Uploader (Stream): A utility function reads that memory buffer and pipes it directly to the Cloudinary API as a data stream.

The Response: Cloudinary processes the image (compresses, converts format) and returns a secure, optimized URL.

The Database: Your controller takes that Cloudinary URL and saves it to the MongoDB Product document.

---

### **3. Database Schemas**

Because this is a NoSQL database, we will normalize the critical transactional data while embedding smaller, read-heavy data. Here are the core Mongoose schemas:

**User Collection**
Manages all entity profiles on the platform.

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | Primary Key |
| `email` | String | Unique identifier, indexed |
| `passwordHash` | String | Bcrypt hashed password |
| `role` | String | Enum: `buyer`, `vendor`, `admin` |
| `vendorProfile` | Object | (Vendors only) Store name, bio, etc. |
| `stripeAccountId` | String | (Vendors only) Required for routing payouts |

**Product Collection**
Holds the catalog. References the vendor who created it.

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | Primary Key |
| `vendorId` | ObjectId | Reference to User (indexed) |
| `title` | String | Name of the product |
| `price` | Number | Stored in the smallest currency unit (e.g., cents) |
| `stockQuantity` | Number | Available inventory |
| `isActive` | Boolean | For soft-deleting or hiding products |

**Order Collection**
The immutable record of a buyer's purchase.

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | Primary Key |
| `buyerId` | ObjectId | Reference to User |
| `lineItems` | Array | Embedded objects: `productId`, `quantity`, `priceAtTimeOfPurchase` |
| `totalAmount` | Number | Total cost charged to the buyer |
| `status` | String | Enum: `pending`, `paid`, `shipped`, `delivered` |
| `paymentIntentId` | String | Stripe reference for the transaction |

**Commission Ledger Collection**
This is the most critical collection for the platform's business logic. It separates the money the platform keeps from the money owed to the vendor.

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | Primary Key |
| `orderId` | ObjectId | Reference to Order |
| `vendorId` | ObjectId | Reference to User |
| `grossAmount` | Number | Total revenue from this vendor's items |
| `platformFee` | Number | The percentage cut taken by the platform |
| `netEarnings` | Number | The amount owed to the vendor (`grossAmount` - `platformFee`) |
| `payoutStatus` | String | Enum: `pending`, `cleared_for_payout`, `paid` |

---
1. Backend Directory Structure (Node.js / Express)
This structure separates your business logic (Services) from your HTTP request handling (Controllers), making it much easier to test and maintain.
server/
├── .env                  
├── .gitignore
├── package.json
└── src/
    ├── app.js            
    ├── server.js         
    │
    ├── config/           
    │   ├── db.js         
    │   ├── stripe.js     
    │   └── cloudinary.js     # NEW: Cloudinary SDK initialization & credentials
    │
    ├── middlewares/      
    │   ├── auth.js       
    │   ├── errorHandler.js 
    │   ├── rateLimiter.js
    │   └── upload.js         # NEW: Multer configuration using memoryStorage
    │
    ├── modules/          
│   ├── auth/
    │   │   ├── auth.controller.js
    │   │   ├── auth.routes.js
    │   │   └── auth.service.js            
│   ├── users/        # Handles Buyer and Vendor profiles
    │   │   ├── user.model.js
    │   │   ├── user.controller.js
    │   │   └── user.routes.js          
    │   ├── products/     
    │   │   ├── product.model.js      # Updated: schema now includes imageUrl arrays
    │   │   ├── product.controller.js # Updated: calls Cloudinary utility
    │   │   └── product.routes.js     # Updated: injects upload middleware before controller
    │   │
│   ├── orders/
    │   │   ├── order.model.js
    │   │   ├── order.controller.js
    │   │   └── order.routes.js     
│   └── payments/     # The financial core
    │       ├── commissionLedger.model.js
    │       ├── payment.controller.js # Handles standard requests
    │       ├── stripeWebhook.js      # Dedicated webhook listener
    │       └── payment.routes.js  
    │
    └── utils/            
        ├── catchAsync.js 
        ├── logger.js
        └── streamUpload.js   # NEW: Function to pipe Multer buffers to Cloudinary
2. Frontend Directory Structure (React / Vite)
For the frontend, we will also use a feature-based approach. We will assume you are using standard React (via Vite) with React Router and a state manager like Zustand or Redux Toolkit.

Plaintext
client/
├── .env                  # Public environment variables (VITE_STRIPE_PUBLIC_KEY)
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          # React DOM rendering and Context Providers
    ├── App.jsx           # Root component and main layout wrapper
    │
    ├── assets/           # Static files (images, global CSS)
    │   └── index.css
    │
    ├── components/       # Reusable, "dumb" UI components
    │   ├── ui/           # Buttons, Inputs, Modals, Spinners
    │   │   ├── Button.jsx
    │   │   └── Modal.jsx
    │   └── layout/       # Navbars, Footers, Sidebars
    │       ├── Navbar.jsx
    │       └── VendorSidebar.jsx
    │
    ├── features/         # Complex, domain-specific components
    │   ├── cart/
    │   │   ├── CartDrawer.jsx
    │   │   └── cartStore.js      # Zustand store or Redux slice for cart state
    │   ├── checkout/
    │   │   ├── CheckoutForm.jsx  # Stripe Elements wrapper
    │   │   └── OrderSummary.jsx
    │   └── vendorDashboard/
    │       ├── PayoutStatus.jsx
    │       └── ProductList.jsx
    │
    ├── hooks/            # Custom reusable React hooks
    │   ├── useAuth.js
    │   └── useDebounce.js
    │
    ├── pages/            # Top-level route components
    │   ├── Home.jsx
    │   ├── Shop.jsx
    │   ├── ProductDetails.jsx
    │   ├── CartPage.jsx
    │   ├── Checkout.jsx
    │   └── vendor/
    │       ├── Dashboard.jsx
    │       └── Inventory.jsx
    │
    ├── routes/           # Routing configuration
    │   ├── AppRoutes.jsx
    │   └── PrivateRoute.jsx      # Component to protect vendor/admin routes
    │
    ├── services/         # API call definitions (Axios/Fetch)
    │   ├── api.js        # Base Axios instance with interceptors
    │   ├── authApi.js
    │   ├── productApi.js
    │   └── paymentApi.js
    │
    └── utils/            # Formatting and calculation helpers
        ├── currencyFormatter.js
        └── commissionCalculator.js