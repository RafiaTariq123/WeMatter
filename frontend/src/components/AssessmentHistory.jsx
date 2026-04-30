import React, { useEffect, useState } from "react";

export default function AssessmentHistory({ userId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:8000/api/scores/user/${userId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch assessment history");
        }
        if (isMounted) setScores(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        if (isMounted) setError(e.message || "Failed to fetch assessment history");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const sevColor = (sev) => {
    if (sev === "Normal") return "text-green-600";
    if (sev === "Mild") return "text-yellow-600";
    if (sev === "Moderate") return "text-orange-600";
    if (sev === "Severe") return "text-red-600";
    if (sev === "Extremely Severe") return "text-red-700";
    return "text-gray-600";
  };

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-[#0E6C72] mb-3">Assessment History</h2>
      <div className="bg-white rounded-md shadow p-4">
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && error && <p className="text-red-600">{error}</p>}
        {!loading && !error && scores.length === 0 && (
          <p className="text-gray-500">No assessments available.</p>
        )}
        {!loading && !error && scores.length > 0 && (
          <ul className="divide-y">
            {scores.map((s) => (
              <li key={s._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{new Date(s.completedAt || s.createdAt).toLocaleString()}</p>
                  <p className="text-base font-medium">Depression Score: {s.depressionScore}</p>
                </div>
                <span className={`text-sm font-semibold ${sevColor(s.severity)}`}>{s.severity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
