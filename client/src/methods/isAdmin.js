import axios from "axios";

export default async function isAdmin() {
    const server = localStorage.getItem("server")
    const token = localStorage.getItem("token")

    try {
        const {data} = await axios.post(`${server}/user/isAdmin`, {
            token
        })

        if (data === true)
            return true;
    } catch (err) {
        console.error(err)
    }

    return false;
}