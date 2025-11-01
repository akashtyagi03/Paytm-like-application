import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function User() {
    const [user, setUser] = useState([]);
    const [filter, setFilter] = useState("");
    console.log(filter)

    useEffect(() => {
        //fetch users from backend
        const fetchusers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/bulk", {
                    headers: {
                        "authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                setUser(res.data.users);
            } catch (err) {
                console.log("error fetching users", err);
            }
        }
        fetchusers();
    }, [])

    useEffect(() => {
        const fetchFilteredUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/bulk/filter?filter=" + filter, {
                    headers: {
                        "authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                setUser(res.data.users);
            } catch (err) {
                console.log("error filtering users", err);
            }
        }
        fetchFilteredUsers();
    }, [filter])

    return <div >
        <div className="text-2xl">
            Users
        </div>
        <div className="p-5">
            <input
                onChange={(e) => setFilter(e.target.value)}
                type="text"
                placeholder="Enter name to send money"
                className="border border-gray-400 rounded-full w-100 h-10 px-4 outline-none focus:border-blue-500"
            />
        </div>
        <div>
            {user.map(user => <Users users={user} />)}
        </div>
    </div>
}

export function Users({ users }: any) {
    const navigate = useNavigate();

    return <div key={users.id}>
        <div className="border border-gray-400 rounded-lg p-4 m-2 hover:bg-gray-100 cursor-pointer">
            <div className="flex justify-between items-center">
                <div className="font-bold text-lg">
                    {users.firstName} {users.lastName}
                </div>
                <button onClick={
                    () => {
                        navigate(`/sendmoney?id=${users.id}&firstname=${users.firstName}&lastname=${users.lastName}`);
                    }
                } className="bg-blue-500 text-white rounded-sm w-35 h-9 flex items-center justify-center cursor-pointer">
                    send money
                </button>
            </div>
        </div>
    </div>
}