import {IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs,} from '@ionic/react';
import React from 'react';
import {IonReactRouter} from "@ionic/react-router";
import {Redirect, Route} from "react-router-dom";
import {home as homeIcon, settings as settingsIcon} from 'ionicons/icons';

import HomePage from "./pages/(auth)/HomePage";
import SettingsPage from "./pages/(auth)/SettingsPage";
import EntryPage from "./pages/(auth)/EntryPage";
import {useAuth} from "./context/auth";
import AddEntryPage from "./pages/(auth)/AddEntryPage";

const AppTabs: React.FC = () => {
    const {loggedIn} = useAuth();

    if (!loggedIn) {
        return <Redirect to="/signin"/>;
    }

    return (
        <IonReactRouter>
            <IonTabs>
                <IonRouterOutlet>
                    <Route exact path="/my/entries">
                        <HomePage/> :
                    </Route>
                    <Route exact path="/my/entries/view/:id">
                        <EntryPage/>
                    </Route>
                    <Route exact path="/my/entries/add">
                        <AddEntryPage/>
                    </Route>
                    <Route exact path="/my/settings">
                        <SettingsPage/>
                    </Route>

                    <Redirect exact path="/" to="/my/entries"/>
                </IonRouterOutlet>

                <IonTabBar slot="bottom">
                    <IonTabButton tab="home" href="/my/entries">
                        <IonIcon icon={homeIcon}/>
                        <IonLabel>Home</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="settings" href="/my/settings">
                        <IonIcon icon={settingsIcon}/>
                        <IonLabel>Settings</IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </IonReactRouter>
    );
};

export default AppTabs;
