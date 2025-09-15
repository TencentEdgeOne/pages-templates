import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const submit = async() => {
    console.log("submit");
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    return fetch(`/auth/signup`, {
      method: "POST",
      body: formdata,
    }).then(async (resp) => {
      if (resp.status === 200) {
        alert('Sign Up Successfully, jumping to log in...')
        return window.location.href = "/login"
      }
      alert(await resp.text());
    });
  }
  return (
    <>
      <div className="flex items-center  bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto my-10">
            <div className="text-center">
              <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
                Sign up
              </h1>

              <p className="text-gray-500 dark:text-gray-400">
                Sign up to access your account
              </p>
            </div>

            <div className="m-7">
              <form action="">
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="you@company.com"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="text-sm text-gray-600 dark:text-gray-400">
                      Password
                    </label>
                  </div>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Your Password"
                    className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <button
                    onClick={submit}
                    type="button"
                    className="w-full px-3 py-4 text-white bg-black rounded-md focus:bg-black focus:outline-none">
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
