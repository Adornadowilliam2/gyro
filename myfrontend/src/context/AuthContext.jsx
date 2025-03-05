import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);

    // Register user
    const register = async (username, email, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/register/', {
                username,
                email,
                password
            });
            setUser(response.data);
        } catch (error) {
            setAuthError(error.response?.data || 'Registration failed');
        }
    };

    // Login user and store JWT token
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/login/', {
                username,
                password
            });
            // Assuming response contains the JWT token
            const token = response.data.token;
            localStorage.setItem('access_token', token); // Store token in localStorage

            // Optionally, set the user info here as well
            setUser({ username });
        } catch (error) {
            setAuthError(error.response?.data || 'Login failed');
        }
    };

    // Logout user
    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token'); // Remove token on logout
    };

    // Check token validity
    const checkToken = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get('http://127.0.0.1:8000/api/accounts/check-token/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                console.log('Token is valid:', response.data);
                setUser({
                    username: response.data.user.username,
                    email: response.data.user.email,
                });
            } else {
                console.log('Invalid token');
                logout();
            }
        } catch (error) {
            console.error('Token check failed:', error);
            logout();
        }
    };

    // Try checking the token on component load if user is not logged in
    React.useEffect(() => {
        if (localStorage.getItem('access_token')) {
            checkToken();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, register, login, logout, authError }}>
            {children}
        </AuthContext.Provider>
    );
};
