import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [cities, setCities] = useState([]);
  const [parkingAreas, setParkingAreas] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedParkingArea, setSelectedParkingArea] = useState('');
  const [email, setEmail] = useState('');
  const [parkingSessionStarted, setParkingSessionStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    // Fetch cities and parking areas
    const fetchCities = async () => {
      const result = await axios.get('/api/cities'); 
      setCities(result.data);
    };
    fetchCities();
  }, []);

  const handleCityChange = (event) => {
    const cityName = event.target.value;
    setSelectedCity(cityName);
    // Fetch parking areas based on selected city
    const city = cities.find(city => city.name === cityName);
    if (city) {
      setParkingAreas(city.parkingAreas);
    } else {
      setParkingAreas([]);
    }
  };

  const handleStartParking = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/start-parking', {
        email,
        cityName: selectedCity,
        parkingAreaName: selectedParkingArea
      });
      setStartTime(response.data.startTime);
      setParkingSessionStarted(true);
    } catch (error) {
      console.error("Error starting parking:", error);
      alert('Failed to start parking session');
    }
  };

  const handleStopParking = async () => {
    try {
      const response = await axios.post('/api/stop-parking', {
        email
      });
      alert(`Parking stopped. Total price: ${response.data.price}`);
      setParkingSessionStarted(false);
      setStartTime(null);
      setSelectedCity('');
      setSelectedParkingArea('');
      setParkingAreas([]);
    } catch (error) {
      console.error("Error stopping parking:", error);
      alert('Failed to stop parking session');
    }
  };

  return (
    <div className="hero_area">
      <header className="header_section">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg custom_nav-container">
            <a className="navbar-brand" href="#">
              <span>Wango parking</span>
            </a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active"><a className="nav-link" href="#">Home</a></li>
                <li className="nav-item"><a className="nav-link" href="#">About</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Jobs</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Freelancers</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <section className="slider_section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-8 mx-auto">
              <div className="detail-box">
                <h1>Park your car</h1>
                <p>After choosing the city please choose the parking area and hit "pay with Wango" button.</p>
              </div>
            </div>
          </div>
          <div className="find_container">
            <div className="container">
              <div className="row">
                <div className="col">
                  <form onSubmit={handleStartParking}>
                    <div className="form-row">
                      <div className="form-group col-lg-3">
                        <input 
                          type="email" 
                          className="form-control" 
                          placeholder="Email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group col-lg-3">
                        <select 
                          className="form-control wide" 
                          value={selectedCity} 
                          onChange={handleCityChange}>
                          <option>Choose city</option>
                          {cities.map(city => (
                            <option key={city._id} value={city.name}>{city.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-lg-3">
                        <select 
                          className="form-control wide" 
                          value={selectedParkingArea} 
                          onChange={(e) => setSelectedParkingArea(e.target.value)}>
                          <option>Choose parking area</option>
                          {parkingAreas.map(area => (
                            <option key={area._id} value={area.name}>{area.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-lg-3">
                        <div className="btn-box">
                          <button type="submit" className="btn">Pay with Wango</button>
                        </div>
                      </div>
                    </div>
                  </form>
                  {parkingSessionStarted && (
                    <button className="btn" onClick={handleStopParking}>Stop Parking</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer_section">
        <div className="container">
          <p>&copy; <span id="displayYear"></span> All Rights Reserved By <a href="https://html.design/">Free Html Templates</a></p>
        </div>
      </footer>
    </div>
  );
}

export default App;