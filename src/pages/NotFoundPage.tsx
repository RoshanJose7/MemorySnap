import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar,} from '@ionic/react';
import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";

const NotFoundPage: React.FC = () => {
    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            history.push('/');
        }, 2000);
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Daily Moments</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h1 className='ion-margin ion-padding'>Ups I think you are lost. Redirecting...</h1>
            </IonContent>
        </IonPage>
    );
};

export default NotFoundPage;
