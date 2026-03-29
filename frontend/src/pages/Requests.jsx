import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import ChatModal from "../components/ChatModal";
import { AuthContext } from "../context/AuthContext";

const Requests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chat tracking state
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = (targetUser) => {
    setActiveChatUser(targetUser);
    setIsChatOpen(true);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/received");

      // ✅ SAFE DATA HANDLING
      setRequests(res.data?.data || []);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    if (!window.confirm("Accept this request?")) return;

    try {
      await API.patch(`/requests/${id}/accept`);

      // ✅ INSTANT UI UPDATE (no reload)
      setRequests((prev) =>
        prev.filter((req) => req._id !== id)
      );

    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept");
      console.log(err.response?.data?.message);
    }
  };

  const rejectRequest = async (id) => {
    if (!window.confirm("Reject this request?")) return;

    try {
      await API.patch(`/requests/${id}/reject`);

      // ✅ INSTANT UI UPDATE
      setRequests((prev) =>
        prev.filter((req) => req._id !== id)
      );

    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <Navbar />

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        targetUser={activeChatUser} 
        currentUserId={user?._id} 
      />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white shadow-xl rounded-2xl p-8">

          <h2 className="text-3xl font-bold text-slate-800 mb-8">
            Trip Join Requests
          </h2>

          {!requests || requests.length === 0 ? (
            <p className="text-slate-600 text-lg">
              No join requests available.
            </p>
          ) : (
            <div className="grid gap-6">

              {requests.map((req) => {

                // ✅ HANDLE DELETED TRIP
                if (!req.trip) {
                  return (
                    <div
                      key={req._id}
                      className="border rounded-xl p-6 flex justify-between items-center bg-red-50"
                    >
                      <p className="text-red-600 font-medium">
                        Trip no longer exists
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={req._id}
                    className="border rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >

                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                        {req.sender?.name || "Unknown User"}
                        <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-full">
                          + {req.requestedMembers || 1} Member(s)
                        </span>
                      </h3>

                      <p className="text-slate-600 mt-1">
                        wants to join
                        <span className="font-medium text-blue-600">
                          {" "} {req.trip?.title}
                        </span>
                      </p>

                      <p className="text-slate-500 text-sm mt-1">
                        Destination: {req.trip?.destination}
                      </p>

                      <p className="text-slate-500 text-sm">
                        Budget: ₹{req.trip?.budget}
                      </p>

                      <p className="text-slate-500 text-sm">
                        Dates:{" "}
                        {req.trip?.startDate?.split("T")[0]} to{" "}
                        {req.trip?.endDate?.split("T")[0]}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-4 md:mt-0">
                      
                      <button
                        onClick={() => openChat(req.sender)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center gap-2"
                      >
                        <span>💬</span> Chat
                      </button>

                      <button
                        onClick={() => acceptRequest(req._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => rejectRequest(req._id)}
                        className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                      >
                        Reject
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;