import React from 'react';
import axios from "axios";
import styles from '../styles/login.module.scss'

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            server: localStorage.getItem("server") || "",
            error: "\u00a0"
        }
    }

    async login() {
        let {email, password, server} = this.state;

        if (server.charAt(server.length - 1) === "/")
            server = server.substr(0, server.length - 1)

        if (email !== "" && password !== "" && server !== "") {
            if (server.includes("http")) {
                const {data} = await axios.post(`${server}/user/login`, {
                    email, password
                })

                if (data.success) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("server", server);
                    window.location.href = "#"
                } else {
                    this.setState({
                        error: "Email or Password is wrong!"
                    })
                }
            } else {
                this.setState({
                    error: "http:// or https:// must exist in your server address!"
                })
            }
        } else {
            this.setState({
                error: "Please fill out all fields!"
            })
        }
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <h4>Login</h4>
                    <h6>Share your setups with ease.</h6>

                    <div className={styles.login_container}>
                        <input type="email" placeholder="Email" onChange={e => {
                            this.setState({
                                email: e.target.value
                            })
                        }}/>
                        <input type="password" placeholder="Password" onChange={e => {
                            this.setState({
                                password: e.target.value
                            })
                        }}/>

                        <input type="text" placeholder="Server Address" value={this.state.server} onChange={e => {
                            this.setState({
                                server: e.target.value
                            })
                        }}/>
                        <p>Example: http://localhost:3030</p>

                        <button onClick={this.login.bind(this)}>Login</button>

                        <p className={styles.error}>{this.state.error}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login