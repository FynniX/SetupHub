import React from 'react';
import { Trash2 } from 'react-feather';
import Verify from '../methods/Verify'
import styles from '../styles/tracks.module.scss'

import axios from "axios";

import SidebarMenu from '../components/Sidebar'
import Error from "../components/Error";

class Tracks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            folder: "",
            game: "",
            tracks: [],
            games: [],
            error: "\u00a0",
            error2_success: false,
            error2: ""
        }
    }

    async componentDidMount() {
        await Verify();
        await this.get();
        await this.getGames();
    }

    async getGames() {
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

    async get() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {data} = await axios.post(`${server}/tracks/get`, {
            token
        })

        if(Array.isArray(data)) {
            this.setState({
                tracks: data
            })
        }
    }

    async insert() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {name, folder, game} = this.state

        if(name !== "" && folder !== "" && game !== "") {
            const {data} = await axios.post(`${server}/tracks/add`, {
                token, name, folder, game
            })

            if(data) {
                await this.get()

                this.setState({
                    error2_success: true,
                    error2: "Track was successful created!"
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
            const {data} = await axios.post(`${server}/tracks/remove`, {
                token, id
            })

            if(data) {
                await this.get()

                this.setState({
                    error2_success: true,
                    error2: "Track was successful removed!"
                })
            }
        }
    }

    render() {
        const select_games = this.state.games.map((value, index) => {
            return (
                <option key={`game-${index}`} value={JSON.stringify(value)}>{value.name}</option>
            )
        })

        const tracks = this.state.tracks.map((value, index) => {
            const obj_game = JSON.parse(value.game)

            return (
                <div key={index} className={styles.track_container}>
                    <div className={styles.title}>
                        <h6>Track - {value.name}</h6>
                        <button onClick={async e => {
                            await this.remove(value.id)
                        }} className={styles.remove}>
                            Remove <Trash2 size={18}/>
                        </button>
                    </div>

                    <div className={styles.splitter}/>

                    <p className={styles.info}>Name: {value.name}</p>
                    <p className={styles.info}>Folder: {value.folder}</p>
                    <p className={styles.info}>Games: {obj_game.name}</p>
                </div>
            )
        })

        return (
            <div className={styles.wrapper}>
                <SidebarMenu active="Tracks"/>
                <Error success={this.state.error2_success} text={this.state.error2}/>

                <div className={styles.tracks_container}>
                    <div className={styles.add_container}>

                        <div className={styles.title}>
                            <h6>Insert a new track</h6>
                        </div>

                        <br/>

                        <label htmlFor="">Name</label>
                        <input type="text" placeholder="e.g. Oulton Park" onChange={e => {
                            this.setState({
                                name: e.target.value
                            })
                        }}/>

                        <label htmlFor="">Folder</label>
                        <input type="text" placeholder="e.g. oulton_park" onChange={e => {
                            this.setState({
                                folder: e.target.value
                            })
                        }}/>

                        <label htmlFor="game">Game</label>
                        <select id="game" defaultValue="" style={this.state.game === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                            this.setState({
                                game: e.target.value
                            })
                        }}>
                            <option value="" disabled>Please choose...</option>
                            {select_games}
                        </select>

                        <p className={styles.error}>{this.state.error}</p>

                        <button onClick={this.insert.bind(this)}>Insert</button>

                        <br/>
                    </div>

                    {tracks}
                </div>
            </div>
        )
    }
}

export default Tracks