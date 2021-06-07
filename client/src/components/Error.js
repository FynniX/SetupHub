import React from 'react';
import styles from '../styles/components/error.module.scss'

class Error extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.showError();
    }

    showError() {
        if(this.props.error !== "") {
            const ele = document.getElementById("error")
            ele.style.display = "block";

            setTimeout(() => {
                ele.style.display = "none";
            }, 3000)
        }
    }

    render() {
        return (
            <div id="error" style={this.props.success === true ? {color: "green"} : {color: "red"}} className={styles.wrapper}>
                {this.props.text}
            </div>
        )
    }
}

export default Error