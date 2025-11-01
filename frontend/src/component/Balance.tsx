import axios from "axios";
import { useEffect, useState } from "react";

export function Balance(){
    const [Balance, setBalance] = useState("");

    useEffect(()=>{
        const fetchBalance = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/account/balance", {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setBalance(res.data.balance);
            } catch (err) {
                console.log("Error fetching balance:", err);
            }
        };
        fetchBalance();
    },[])

    return <div>
        <p className="text-2xl">Your Balance {Balance}</p>
    </div>  
}