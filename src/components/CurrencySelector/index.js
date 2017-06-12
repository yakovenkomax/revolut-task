import React, { Component } from 'react';

import './styles.css';

export default class App extends Component {
    handleChange = (event) => {
        const { value } = event.target;

        this.props.onSelect(value);
    }

    render() {
        const { isDisabled, currencyList, selectedValue, tabIndex } = this.props;

        return (
            <select
                className="select"
                value={ selectedValue }
                onChange={ this.handleChange }
                disabled={ isDisabled }
                tabIndex={ tabIndex }>
                { currencyList.map((currency) =>
                    <option key={ currency } value={ currency }>{ currency }</option>
                )}
            </select>
        );
    }
}
