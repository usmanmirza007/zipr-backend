import Stripe from 'stripe';

// const config: Stripe.StripeConfig = null;
const stripe = new Stripe('sk_test_51JZqBbHuC1KQJpzy8ajuswh1jv7JV6Ullz0QCxNAZaI4gy5oafHnz6mEvQjXDwqO6bkTNnnqX9AK3F8oWGnPSljz00Fnid8ePX', {
  apiVersion: '2022-08-01',
});
// const stripe = require('stripe')('sk_test_51JZqBbHuC1KQJpzy8ajuswh1jv7JV6Ullz0QCxNAZaI4gy5oafHnz6mEvQjXDwqO6bkTNnnqX9AK3F8oWGnPSljz00Fnid8ePX');

export const createCustomer = async (email: string, name: string) => {
  const customer = await stripe.customers.create({
    email: email,
    name: name,
    // email: 'usman1313@example.com',
    // name: 'usman',
    // phone: '31231533',

  });
  return customer
};
// creaete method
export const createMethod = async (cardNumber: string, month: number, year: number, cvc: string ) => {

  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: cardNumber,
      exp_month: month,
      exp_year: year,
      cvc: cvc,
    },
    // card: {
    //   number: '4242424242424242',
    //   exp_month: 12,
    //   exp_year: 2023,
    //   cvc: '314',
    // },
  });

  return paymentMethod
};

export const attachPaymentMethod = async (pm_id: string, cus_id: string) => {
  
  const paymentMethod = await stripe.paymentMethods.attach(
    pm_id,
    { customer: cus_id }
  );

}

export const createPayment = async (price: number, cus_id: string, pm_id: string, currency: string, ) => {
  
  const payment = await stripe.paymentIntents.create({
    amount: price,
    currency: currency,
    customer: cus_id,
    capture_method: 'automatic',
    payment_method: pm_id,
    confirm: true,
  });

  if (payment) {
    return true
  }
}
