import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithGoogle } from './firebase';
import { auth } from './firebase';
import GoogleLogo from './GoogleLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(null); // Clear any existing error on successful sign-in
    } catch (error) {
      setError('*Incorrect email or password');
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      setError(null); // Clear any existing error on successful sign-in
    } catch (error) {
      setError('An error occurred during Google sign-in');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 rounded py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#!" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 mb-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={handleSignInWithGoogle}
              className="bg-white text-gray-600 px-4 py-2 rounded-md flex items-center justify-center space-x-2 w-64 border border-gray-300 text-sm font-medium shadow-sm hover:bg-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <GoogleLogo className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </div>
        </form>
        <div className="text-sm">
          <p className="font-medium text-center">
            Don't have an account?
            <Link className="text-indigo-600 hover:text-indigo-500 ml-1" to="/register">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
