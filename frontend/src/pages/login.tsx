/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Tabs, Tab, Input, Link, Button, Card, CardBody } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios"; // Make sure path is correct
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [selected, setSelected] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      login(res.data.token);
      navigate("/profile");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/auth/signup", {
        email: signupEmail,
        password: signupPassword,
        name: signupName
      });

      login(res.data.token);
      navigate("/profile");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>{selected === "login" ? "Login" : "Sign up"}</h1>
        </div>

        <div className="flex flex-col w-full items-center">
          <Card className="max-w-full w-[340px] h-[430px]">
            <CardBody className="overflow-hidden">
              <Tabs
                fullWidth
                aria-label="Tabs form"
                selectedKey={selected}
                size="md"
                onSelectionChange={(key) => setSelected(String(key))}
              >
                <Tab key="login" title="Login">
                  <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <Input
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    <Input
                      isRequired
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <p className="text-center text-small">
                      Need to create an account?{" "}
                      <Link size="sm" onPress={() => setSelected("sign-up")}>
                        Sign up
                      </Link>
                    </p>
                    {errorMsg && (
                      <p className="text-center text-danger text-small">{errorMsg}</p>
                    )}
                    <div className="flex gap-2 justify-end">
                      <Button fullWidth color="primary" isLoading={loading} type="submit">
                        Login
                      </Button>
                    </div>
                  </form>
                </Tab>

                <Tab key="sign-up" title="Sign up">
                  <form className="flex flex-col gap-4 h-[300px]" onSubmit={handleSignup}>
                    <Input
                      isRequired
                      label="Name"
                      placeholder="Enter your name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                    <Input
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                    <Input
                      isRequired
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <p className="text-center text-small">
                      Already have an account?{" "}
                      <Link size="sm" onPress={() => setSelected("login")}>
                        Login
                      </Link>
                    </p>
                    {errorMsg && (
                      <p className="text-center text-danger text-small">{errorMsg}</p>
                    )}
                    <div className="flex gap-2 justify-end">
                      <Button fullWidth color="primary" isLoading={loading} type="submit">
                        Sign up
                      </Button>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
