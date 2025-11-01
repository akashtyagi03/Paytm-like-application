import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Sendmoney() {
  const [searchparam] = useSearchParams("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const id:any = searchparam.get("id");

  const handleTransfer = async () => {
    if (!amount) {
      alert("Please enter an amount");
      return;
    }
    const res = await axios.post("http://localhost:5000/api/v1/account/transfer", {
      to: parseInt(id),
      amount: parseFloat(amount)
    }, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    setAmount("");
    alert("Transfer Failed: " + res.data.message);
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h2 className="text-2xl font-semibold mb-6">Send Money</h2>

        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div className="ml-3 text-lg font-medium">{searchparam.get("firstname")} {searchparam.get("lastname")}</div>
        </div>

        <div className="text-left mb-4">
          <label className="block text-gray-700 mb-2">Amount (in ₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          onClick={handleTransfer}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-medium transition-all"
        >
          Initiate Transfer
        </button>
      </div>
    </div>
  );
}