import React from 'react';
import { Edit } from 'react-feather';
import axios from "axios";
import Verify from '../methods/Verify'
import styles from '../styles/settings.module.scss'


import SidebarMenu from '../components/Sidebar'
import Error from "../components/Error";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            oldpassword: "",
            newpassword: "",
            repeatpassword: "",
            games: [],
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

        const {data} = await axios.post(`${server}/games/get`, {
            token
        })

        if(Array.isArray(data)) {
            this.setState({
                games: data
            })
        }
    }

    async changePassword() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {oldpassword, newpassword, repeatpassword} = this.state

        if(oldpassword !== "" && newpassword !== "" && newpassword === repeatpassword) {
            const {data} = await axios.post(`${server}/user/changePassword`, {
                token, oldpassword, newpassword
            })

            if(!data)
                this.setState({
                    error: "An error occurred!"
                })
            else {
                this.setState({
                    error2_success: true,
                    error2: "Password was successful changed!"
                })
            }
        } else {
            this.setState({
                error: "Please fill out all fields!"
            })
        }
    }

    updateFolder(name) {
        localStorage.setItem(name, this.state[name])

        this.setState({
            error2_success: true,
            error2: "Path was successful updated!"
        })
    }

    render() {
        const games = this.state.games.map((value, index) => {
            if(this.state[value.shorthand] === undefined) {
                this.setState({
                    [value.shorthand]: localStorage.getItem(value.shorthand) || ""
                })
            }

            return (
                <div key={index} className={styles.game_container}>
                    <div className={styles.title}>
                        <h6>Game - {value.name}</h6>
                        <button onClick={async e => {
                            this.updateFolder(value.shorthand)
                        }} className={styles.remove}>
                            Update Path <Edit size={18}/>
                        </button>
                    </div>

                    <div className={styles.splitter}/>

                    <p className={styles.info}>Name: {value.name}</p>
                    <p className={styles.info}>Shorthand: {value.shorthand}</p>

                    <br/>

                    <label htmlFor="">Path to Documents Folder</label>
                    <input type="text" value={this.state[value.shorthand]} onChange={e => {
                        this.setState({
                            [value.shorthand]: e.target.value
                        })
                    }} placeholder="e.g. C:/Users/User/Documents/Assetto Corsa Competizione/Setups"/>
                </div>
            )
        })

        return (
            <div className={styles.wrapper}>
                <SidebarMenu active="Settings"/>
                <Error success={this.state.error2_success} text={this.state.error2}/>

                <div className={styles.settings_container}>
                    <div className={styles.add_container}>

                        <div className={styles.title}>
                            <h6>Change Password</h6>
                        </div>

                        <br/>

                        <label htmlFor="">Old Password</label>
                        <input type="password" placeholder="Old Password" onChange={e => {
                            this.setState({
                                oldpassword: e.target.value
                            })
                        }}/>

                        <label htmlFor="">New Password</label>
                        <input type="password" placeholder="New Password" onChange={e => {
                            this.setState({
                                newpassword: e.target.value
                            })
                        }}/>

                        <label htmlFor="">Repeat Password</label>
                        <input type="password" placeholder="Repeat Password" onChange={e => {
                            this.setState({
                                repeatpassword: e.target.value
                            })
                        }}/>

                        <p className={styles.error}>{this.state.error}</p>

                        <button onClick={this.changePassword.bind(this)}>Insert</button>

                        <br/>
                    </div>

                    {games}
                </div>
            </div>
        )
    }
}

export default Settings