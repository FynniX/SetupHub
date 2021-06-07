import React from 'react';
import {Search, Download, FilePlus, Plus, X, Trash2} from 'react-feather';
import Verify from '../methods/Verify'
import styles from '../styles/setups.module.scss'
import moment from 'moment'
import SidebarMenu from '../components/Sidebar'
import axios from "axios";
import Error from '../components/Error'
import isAdmin from "../methods/isAdmin";

class Setups extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdmin: false,
            search_filename: "",
            search_game: "",
            search_car: "",
            search_track: "",
            search_sort_by: "",

            show_add: false,
            add_game: "",
            add_car: "",
            add_track: "",
            add_description: "",
            add_files: [],
            games: [],
            cars: [],
            tracks: [],
            setups: [],
            error: "\u00a0",
            error2_success: false,
            error2: ""
        }
    }

    async componentDidMount() {
        await Verify();
        this.setState({
            isAdmin: await isAdmin()
        })
        await this.getSetups();
        await this.getGames();
        await this.getCars();
        await this.getTracks();

        window.api.receive("DownloadSuccess", response => {
            if(response) {
                this.setState({
                    error2_success: response,
                    error2: "Setup was successful downloaded!"
                })
            } else {
                this.setState({
                    error2_success: response,
                    error2: "An error occurred!"
                })
            }
        })
    }

    async getSetups() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {data} = await axios.post(`${server}/setups/get`, {
            token
        })

        if(Array.isArray(data)) {
            this.setState({
                setups: data
            })
        }
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

    async getCars() {
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

    async getTracks() {
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

    async add() {
        const {add_game, add_car, add_track, add_description, add_files} = this.state
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        if(add_game !== "" && add_car !== "" && add_track !== "" && add_files !== []) {
            const formData = new FormData();
            formData.append("token", token)
            formData.append("game", add_game)
            formData.append("car", add_car)
            formData.append("description", add_description)
            formData.append("track", add_track)

            for(let i = 0; i < add_files.length; i++)
                formData.append("file", add_files[i])

            const {data} = await axios.post(`${server}/setups/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if(data) {
                await this.getSetups();

                this.setState({
                    error2_success: true,
                    error2: "Setup was successful uploaded!"
                })
            }
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
            const {data} = await axios.post(`${server}/setups/remove`, {
                token, id
            })

            if(data) {
                await this.getSetups()

                this.setState({
                    error2_success: true,
                    error2: "Setup was successful removed!"
                })
            }
        }
    }

    async download(filename, value) {
        const obj_game = JSON.parse(value.game)
        const obj_car = JSON.parse(value.car)
        const obj_track = JSON.parse(value.track)

        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        let path = localStorage.getItem(obj_game.shorthand)

        if(path !== undefined) {
            if(path.charAt(path.length - 1) !== "/")
                path = path + "/"

            const file_paths = JSON.parse(filename).map((value, index) => {
                const file_name = value.split("/")
                return path + obj_car.folder + "/" + obj_track.folder + "/" + file_name[file_name.length - 1]
            })

            const {data} = await axios.post(`${server}/setups/download`, {
                token, filename, id: value.id, downloads: value.downloads + 1
            })

            if(data) {
                await this.getSetups();
                await window.api.send('DownloadFile', [file_paths, data]);
            }
        } else {
            this.setState({
                error2_success: false,
                error2: "You need to set the path in your Settings!"
            })
        }
    }

    toggleShow() {
        this.setState({
            show_add: !this.state.show_add
        })
    }

    render() {
        //Add Select Filtering
        let games = this.state.games
        let cars = this.state.cars
        let tracks = this.state.tracks

        if(this.state.add_game !== "") {
            cars = cars.filter(value => JSON.parse(value.game).name === JSON.parse(this.state.add_game).name)
            tracks = tracks.filter(value => JSON.parse(value.game).name === JSON.parse(this.state.add_game).name)
        }

        if(this.state.add_car !== "") {
            games = games.filter(value => value.name === JSON.parse(JSON.parse(this.state.add_car).game).name)
            tracks = tracks.filter(value => JSON.parse(value.game).name === JSON.parse(JSON.parse(this.state.add_car).game).name)
        }

        if(this.state.add_track !== "") {
            cars = cars.filter(value => JSON.parse(value.game).name === JSON.parse(JSON.parse(this.state.add_track).game).name)
            games = games.filter(value => value.name === JSON.parse(JSON.parse(this.state.add_track).game).name)
        }

        const select_games = games.map((value, index) => {
            return (
                <option key={`game-${index}`} value={JSON.stringify(value)}>{value.name}</option>
            )
        })

        const select_cars = cars.map((value, index) => {
            return (
                <option key={`cars-${index}`} value={JSON.stringify(value)}>{value.name}</option>
            )
        })

        const select_tracks = tracks.map((value, index) => {
            return (
                <option key={`tracks-${index}`} value={JSON.stringify(value)}>{value.name}</option>
            )
        })

        //Search Select Filtering
        let games1 = this.state.games
        let cars1 = this.state.cars
        let tracks1 = this.state.tracks

        if(this.state.search_game !== "") {
            cars1 = cars.filter(value => JSON.parse(value.game).name === JSON.parse(this.state.search_game).name)
            tracks1 = tracks.filter(value => JSON.parse(value.game).name === JSON.parse(this.state.search_game).name)
        }

        if(this.state.search_car !== "") {
            games1 = games.filter(value => value.name === JSON.parse(JSON.parse(this.state.search_car).game).name)
            tracks1 = tracks.filter(value => JSON.parse(value.game).name === JSON.parse(JSON.parse(this.state.search_car).game).name)
        }

        if(this.state.search_track !== "") {
            cars1 = cars.filter(value => JSON.parse(value.game).name === JSON.parse(JSON.parse(this.state.search_track).game).name)
            games1 = games.filter(value => value.name === JSON.parse(JSON.parse(this.state.search_track).game).name)
        }

        const select_games1 = games1.map((value, index) => {
            return (
                <option key={`game-${index}`} value={JSON.stringify(value)}>{value.name}</option>
            )
        })

        const select_cars1 = cars1.map((value, index) => {
            return (
                <option key={`cars-${index}`} value={JSON.stringify(value)}>{value.name}</option>
            )
        })

        const select_tracks1 = tracks1.map((value, index) => {
            return (
                <option key={`tracks-${index}`} value={JSON.stringify(value)}>{value.name}</option>
            )
        })

        let sorted_setups = this.state.setups

        if(this.state.search_filename !== "")
            sorted_setups = sorted_setups.filter(value => value.filename.toLowerCase().includes(this.state.search_filename.toLowerCase()))

        if(this.state.search_game !== "")
            sorted_setups = sorted_setups.filter(value => JSON.parse(value.game).shorthand === JSON.parse(this.state.search_game).shorthand)

        if(this.state.search_car !== "")
            sorted_setups = sorted_setups.filter(value => JSON.parse(value.car).name === JSON.parse(this.state.search_car).name)

        if(this.state.search_track !== "")
            sorted_setups = sorted_setups.filter(value => JSON.parse(value.track).name === JSON.parse(this.state.search_track).name)

        if(this.state.search_sort_by === "") {
            sorted_setups = sorted_setups.sort((a, b) => b.id - a.id)
        }

        if(this.state.search_sort_by === "date") {
            sorted_setups = sorted_setups.sort((a,b) => new moment(b.date).format('YYYYMMDDHHmmss') - new moment(a.date).format('YYYYMMDDHHmmss'))
        }

        if(this.state.search_sort_by === "downloads") {
            sorted_setups = sorted_setups.sort((a,b) => b.downloads - a.downloads)
        }

        const setups = sorted_setups.map((value, index) => {
            const filenames = JSON.parse(value.filename)
            const files = filenames.map((value, index) => {
                const name = value.split("/")
                return filenames.length - 1 !== index ? `${name[name.length - 1]}, ` : name[name.length - 1]
            })

            const obj_game = JSON.parse(value.game)
            const obj_car = JSON.parse(value.car)
            const obj_track = JSON.parse(value.track)

            return (
                <div key={`setups-${index}`} className={styles.setup_container}>
                    <div className={styles.title}>
                        <h6>Setup - {obj_game.shorthand} - {obj_track.name} - {obj_car.shorthand}</h6>

                        {
                            this.state.isAdmin && <button onClick={e => {
                                this.remove(value.id)
                            }} className={styles.download}>
                                Remove <Trash2 size={18}/>
                            </button>
                        }

                        <button onClick={e => {
                            this.download(value.filename, value)
                        }} className={styles.download}>
                            Download <Download size={18}/>
                        </button>
                    </div>

                    <div className={styles.splitter}/>

                    <p className={styles.info}>Game: {obj_game.name}</p>
                    <p className={styles.info}>Car: {obj_car.shorthand}</p>
                    <p className={styles.info}>Track: {obj_track.name}</p>
                    <p className={styles.info}>Files: {files}</p>
                    <p className={styles.info}>Description: {value.description}</p>

                    <div className={styles.splitter}/>

                    <p className={styles.info}>
                        {moment(value.date).format("DD.MM.YYYY HH:mm:ss")} - {value.downloads} Download(s)
                    </p>
                </div>
            )
        })

        return (
            <div className={styles.wrapper}>
                <Error success={this.state.error2_success} text={this.state.error2}/>
                <SidebarMenu active="Setups"/>

                <div className={styles.setups_container}>
                    <div className={styles.search_container}>
                        <div className={styles.title}>
                            <FilePlus size={20}/>
                            <h6>Add Setup</h6>

                            {
                                this.state.show_add ? <div onClick={this.toggleShow.bind(this)} className={styles.hide}>
                                    <h6>Hide</h6>
                                    <X size={20}/>
                                </div> : <div onClick={this.toggleShow.bind(this)} className={styles.hide}>
                                    <h6>Show</h6>
                                    <Plus size={20}/>
                                </div>
                            }
                        </div>

                        {
                            this.state.show_add && <div style={{display: "flex", flexDirection: "column"}}>
                                <br/>

                                <label htmlFor="game">Game</label>
                                <select id="game" defaultValue="" style={this.state.add_game === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                                    this.setState({
                                        add_game: e.target.value
                                    })
                                }}>
                                    <option value="" disabled>Please choose...</option>
                                    {select_games}
                                </select>

                                <label htmlFor="car">Car</label>
                                <select id="car" defaultValue="" style={this.state.add_car === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                                    this.setState({
                                        add_car: e.target.value
                                    })
                                }}>
                                    <option value="" disabled>Please choose...</option>
                                    {select_cars}
                                </select>

                                <label htmlFor="track">Track</label>
                                <select id="track" defaultValue="" style={this.state.add_track === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                                    this.setState({
                                        add_track: e.target.value
                                    })
                                }}>
                                    <option value="" disabled>Please choose...</option>
                                    {select_tracks}
                                </select>

                                <label htmlFor="">Description</label>
                                <textarea placeholder="Description" onChange={e => {
                                    this.setState({
                                        add_description: e.target.value
                                    })
                                }}/>

                                <label htmlFor="">Setup File</label>
                                <input type="file" multiple onChange={e => {
                                    this.setState({
                                        add_files: e.target.files
                                    })
                                }}/>

                                <p className={styles.error}>{this.state.error}</p>

                                <button onClick={this.add.bind(this)}>Add Setup</button>

                                <br/>
                            </div>
                        }
                    </div>

                    <div className={styles.search_container}>

                        <div className={styles.title}>
                            <Search size={20}/>
                            <h6>Search</h6>
                        </div>

                        <br/>

                        <label htmlFor="">Filename</label>
                        <input type="text" placeholder="Search by filename" style={this.state.search_filename === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                            this.setState({
                                search_filename: e.target.value
                            })
                        }}/>

                        <label htmlFor="game">Game</label>
                        <select id="game" defaultValue="" style={this.state.search_game === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                            this.setState({
                                search_game: e.target.value
                            })
                        }}>
                            <option value="" disabled>Please choose...</option>
                            {select_games1}
                        </select>

                        <label htmlFor="car">Car</label>
                        <select id="car" defaultValue="" style={this.state.search_car === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                            this.setState({
                                search_car: e.target.value
                            })
                        }}>
                            <option value="" disabled>Please choose...</option>
                            {select_cars1}
                        </select>

                        <label htmlFor="track">Track</label>
                        <select id="track" defaultValue="" style={this.state.search_track === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                            this.setState({
                                search_track: e.target.value
                            })
                        }}>
                            <option value="" disabled>Please choose...</option>
                            {select_tracks1}
                        </select>

                        <label htmlFor="sortby">Sort by</label>
                        <select id="sortby" defaultValue="" style={this.state.search_sort_by === "" ? {color: '#E0E0E0'} : {}} onChange={e => {
                            this.setState({
                                search_sort_by: e.target.value
                            })
                        }}>
                            <option value="" disabled>Please choose...</option>
                            <option value="date">Date</option>
                            <option value="downloads">Downloads</option>
                        </select>

                        <br/>
                    </div>

                    {setups}
                </div>
            </div>
        )
    }
}

export default Setups