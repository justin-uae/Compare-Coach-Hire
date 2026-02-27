import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CompletePage from './Pages/Home';
import TaxiOptions from './Pages/TaxiOptions';

import Navbar from './Components/Navbar';
import NotFound from './Components/NotFound';
// import Login from './Pages/LoginPage';
// import Register from './Pages/RegisterPage';
import Contact from './Pages/ContactPage';
import AboutUs from './Pages/AboutUsPage';
import Footer from './Components/Footer';
import { store } from './store/store';
import { Provider } from 'react-redux';
import ScrollToTop from './Components/ScrollToTop';
import OurFleet from './Pages/OurFleet';
import CarRentalDetails from './Pages/CarRentalDetails';
import CarRentalOptions from './Pages/CarRentalOptions';
import CoachHireServices from './Pages/CoachHireServices';
import MinibusHireServices from './Pages/MinibusHireServices';
import BlogListing from './Pages/BlogListing';
import BlogDetail from './Pages/BlogDetail';
import TermsAndConditions from './Pages/Termsandconditions';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import { WhatsAppButton } from './Components/WhatsAppButton';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<CompletePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/vehicles" element={<OurFleet />} />
            <Route path="/transport-options" element={<TaxiOptions />} />
            <Route path="/car-rental-options" element={<CarRentalOptions />} />
            <Route path="/car-rental/:carId" element={<CarRentalDetails />} />
            <Route path="/coachhire" element={<CoachHireServices />} />
            <Route path="/minibus" element={<MinibusHireServices />} />
            <Route path="/blogs" element={<BlogListing />} />
            <Route path="/viewBlog/:slug" element={<BlogDetail />} />
            <Route path="/payment" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </Provider>
  );
}

export default App;