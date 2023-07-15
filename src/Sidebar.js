import './styles.css';
import { BsHouseDoor, BsBook, BsGear, BsBoxArrowRight } from 'react-icons/bs';
import { signOutUser } from './firebase';

const Sidebar = () => {
  const style = {
    sidebar: 'flex flex-col w-60 p-5 border-r flex-grow bg-gray-100',
    list: 'flex flex-col space-y-3',
    listItem: 'flex items-center space-x-2',
    link: 'text-gray-600 hover:text-gray-800',
  };

  return (
    <div className={style.sidebar}>
      {/* There will be added a Search Functionality with Ctrl + K */}

      <ul className={style.list}>
        <li className={style.listItem}>
          <BsHouseDoor size={24} />
          <button className={style.link}>Home</button>
        </li>
        <li className={style.listItem}>
          <BsBook size={24} />
          <button className={style.link}>My Decks</button>
        </li>
        <li className={style.listItem}>
          <BsGear size={24} />
          <button className={style.link}>Settings</button>
        </li>
        <li className={style.listItem}>
          <BsBoxArrowRight size={24} />
          <button className={style.link} onClick={signOutUser}>
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
