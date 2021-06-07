import React from 'react';
import { Trash2 } from 'react-feather';
import Verify from '../methods/Verify'
import styles from '../styles/games.module.scss'

import axios from "axios";

import SidebarMenu from '../components/Sidebar'
import Error from "../components/Error";

class Games extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            shorthand: "",
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

    async insert() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {name, shorthand} = this.state

        if(name !== "" && shorthand !== "") {
            const {data} = await axios.post(`${server}/games/add`, {
                token, name, shorthand
            })

            if(data) {
                await this.get()
                this.setState({
                    error2_success: true,
                    error2: "Game was successful created!"
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
            const {data} = await axios.post(`${server}/games/remove`, {
                token, id
            })

            if(data) {
                await this.get()
                this.setState({
                    error2_success: true,
                    error2: "Game was successful removed!"
                })
            }
        }
    }

    render() {
        const games = this.state.games.map((value, index) => {
            return (
                <div key={index} className={styles.game_container}>
                    <div className={styles.title}>
                        <h6>Game - {value.name}</h6>
                        <button onClick={async e => {
                            await this.remove(value.id)
                        }} className={styles.remove}>
                            Remove <Trash2 size={18}/>
                        </button>
                    </div>

                    <div className={styles.splitter}/>

                    <p className={styles.info}>Name: {value.name}</p>
                    <p className={styles.info}>Shorthand: {value.shorthand}</p>
                </div>
            )
        })

        return (
            <div className={styles.wrapper}>
                <SidebarMenu active="Games"/>
                <Error success={this.state.error2_success} text={this.state.error2}/>

                <div className={styles.games_container}>
                    <div className={styles.add_container}>

                        <div className={styles.title}>
                            <h6>Insert a new game</h6>
                        </div>

                        <br/>

                        <label htmlFor="">Name</label>
                        <input type="text" placeholder="e.g. Assetto Corsa Competizione" onChange={e => {
                            this.setState({
                                name: e.target.value
                            })
                        }}/>

                        <label htmlFor="">Name</label>
                        <input type="text" placeholder="e.g. ACC" onChange={e => {
                            this.setState({
                                shorthand: e.target.value
                            })
                        }}/>

                        <p className={styles.error}>{this.state.error}</p>

                        <button onClick={this.insert.bind(this)}>Insert</button>

                        <br/>
                    </div>

                    {games}
                </div>
            </div>
        )
    }
}

export default Games