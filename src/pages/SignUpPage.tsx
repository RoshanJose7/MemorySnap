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
import {Redirect, useHistory} from "react-router-dom";
import {useAuth} from "../context/auth";
import {auth} from "../firebase/firebase";

const SignUpPage: React.FC = () => {
    const {loggedIn} = useAuth();
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMailAlert, setShowMailAlert] = useState(false);

    const handleSignUp = () => {
        setLoading(true);
        auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
            userCredential.user.sendEmailVerification().then((resp) => {
                setShowMailAlert(true);
                setLoading(false);
                setErrorMessage('');
            }).catch((err) => {
                setLoading(false);
                setErrorMessage(err.message);
            });
        }).catch((err) => {
            setLoading(false);
            setErrorMessage(err.message);
        });
    }

    const onDismissAlert = () => {
        setShowMailAlert(false);
        history.push('/signin')
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
                <h1 className="ion-margin-top">Sign up to Daily Moments</h1>
                <IonList className="ion-margin-top">
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
                </IonList>
                <IonButton className="ion-margin-top" expand="block" onClick={handleSignUp}>
                    Sign Up
                </IonButton>
                <IonButton className="ion-margin-top" expand="block" fill="clear" routerLink="/signin">
                    Already have an account, Sign In ?
                </IonButton>
                {errorMessage && errorMessage.length > 0 &&
                    <IonText color="danger">{errorMessage}</IonText>
                }
                <img className='bottom-banner' src='/assets/img/girl1.png' width="216" alt={''}/>
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

export default SignUpPage;
