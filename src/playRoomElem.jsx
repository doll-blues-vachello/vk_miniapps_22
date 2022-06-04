import { Group, Text } from "@vkontakte/vkui";
import "./stylish.css";

const PlayRoomElement = ({ plArray, location, index = 0 }) => {
  return (
    <Group>
      <Text className="play-room-text">{plArray[index]?.name}</Text>
      {
        plArray[index]?.spy
        ? <Text className="play-room-text">Вы шпион! Не выдайте себя</Text>
        : <Text className="play-room-text">Ваша локация: {location} </Text>
      }
    </Group>
  )
}

export default PlayRoomElement;