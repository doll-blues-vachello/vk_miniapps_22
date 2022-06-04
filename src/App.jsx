import React, { useEffect, useState } from 'react';
import PlayRoomElement from './playRoomElem';

import {
  AppRoot, View, Panel, PanelHeader, PanelHeaderBack, Group, FormItem
  , Slider, Text, Button, Header, List, SimpleCell
} from '@vkontakte/vkui';

const locs = ['Стройплощадка', 'Метро', 'Парламент', 'Стадион', 'Музей', 'Дом престарелых'
  , 'Рок-концерт', 'Шахта', 'Свадьба', 'Заправочная станция', 'Библиотека'
  , 'Шоколадная фабрика', 'Кладбище', 'Джаз-бэнд', 'Виноградник', 'Порт', 'Автогонки', 'Тюрьма'
  , 'Выставка кошек'];

const locationList = locs.map((elem, index) => <SimpleCell className='child-style' key={index}>{elem}</SimpleCell>);

const App = () => {
  const [activetedPanel, setActivatedPanel] = useState('main');
  const [locationPicked, setLocationPicked] = useState('');
  const [numOfPlayers, setNumOfPlayers] = useState(5);
  const [playerStatus, setPlayerStatus] = useState(true);
  const [playerArray, setPlayerArray] = useState([]);
  const [curPlayer, setCurPlayer] = useState(0);
  const [timerTime, setTimerTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (timerActive && timerTime > 1) {
      const interval = setInterval(() => setTimerTime(currentTime => currentTime - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive]);

  useEffect(() => {
    if (timerTime < 1) {
      setTimerActive(false);
      setActivatedPanel('end-game');
    }
  }, [timerTime]);

  const toPlayRoom = (num) => {
    let arr = [];

    const spyIndex = Math.floor(Math.random() * (num + 1));
    let secSpyIndex = -1;

    if (num > 7) secSpyIndex = Math.floor(Math.random() * (num + 1));
    while (secSpyIndex === spyIndex) secSpyIndex = Math.floor(Math.random() * (num + 1));
    const locationIndex = Math.floor(Math.random() * locs.length);
    const locationForTheGame = locs[locationIndex];

    for (let i = 0; i < num; i++) {
      (i === spyIndex || i === secSpyIndex)
        ? arr.push({ name: 'Игрок ' + (i + 1), spy: true })
        : arr.push({ name: 'Игрок ' + (i + 1), spy: false });
    }

    setPlayerArray(arr);
    setLocationPicked(locationForTheGame);
    setActivatedPanel('second');
    setCurPlayer(0);
    setPlayerStatus(true);
    setTimerTime(60 * num);
    setTimerActive(true);
  }

  const playRoomHandler = (plStatus, statusCur) => {
    if (numOfPlayers >= statusCur) {
      setCurPlayer(statusCur + 1);
      setPlayerStatus(plStatus);
    }
    if (curPlayer === numOfPlayers - 1) setActivatedPanel('find-spy');
  }

  const toMain = () => {
    setTimerActive(false);
    setActivatedPanel('end-game');
    setTimerTime(0);
  }

  return (
    <AppRoot>
      <View activePanel={activetedPanel}>
        <Panel id="main">
          <PanelHeader>Spyre - Найди шпиона</PanelHeader>
          <Group>
            <Text style={{ margin: "24px 0", textAlign: "center" }}>Чтобы начать игру, проведем некоторую подготовку</Text>
            <FormItem top={"Число участников: " + numOfPlayers}>
              <Slider step={1} min={3} max={12} value={Number(numOfPlayers)} onChange={(val) => setNumOfPlayers(val)} />
            </FormItem>
            <FormItem top={'Число шпионов: ' + (numOfPlayers > 7 ? 2 : 1)}></FormItem>
            <Button className="btn-main-screen" onClick={() => toPlayRoom(numOfPlayers)}>Играть!</Button>
          </Group>

          <Group header={<Header mode='secondary'>Список локаций</Header>}>
            <List className='flex-style'>
              {locationList}
            </List>
          </Group>
        </Panel>
        <Panel id="second">
          <PanelHeader left={<PanelHeaderBack onClick={() => toMain()} />}>Найди шпиона!</PanelHeader>
          <Group className="play-room-js">
            <Text className='play-room-text'>Оставшееся время: {Math.floor(timerTime / 60)}:{timerTime % 60}</Text>
            {
              playerStatus ?
                <>
                  <Button className="play-room-text" onClick={() => setPlayerStatus(false)}>
                    Перейти к следующему игроку
                  </Button>
                </>
                :
                <>
                  <PlayRoomElement index={curPlayer} plArray={playerArray} location={locationPicked} />
                  <Button className="play-room-text" onClick={() => playRoomHandler(true, curPlayer)}>Скрыть информацию</Button>
                </>
            }
          </Group>
        </Panel>
        <Panel id="find-spy">
          <PanelHeader left={<PanelHeaderBack onClick={() => toMain()} />}>Spyre</PanelHeader>
          <Group className='play-room-js'>
            <Text className='play-room-text'>Оставшееся время: {Math.floor(timerTime / 60)}:{timerTime % 60}</Text>
            <Text className='play-room-text'>Сможете ли вы найти шпиона?</Text>
            <Button className='play-room-text' onClick={() => toMain()}>К результатам</Button>
          </Group>
        </Panel>
        <Panel id="end-game">
          <PanelHeader left={<PanelHeaderBack onClick={() => toMain()} />}>Spyre</PanelHeader>
          <Group className='play-room-js'>
            <Text className='play-room-text'>Игра окончена!</Text>
            <Button className='play-room-text' onClick={() => setActivatedPanel('main')}>В главное меню</Button>
          </Group>
        </Panel>
      </View>
    </AppRoot>
  )
}

export default App
