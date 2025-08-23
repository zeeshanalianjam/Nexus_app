import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios} = useContext(AuthContext)

    // function to get all users for sidebar
    const getUsers = async () => {
        try {
          const response =  await axios.get("/api/v1/messages/users")
          if(response.data.success){
            setUsers(response.data.data.users)
            setUnseenMessages(response.data.data.unseenMessages)
          }
          
        } catch (error) {
            toast.error(error?.response?.data?.messages || "Something went wrong while getting users.");
        }
    }

    // function to get messages
    const getMessages = async(userId) => {
        try {
            const response = await axios.get(`/api/v1/messages/${userId}`)
            if(response.data.success){
                setMessages(response.data.data)
            }
        } catch (error) {
            toast.error(error?.response?.data?.messages || "Something went wrong while getting messages.");
        }
    }

    // send message api
    const sendMessage = async(message) => {
        try {
            const response = await axios.post(`/api/v1/messages/send/${selectedUser._id}`, message)
            if(response.data.success){
                setMessages((prevMessages) => [...prevMessages, response.data.data])
            }
        } catch (error) {
            toast.error(error?.response?.data?.messages || "Something went wrong while sending message.");
        }
    }

    // send image api with in chat message
    const sendMessageImage = async(image) => {
        try {
            const response = await axios.post(`/api/v1/messages/send-image/${selectedUser._id}`, image)
            if(response.data.success){
                setMessages((prevMessages) => [...prevMessages, response.data.data])
            }
        } catch (error) {
            toast.error(error?.response?.data?.messages || "Something went wrong while sending image.");
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        if(!socket) return ;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/v1/messages/mark/${newMessage._id}`); 
            }else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = async () => {
        if(!socket) return ;
        socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessages();

        return () => {
            unsubscribeFromMessages();
        }
    }, [socket, selectedUser])


    const value = {
        messages,
        users,
        selectedUser,
        setSelectedUser,
        sendMessage,
        getMessages,
        getUsers,
        unseenMessages,
        sendMessageImage
    }

    return (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    )
}

export { ChatContext, ChatProvider }