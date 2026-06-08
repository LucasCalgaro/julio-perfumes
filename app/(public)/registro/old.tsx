"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          router.push("/admin");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-secondary p-8 shadow-lg">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm font-sans">
            Ou{" "}
            <Link href="/login" className="hover:underline text-primary">
              entre na sua conta existente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          {error && (
            <div className="rounded-md p-3 bg-destructive/5 text-sm text-destructive font-bold">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-md"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                className="rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                className="rounded-md"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando conta..." : "Registrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
