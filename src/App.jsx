import React, { useEffect, useState } from 'react';
import PlayRoomElement from './playRoomElem';
import bridge from '@vkontakte/vk-bridge';

import {
  AppRoot, View, Panel, PanelHeader, PanelHeaderBack, Group, FormItem
  , Slider, Text, Button, Header, List, SimpleCell, Input, FormLayout
} from '@vkontakte/vkui';

let locs = ['Стройплощадка', 'Метро', 'Парламент', 'Стадион', 'Музей', 'Дом престарелых'
  , 'Рок-концерт', 'Шахта', 'Свадьба', 'Заправочная станция', 'Библиотека'
  , 'Шоколадная фабрика', 'Кладбище', 'Джаз-бэнд', 'Виноградник', 'Порт', 'Автогонки', 'Тюрьма'
  , 'Выставка кошек'];

const players = ['', '', '', '', ''];
let playersList = players.map((elem, index) => {
  return (
    <FormItem key={index} top={'Игрок номер ' + (index + 1)}>
      <Input onChange={(e) => players[index] = e.target.value} type="text" placeholder='Имя игрока'></Input>
    </FormItem>
  )
});

const App = () => {
  const [activetedPanel, setActivatedPanel] = useState('main');
  const [locationPicked, setLocationPicked] = useState('');
  const [newLocationName, setnewLocationName] = useState('');
  const [numOfPlayers, setNumOfPlayers] = useState(5);
  const [playerStatus, setPlayerStatus] = useState(true);
  const [playerArray, setPlayerArray] = useState([]);
  const [curPlayer, setCurPlayer] = useState(0);
  const [timerTime, setTimerTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isLocDeleted, setIsLocDeleted] = useState(false);
  const [isLocAdded, setIsLocAdded] = useState(false);

  const handlerLocations = (text) => {
    locs = locs.filter((e) => e !== text);
    setIsLocDeleted(true);
  }

  let locationList = locs.map((elem, index) => <FormItem key={index} removable onRemove={(e, root) => handlerLocations(root.innerText)} className='child-style'>
    <SimpleCell>{elem}</SimpleCell>
  </FormItem>);

  const handlerRender = (num) => {
    let arr = [];
    for (let i = 0; i < num; i++) arr.push('');
    setPlayerArray(arr);

    return (
      playersList = arr.map((elem, index) => {
        return (
          <FormItem key={index} top={'Игрок номер ' + (index + 1)}>
            <Input onChange={(e) => players[index] = e.target.value} type="text" placeholder='Имя игрока'></Input>
          </FormItem>
        )
      }))
  }

  useEffect(() => {
    if (timerActive && timerTime > 1) {
      const interval = setInterval(() => setTimerTime(currentTime => currentTime - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive]);

  useEffect(() => {
    setIsLocDeleted(false);
    return (
      locationList = locs.map((elem, index) => <FormItem key={index} removable onRemove={(e, root) => handlerLocations(root.innerText)} className='child-style'>
        <SimpleCell>{elem}</SimpleCell>
      </FormItem>)
    )
  }, [isLocDeleted]);

  useEffect(() => {
    setIsLocAdded(false);
    return (
      locationList = locs.map((elem, index) => <FormItem key={index} removable onRemove={(e, root) => handlerLocations(root.innerText)} className='child-style'>
        <SimpleCell>{elem}</SimpleCell>
      </FormItem>)
    )
  }, [isLocAdded]);

  useEffect(() => {
    if (timerTime < 0) {
      setTimerActive(false);
      setActivatedPanel('end-game');
    }
    console.log(timerTime);
  }, [timerTime]);

  useEffect(() => {
    handlerRender(numOfPlayers);
  }, [numOfPlayers]);

  useEffect(() => {
    if (timerTime < 0) {
      bridge.send("VKWebAppFlashSetLevel", { level: 1.0 });
      setTimeout(() => {
        bridge.send("VKWebAppFlashSetLevel", { level: 0.0 });
      }, 1500);
      setTimeout(() => {
        bridge.send("VKWebAppFlashSetLevel", { level: 1.0 });
      }, 3000);
      setTimeout(() => {
        bridge.send("VKWebAppFlashSetLevel", { level: 0.0 });
      }, 4500);
      setTimeout(() => {
        bridge.send("VKWebAppFlashSetLevel", { level: 1.0 });
      }, 6000);
      setTimeout(() => {
        bridge.send("VKWebAppFlashSetLevel", { level: 0.0 });
      }, 7500);
    }
  }, [timerTime]);

  const toPlayRoom = (num) => {
    let arr = [];

    const spyIndex = Math.floor(Math.random() * (num));
    let secSpyIndex = -1;

    if (num > 7) secSpyIndex = Math.floor(Math.random() * (num));
    while (secSpyIndex === spyIndex) secSpyIndex = Math.floor(Math.random() * (num));
    const locationIndex = Math.floor(Math.random() * locs.length);
    const locationForTheGame = locs[locationIndex];

    for (let i = 0; i < num; i++) {
      (i === spyIndex || i === secSpyIndex)
        ? arr.push({ name: players[i] ? players[i] : 'Игрок ' + (i + 1), spy: true })
        : arr.push({ name: players[i] ? players[i] : 'Игрок ' + (i + 1), spy: false });
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

  const addHandlerLocations = (text) => {
    setnewLocationName('');
    if (text && !locs.includes(text)) {
      locs.push(text);
      setIsLocAdded(true);
    }
  }

  const findSpyInPl = () => {
    return playerArray[playerArray.findIndex((e) => e.spy === true)].name;
  }

  return (
    <AppRoot>
      <View activePanel={activetedPanel}>
        <Panel id="main">
          <PanelHeader>Spyre - Найди шпиона</PanelHeader>
          <Group>
            <Text style={{ margin: "24px 0", textAlign: "center" }}>Чтобы начать игру, проведем некоторую подготовку</Text>
            <FormLayout>
              <FormItem top={"Число участников: " + numOfPlayers}>
                <Slider step={1} min={3} max={12} value={Number(numOfPlayers)} onChange={(val) => setNumOfPlayers(val)} />
              </FormItem>
              <FormItem top={'Число шпионов: ' + (numOfPlayers > 7 ? 2 : 1)}></FormItem>
              {playersList}
              {
                locs.length ? <Button className="btn-main-screen" onClick={() => toPlayRoom(numOfPlayers)}>Играть!</Button> : <></>
              }
            </FormLayout>
          </Group>

          <Group header={<Header mode='secondary'>Список локаций</Header>}>
            <List className='flex-style'>
              {locationList}
            </List>
            <FormItem top={'Добавить локацию'}>
              <Input onChange={(e) => setnewLocationName(e.target.value)} value={newLocationName} type="text" placeholder='Имя игрока'></Input>
            </FormItem>
            <Button className='btn-main-screen' onClick={() => addHandlerLocations(newLocationName)}>Добавить локацию</Button>
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
            <Text className='play-room-text'>Шпионом был: {activetedPanel === 'end-game' ? findSpyInPl() : ''}</Text>
            <Button className='play-room-text' onClick={() => setActivatedPanel('main')}>В главное меню</Button>
          </Group>
        </Panel>
      </View>
    </AppRoot>
  )
}

export default App
