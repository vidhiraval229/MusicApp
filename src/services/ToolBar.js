import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #222;
`;

const Icon = styled.Image`
  width: 30px;
  height: 30px;
`;

const BackIcon = styled.Image`
  width: 20px;
  height: 15px;
`;
const Points = styled.Text`
  color: white;
  font-size: 18px;
`;

const TopBar = ({ onBack, points }) => (
  <Container>
    <TouchableOpacity onPress={onBack}>
      <BackIcon source={require('../assets/back.png')} />
    </TouchableOpacity>
    <Icon source={require('../assets/badge.png')} />
    <Points>{points} PTS</Points>
  </Container>
);

export default TopBar;
