import React from 'react';
import { Trash2 } from 'react-feather';
import Verify from '../methods/Verify'
import styles from '../styles/classes.module.scss'

import axios from "axios";

import SidebarMenu from '../components/Sidebar'
import Error from "../components/Error";

class Classes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            classes: [],
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

        const {data} = await axios.post(`${server}/classes/get`, {
            token
        })

        if(Array.isArray(data)) {
            this.setState({
                classes: data
            })
        }
    }

    async insert() {
        const server = localStorage.getItem("server")
        const token = localStorage.getItem("token")

        const {name} = this.state

        if(name !== "") {
            const {data} = await axios.post(`${server}/classes/add`, {
                token, name
            })

            if(data) {
                await this.get()
                this.setState({
                    error2_success: true,
                    error2: "Class was successful created!"
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
            const {data} = await axios.post(`${server}/classes/remove`, {
                token, id
            })

            if(data) {
                await this.get()
                this.setState({
                    error2_success: true,
                    error2: "Class was successful removed!"
                })
            }
        }
    }

    render() {
        const classes = this.state.classes.map((value, index) => {
            return (
                <div key={index} className={styles.class_container}>
                    <div className={styles.title}>
                        <h6>Class - {value.name}</h6>
                        <button onClick={async e => {
                            await this.remove(value.id)
                        }} className={styles.remove}>
                            Remove <Trash2 size={18}/>
                        </button>
                    </div>

                    <div className={styles.splitter}/>

                    <p className={styles.info}>Name: {value.name}</p>
                </div>
            )
        })

        return (
            <div className={styles.wrapper}>
                <SidebarMenu active="Classes"/>
                <Error success={this.state.error2_success} text={this.state.error2}/>

                <div className={styles.classes_container}>
                    <div className={styles.add_container}>

                        <div className={styles.title}>
                            <h6>Insert a new class</h6>
                        </div>

                        <br/>

                        <label htmlFor="">Name</label>
                        <input type="text" placeholder="e.g. GT3" onChange={e => {
                            this.setState({
                                name: e.target.value
                            })
                        }}/>

                        <p className={styles.error}>{this.state.error}</p>

                        <button onClick={this.insert.bind(this)}>Insert</button>

                        <br/>
                    </div>

                    {classes}
                </div>
            </div>
        )
    }
}

export default Classes