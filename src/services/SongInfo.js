import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

const AlbumCover = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 10px;
`;

const Info = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Artist = styled.Text`
  color: white;
  font-size: 14px;
`;

const SongInfo = ({ cover, title, artist }) => (
  <Container>
    <AlbumCover source={{ uri: cover }} />
    <Info>
      <Title>{title}</Title>
      <Artist>{artist}</Artist>
    </Info>
  </Container>
);

export default SongInfo;
