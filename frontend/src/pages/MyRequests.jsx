import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/sent");

      // ✅ SAFE DATA ACCESS
      setRequests(res.data?.data || []);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (requestId) => {
    const confirmCancel = window.confirm("Cancel this request?");
    if (!confirmCancel) return;

    try {
      await API.delete(`/requests/${requestId}`);

      // ✅ Update UI instantly
      setRequests((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            My Join Requests
          </h2>

          {!requests || requests.length === 0 ? (
            <p>No requests sent yet.</p>
          ) : (
            <div className="space-y-6">
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

                      <button
                        onClick={() => cancelRequest(req._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={req._id}
                    className="border rounded-xl p-6 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">
                        {req.trip?.title}
                      </h3>

                      <p className="text-slate-600">
                        {req.trip?.destination}
                      </p>
                    </div>

                    {/* STATUS */}
                    {req.status === "pending" && (
                      <div className="flex items-center gap-4">
                        <span className="text-yellow-600 font-medium">
                          Pending
                        </span>

                        <button
                          onClick={() => cancelRequest(req._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {req.status === "accepted" && (
                      <span className="text-green-600 font-medium">
                        Accepted
                      </span>
                    )}

                    {req.status === "rejected" && (
                      <span className="text-red-600 font-medium">
                        Rejected
                      </span>
                    )}
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

export default MyRequests;