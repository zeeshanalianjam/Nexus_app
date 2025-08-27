import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const navigate = useNavigate();

    // check if user is authenticated and so if, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/v1/users/check-auth');
            if(response.data.success){
                setAuthUser(response.data.user)
                connectSocket(response.data.user);
            }
        } catch (error) {
           console.log("Error in auth: ", error?.response?.data?.message)
        } finally {
            setLoading(false);
        }
    }

    // login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        try {
            setProfileLoading(true);
            const response = await axios.post(`/api/v1/users/${state}`, credentials);
            if(response.data.success){
                const accessToken = response.data.data.accessToken;
                 axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                setAccessToken(response.data.data.accessToken);
                localStorage.setItem("accessToken", response.data.data.accessToken);
                setAuthUser(response.data.data.user);
                connectSocket(response.data.data.user);
                toast.success(response.data.message);
                navigate("/")
            } 
        } catch (error) {
            console.log("error in login : ", error)
            toast.error(error?.response?.data?.message || "Something went wrong while logging in.");
        } finally {
            setProfileLoading(false);
        }
    }

    // logout function to handle user logout and disconnect the socket
    const logout = async () => {
        try {
            setProfileLoading(true);
            localStorage.removeItem("accessToken");
            setAccessToken(null);
            setAuthUser(null);
            setOnlineUsers([]);
          delete axios.defaults.headers.common["Authorization"];
            toast.success("Logout successful!");
            if(socket) {
                socket.disconnect();
                setSocket(null);
            }
            navigate("/login");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong while logging out.");
        } finally {
            setProfileLoading(false);
        }
    }

    // update user profile function
    const updateUserProfile = async (id, body) => {
        try {
            setProfileLoading(true);
            const response = await axios.put(`/api/v1/users/update-profile/${id}`, body);
            if(response.data.success){
                setAuthUser(response.data.data);
                toast.success("Profile updated successfully!");
            } else {
                toast.error(response.data.message || "Profile update failed.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong while updating profile.");
        } finally {
            setProfileLoading(false);
        }
    }

    // update user profile image function
    const updateUserProfileImage = async (id, image) => {
        try {
            setProfileLoading(true);
            const formData = new FormData();
            formData.append("image", image);
            const response = await axios.put(`/api/v1/users/update-profile-image/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if(response.data.success){
                setAuthUser((prev) => ({
                    ...prev, 
                    profilePicture : response.data.data.profilePicture
                }))
                toast.success("Profile image updated successfully!");
            } else {
                toast.error(response.data.message || "Profile image update failed.");
            } 

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong while updating profile image.");
        } finally {
                setProfileLoading(false);
            }
    }


    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    useEffect(() => {
        if(accessToken){
          axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }
        checkAuth();
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateUserProfile,
        updateUserProfileImage,
        loading,
        profileLoading

    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export { AuthContext, AuthProvider };
