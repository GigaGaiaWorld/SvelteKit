export async function load({ fetch }) {
    try {
        const response = await fetch('http://127.0.0.1:8000/calendar/get');
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        console.log("calendar server:",data)
        return { data };
    } catch (error) {
        console.log("calendar server error")
        console.error(error);
        return { data: [] };
    }
}


