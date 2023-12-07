import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import withModal from '../common/Modal';
import Create from '../create/Create';
import Context from '../../context';
import logo from '../../logo.png';

const Header = (props) => {
  const { toggleModal } = props;

  const { user, setUser, cometChat } = useContext(Context);

  const history = useHistory();

  const logout = async () => {
    const isLogout = window.confirm('Você quer deslogar da conta?');
    if (isLogout) {
      await cometChat.logout();
      localStorage.removeItem('auth');
      setUser(null);
      history.push('/login');
    }
  };

  const goCreatePost = () => {
    toggleModal(true);
  };

  const goHome = () => {
    history.push('/');
  };

  const goProfile = () => {
    history.push(`/profile/${user.id}`)
  };

  const goNotification = () => {
    history.push('/notifications');
  };

  const goChat = () => {
    history.push('/chat');
  };

  const goSearch = () => {
    history.push('/search');
  };
  
  const goMarket = () => {
    history.push('/market');
  };

  return (
    <div>
      <div className="header">
          <img onClick={goHome} src={logo} alt="ArtZone" />
      </div>
    </div>
  );
}

export default withModal(Create)(Header);