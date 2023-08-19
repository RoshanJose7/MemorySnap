import {IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,} from '@ionic/react';
import React from 'react';
import {auth} from "../../firebase/firebase";
import {logOutOutline} from "ionicons/icons";

const SettingsPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Daily Moments</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h1 className='ion-padding'>Settings</h1>
                <IonButton expand="block"
                           fill='outline'
                           onClick={() => auth.signOut()}>
                    Sign Out
                    <IonIcon icon={logOutOutline} slot='end'/>
                </IonButton>
                <img className='bottom-banner' src='/assets/img/girl4.png' width="316" alt={''}/>
            </IonContent>
        </IonPage>
    );
};

export default SettingsPage;
