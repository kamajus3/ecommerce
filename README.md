# Poubelle (Ecommerce)

![Example](https://github.com/user-attachments/assets/9847f12c-b6a3-45b3-8c36-ae087a4b7f35)

## Main Technologies

- **React.js**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Next.js**: A React framework for server-side rendering and static site generation.
- **Firebase**: A platform for building mobile and web applications, offering backend services such as authentication, real-time databases, and cloud storage.

## Main Features

- [x] **User Authentication**: Secure login and registration with Firebase Authentication.
- [x] **Product Catalog**: Display products with filtering and sorting options.
- [x] **Shopping Cart**: Add, remove, and update items in the shopping cart.
- [x] **Order Management**: View and manage user orders in the admin panel.
- [x] **Responsive Design**: Mobile-friendly layout with responsive design principles.
- [x] **Campaign Management**: Manage marketing campaigns from the admin panel.
- [x] **Product Posting**: Add and update products from the admin panel.
- [x] **Order Creation and Proforma Invoice**: Create orders and generate proforma invoices for user orders.
- [ ] **Checkout Process**: Integration with payment gateway and order summary.

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
