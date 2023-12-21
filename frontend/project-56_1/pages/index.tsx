import Head from 'next/head'
import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import UserService from '@/service/UserService'

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [loginError, setLoginError] = useState("");

  const router = useRouter();

  const validation = () => {
    setNameError("");
    if (!username || username.trim() === "") {
      setNameError("Username is empty");
      return false;
    }
    return true;
  }

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!validation()) return;

    const response = await UserService.loginUser(username, password);
    if (response === undefined) {
        setLoginError("Login failed");
        return;
    }

    if (response.status === 200) {
      setLoginError("");
      const { token } = await response.json();
      sessionStorage.setItem("token", token)
      sessionStorage.setItem("username", username);
      setTimeout(() => {
        router.push("/Blog");
      });
    } else {
      // handle error
      setLoginError("Login failed");
    }
  }

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername !== null) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
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
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            {nameError && <div className="text-danger">{nameError}</div>}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>
        {loginError && <div className='text-danger'>{loginError}</div>}
        <div className="row">
          <div className="col-md-2">
            <button className="btn btn-primary" type="submit">Login</button>
          </div>
          <div className="col-md-2">
            <Link className="btn btn-primary" href="/Register">
              Register
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}
