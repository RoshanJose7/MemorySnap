import {
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import {useAuth} from "../context/auth";
import {auth} from "../firebase/firebase";

const SignInPage: React.FC = () => {
    const {loggedIn} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMailAlert, setShowMailAlert] = useState(false);

    const onForgotPassword = () => {
        setLoading(true);
        auth.sendPasswordResetEmail(email).then(() => {
            setShowMailAlert(true);
            setLoading(false);
            setErrorMessage('');
        }).catch((err) => {
            setLoading(false);
            setErrorMessage(err.message);
        });
    }

    const onSignIn = () => {
        setLoading(true);
        auth.signInWithEmailAndPassword(email, password).then(() => {
            setLoading(false);
            setErrorMessage('');
        }).catch((err) => {
            setLoading(false);
            setErrorMessage(err.message);
        });
    }

    const onDismissAlert = () => {
        setShowMailAlert(false);
    }


    if (loggedIn) {
        return <Redirect to="/my/entries"/>;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Daily Moments</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h1 className="ion-margin-top">Sign in to Daily Moments</h1>
                <IonList className="ion-margin-top" lines="none">
                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput type="email" value={email}
                                  onIonChange={(event) => setEmail(event.detail.value)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput type="password" value={password}
                                  onIonChange={(event) => setPassword(event.detail.value)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonButton className="ion-margin-top" expand="block" fill="clear" onClick={onForgotPassword}>
                            Forgot password ?
                        </IonButton>
                    </IonItem>
                </IonList>
                <IonButton className="ion-margin-top" expand="block" onClick={onSignIn}>
                    Sign In
                </IonButton>
                <IonButton className="ion-margin-top" expand="block" fill="clear" routerLink="/signup">
                    Don't have an account, Sign Up ?
                </IonButton>
                {errorMessage && errorMessage.length > 0 &&
                    <IonText color="danger">{errorMessage}</IonText>
                }
                <img className='bottom-banner' src='/assets/img/girl2.png' width="216" alt={''}/>
                <IonLoading message='Loading' isOpen={loading}/>
                <IonAlert
                    isOpen={showMailAlert}
                    onDidDismiss={onDismissAlert}
                    header={'Success'}
                    message={'Please check your email.'}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default SignInPage;
