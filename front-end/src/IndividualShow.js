import React, { useEffect, useState, useRef } from 'react'
import Header from './Header'
import Footer from './Footer'
import './IndividualShow.css';
import axios from 'axios';
import { createMockUser, mockShowAPI, mockUserImage, mockShowImage } from './MockData'

/*the component stores user's watched episode progress 
by allowing to save the show's latest season and episode watched*/
const ProgressData = ({ season, episode }) => {
  const refSeason = useRef();
  const refEpisode = useRef();
  const saveProgressData = (() => {
    //the function will be further developed in sprint 2
    let progress = [];
    var season = React.findDOMNode(this.refs.season).value;
    var episode = React.findDOMNode(this.refs.episode).value;
    progress.push(season);
    progress.push(episode);
  });
  return (
    <form onSubmit={(e) => saveProgressData()} >
      <label className="labelCustom" for="season">Current Season: </label>
      <input id="season" className="progress" value={season} ref={refSeason} />
      <br /> <br /><br /> <br />
      <label className="labelCustom" for="episode">Current Episode:</label>
      <input id="episode" className="progress" value={episode} ref={refEpisode} />
      <br /><br />
      <input className="btnProgress" type="submit" value="Save Progress" />
    </form>
  )
}

/*the component displays and stores user's chosen platform*/

const PlatformData = () => {

  const refNetflix = useRef();
  const refPrime = useRef();
  const refHulu = useRef();
  const refCrunchy = useRef();
  const refDisney = useRef();
  const refHBO = useRef();
  const refOther = useRef();
  const savePlatform = (() => {
    //the function will be further developed in sprint 2
  });
  return (
    <div>
      
      <p className="labelCustom">Select the platform: </p>
      <form onSubmit={(e) => savePlatform()}>

        <input class="platform" type="checkbox" id="netflix" value="Netflix" ref={refNetflix} />
        <label  for="netflix">Netflix  </label>
        <input class="platform" type="checkbox" id="prime" value="Prime" ref={refPrime} />
        <label for="prime">Amazon Prime  </label>
        <input class="platform" type="checkbox" id="hulu" value="Hulu" ref={refHulu} />
        <label for="hulu">Hulu  </label>
        <input class="platform" type="checkbox" id="crunch" value="Crunchyroll" ref={refCrunchy} />
        <label for="crunch">Crunchyroll  </label><br /><br />
        <input class="platform" type="checkbox" id="disney" value="Disney Plus" ref={refDisney} />
        <label for="crunch">Disney Plus  </label><br /><br />
        <input class="platform" type="checkbox" id="hbo" value="HBO" ref={refHBO} />
        <label for="hbo">HBO  </label>
        <input class="platform" type="checkbox" id="other" value="Other" ref={refOther} />
        <label for="other">Other  </label><br /><br />
        <input className="btnProgress" type="submit" value="Save Platform" />
      </form>
    </div>
  )
}

/*the component displays and stores general info about the show*/

const Description = ({ genre, description, totalEpisodes, isMovieN }) => {
  const refDescription = useRef();
  const refIsMovie = useRef();
  const refGenre = useRef();
  const refTotalEpisodes = useRef();
  let movieV = { isMovieN };
  if (movieV) {
    movieV = "Yes";
  } else {
    movieV = "No";
  }
  const saveMovieData = (() => {
    //the function will be further developed in sprint 2
  });
  return (
    <div className="description">
      <br /><br />
      <label  className="descript" for="genre">Genre:  </label>
      <u> <span   ref={refGenre}>{genre}</span></u><br /><br />
      <u> <label className="descript"  for="description">Description:  </label></u> 
      <span   value={description} ref={refDescription}>{description}</span><br /><br /><br />
      <u> <label className="descript"  for="totalEpisodes">Total Episodes: </label></u> 
      <span  ref={refTotalEpisodes}>{totalEpisodes}</span><br /><br /><br />
      <label className="descript"   for="movie">Is it a movie? </label>
      <u> <span  value={movieV} ref={refIsMovie}>{movieV}</span><br /><br /></u> 
    </div>
  )
}

/*the component calls other components and displays comprehensive info about the show; 
values passed as parameters to the main components are generated by the mock data API */

const IndividualShow = (props) => {

  const refTitle = useRef();
  const refCover = useRef();
  const returnToShows = (() => {
    window.location.href = '/my-shows/'
  });
  const addToInProgress = (() => {
    window.location.href = '/my-shows/'
  });

  const addToWatched = (() => {
    window.location.href = '/my-shows/'
  });

  let [show, setShow] = useState([]);

  useEffect(() => {
    //temporary variable to be replaced
    let showInfo = [];
    let showId = "54";
    //axios.get(`https://my.api.mockaroo.com/shows/${show.id}.json?key=ee3c98c0`)
    axios.get(`https://my.api.mockaroo.com/shows/${showId}.json?key=ee3c98c0`)
      .then((response) => {
        showInfo.push(response.data);
        console.log(showInfo);
        //console.log(show);
        setShow(showInfo);
      })
      .catch((err) => {
        console.log("We likely reached Mockaroo's request limit...");
        console.log(err);
        showInfo.push(mockShowAPI[showId]);
      })
  }, [])


  return (
    <>
      <Header />

      <div className="showContent">
        <fieldset className="main">
          <div className="showDetails">
            <fieldset >
              {show.map(s => ( //display name of the show
                <h3 id="title" value={s.name} ref={refTitle}>{s.name}</h3>
              ))}

              <button className="btnProgress" onClick={(e) => returnToShows()}>
                Return to Shows
            </button>

              <div className="btnProgressContainer">
                <button className="btnProgress" onClick={(e) => addToInProgress()}>
                  Add to In Progress Shows
          </button>
                <button className="btnProgress" onClick={(e) => addToWatched()}>
                  Add to Watched Shows
          </button>

              </div>
              <div id="clear"></div>
              <ProgressData season="5" episode="7" />
              <br /><br />
              <PlatformData />
              <br /><br />
              <div className="showContent">
                {show.map(s => ( //display general info about the show
                  <Description genre={s.genres} description={s.description} totalEpisodes={s.episodes} isMovieN={s.isMovie} />
                ))}
                <br />
              </div>
            </fieldset>

          </div>
          {show.map(s => ( //display cover image 
            <img id="cover" src={s.coverPhoto} alt="" ref={refCover}></img>
          ))}

          <div id="clear"></div>
        </fieldset>
      </div>

      <Footer />
    </>
  );
}
export default IndividualShow