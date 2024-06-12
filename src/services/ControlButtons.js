import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 10px;
`;

const Icon = styled.Image`
  width: 30px;
  height: 30px;
`;

const ControlButtons = ({ onHeadphones, onMicrophone, onPlayPause, onReplay, onSubmit, playing }) => (
  <Container>
    <TouchableOpacity onPress={onHeadphones}>
      <Icon source={require('../assets/audio.png')} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onMicrophone}>
      <Icon source={require('../assets/setting.png')} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onPlayPause}>
      <Icon source={ playing ? require(`../assets/pause.png`) :  require("../assets/play.png")} tintColor={"white"} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onReplay}>
      <Icon source={require('../assets/replay.png')} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onSubmit}>
      <Icon source={require('../assets/check.png')} />
    </TouchableOpacity>
  </Container>
);

export default ControlButtons;
