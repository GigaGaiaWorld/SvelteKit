export async function load({ fetch }) {
    try {
        const response = await fetch('http://127.0.0.1:8000/todos/get');
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        console.log("todos server:",data)
        return { data };
    } catch (error) {
        console.log("todos server error")
        console.error(error);
        return { data: [] };
    }
}


