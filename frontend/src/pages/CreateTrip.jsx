import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const CreateTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [trip, setTrip] = useState({
    title: "",
    description: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    budgetRange: "medium", // 🔥 NEW
    interests: "", // 🔥 NEW (string)
    image: "", // 🔥 NEW
    maxParticipants: "",
    currentMembers: "1",
  });

  // ✅ FETCH TRIP (EDIT MODE)
  useEffect(() => {
    if (!isEditMode) return;

    const fetchTrip = async () => {
      try {
        const res = await API.get(`/trips/${id}`);
        const data = res.data.data;

        setTrip({
          title: data.title || "",
          description: data.description || "",
          destination: data.destination || "",
          startDate: data.startDate?.split("T")[0] || "",
          endDate: data.endDate?.split("T")[0] || "",
          budget: data.budget || "",
          budgetRange: data.budgetRange || "medium",
          interests: data.interests?.join(", ") || "",
          image: data.image || "",
          maxParticipants: data.maxParticipants || "",
          currentMembers: data.currentMembers || "1",
        });
      } catch (err) {
        console.log(err.response?.data?.message);
        alert("Failed to load trip details");
      }
    };

    fetchTrip();
  }, [id, isEditMode]);

  // ✅ HANDLE CHANGE
  const handleChange = (field, value) => {
    setTrip((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", trip.title);
      formData.append("description", trip.description);
      formData.append("destination", trip.destination);
      formData.append("startDate", trip.startDate);
      formData.append("endDate", trip.endDate);
      formData.append("budget", trip.budget);
      formData.append("budgetRange", trip.budgetRange);
      formData.append("maxParticipants", trip.maxParticipants);
      formData.append("currentMembers", trip.currentMembers);
      
      const interestsArray = trip.interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);
        
      interestsArray.forEach(interest => formData.append("interests", interest));

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (trip.image) {
        formData.append("image", trip.image);
      }

      if (isEditMode) {
        await API.patch(`/trips/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Trip Updated Successfully!");
      } else {
        await API.post("/trips", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Trip Created Successfully!");
      }

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex justify-center items-center py-12 px-4">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
            {isEditMode ? "Edit Trip" : "Create a New Trip"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Trip Title
              </label>
              <input
                required
                value={trip.title}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Destination
              </label>
              <input
                required
                value={trip.destination}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                onChange={(e) => handleChange("destination", e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Description
              </label>
              <textarea
                required
                rows="4"
                value={trip.description}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg resize-none"
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="date"
                required
                value={trip.startDate}
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
              <input
                type="date"
                required
                value={trip.endDate}
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>

            {/* Budget & Participants */}
            <div className="grid md:grid-cols-3 gap-6">
              <input
                type="number"
                placeholder="Budget"
                value={trip.budget}
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => handleChange("budget", e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Participants"
                value={trip.maxParticipants}
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) =>
                  handleChange("maxParticipants", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Current Members"
                value={trip.currentMembers}
                min="1"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) =>
                  handleChange("currentMembers", e.target.value)
                }
              />
            </div>

            {/* 🔥 Budget Range */}
            <select
              value={trip.budgetRange}
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) =>
                handleChange("budgetRange", e.target.value)
              }
            >
              <option value="low">Low Budget</option>
              <option value="medium">Medium Budget</option>
              <option value="high">High Budget</option>
            </select>

            {/* 🔥 Interests */}
            <input
              value={trip.interests}
              placeholder="Interests (e.g. hiking, beach)"
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) =>
                handleChange("interests", e.target.value)
              }
            />

            {/* 🔥 Image */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Trip Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {trip.image && !imageFile && isEditMode && (
                <p className="text-xs text-gray-500 mt-1">
                  Current: <a href={trip.image} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Image</a>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white py-3 rounded-lg transition ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Processing..." : isEditMode ? "Update Trip" : "Create Trip"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;