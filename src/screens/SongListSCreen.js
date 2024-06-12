import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios'; 
import { useNavigation } from '@react-navigation/native';
import SongInfo from '../services/SongInfo';


const SongListScreen = () => {
  const [songs, setSongs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const navigation = useNavigation();
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('https://dev-api.conqt.com/api/tc-song-vault/get-all-song-list?page=1&limit=10');
      setSongs(response?.data?.data); 
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching songs:', error);
      setLoading(false); 
    }
  };

  const renderSongItem = ({ item }) => (
    <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate("Home", { songData:item})}>
   <SongInfo cover={item.album_art} title={item.file_name_without_vocal} artist={item.artists} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor:"black" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

export default SongListScreen;
