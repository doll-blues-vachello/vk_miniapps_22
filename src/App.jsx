import { AppRoot, View, Panel, PanelHeader, Group, SimpleCell, List, Header } from '@vkontakte/vkui'
import './stylish.css'

const locs = ['Стройплощадка', 'Метро', 'Парламент', 'Стадион', 'Музей', 'Дом престарелых'
  , 'Экскурсионный автобус', 'Рок-концерт', 'Шахта', 'Свадьба', 'Заправочная станция', 'Библиотека'
  , 'Шоколадная фабрика', 'Кладбище', 'Джаз-бэнд', 'Виноградник', 'Порт', 'Автогонки', 'Тюрьма'
  , 'Выставка кошек'];

const locationList = locs.map((elem, index) => <SimpleCell className='child-style' key={index}>{elem}</SimpleCell>);


const App = () => {
  return (
    <AppRoot>
      <View activePanel="main">
        <Panel id="main">
          <PanelHeader>Spyre</PanelHeader>
          <Group header={<Header mode='secondary'>Список локаций</Header>}>
            <List className='flex-style'>
              {locationList}
            </List>
          </Group>
        </Panel>
      </View>
    </AppRoot>
  )
}

export default App
