# Poubelle - Ecommerce Application

## Main Technologies

- **React.js**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Next.js**: A React framework for server-side rendering and static site generation.
- **Firebase**: A platform for building mobile and web applications, offering backend services such as authentication, real-time databases, and cloud storage.

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

     - Enable Firebase Authentication
     - Enable Firebase Realtime Database
     - Enable Firebase Cloud Storage

   - **Update Firebase Configuration**

     Update the Firebase Cloud Storage URL in your `.env.local` file.

   - **Deploy Firebase Rules**

     Apply the Firebase storage and database rules by executing:

     ```bash
     npm run deploy
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
