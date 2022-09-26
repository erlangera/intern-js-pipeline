import React, {useState, useEffect} from 'react'; 
import RepoCard from './RepoCard.jsx';
import Title from './Title';
import {getUserRepos, getAccessToken, setToken} from '../getData.js';
import config from '../../config.json';

//entire dashboard
export function HomePage() {

  //list of repos to display
  const [repos, setRepos] = useState([]);
  
  async function fetchRepos() {
    console.log('fetch repos')
    try {
      //the following lines automatically get all repos in the org and filter for ones with a test harness
      const asyncResponse = await getUserRepos(config.organization);
      if([...asyncResponse] != [...repos]){
        setRepos(asyncResponse);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchAccessToken(code) {
    try {
      const {token} = await getAccessToken(code);
      localStorage.setItem('access_token', token)
      setToken(token)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(async () => {
    
    // comment fetchRepos() and uncomment the following lines if you want to list the repos that should be on the dashboard
    // if([...repos] !=['vanilla-basic', 'vanilla-api', 'nextjs-starter', 'nuxtjs-starter', 'angular-basic', 'react-basic', 'vue-basic', 'blazor-starter', 'blazor-basic', 'roles-function', '30DaysOfSWA' ] ){
    //   setRepos(['vanilla-basic', 'vanilla-api', 'nextjs-starter', 'nuxtjs-starter', 'angular-basic', 'react-basic', 'vue-basic', 'blazor-starter', 'blazor-basic', 'roles-function', '30DaysOfSWA' ])
    // }
    
    const token = localStorage.getItem("access_token");
    const code = new URL(location.href).searchParams.get('code');
    console.log('check', token, code)
    if (token) {
      setToken(token);
    }
    if (!token && code) {
      console.log('fetch token');
      await fetchAccessToken(code)
    }
    fetchRepos();
  }, []);


  return (
    <div >
        <Title/>
        { repos.map(element => {
            return <RepoCard key={element} repoName={element} orgName={config.organization}/>
        })} 
      
    </div>
  );
}

export default HomePage;
