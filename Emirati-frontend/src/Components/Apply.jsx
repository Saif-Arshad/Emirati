import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Apply() {
    const { id: jobId } = useParams();

    const [coverLetter, setCoverLetter] = useState("");
    const [experience, setExperience] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const token = localStorage.getItem("user-token");
    const userToken = token && token.replace(/"/g, "");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const payload = {
            jobId,
            cover_letter: coverLetter,
            experience,
            contactInfo,
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/job/apply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setErrorMessage(errorData.error || "Something went wrong.");
            } else {
                await res.json();
                toast.success("Application submitted successfully!")
                setSuccessMessage("Application submitted successfully!");
                setCoverLetter("");
                setExperience("");
                setContactInfo("");
            }
        } catch (error) {
            console.log("🚀 ~ handleSubmit ~ error:", error)
            toast.error("Something went wrong. Please try again.")

            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-100 p-8 rounded-lg shadow-md">
                <h1 className="text-2xl md:text-3xl text-start font-bold mb-10">
                    Apply for Job
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lg text-start text-gray-900">Cover Letter</label>
                        <textarea
                            className="mt-1 w-full border border-gray-700 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            rows="4"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-lg text-start text-gray-900">Related Experience</label>
                        <textarea
                            className="mt-1 w-full border border-gray-700 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            rows="3"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-lg text-start text-gray-900">Your Contact Info</label>
                        <input
                            type="text"
                            className="mt-1 w-full border border-gray-700 rounded-md p-2 focus:outline-none focus:border-blue-500"

                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-500 text-sm text-center">{successMessage}</p>
                    )}
                    <div className="flex items-center justify-end">

                        <button
                            type="submit"
                            disabled={loading}
                            className=" bg-blue-500 mt-10 w-fit  hover:bg-blue-600 text-white py-2 px-4 rounded-full text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {loading ? "Submitting..." : "Submit Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Apply;
