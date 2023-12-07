import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import axios from 'axios';
import Header from '../common/Header';
import SideBar from '../common/SideBar';
import Context from '../../context';
import Posts from '../post/Posts';

const Search = () => {
  const [results, setResults] = useState([]);

  const searchRef = useRef(null);

  const { setIsLoading, hasNewPost, setHasNewPost } = useContext(Context);

  let loadResults = null;

  useEffect(() => {
    loadResults();
    return () => {
      setResults([]);
    }
  }, [loadResults]);

  useEffect(() => {
    if (hasNewPost) {
      loadResults();
      setHasNewPost(false);
    }
  }, [hasNewPost, loadResults, setHasNewPost]);

  loadResults = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = 'http://localhost:8080/api/search';
      const response = await axios.get(url, {
        params: {
          q: searchRef.current.value
        }
      });
      setResults(() => response.data);
      if(response.data.message) {
        alert(response.data.message)
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const handleKeyDown = function(e) {
    if (e.key === 'Enter') {
      loadResults();
    }
  }
  
  return (
    <div>
      <div id="header">
        <Header />
      </div>
      <div id="sidebarHome">
        <SideBar/>
        <div className='searchContent'>
          <div className='search'>
            <input className='searchBar' name='search' ref={searchRef} onKeyDown={handleKeyDown}></input>
            <span className='searchButton' onClick={loadResults}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
              </svg>
            </span>
          </div>
          <Posts posts={results} />
        </div>
      </div>
    </div>
  );
};
export default Search;