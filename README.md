# Revolut task

Open the current Revolut app, on either iOS or Android, and navigate to the exchange screen.
If the app is not available in your country you can observe how application works in video [youtube](https://youtu.be/c0zPSiKYipc?t=29s). (Exchange screen is on the 29th second of the video)
Implement *functionality* of this screen in your own custom web widget using FX rates from either source:

1. [http://www.ecb.int/stats/exchange/eurofxref/html/index.en.html#dev](http://www.ecb.int/stats/exchange/eurofxref/html/index.en.html#dev)
2. [https://openexchangerates.org/](https://openexchangerates.org/)
3. Your preferred source of FX rates

## Explicit Requirements

Your app should poll the endpoint every 10 seconds to get the latest rates for GBP, EUR and USD. (The API provides close of day FX rates. Although we expect you to refresh the rate every 10s, we do not expect the rate to change every 10s as most free rate sources won’t provide live rates)

## Implicit Requirements

The widget must work and produce correct results.
The code produced is expected to be of high standard.
You should implement as many features from the model exchange screen as possible.

Please put your work on Bitbucket or Github.
