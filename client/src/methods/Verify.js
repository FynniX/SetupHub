import axios from "axios";

export default async function verify() {
    const server = localStorage.getItem("server")
    const token = localStorage.getItem("token")

    try {
        const {data} = await axios.post(`${server}/user/verify`, {
            token
        })

        if (!data.success) {
            localStorage.removeItem("token")
            window.location.href = "#login"
        }
    } catch (err) {
        console.error(err)
        localStorage.removeItem("token")
        window.location.href = "#login"
    }
}