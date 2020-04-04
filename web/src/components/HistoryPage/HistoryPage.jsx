import React, { Component } from 'react'
import { connect } from 'react-redux'

// TODO: проверять есть ли сохраненные настрйоки. Иначе сервер вернет 500

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
