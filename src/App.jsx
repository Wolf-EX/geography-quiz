import "./app.css";
import { mod } from "./Util/util";
import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import QuizForm from "./Components/QuizForm";
import OptionsMenu from "./Components/OptionsMenu";
import Warning from "./Components/Warning";

export default function App() {
  const [showModal, setShowModal] = useState(false); // showSettingMenu
  const [showClearMenu, setShowClearMenu] = useState(false);
  const [hover, setHover] = useState();
  const [options, setOptions] = useState([false, true, false, false]); //showCountry, showCapital
  const [globeData, setGlobeData] = useState({features: []}); // try to merge this data into countryData
  const [countryData, setCountryData] = useState([]);
  const [countryDataIndex, setCountryDataIndex] = useState(0); //selected country
  const [answerData, setAnswerData] = useState(["", ""]);
  const [correctCountries, setCorrectCountries] = useState(new Set());
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  
  const isHover = useRef(hover);

  const globeRef = useRef(null);
  const modalRef = useRef(null);
  const countryInputRef = useRef(null);
  const cityInputRef = useRef(null);

  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    fetch("/src/assets/datasets/ne_110m_admin_0_countries.geojson")
    .then(res => res.json())
    .then(setGlobeData);
    
    fetch("/src/assets/datasets/country-by-capital-city.json")
    .then(res => res.json())
    .then(data => setCountryData(data));

    globeRef.current && globeRef.current.pointOfView({ lat: 41, lng: -95, altitude: 1.5 }, 2000); // 2000ms transition

    setCorrectCountries(new Set(JSON.parse(localStorage.getItem("correctCountries"))));
    setOptions(JSON.parse(localStorage.getItem("options")));
      
  }, []);

  useEffect(() => {
    function handleOuterClick(event) {
      if(!isHover.current) {
        setShowModal(modalRef.current.contains(event.target));
        setIsWrongAnswer(false);
        setAnswerData(["", ""]);
      }
    }

    document.addEventListener("mouseup", handleOuterClick);

    return () => {
      document.removeEventListener("mouseup", handleOuterClick);
    }
  }, [modalRef]);

  function handleSubmitClick(event) {
    event.preventDefault();
    if((!options[0] ||
      answerData[0].toLowerCase() === countryData[countryDataIndex].displayName?.toLowerCase() ||
      answerData[0].toLowerCase() === countryData[countryDataIndex].country.toLowerCase()) &&
    (!options[1] || answerData[1].toLowerCase() === countryData[countryDataIndex].city.toLowerCase())) {
      const updatedCorrectCountries = [...correctCountries, countryData[countryDataIndex].country];
      localStorage.setItem("correctCountries", JSON.stringify(updatedCorrectCountries));
      setCorrectCountries(new Set(updatedCorrectCountries));
      setAnswerData(["", ""]);
      setIsWrongAnswer(false);
    } else {
      setIsWrongAnswer(true);
    }
  }

  function handlePolygonClick(country) {
    const index = countryData.findIndex(e => e.country === country);
    if(countryData[index]) {
      setCountryDataIndex(index);
      setShowModal(true);
      setIsWrongAnswer(false);
      cityInputRef.current && cityInputRef.current.focus() || countryInputRef.current && countryInputRef.current.focus();
    }
  }

  function handleNextCountryClick(count) {
    handlePolygonClick(countryData[mod(countryDataIndex + count, countryData.length)].country);
    setAnswerData(["", ""]);
    setIsWrongAnswer(false);
  }

  function handleDeleteClick(deleteData) {
    if(deleteData) {
      localStorage.removeItem("correctCountries");
      setCorrectCountries(new Set());
    }
    setShowClearMenu(false);
  }

  return (
    <>
      <h1 className="header-ui">{`Countries: ${correctCountries.size}\\${countryData.length}`}</h1>
      {
        countryData[countryDataIndex] &&
        <QuizForm
          show={showModal}
          refs={[modalRef, countryInputRef, cityInputRef]}
          countryData={countryData[countryDataIndex]}
          handleSubmit={handleSubmitClick}
          handleNext={handleNextCountryClick}
          answerData={answerData}
          setAnswerData={setAnswerData}
          isCorrect={correctCountries.has(countryData[countryDataIndex].country)}
          isWrongAnswer={isWrongAnswer}
          options={options}
        />
      }
      <OptionsMenu options={options} setOptions={setOptions} setShowClearMenu={setShowClearMenu}/>
      {
        showClearMenu && <Warning onClick={handleDeleteClick}/>
      }
      <Globe
        ref={globeRef}
        backgroundColor={isDarkMode ? "#000000" : "#ffffff"}
        globeOffset={[0, 0]}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg"
        polygonsData={globeData.features}
        // polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
        // polygonCapColor={d => d === hover ? 'steelblue' : 'lightyellow'}
        polygonCapColor={d => correctCountries.has(d.properties.ADMIN) ? "green" : d === hover ? 'steelblue' : 'lightyellow'}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
        polygonStrokeColor={() => '#111'}
        // polygonLabel={({ properties: d }) => <div>
        //   <div><b>{d.ADMIN} ({d.ISO_A2}):</b></div>
        // </div>}
        onPolygonClick={d => handlePolygonClick(d.properties.ADMIN)}
        onPolygonHover={d => {isHover.current = !!d; return setHover(d)}}
        // onGlobeClick={e => console.log(e)}
        polygonsTransitionDuration={300}
      />
    </>
  )
}