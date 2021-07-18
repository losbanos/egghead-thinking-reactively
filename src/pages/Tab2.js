import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import DisplayCenter from "../components/presentational/DisplayCenter";
import FastButtons from "../components/FastButtons";

const Tab2 = () => {
  return (
    <IonPage>
      <IonContent>
        <DisplayCenter>
          <FastButtons></FastButtons>
        </DisplayCenter>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
