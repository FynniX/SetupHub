import React from 'react';
import { Trash2 } from 'react-feather';
import Verify from '../methods/Verify'
import styles from '../styles/cars.module.scss'

import axios from "axios";

import SidebarMenu from '../components/Sidebar'
import Error from "../components/Error";

class Cars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            shorthand: "",
            folder: "",
            game: "",
            class1: "",
            cars: [],
            games: [],
            classes: [],
            error: "\u00a0",
            error2_success: false,
            error2: ""
        }
    }

    async componentDidMount() {
        await Verify();
        await this.get();
        await this.getGames();
        await this.getClasses();
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

    async getClasses() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {data} = await axios.post(`${server}/classes/get`, {
            token
        })

        if(Array.isArray(data)) {
            this.setState({
                classes: data
            })
        }
    }

    async get() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {data} = await axios.post(`${server}/cars/get`, {
            token
        })

        if(Array.isArray(data)) {
            this.setState({
                cars: data
            })
        }
    }

    async insert() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {name, shorthand, folder, game, class1} = this.state

        if(name !== "" && shorthand !== "" && folder !== "" && game !== "" && class1 !== "") {
            const {data} = await axios.post(`${server}/cars/add`, {
                token, name, shorthand, folder, game, class: class1
            })

            if(data) {
                await this.get()
                this.setState({
                    error2_success: true,
                    error2: "Car was successful created!"
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
            const {data} = await axios.post(`${server}/cars/remove`, {
                token, id
            })

            if(data) {
                await this.get()
                this.setState({
                    error2_success: true,
                    error2: "Car was successful removed!"
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

        const select_classes = this.state.classes.map((value, index) => {
            return (
                <option key={`class-${index}`} value={JSON.stringify(value)}>{value.name}</option>
            )
        })

        const cars = this.state.cars.map((value, index) => {
            const obj_game = JSON.parse(value.game)
            const obj_class = JSON.parse(value.class)

            return (
                <div key={index} className={styles.car_container}>
                    <div className={styles.title}>
                        <h6>Car - {value.name}</h6>
                        <button onClick={async e => {
                            await this.remove(value.id)
                        }} className={styles.remove}>
                            Remove <Trash2 size={18}/>
                        </button>
                    </div>

                    <div className={styles.splitter}/>

                    <p className={styles.info}>Name: {value.name}</p>
                    <p className={styles.info}>Shorthand: {value.shorthand}</p>
                    <p className={styles.info}>Folder: {value.folder}</p>
                    <p className={styles.info}>Game: {obj_game.name}</p>
                    <p className={styles.info}>Class: {obj_class.name}</p>
                </div>
            )
        })

        return (
            <div className={styles.wrapper}>
                <SidebarMenu active="Cars"/>
                <Error success={this.state.error2_success} text={this.state.error2}/>

                <div className={styles.cars_container}>
                    <div className={styles.add_container}>

                        <div className={styles.title}>
                            <h6>Insert a new car</h6>
                        </div>

                        <br/>

                        <label htmlFor="">Name</label>
                        <input type="text" placeholder="e.g. Aston Martin V8" onChange={e => {
                            this.setState({
                                name: e.target.value
                            })
                        }}/>

                        <label htmlFor="">Shorthand</label>
                        <input type="text" placeholder="e.g. AMR V8" onChange={e => {
                            this.setState({
                                shorthand: e.target.value
                            })
                        }}/>

                        <label htmlFor="">Folder</label>
                        <input type="text" placeholder="e.g. amr_v8_vantage_gt3" onChange={e => {
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

                        <label htmlFor="class">Class</label>
                        <select id="class" defaultValue="" style={this.state.class1 === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                            this.setState({
                                class1: e.target.value
                            })
                        }}>
                            <option value="" disabled>Please choose...</option>
                            {select_classes}
                        </select>

                        <p className={styles.error}>{this.state.error}</p>

                        <button onClick={this.insert.bind(this)}>Insert</button>

                        <br/>
                    </div>

                    {cars}
                </div>
            </div>
        )
    }
}

export default Cars