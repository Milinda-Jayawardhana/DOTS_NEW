import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Stats() {
  const [stats, setStats] = useState([]);
  const [role, setRole] = useState(null);
  const [editingStat, setEditingStat] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/stats");
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch {
        setRole(null);
      }
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/stats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/stats/${editingStat._id}`,
        {
          num: editingStat.num,
          mark: editingStat.mark,
          text: editingStat.text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats((prev) =>
        prev.map((s) => (s._id === editingStat._id ? editingStat : s))
      );
      setEditingStat(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <section className="pt-10 mx- lg:mx-20 md:pb-none">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-6 md:flex md:justify-evenly flex-wrap max-w-[80vw] mx-auto md:max-w-none">
          {stats.map((item) => (
            <div className="flex flex-col items-center" key={item._id}>
              {editingStat?._id === item._id ? (
                <div className="space-y-2">
                  <input
                    className="px-2 py-1 text-black border rounded"
                    type="number"
                    value={editingStat.num}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, num: Number(e.target.value) })
                    }
                  />
                  <input
                    className="px-2 py-1 text-black border rounded"
                    type="text"
                    value={editingStat.mark}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, mark: e.target.value })
                    }
                  />
                  <input
                    className="px-2 py-1 text-black border rounded"
                    type="text"
                    value={editingStat.text}
                    onChange={(e) =>
                      setEditingStat({ ...editingStat, text: e.target.value })
                    }
                  />
                  <div className="space-x-2">
                    <button
                      onClick={handleUpdate}
                      className="px-2 py-1 text-white bg-green-500 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingStat(null)}
                      className="px-2 py-1 text-white bg-gray-500 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="flex items-center gap-1">
                      <CountUp
                        end={item.num}
                        duration={5}
                        delay={1}
                        className="text-2xl font-semibold sm:text-3xl lg:text-5xl md:text-4xl"
                      />
                      <p className="text-xl">{item.mark}</p>
                    </div>
                    <p className="max-w-[100px] leading-snug text-white/80 text-[14px] sm:text-[18px] font-semibold">
                      {item.text}
                    </p>
                  </div>
                  {role === "admin" && (
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => setEditingStat(item)}
                        className="px-2 py-1 text-white bg-blue-500 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-2 py-1 text-white bg-red-500 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
