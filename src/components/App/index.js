import React, { Component } from 'react';
import CurrencySelector from '../CurrencySelector';

import './styles.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        // Currency is stored as integer increased by 10k
        // To save 4 digits after decimal point
        this.state = {
            wallet: {
                USD: 12871600,
                EUR: 8609400
            },
            rates: {},
            amountFrom: '',
            amountTo: '',
            currencyFrom: '',
            currencyTo: ''
        }

        // Update rates every 10 seconds
        setInterval(this.getRates, 10000);
    }

    componentDidMount() {
        const { wallet } = this.state;

        // Set default currencyFrom value
        this.setState({ currencyFrom: Object.keys(wallet)[0] });

        // Update rates
        this.getRates();
    }

    componentDidUpdate() {
        const { wallet, rates, currencyFrom, currencyTo } = this.state;

        // Handle wrong currencyFrom values
        if (wallet.hasOwnProperty(currencyFrom) === false) {
            this.setState({ currencyFrom: Object.keys(wallet)[0] });
        }

        // Handle wrong currencyTo values
        if ((currencyTo === '' || currencyTo === currencyFrom) && rates.hasOwnProperty(currencyFrom) === true) {
            this.setState({ currencyTo: Object.keys(rates[currencyFrom])[0] });
        }
    }

    getRates = (base) => {
        const { wallet } = this.state;

        if (typeof base !== 'undefined') {
            fetchData(base, this.updateRates);
        } else {
            Object.keys(wallet).forEach((base) => {
                fetchData(base, this.updateRates);
            })
        }

        function fetchData(base, callback) {
            fetch(`http://api.fixer.io/latest?base=${base}`)
                .then((responseJson) => responseJson.json())
                .then((responseObject) => {
                    callback(responseObject);
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        console.log('Get rates.');
    }

    updateRates = (ratesObject) => {
        let { rates } = this.state;

        rates[ratesObject.base] = ratesObject.rates;
        this.setState({ rates },
            this.updateAmountTo);

        console.log('Rates update:', rates);
    }

    updateAmountFrom() {
        const { rates, currencyFrom, currencyTo, amountTo } = this.state;
        let amountFrom = '';

        if (amountTo !== 0 && currencyTo !== '') {
            amountFrom = this.valueToAmount(this.amountToNumber(amountTo) / rates[currencyFrom][currencyTo]);
            this.setState({ amountFrom });
        }

        console.log('Update amountFrom.');
    }

    updateAmountTo() {
        const { rates, currencyFrom, currencyTo, amountFrom } = this.state;
        let amountTo = '';

        if (amountFrom !== 0 && currencyTo !== '') {
            amountTo = this.valueToAmount(this.amountToNumber(amountFrom) * rates[currencyFrom][currencyTo]);
            this.setState({ amountTo });
        }

        console.log('Update amountTo.');
    }

    handleExchange = () => {
        const { wallet, rates, amountFrom, amountTo, currencyFrom, currencyTo } = this.state;

        // Create wallet entry for new currency and get rates for it
        if (wallet.hasOwnProperty(currencyTo) === false) {
            wallet[currencyTo] = 0;
            this.getRates(currencyTo);
        }

        // Perform wallet changes
        wallet[currencyFrom] -= amountFrom;
        wallet[currencyTo] += amountTo;

        // Delete wallet and rates entries for empty currency
        if (wallet[currencyFrom] === 0) {
            delete(wallet[currencyFrom]);
            delete(rates[currencyFrom]);
        }

        this.setState({
            wallet,
            rates,
            amountFrom: '',
            amountTo: ''
        });

        console.log('Exchange.');
    }

    handleCurrencyFromChange = (currencyFrom) => {
        this.setState({ currencyFrom },
            this.updateAmountFrom);
    }

    handleCurrencyToChange = (currencyTo) => {
        this.setState({ currencyTo },
            this.updateAmountTo);
    }

    handleAmountFromChange = (event) => {
        this.setState({ amountFrom: this.valueToAmount(event.target.value) },
            this.updateAmountTo);
    }

    handleAmountToChange = (event) => {
        this.setState({ amountTo: this.valueToAmount(event.target.value) },
            this.updateAmountFrom);
    }

    amountToNumber(amount) {
        return amount / 10000;
    }

    amountToString(amount) {
        return (amount / 10000).toFixed(2).replace('.00', '');
    }

    valueToAmount(value) {
        return value === '' ? '': parseInt(parseFloat(value.toString().replace(',', '.')) * 10000, 10);
    }

    render() {
        const { wallet, rates, amountFrom, amountTo, currencyFrom, currencyTo } = this.state;

        let isExchangeAvailable = amountFrom !== '' && amountTo !== '' &&
            wallet[currencyFrom] >= amountFrom

        return (
            <div className="app">
                <div>State: { JSON.stringify(this.state, null, '\t') }</div>
                <div>
                    From:
                    <CurrencySelector
                        currencyList={ Object.keys(wallet) }
                        selectedValue={ currencyFrom }
                        onSelect={ this.handleCurrencyFromChange }/>
                    <input
                        type="number"
                        min="0"
                        onChange={ this.handleAmountFromChange }
                        value={ this.amountToString(amountFrom) }
                        disabled={ currencyFrom === currencyTo }/>
                </div>
                { rates.hasOwnProperty(currencyFrom) &&
                    <div>
                        To:
                        <CurrencySelector
                            currencyList={ Object.keys(rates[currencyFrom])}
                            selectedValue={ currencyTo }
                            onSelect={ this.handleCurrencyToChange }/>
                        <input
                            type="number"
                            min="0"
                            onChange={ this.handleAmountToChange }
                            value={ this.amountToString(amountTo) }
                            disabled={ currencyFrom === currencyTo }/>
                    </div>
                }
                <button onClick={ this.handleExchange } disabled={ !isExchangeAvailable }>Exchange</button>
            </div>
        );
    }
}
