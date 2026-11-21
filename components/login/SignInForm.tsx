"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { LoginValidation } from "@/lib/validation/loginValidation";
import SubmitButton from "../ui/SubmitButton";
import { signIn } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type LoginFormValues = z.infer<typeof LoginValidation>;

const SignIn: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bubbles, setBubbles] = useState<React.ReactNode[]>([]);

  const generateBubbles = () => {
    const bubbleCount = window.innerWidth < 640 ? 5 : 15;
    const newBubbles = Array.from({ length: bubbleCount }, (_, i) => {
      const size = Math.random() * 50 + 20;
      const left = Math.random() * 100;
      const delay = Math.random() * -10; // Negative delay for immediate start
      const duration = Math.random() * 10 + 10;
      const opacity = Math.random() * 0.3 + 0.1;

      return (
        <div
          key={i}
          className="absolute rounded-full opacity-40 bg-opacity-20 bubble-float"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDelay: `${delay}s`, // Apply negative delay
            animationDuration: `${duration}s`,
            backgroundColor: `hsla(0, 50%, 50%, ${opacity})`,
            filter: `blur(${size / 20}px)`,
          }}
        />
      );
    });

    setBubbles(newBubbles);
  };

  
  useEffect(() => {
    generateBubbles();
    window.addEventListener("resize", generateBubbles);

    // Hide scrollbar for the entire body
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", generateBubbles);
      document.body.style.overflow = ""; // Reset on unmount
    };
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setMsg("");

    try {
      const response = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });

      if (response?.error) {
        console.error("Login error:", response.error);
        setMsg("Login failed. Please check your username and password.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Unexpected login error:", error);
      setMsg("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen min-w-full bg-gradient-to-br from-custom-pink-200 via-custom-pink-100 to-custom-pink-200 flex items-center justify-center p-4 
    overflow-hidden
    scrollbar-hide
    [&::-webkit-scrollbar]:hidden 
    [-ms-overflow-style:none] 
    [scrollbar-width:none]"
    >
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 z-0 pointer-events-none">{bubbles}</div>

      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden">
        {/* Rest of the component remains the same */}
        <div className="p-8 space-y-6 relative z-20">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-custom-pink-300 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to continue to your dashboard
            </p>
          </div>
          {msg && (
            <div className="mb-4">
              <Alert>
                <AlertTitle className="text-red-600">Login Error</AlertTitle>
                <AlertDescription>{msg}</AlertDescription>
              </Alert>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...form.register("username")}
                      className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-custom-pink-300 focus:outline-none focus:ring-0 transition duration-300"
                      placeholder="Enter your username"
                    />
                  </div>
                  {form.formState.errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                      className="pl-10 pr-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-custom-pink-300 focus:outline-none focus:ring-0 transition duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center "
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-700">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-indigo-600 focus:ring-indigo-500 mr-2"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-custom-pink-330 hover:text-indigo-500 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="pt-2">
                <SubmitButton
                  isLoading={isLoading}
                  className="w-full bg-custom-pink-300 text-white py-2.5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.02]"
                >
                  Login
                </SubmitButton>
              </div>
            </form>
          </Form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-custom-pink-330 hover:text-indigo-500 hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
