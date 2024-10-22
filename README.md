# E-commerce

![Example](https://github.com/user-attachments/assets/9847f12c-b6a3-45b3-8c36-ae087a4b7f35)

## Main Technologies

- **React.js**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Next.js**: A React framework for server-side rendering and static site generation.
- **Firebase**: A platform for building mobile and web applications, offering backend services such as authentication, real-time databases, and cloud storage.

## Main Features

- [x] **User Authentication**: Robust login and registration system powered by Firebase Authentication, ensuring secure access for all users.
- [x] **Product Catalog**: Comprehensive product display with advanced filtering and sorting options, making it easy for users to find exactly what they need.
- [x] **Shopping Cart**: Dynamic shopping cart functionality that allows users to add, remove, and update items effortlessly.
- [x] **Order Management**: Admin panel with full control over user orders, including viewing, updating, and managing order statuses.
- [x] **Responsive Design**: Optimized for all devices, providing a seamless and intuitive experience across desktops, tablets, and mobile devices.
- [x] **Campaign Management**: Admin panel tools for creating and managing marketing campaigns, enabling targeted promotions and discounts.
- [x] **Product Management**: Easy-to-use admin interface for adding, updating, and organizing product listings.
- [x] **Order Creation & Proforma Invoicing**: Streamlined process for creating orders and generating proforma invoices, enhancing the efficiency of order handling.
- [x] **Admin Email Notifications**: Automatic email notifications to the admin for every new order, ensuring timely awareness and action.
- [ ] **Checkout & Payment Integration**: In-progress feature for a smooth checkout experience, including integration with a payment gateway and detailed order summaries.

## Getting Started

To get started with the Poubelle ecommerce application, follow these steps:

1. **Install Dependencies**

   Open your terminal, navigate to the root directory of the project, and run:

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**

   Create a `.env.local` file in the root directory. Use the provided `env.example` file as a reference to configure your environment variables.

3. **Configure Firebase**

   - **Authenticate with Firebase CLI**

     Log in to Firebase CLI by running:

     ```bash
     firebase login
     ```

   - **Enable Firebase Services**

     - Enable Firebase Authentication By email and password
     - Enable Firebase Realtime Database
     - Enable Firebase Cloud Storage

   - **Enable custom email action pages (change email, reset password, recovery account, etc)**

     Go to your Firebase Project -> Authentication -> Templates tab on top of the page -> click on pencil button -> customise action url on the bottom -> Replace

     `https://myapp.firebaseapp.com/__/auth/action` with `https://auth.mydom.com/en/action`

   - **Update Firebase Configuration**

     Update the Firebase Cloud Storage URL in your `.env.local` file.

   - **Deploy Firebase Rules**

     Apply the Firebase storage and database rules by executing:

     ```bash
     npm run deploy:rules
     ```

4. **Configure CORS for Firebase Storage**

   To handle CORS (Cross-Origin Resource Sharing) issues, you need to configure CORS for your Firebase Storage. Follow these steps:

   - **Install Google Cloud CLI**

     Follow the installation instructions at [Google Cloud CLI Installation](https://cloud.google.com/storage/docs/gsutil_install).

   - **Authenticate with Google Cloud CLI**

     Run:

     ```bash
     gcloud auth login
     ```

   - **Apply the CORS Configuration**

     Run the following command to apply the CORS configuration to your Firebase Storage bucket.

     ```bash
     npm run storage:cors
     ```

5. **Start the Development Server**

   Launch the development server with:

   ```bash
   npm run dev
   ```

   Your application should now be accessible at [http://localhost:3000](http://localhost:3000).

## Additional Notes

- Ensure Node.js and npm are installed on your system.
- For detailed documentation on Firebase and Next.js, refer to their official documentation:
  - Firebase Documentation: [Firebase Documentation](https://firebase.google.com/docs)
  - Next.js Documentation: [Next.js Documentation](https://nextjs.org/docs)
