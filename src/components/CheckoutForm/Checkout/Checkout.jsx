import React, {useState, useEffect} from 'react';
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button} from '@material-ui/core';
import {commerce} from '../../../lib/commerce';
import useStyles from './checkoutStyles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

const steps = ['¡ Shipping address !', '¡ Payment details !'];

const Checkout = ({cart, order, onCaptureCheckout, error}) => {
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();
    
    useEffect(() => {
        if(cart.id){
            const generateToken = async () => {
                try {
                    const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'});
                    console.log("Your token is: ",  token);
                    setCheckoutToken(token);
                } catch (error) {
                    
                }
            }

            generateToken();
        }
    }, [cart])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep+1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep-1);

    const next = (data) => {
        setShippingData(data);
        nextStep();

    }

    const Confirmation = () => (
        <div>
            Myeeee Confirmation 
        </div>
    );

    //if activeStep===0 return AddressForm else return PaymentForm
    const Form = () => (activeStep === 0 ?
        <AddressForm checkoutToken={checkoutToken} next={next}/> : 
        <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout}/>);
        
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">¡ Checkout !</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) =>(
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>

        </main>
    )
}

export default Checkout
