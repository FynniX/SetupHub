import React from 'react';
import { Trash2, Edit } from 'react-feather';
import axios from "axios";
import Verify from '../methods/Verify'
import styles from '../styles/user.module.scss'


import SidebarMenu from '../components/Sidebar'
import Error from "../components/Error";

class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            users: [],
            error: "\u00a0",
            error2_success: false,
            error2: ""
        }
    }

    async componentDidMount() {
        await Verify();
        await this.get();
    }

    async get() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {data} = await axios.post(`${server}/user/get`, {
            token
        })

        if(Array.isArray(data)) {
            this.setState({
                users: data
            })
        }
    }

    async insert() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {email, password} = this.state

        if(email !== "" && password !== "") {
            const {data} = await axios.post(`${server}/user/add`, {
                token, email, password
            })

            if(data) {
                await this.get()

                this.setState({
                    error2_success: true,
                    error2: "User was successful created!"
                })
            } else
                this.setState({
                    error: "An error occurred!"
                })
        } else {
            this.setState({
                error: "Please fill out all fields!"
            })
        }
    }

    async remove(id) {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        if(id !== undefined) {
            const {data} = await axios.post(`${server}/user/remove`, {
                token, id
            })

            if(data) {
                await this.get()

                this.setState({
                    error2_success: true,
                    error2: "User was successful removed!"
                })
            }
        }
    }

    async toggleAdmin(id, isAdmin) {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        if(id !== undefined) {
            const {data} = await axios.post(`${server}/user/toggleAdmin`, {
                token, id, isAdmin: !isAdmin
            })

            if(data)
                await this.get()
        }
    }

    render() {
        const users = this.state.users.map((value, index) => {
            return (
                <div key={index} className={styles.user_container}>
                    <div className={styles.title}>
                        <h6>User - {value.email}</h6>
                        <button onClick={async e => {
                            await this.toggleAdmin(value.id, value.isAdmin)
                        }} className={styles.remove}>
                            Toggle Admin <Edit size={18}/>
                        </button>
                        <button onClick={async e => {
                            await this.remove(value.id)
                        }} className={styles.remove}>
                            Remove <Trash2 size={18}/>
                        </button>
                    </div>

                    <div className={styles.splitter}/>

                    <p className={styles.info}>Email: {value.email}</p>
                    <p className={styles.info}>Admin: {value.isAdmin === true ? "Ja" : "Nein"}</p>
                </div>
            )
        })

        return (
            <div className={styles.wrapper}>
                <SidebarMenu active="User"/>
                <Error success={this.state.error2_success} text={this.state.error2}/>

                <div className={styles.users_container}>
                    <div className={styles.add_container}>

                        <div className={styles.title}>
                            <h6>Insert a new user</h6>
                        </div>

                        <br/>

                        <label htmlFor="">E-Mail</label>
                        <input type="email" placeholder="E-Mail" onChange={e => {
                            this.setState({
                                email: e.target.value
                            })
                        }}/>

                        <label htmlFor="">Password</label>
                        <input type="password" placeholder="Password" onChange={e => {
                            this.setState({
                                password: e.target.value
                            })
                        }}/>

                        <p className={styles.error}>{this.state.error}</p>

                        <button onClick={this.insert.bind(this)}>Insert</button>

                        <br/>
                    </div>

                    {users}
                </div>
            </div>
        )
    }
}

export default User