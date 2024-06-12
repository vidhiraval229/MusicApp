import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  margin: 10px;
`;

const Bar = styled.View`
  height: 5px;
  background-color: #555;
  border-radius: 2.5px;
  overflow: hidden;
`;

const Progress = styled.View`
  height: 5px;
  background-color: #FF6F7E;
  width: ${({ progress }) => progress}%;
`;

const TimeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Timestamp = styled.Text`
  color: white;
  font-size: 12px;
`;

const ProgressBar = ({ progress, elapsedTime, remainingTime }) => (
  <Container>
    <Bar>
      <Progress progress={progress} />
    </Bar>
    <TimeContainer>
      <Timestamp>{elapsedTime}</Timestamp>
      <Timestamp>{remainingTime}</Timestamp>
    </TimeContainer>
  </Container>
);

export default ProgressBar;
