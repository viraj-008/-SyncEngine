
const getStatus = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api`);
        const data = await response.json();
        return data;
    }
    catch (error) { 
        console.log(error)
    }
}
export { getStatus }