const API_BASE_URL = "http://localhost:8000";

export async function predictInsect(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Prediction failed");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// Health check function
export async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        console.error("Health check failed:", error);
        return false;
    }
}