import React from 'react';
import {Link} from 'react-router-dom';
import {LogOut, MapPin, Monitor, Navigation, Settings, Layers, User, Bookmark} from 'react-feather';
import isAdmin from "../methods/isAdmin";
import styles from '../styles/components/sidebar.module.scss'

class SidebarMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdmin: false
        }
    }

    logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("isAdmin")
        window.location.href = "#login"
    }

    async componentDidMount() {
        this.setState({
            isAdmin: await isAdmin()
        })
    }

    render() {
        return (
            <nav className={styles.wrapper}>
                <h2 className={styles.title}>SetupHub</h2>

                <div className={styles.splitter}/>

                <Link to="/">
                    <div className={this.props.active === "Setups" ? `${styles.active} ${styles.menu}` : styles.menu}>
                        <Layers color="#525557" strokeWidth={2}/>
                        <p>Setups</p>
                    </div>
                </Link>

                <Link to="/settings">
                    <div className={this.props.active === "Settings" ? `${styles.active} ${styles.menu}` : styles.menu}>
                        <Settings color="#525557" strokeWidth={2}/>
                        <p>Settings</p>
                    </div>
                </Link>

                <br/>

                {
                    this.state.isAdmin && <Link to="/user">
                        <div className={this.props.active === "User" ? `${styles.active} ${styles.menu}` : styles.menu}>
                            <User color="#525557" strokeWidth={2}/>
                            <p>User</p>
                        </div>
                    </Link>
                }

                {
                    this.state.isAdmin && <Link to="/games">
                        <div className={this.props.active === "Games" ? `${styles.active} ${styles.menu}` : styles.menu}>
                            <Monitor color="#525557" strokeWidth={2}/>
                            <p>Games</p>
                        </div>
                    </Link>
                }

                {
                    this.state.isAdmin && <Link to="/classes">
                        <div className={this.props.active === "Classes" ? `${styles.active} ${styles.menu}` : styles.menu}>
                            <Bookmark color="#525557" strokeWidth={2}/>
                            <p>Classes</p>
                        </div>
                    </Link>
                }

                {
                    this.state.isAdmin && <Link to="/cars">
                        <div className={this.props.active === "Cars" ? `${styles.active} ${styles.menu}` : styles.menu}>
                            <Navigation color="#525557" strokeWidth={2}/>
                            <p>Cars</p>
                        </div>
                    </Link>
                }

                {
                    this.state.isAdmin && <Link to="/tracks">
                        <div className={this.props.active === "Tracks" ? `${styles.active} ${styles.menu}` : styles.menu}>
                            <MapPin color="#525557" strokeWidth={2}/>
                            <p>Tracks</p>
                        </div>
                    </Link>
                }

                <button className={styles.button} onClick={this.logout.bind(this)}>
                    <LogOut color="#525557" strokeWidth={2}/>
                    <p>Logout</p>
                </button>
            </nav>
        )
    }
}

export default SidebarMenu