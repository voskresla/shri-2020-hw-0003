import React, { Component } from 'react'
import { connect } from 'react-redux'

export class HistoryPage extends Component {
    render() {
        return (
            <div>
                History Page
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPage)
