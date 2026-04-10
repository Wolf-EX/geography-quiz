import "./app.css";
import { mod } from "./Util/util";
import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import QuizForm from "./Components/QuizForm";
import OptionsMenu from "./Components/OptionsMenu";
import Warning from "./Components/Warning";

function App() {

  const [options, setOptions] = useState([false, true]); //showCountry, showCapital
  const [showModal, setShowModal] = useState(false); //showSettingMenu
  const [showClearMenu, setShowClearMenu] = useState(false);
  const [hover, setHover] = useState();
  const [globeData, setGlobeData] = useState({features: []});
  const [countryData, setCountryData] = useState([]);
  const [countryDataIndex, setCountryDataIndex] = useState(223);
  const [capitalAnswer, setCapitalAnswer] = useState("");
  const [correctCountries, setCorrectCountries] = useState(new Set());
  const [selectedCountryData, setSelectedCountryData] = useState({});


  const globeRef = useRef(null);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const isHover = useRef(hover);

  function printData(data) {
    // const temp = data.filter(d => d.properties.ISO_A2 === 'AQ');
    console.log(data);
  }

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
      }
    }

    document.addEventListener("mouseup", handleOuterClick);

    return () => {
      document.removeEventListener("mouseup", handleOuterClick);
    }
  }, [modalRef])

  function handleSubmitClick(e) {
    e.preventDefault();
    // console.log("selectedCountry", selectedCountryData);
    if(capitalAnswer.toLowerCase() === countryData[countryDataIndex].city.toLowerCase()) {
      const updatedCorrectCountries = [...correctCountries, countryData[countryDataIndex].country];
      localStorage.setItem("correctCountries", JSON.stringify(updatedCorrectCountries));
      setCorrectCountries(new Set(updatedCorrectCountries));
      setCapitalAnswer("");
    }
  }

  // handleCountryClick
  function handlePolygonClick(country) {
    const index = countryData.findIndex(e => e.country === country);
    if(countryData[index]) {
      setSelectedCountryData(countryData[index]);
      setCountryDataIndex(index);
      setShowModal(true);
      inputRef.current && inputRef.current.focus();
    }
  }

  function handleNextCountryClick(count) {
    handlePolygonClick(countryData[mod(countryDataIndex + count, countryData.length)].country);
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
      <QuizForm
        show={showModal}
        modalRef={modalRef}
        inputRef={inputRef}
        countryData={selectedCountryData}
        handleSubmit={handleSubmitClick}
        handleNext={handleNextCountryClick}
        isCorrect={correctCountries.has(selectedCountryData.country)}
        capitalAnswer={capitalAnswer}
        setCapitalAnswer={setCapitalAnswer}
      />
      <OptionsMenu options={options} setOptions={setOptions} setShowClearMenu={setShowClearMenu}/>
      {
        showClearMenu && <Warning onClick={handleDeleteClick}/>
      }
      <Globe
        ref={globeRef}
        globeOffset={[0, 0]}
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg"
        polygonsData={globeData.features}
        // polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
        // polygonCapColor={d => d === hover ? 'steelblue' : 'lightyellow'}
        polygonCapColor={d => correctCountries.has(d.properties.ADMIN) ? "green" : d === hover ? 'steelblue' : 'lightyellow'}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
        polygonStrokeColor={() => '#111'}
        polygonLabel={({ properties: d }) => <div>
          <div><b>{d.ADMIN} ({d.ISO_A2}):</b></div>
          {/* <div>GDP: <i>{d.GDP_MD_EST}</i> M$</div> */}
          {/* <div>Population: <i>{d.POP_EST}</i></div> */}
        </div>}
        onPolygonHover={d => {isHover.current = !!d; return setHover(d)}}
        onPolygonClick={d => handlePolygonClick(d.properties.ADMIN)}
        polygonsTransitionDuration={300}
        // onGlobeClick={e => console.log(e)}
      />
    </>
  );
}

export default App
