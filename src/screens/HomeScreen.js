import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import TopBar from '../services/ToolBar';
import ProgressBar from '../services/ProgressBar';
import PitchGuide from '../services/PitchGuide';
import LyricsDisplay from '../services/Lyrics';
import SongInfo from '../services/SongInfo';
import ControlButtons from '../services/ControlButtons';
import { YIN } from 'pitchfinder';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Buffer } from 'buffer';

const parseLyrics = (lyrics) => {
  const parsedLines = lyrics.split('\n').map(line => {
    const match = line.match(/^\[(\d{2}):(\d{2}).(\d{2})\](.*)$/);
    if (match) {
      const [, min, sec, msec, text] = match;
      const time = parseInt(min) * 60 + parseInt(sec) + parseInt(msec) / 100;
      return {
        time,
        text: text.trim(),
        highlight: false,
      };
    }
    return null;
  }).filter(line => line !== null);


  return parsedLines;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const HomeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [song, setSong] = useState(route?.params?.songData);
  const [lyrics, setLyrics] = useState([]);
  const [pitchData, setPitchData] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [points, setPoints] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [elapsedTime, setElapsedTime] = useState('0:00');
  const [remainingTime, setRemainingTime] = useState('0:00');
  const [headphonesEnabled, setHeadphonesEnabled] = useState(false);
  const soundRef = useRef(null);
  const intervalRef = useRef(null);
  const scrollViewRef = useRef(null);
  const detectPitch = useRef(YIN()).current;

  useEffect(() => {
    requestMicrophonePermission();
    setSong(song);
    setLyrics(parseLyrics(song.lyrics));

    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
      stopPitchDetection();
      clearInterval(intervalRef.current);
    };
  }, []);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.warn('Microphone permission denied');
        }
      } catch (error) {
        console.error('Error requesting microphone permission:', error);
      }
    }
  };

  const handlePlayPause = () => {
    if (playing) {
      soundRef.current.pause();
      setPlaying(false);
    } else {
      if (!soundRef.current) {
        soundRef.current = new Sound(song.file_name_vocal, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          soundRef.current.play(handlePlayEnd);
          setPlaying(true);
          startLyricsHighlighting();
          startPitchDetection();
        });
      } else {
        soundRef.current.play();
        setPlaying(true);
        startLyricsHighlighting();
        startPitchDetection();
      }
    }
  };

  const handlePlayEnd = () => {
    setPlaying(false);
    setProgress(100);
    setCurrentLine(lyrics.length - 1);
    clearInterval(intervalRef.current);
  };

  const handleReplay = () => {
    if (soundRef.current) {
      soundRef.current.setCurrentTime(0);
      setProgress(0);
      setCurrentLine(0);
      setElapsedTime('0:00');
      setRemainingTime(formatTime(soundRef.current.getDuration()));
    
    }
  };

  const toggleHeadphonesMode = () => {
    setHeadphonesEnabled(!headphonesEnabled);
    if (soundRef.current) {
      soundRef.current.setVolume(headphonesEnabled ? 0.5 : 1.0); // Example: Reduce volume when headphones mode is enabled
    }
  };
  
  const handleSubmit = () => {
    // Add code to submit the performance
  };

  const startLyricsHighlighting = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const updateLyricsHighlighting = () => {
      if (soundRef.current) {
        soundRef.current.getCurrentTime((seconds) => {
          const duration = soundRef.current.getDuration();
          const progress = (seconds / duration) * 100;
          setProgress(progress);

          const currentLineIndex = lyrics.findIndex(line => line.time > seconds) - 1;
          setCurrentLine(currentLineIndex >= 0 ? currentLineIndex : 0);

          setLyrics(prevLyrics =>
            prevLyrics.map((line, index) => ({
              ...line,
              highlight: index === currentLineIndex
            }))
          );

          if (scrollViewRef.current && currentLineIndex >= 0) {
            const offset = currentLineIndex * 30;
            scrollViewRef.current.scrollTo({ y: offset, animated: true });
          }

          setElapsedTime(formatTime(seconds));
          setRemainingTime(formatTime(duration - seconds));

          requestAnimationFrame(updateLyricsHighlighting);
        });
      }
    };

    requestAnimationFrame(updateLyricsHighlighting);
  };

  const startPitchDetection = async () => {
    try {
      AudioRecord.init({
        sampleRate: 44100,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 6,
      });
      AudioRecord.start();

      AudioRecord.on('data', data => {
        const buffer = new Float32Array(data);
        if (buffer.length > 0) {
          const pitch = detectPitch(buffer);
          if (pitch) {
            const hit = checkPitch(pitch);
            if (hit) {
              setPoints(points + 10);
            }
            setPitchData(prevData => [...prevData, { pitch, hit }]);
          }
        }
      });
    } catch (error) {
      console.error('Error starting pitch detection:', error);
    }
  };

  const stopPitchDetection = async () => {
    try {
      await AudioRecord.stop();
    } catch (error) {
      console.error('Error stopping pitch detection:', error);
    }
  };

  const checkPitch = (pitch) => {
    return Math.random() > 0.5; 
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar onBack={() => navigation.goBack()} points={points} />
      <ProgressBar progress={progress} elapsedTime={elapsedTime} remainingTime={remainingTime} />
      <PitchGuide pitchData={pitchData} />
      <ScrollView ref={scrollViewRef}>
        <LyricsDisplay lyrics={lyrics} />
      </ScrollView>

      {song && <SongInfo cover={song.album_art} title={song.file_name_without_vocal} artist={song.artists} />}

      <ControlButtons
        onHeadphones={toggleHeadphonesMode}
        onMicrophone={() => { navigation.navigate("VoiceInput")}}
        onPlayPause={handlePlayPause}
        onReplay={handleReplay}
        onSubmit={handleSubmit}
        playing={playing}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default HomeScreen;
