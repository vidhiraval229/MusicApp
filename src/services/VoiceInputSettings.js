import React, { useState, useEffect } from 'react';
import { View, Text, Picker, Switch, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
    flex: 1;
    padding:20px;
    background-color:#000;
`
const MainText = styled.Text`
font-size:20px;
color:#fff;
margin-top:10px;
`
const VoiceChange = styled.View`
flex-direction:row;
justify-content:space-between
`
const EffectText = styled.Text`
font=size:15px;
color:#fff;
margin-left:10px;
margin-top:10px
`
const Icon = styled.Image`
  width: 20px;
  height: 15px;
`;
const VoiceSettingsPage = () => {
  const naviagtion= useNavigation()
  const [sensitivity, setSensitivity] = useState(50);
  const [language, setLanguage] = useState('en');
  
  const [echoEnabled, setEchoEnabled] = useState(false);
  const [reverbEnabled, setReverbEnabled] = useState(false);
  const [pitchEnabled, setPitchEnabled] = useState(false);
  const [audioSettings, setAudioSettings] = useState({});

  useEffect(() => {
  }, [sensitivity]);

  useEffect(() => {
    setLanguage(language);
  }, [language]);

  useEffect(() => {
    applyAudioEffects();
  }, [echoEnabled, reverbEnabled, pitchEnabled]);

  const applyAudioEffects = () => {
    let settings = {};

    if (echoEnabled) {
      settings = { ...settings, echo: { delay: 500, decay: 0.5, damping: 0.3, level: 0.7 } };
    }

    if (reverbEnabled) {
      settings = { ...settings, reverb: { roomSize: 0.5, damping: 0.3, wetLevel: 0.7, dryLevel: 0.7 } };
    }

    if (pitchEnabled) {
      settings = { ...settings, pitch: { value: 0.5 } };
    }

    setAudioSettings(settings);
  };
  return (
    <Container>
      <TouchableOpacity onPress={() =>naviagtion?.goBack() }>
            <Icon source={require('../assets/back.png')} />
      </TouchableOpacity>
      <MainText>Microphone Sensitivity</MainText>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={100}
        value={sensitivity}
        onValueChange={setSensitivity}
        step={1}
      />
      <EffectText>{sensitivity}</EffectText>

   
      <MainText>Voice Effects</MainText>
      <VoiceChange>
        <EffectText>Echo</EffectText>
        <Switch
          value={echoEnabled}
          onValueChange={setEchoEnabled}
        />
      </VoiceChange>
      <VoiceChange>
        <EffectText>Reverb</EffectText>
        <Switch
          value={reverbEnabled}
          onValueChange={setReverbEnabled}
        />
      </VoiceChange>
      <VoiceChange>
        <EffectText>Pitch</EffectText>
        <Switch
          value={pitchEnabled}
          onValueChange={setPitchEnabled}
        />
      </VoiceChange>
   </Container>
  );
};

export default VoiceSettingsPage;
