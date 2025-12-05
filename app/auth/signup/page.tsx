import { RegisterForm } from "@/components/auth/register-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-white relative flex items-center justify-center">
      {/*  Diagonal Cross Bottom Left Fade Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
        }}
      />
      <div className="relative z-10 w-full max-w-md px-4">
        <RegisterForm />
      </div>
    </div>
  );
}
