import React, { useState } from 'react';
import PlayRoomElement from './playRoomElem';

import {
  AppRoot, View, Panel, PanelHeader, PanelHeaderBack, Group, FormItem
  , Slider, Text, Button, Header, List, SimpleCell
} from '@vkontakte/vkui'

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
  }

  const playRoomHandler = (plStatus, statusCur) => {
    if (numOfPlayers >= statusCur) {
      setCurPlayer(statusCur + 1);
      setPlayerStatus(plStatus);
    }
    if (curPlayer === numOfPlayers - 1) setActivatedPanel('end-game');
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
          <PanelHeader left={<PanelHeaderBack onClick={() => setActivatedPanel('main')} />}>Найди шпиона!</PanelHeader>
          <Group className="play-room-js">
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
        <Panel id="end-game">
        <PanelHeader left={<PanelHeaderBack onClick={() => setActivatedPanel('main')} />}>Spyre</PanelHeader>
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
