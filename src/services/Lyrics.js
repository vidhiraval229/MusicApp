import React from 'react';
import styled from 'styled-components/native';

const Container = styled.ScrollView`
  margin: 20px;
`;

const LyricLine = styled.Text`
  color: ${({ highlight }) => (highlight ? '#FF6F7E' : 'white')};
  font-size: ${({ highlight }) => (highlight ?  '22px': '16px')};
  text-align: center;
  margin-top:10px
`;

const LyricsDisplay = ({ lyrics }) => (
  <Container>
    {lyrics?.map((line, index) => (
      <LyricLine key={index} highlight={line.highlight}>
        {line.text}
      </LyricLine>
    ))}
  </Container>
);

export default LyricsDisplay;
