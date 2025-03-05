import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';

const App = () => {
    const { user, register, login, logout, authError } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        register(username, email, password);
    };

    const handleLogin = () => {
        login(username, password);
    };

    return (
        <div>
            {user ? (
                <div>
                    <h1>Welcome, {user.username}</h1>
                    {console.log(user)}
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <div>
                    <h1>Register</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleRegister}>Register</button>

                    <h1>Login</h1>
                    <button onClick={handleLogin}>Login</button>

                    {authError && <p>{authError}</p>}
                </div>
            )}
        </div>
    );
};

export default App;
