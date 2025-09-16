import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
            Kantong Freelance
          </h1>
          <p className="text-muted-foreground">
            Buat akun baru untuk mulai mengelola keuangan bisnis Anda
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <SignUp 
            appearance={{
              elements: {
                card: "shadow-none border-0 p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border border-gray-200 dark:border-gray-700",
                formFieldInput: "rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white rounded-md",
                footerActionLink: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
              }
            }}
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}