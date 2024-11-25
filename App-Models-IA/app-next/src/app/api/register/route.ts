import { API_URL } from "@src/utils/api_url";
export const register = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Error al registrar usuario");
    }

    const data = await response.json();

    return data;
}