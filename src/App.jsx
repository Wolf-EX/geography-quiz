import "./app.css";
import { mod } from "./Util/util";
import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import QuizForm from "./Components/QuizForm";
import OptionsMenu from "./Components/OptionsMenu";
import Warning from "./Components/Warning";

export default function App() {
  const [showClearMenu, setShowClearMenu] = useState(false);
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
  const [hover, setHover] = useState(null);
  const [options, setOptions] = useState([true, true, true, true]); // [quiz country, quiz capital, display capital, country animation]
  const [countryData, setCountryData] = useState([]);
  const [countryDataIndex, setCountryDataIndex] = useState(null); // selected country index
  const [answerData, setAnswerData] = useState(["", ""]); // [country, capital]
  const [correctCountries, setCorrectCountries] = useState(new Set());
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  
  const isHover = useRef(hover);

  const globeRef = useRef(null);
  const modalRef = useRef(null);
  const warningRef = useRef(null);
  const countryInputRef = useRef(null);
  const cityInputRef = useRef(null);

  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    function handleResize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    fetch("datasets/country-data.json")
    .then(res => res.json())
    .then(data => setCountryData(data));

    setCorrectCountries(new Set(JSON.parse(localStorage.getItem("correctCountries"))));
    setOptions(JSON.parse(localStorage.getItem("options")) || [false, true, false, false, true]);
    
    globeRef.current && globeRef.current.pointOfView({ lat: 41, lng: -95, altitude: 1.5 }, 1500); // 1000ms transition

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleOuterClick(event) {
      if(!isHover.current && !modalRef.current?.contains(event.target)) {
        setCountryDataIndex(null);
        setAnswerData(["", ""]);
        setIsWrongAnswer(false);
      }
      

      if(warningRef.current && !warningRef.current.contains(event.target)) {
        setShowClearMenu(false);
      }
    }

    document.addEventListener("mouseup", handleOuterClick);

    return () => {
      document.removeEventListener("mouseup", handleOuterClick);
    }
  }, [modalRef]);

  function handleSubmit(event) {
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
    const index = countryData.findIndex(e => e?.country === country);
    if(countryData[index]) {
      setCountryDataIndex(index);
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
      <div className="header-ui">
        <h1>{`Countries: ${correctCountries.size}\\${countryData.length}`}</h1>
      </div>
      {
        countryData[countryDataIndex] &&
        <QuizForm
          refs={[modalRef, countryInputRef, cityInputRef]}
          countryData={countryData[countryDataIndex]}
          handleSubmit={handleSubmit}
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
        showClearMenu && <Warning ref={warningRef} onClick={handleDeleteClick}/>
      }
      <Globe
        ref={globeRef}
        width={windowSize[0]}
        height={windowSize[1]}
        backgroundColor={isDarkMode ? "#060912" : "#bbcdf3"}
        globeOffset={[0, 0]}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg"
        polygonsData={countryData}
        polygonAltitude={options[3] ? d => d === countryData[countryDataIndex] ? 0.05 : d === hover ? 0.03 : 0.01 : 0.01}
        polygonCapColor={d => correctCountries.has(d.country) ? "green" : d === hover ? 'steelblue' : 'lightyellow'}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
        polygonStrokeColor={() => '#111'}
        // polygonLabel={d=> <div>
        //   <div><b>{d.country}</b></div>
        // </div>}
        onPolygonClick={d => handlePolygonClick(d.country)}
        onPolygonHover={d => {isHover.current = !!d; return setHover(d)}}
        polygonsTransitionDuration={300}
      />
    </>
  )
}