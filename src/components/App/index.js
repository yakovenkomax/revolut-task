import React, { Component } from 'react';

import './styles.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wallet: {
                USD: 82.16,
                EUR: 152.94,
                GBP: 130.53
            },
            rates: {},
            amount: null,
            base: null
        }

        this.getRates = this.getRates.bind(this);

        // setInterval(this.getRates, 10000);
    }

    componentDidMount() {
        this.getRates();
    }

    getRates() {
        const { wallet } = this.state;

        console.log('Call recieve rates method.');

        Object.keys(wallet).forEach((base) => {
            const symbols = Object.keys(wallet).filter((key) => key !== base).join(',');

            fetch(`http://api.fixer.io/latest?base=${base}&symbols=${symbols}`)
                .then((responseJson) => responseJson.json())
                .then((responseObject) => {
                    this.updateRates(responseObject);
                })
                .catch((error) => {
                    console.error(error);
                });
        })

    }

    updateRates(ratesObject) {
        const { rates } = this.state;

        rates[ratesObject.base] = ratesObject.rates;

        this.setState({ rates });
        console.log('Rates were updated!', rates);
    }

    render() {
        const { wallet, rates } = this.state;

        return (
            <div className="app">
                <div>Wallet: { JSON.stringify(wallet) }</div>
                <div>Rates: { JSON.stringify(rates) }</div>
            </div>
        );
    }
}
