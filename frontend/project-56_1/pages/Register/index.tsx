import UserService from "@/service/UserService";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from 'next/router';
import { UserWithEmail } from "@/types/BlogTypes";

export default function Register(){
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [admin, setAdmin] = useState(false);
    const [nameError, setNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [createError, setCreateError] = useState("");

    const router = useRouter();

    const validation = () => {
        setNameError("");
        setEmailError("");
        setPasswordError("");
        let result = true;
        if (!username || username.trim() === "") {
          setNameError("Username is required");
          result = false;
        }
        if (!email || email.trim() === "") {
          setEmailError("Email is required");
          result = false;
        }
        if (!password || password.trim() === "") {
          setPasswordError("Password is required");
          result = false;
        }
        return result;
      };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!validation()) return;

        const user = { username: username, email: email, password: password, admin: admin };
        const response = await UserService.registerUser(user);

        if(response === undefined) {
            setCreateError("Couldn't create user, they may already exist");
            return;
        }
       

        if (response.status === 201) {
                router.push("/");
        } else {
            setCreateError("Couldn't create user, they may already exist");
        }
        
    };

    return (
        <>
            <Head>
                <title>Register</title>
                <meta name="description" content="Register page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <form onSubmit={handleSubmit} className="container mt-5">
                <div className="row mb-3">
                    <div className="col-md-2">
                        <label htmlFor="nameInput" className="form-label">Username:</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            id="nameInput"
                            type="text"
                            className="form-control"
                            name="username"
                            placeholder="Username"
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        {nameError && <div className="text-danger">{nameError}</div>}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-2">
                        <label htmlFor="emailInput" className="form-label">Email:</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            id="emailInput"
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        {emailError && <div className="text-danger">{emailError}</div>}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-2">
                        <label htmlFor="passwordInput" className="form-label">Password:</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            id="passwordInput"
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Password"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        {passwordError && <div className="text-danger">{passwordError}</div>}
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-2">
                        <label htmlFor="adminInput" className="form-label">Admin:</label>
                    </div>
                    <div className="col-md-6">
                        <input
                            id="adminInput"
                            type="checkbox"
                            name="admin"
                            placeholder="admin"
                            onChange={(event) => setAdmin(event.target.checked)}
                        />
                       
                    </div>
                </div>

                <div className="row">
                    {createError && <div className="text-danger">{createError}</div>}
                    <div className="col-md-2">
                        <button className="btn btn-primary mt-3" type="submit">Register</button>
                    </div>
                    <div className="col-md-2">
                        <Link className="btn btn-primary mt-3" href="/">
                                Back
                        </Link>
                    </div>
                </div>
            </form>
        </>
    )
}
