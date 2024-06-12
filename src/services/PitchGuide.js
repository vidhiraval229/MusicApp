import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const PitchLines = styled.View`
  width: 90%;
  height: 100px;
  border-radius: 10px;
  flex-direction:row
`;

const PitchSegment = styled.View`
  height: 10px;
  width:10px;
  background-color: ${({ hit }) => (hit ? '#0f0' : '#f00')};
  margin: 2px 0;
`;

const Stars = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;
`;

const Star = styled.Text`
  color: gold;
  font-size: 24px;
`;

const PitchGuide = ({ pitchData }) => (
  <Container>
    <PitchLines>
      {pitchData.map((pitch, index) => (
        <PitchSegment key={index} hit={pitch.hit} />
      ))}
    </PitchLines>
    <Stars>
      {pitchData.filter(pitch => pitch.hit).map((_, index) => (
        <Star key={index}>★</Star>
      ))}
    </Stars>
  </Container>
);

export default PitchGuide;
