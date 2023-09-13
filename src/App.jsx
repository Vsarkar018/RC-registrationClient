import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import { FaInstagram, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
function App() {
  const captchRef = useRef();
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [failedVerification, setfailedVerification] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 786);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    studentNo: "",
    branch: "",
    phoneNo: "",
    domain: "",
    projects: "",
    society: "",
    stay: "",
  });
  const [duplicate, setDuplicate] = useState();
  const [errors, setErrors] = useState({
    name: "",
    gender: "",
    email: "",
    studentNo: "",
    branch: "",
    phoneNo: "",
    domain: "",
    stay: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 786);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError(false);
    setErrors({});
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    captchRef.current.reset();
    if (!recaptchaValue) {
      setLoading(false);
      return;
    }
    const newErrors = {
      name: "",
      gender: "",
      email: "",
      studentNo: "",
      branch: "",
      phoneNo: "",
      domain: "",
      stay: "",
    };
    if (!formData.name) {
      newErrors.name = "Name cannot be empty";
    }

    if (!formData.gender || formData.gender === "select") {
      newErrors.gender = "Please select your Gender";
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!formData.email || !emailRegex.test(formData.email.toLowerCase())) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.studentNo || !formData.studentNo.startsWith("22")) {
      newErrors.studentNo = "Enter a valid Student Number";
    }

    if (!formData.branch || formData.branch === "select") {
      newErrors.branch = "Please select your Branch";
    }

    if (!formData.phoneNo || formData.phoneNo.toString().length !== 10) {
      newErrors.phoneNo = "Enter a valid 10-digit phone number";
    }

    if (!formData.domain || formData.domain === "select") {
      newErrors.domain = "Please select your Domain Preference";
    }

    if (!formData.stay || formData.stay === "select") {
      newErrors.stay = "Please select your Stay";
    }
    const hasError = Object.values(newErrors).some((error) => error !== "");
    setErrors(newErrors);
    setError(hasError);
    console.log(error);
    if (hasError) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        "https://recruitmentdriveserver.onrender.com/",
        {
          formData,
          recaptchaValue,
        }
      );
      if (response) setSubmitted(true);
    } catch (error) {
      setDuplicate(error.response.data.msg?.split(" ")[1]);
      if (error.response.status === 403) {
        setfailedVerification(true);
      }
    }
    setLoading(false);
  };
  return !submitted ? (
    <>
      <div className="header">
        <img src="/src/images/5.svg" alt="Header Image" />
        <h1>
          Robotics Club <span className="header-span">AKGEC</span>
        </h1>
      </div>
      <div className="container">
        {isMobile ? (
          <img className="poster" src="/src/images/flex2.jpeg" alt="" />
        ) : (
          <img className="poster" src="/src/images/flex.jpeg" alt="" />
        )}
        <div className="right">
          <h2>Register</h2>
          <form name="submit-to-google-sheet" onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="fullName">Full Name :</label>
              <input
                className={errors.name ? "red" : ""}
                value={formData.name}
                type="text"
                id="fullName"
                name="name"
                placeholder="Enter your Name"
                onChange={handleInputChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div className="input-field">
              <label htmlFor="gender">Gender :</label>
              <select
                name="gender"
                id="gender"
                required
                onChange={handleInputChange}
                className={errors.gender ? "red" : ""}
              >
                <option value="select">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>

            <div className="input-field">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="Enter your college Email I'd"
                required
                onChange={handleInputChange}
                className={errors.email || duplicate === "email" ? "red" : ""}
              />
              {errors.email && <p className="error">{errors.email}</p>}
              {duplicate === "email" && (
                <p className="error">{"Email already Exists"}</p>
              )}
            </div>
            <div className="input-field">
              <label>Student No :</label>

              <input
                type="number"
                name="studentNo"
                id="studentNo"
                placeholder="Enter your student number"
                required
                value={formData.studentNo}
                className={
                  errors.studentNo || duplicate === "studentNo" ? "red" : ""
                }
                onChange={handleInputChange}
              />
              {errors.studentNo && <p className="error">{errors.studentNo}</p>}
              {duplicate === "studentNo" && (
                <p className="error">{"Student Number already Exists"}</p>
              )}
            </div>
            <div className="input-field">
              <label>Branch :</label>

              <select
                name="branch"
                id="branch"
                aria-placeholder="Select your branch"
                required
                className={errors.branch ? "red" : ""}
                onChange={handleInputChange}
              >
                <option value="select">Select</option>
                <option value="CSE">CSE</option>
                <option value="CSE AIML">CSE AIML</option>
                <option value="CSE DS">CSE DS</option>
                <option value="CS">CS</option>
                <option value="CSE HINDI">CSE HINDI</option>
                <option value="AIML">AIML</option>
                <option value="CSIT">CSIT</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EN">EN</option>
                <option value="CIVIL">CIVIL</option>
                <option value="ME">ME</option>
              </select>
            </div>

            <div className="input-field">
              <label htmlFor="phoneNumber">
                Phone Number (WhatsApp Number) :
              </label>

              <input
                type="text"
                id="phoneNumber"
                name="phoneNo"
                value={formData.phoneNo}
                placeholder="Enter your phone number"
                className={errors.phoneNo ? "red" : ""}
                onChange={handleInputChange}
              />
              {errors.phoneNo && <p className="error">{errors.phoneNo}</p>}
            </div>
            <div className="input-field">
              <label>Domain Preference :</label>

              <select
                name="domain"
                id="domain"
                required
                className={errors.domain ? "red" : ""}
                onChange={handleInputChange}
              >
                <option value="select">Select</option>
                <option value="Fabrication">Fabrication</option>
                <option value="Electronics">Electronics</option>
                <option value="Programming">Programming</option>
                <option value="AIML">AI&ML</option>
              </select>
            </div>
            <div className="input-field">
              <label htmlFor="project">Any Projects :</label>
              <input
                type="text"
                id="project"
                name="projects"
                placeholder="If No mention NA"
                value={formData.projects}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <label htmlFor="society">Are you part of other society? :</label>

              <input
                type="text"
                id="society"
                name="society"
                value={formData.society}
                placeholder="If Yes,Kindly mention else write No"
                onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <label>Stay :</label>

              <select
                name="stay"
                id="stay"
                required
                className={errors.stay ? "red" : ""}
                onChange={handleInputChange}
              >
                <option value="select">Select</option>
                <option value="Hosteller">Hosteller</option>
                <option value="Day-scholar">Day-Scholar</option>
              </select>
            </div>
            <div className="recaptcha-field">
              <ReCAPTCHA
                sitekey="6Le43yAoAAAAAJ9xeVe0SPqn4bLPg5yAyErOFeiC" // Replace with your reCAPTCHA Site Key
                onChange={(value) => setRecaptchaValue(value)}
                ref={captchRef}
                className={failedVerification ? "red" : ""}
              />
            </div>
            <div className="button-submit">
              <button
                disabled={error}
                type="submit"
                className={loading ? "submit" : "submit loading"}
              >
                {loading ? "Registering...." : "Register"}
              </button>
            </div>

            <span id="success"> </span>
          </form>
        </div>
      </div>
    </>
  ) : (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ color: "white" }}>Registered Successfully</h1>
        <div style={{ display: "flex", gap: "20px" }}>
          <h2>
            <a
              href="https://www.instagram.com/akgecrobotics/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                size={40}
                style={{
                  marginRight: "10px",
                  color: "#833ab4",
                }}
              />
            </a>
          </h2>
          <h2>
            <a href="mailto:akgecrobotics@gmail.com">
              <FaEnvelope
                size={40}
                style={{ marginRight: "10px", color: "#db4437" }}
              />
            </a>
          </h2>
        </div>
        <div
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <h2>Join the WhatsApp Group for further Notification</h2>
          <a href="https://chat.whatsapp.com/KLsOMnOeFw4DCWYwjAw6gp">
            <FaWhatsapp
              size={40}
              style={{ marginRight: "10px", color: "#25D366" }}
            />
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
